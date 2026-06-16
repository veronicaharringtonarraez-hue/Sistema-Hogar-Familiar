/* ============================================================
   Banco Crece — Store (estado + localStorage)
   ============================================================ */
const STORE_KEY = "bancoCrece.v1";
// Clave del módulo de tareas (Panel de Padres). El banco lee de aquí los
// puntos ya aprobados por los padres para abonarlos 1:1 (1 punto = 1 $).
const TASKS_KEY = "fam_tareas_v1";

function freshMonth() {
  return { income: 0, paid: {}, diezmoPaid: 0, ahorroDone: 0 };
}

function freshChild() {
  return { balance: 0, savings: 0, months: {}, tx: [], badges: {} };
}

function defaultState() {
  const data = {};
  BC.CHILDREN.forEach((c) => (data[c.id] = freshChild()));
  return {
    pin: BC.DEFAULT_PIN,
    goals: {
      mama: { name: "Mi meta de ahorro", target: 500, emoji: "🎯" },
      papa: { name: "Mi meta de ahorro", target: 500, emoji: "🎯" },
      taylor: { name: "Una bicicleta nueva", target: 200, emoji: "🚲" },
      emmeth: { name: "Set de LEGO grande", target: 120, emoji: "🧱" },
      christopher: { name: "Juguete sorpresa", target: 60, emoji: "🎁" },
    },
    // budgets[childId][monthKey][expenseId] = monto editado para ese mes.
    // Si no hay valor guardado, se usa el valor por defecto de data.js (BC.EXPENSES).
    budgets: {},
    requests: [],
    // pointsCredited[childId] = { week, amount }: puntos de tareas ya abonados
    // al banco en la semana en curso. Sirve para no abonar dos veces y para
    // reiniciar el conteo cuando empieza una semana nueva.
    pointsCredited: {},
    data,
  };
}

// Construye un estado válido a partir de datos externos (localStorage o respaldo).
function mergeState(parsed) {
  const base = defaultState();
  if (!parsed || typeof parsed !== "object") return base;
  // merge defensivo
  base.pin = parsed.pin || base.pin;
  base.goals = Object.assign(base.goals, parsed.goals || {});
  base.budgets = (parsed.budgets && typeof parsed.budgets === "object") ? parsed.budgets : {};
  base.requests = Array.isArray(parsed.requests) ? parsed.requests : [];
  base.pointsCredited = (parsed.pointsCredited && typeof parsed.pointsCredited === "object") ? parsed.pointsCredited : {};
  BC.CHILDREN.forEach((c) => {
    if (parsed.data && parsed.data[c.id]) {
      base.data[c.id] = Object.assign(freshChild(), parsed.data[c.id]);
    }
  });
  return base;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // helper: asegura objeto del mes actual
  const ensureMonth = (child) => {
    const mk = BC.monthKey();
    if (!child.months[mk]) child.months[mk] = freshMonth();
    return mk;
  };

  const update = useCallback((childId, fn) => {
    setState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const child = next.data[childId];
      const mk = ensureMonth(child);
      fn(child, child.months[mk], mk, next);
      return next;
    });
  }, []);

  const log = (child, tx) => {
    child.tx.unshift(Object.assign({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), ts: Date.now() }, tx));
    if (child.tx.length > 400) child.tx.length = 400;
  };

  // ── Puentes con el módulo de tareas ───────────────────────────────
  // Lee del Panel de Padres los puntos APROBADOS de la semana (marcas con
  // calidad + bonos) y los abona al banco 1:1 (1 punto = 1 $). Es idempotente:
  // solo abona la diferencia que aún no se ha pasado, así una recarga no
  // duplica dinero. Cuando empieza una semana nueva (cambia "week"), el
  // contador vuelve a cero y se abonan los puntos de la semana nueva.
  function readApprovedPoints() {
    let tasks;
    try { tasks = JSON.parse(localStorage.getItem(TASKS_KEY)); } catch (e) { return null; }
    if (!tasks || typeof tasks !== "object") return null;
    const marks = tasks.marks || {};
    const bonus = tasks.bonus || [];
    const byChild = {};
    Object.keys(marks).forEach((k) => {
      const pid = k.split(":")[0];
      const pts = (typeof window.markPoints === "function") ? window.markPoints(marks[k]) : 0;
      if (pts) byChild[pid] = (byChild[pid] || 0) + pts;
    });
    bonus.forEach((b) => {
      if (b && b.pid && b.pts) byChild[b.pid] = (byChild[b.pid] || 0) + b.pts;
    });
    return { week: tasks.week || "", byChild };
  }

  const reconcilePoints = useCallback(() => {
    const info = readApprovedPoints();
    if (!info) return;
    setState((prev) => {
      let changed = false;
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.pointsCredited) next.pointsCredited = {};
      BC.CHILDREN.forEach((c) => {
        if (!next.data[c.id]) return;
        const total = Math.round(info.byChild[c.id] || 0);
        const rec = next.pointsCredited[c.id];
        const base = (rec && rec.week === info.week) ? rec.amount : 0;
        const add = total - base; // solo abonamos lo nuevo; nunca quitamos
        if (add > 0) {
          const child = next.data[c.id];
          const mk = BC.monthKey();
          if (!child.months[mk]) child.months[mk] = freshMonth();
          const month = child.months[mk];
          child.balance += add;
          month.income += add;
          child.tx.unshift({
            id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), ts: Date.now(),
            type: "income", amount: add, label: "Puntos de tareas aprobados", cat: "tareas", icon: "⭐",
          });
          if (child.tx.length > 400) child.tx.length = 400;
          next.pointsCredited[c.id] = { week: info.week, amount: base + add };
          changed = true;
        } else if (!rec || rec.week !== info.week) {
          // Semana nueva sin puntos todavía: fija la línea base sin abonar.
          next.pointsCredited[c.id] = { week: info.week, amount: base };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  // Reconcilia al abrir el banco y cada vez que cambian las tareas (otra
  // pestaña/ventana escribe localStorage, o al volver a la app).
  useEffect(() => {
    reconcilePoints();
    const onStorage = (e) => { if (!e || e.key === null || e.key === TASKS_KEY) reconcilePoints(); };
    const onVisible = () => { if (!document.hidden) reconcilePoints(); };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", reconcilePoints);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", reconcilePoints);
    };
  }, [reconcilePoints]);

  const actions = {
    earn(childId, amount, label, cat = "trabajo", icon = "💪") {
      update(childId, (child, month) => {
        child.balance += amount;
        month.income += amount;
        log(child, { type: "income", amount, label, cat, icon });
      });
    },
    payBill(childId, expenseId) {
      const exp = BC.EXPENSES.find((e) => e.id === expenseId);
      let ok = false;
      update(childId, (child, month, mk, next) => {
        if (month.paid[expenseId]) return;
        const amount = budgetAmount(next, childId, mk, exp);
        if (child.balance < amount) return;
        child.balance -= amount;
        month.paid[expenseId] = true;
        log(child, { type: "expense", amount, label: exp.label, cat: exp.id, icon: exp.icon });
        ok = true;
      });
      return ok;
    },
    payDiezmo(childId) {
      let ok = false;
      update(childId, (child, month) => {
        const due = Math.round(month.income * 0.10);
        const remaining = due - month.diezmoPaid;
        if (remaining <= 0) return;
        const pay = Math.min(remaining, child.balance);
        if (pay <= 0) return;
        child.balance -= pay;
        month.diezmoPaid += pay;
        log(child, { type: "expense", amount: pay, label: "Diezmo", cat: "diezmo", icon: "⛪" });
        ok = true;
      });
      return ok;
    },
    saveToGoal(childId, amount) {
      let ok = false;
      update(childId, (child, month) => {
        if (amount <= 0 || child.balance < amount) return;
        child.balance -= amount;
        child.savings += amount;
        month.ahorroDone += amount;
        log(child, { type: "saving", amount, label: "Ahorro a mi meta", cat: "ahorro", icon: "🐷" });
        ok = true;
      });
      return ok;
    },
    withdrawSavings(childId, amount) {
      let ok = false;
      update(childId, (child) => {
        if (amount <= 0 || child.savings < amount) return;
        child.savings -= amount;
        child.balance += amount;
        log(child, { type: "income", amount, label: "Retiro de ahorro", cat: "ahorro", icon: "🐷" });
        ok = true;
      });
      return ok;
    },
    adjust(childId, amount, label) {
      update(childId, (child, month) => {
        child.balance += amount;
        if (amount > 0) month.income += amount;
        log(child, {
          type: amount >= 0 ? "income" : "expense",
          amount: Math.abs(amount),
          label: label || (amount >= 0 ? "Ajuste (+)" : "Ajuste (-)"),
          cat: "ajuste",
          icon: amount >= 0 ? "✨" : "➖",
        });
      });
    },
    setBudget(childId, mk, expenseId, amount) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        if (!next.budgets) next.budgets = {};
        if (!next.budgets[childId]) next.budgets[childId] = {};
        if (!next.budgets[childId][mk]) next.budgets[childId][mk] = {};
        next.budgets[childId][mk][expenseId] = Math.max(0, Math.round(Number(amount) || 0));
        return next;
      });
    },
    resetBudget(childId, mk) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        if (next.budgets && next.budgets[childId]) delete next.budgets[childId][mk];
        return next;
      });
    },
    setGoal(childId, goal) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        next.goals[childId] = Object.assign({}, next.goals[childId], goal);
        return next;
      });
    },
    setPin(pin) {
      setState((prev) => Object.assign({}, prev, { pin }));
    },
    unlockBadge(childId, badgeId) {
      setState((prev) => {
        if (prev.data[childId].badges && prev.data[childId].badges[badgeId]) return prev;
        const next = JSON.parse(JSON.stringify(prev));
        if (!next.data[childId].badges) next.data[childId].badges = {};
        next.data[childId].badges[badgeId] = Date.now();
        return next;
      });
    },
    submitRequest(childId, items, total) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        next.requests.unshift({
          id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
          childId, items, total, ts: Date.now(),
        });
        return next;
      });
    },
    approveRequest(reqId) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const req = next.requests.find((r) => r.id === reqId);
        if (!req) return next;
        const child = next.data[req.childId];
        const mk = BC.monthKey();
        if (!child.months[mk]) child.months[mk] = freshMonth();
        const month = child.months[mk];
        req.items.forEach((i) => {
          child.balance += i.subtotal;
          month.income += i.subtotal;
          child.tx.unshift({
            id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), ts: Date.now(),
            type: "income", amount: i.subtotal, label: i.label, cat: i.cat, icon: i.icon,
          });
        });
        next.requests = next.requests.filter((r) => r.id !== reqId);
        return next;
      });
    },
    rejectRequest(reqId) {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        next.requests = next.requests.filter((r) => r.id !== reqId);
        return next;
      });
    },
    resetChildMonth(childId) {
      update(childId, (child, month, mk) => {
        child.months[mk] = freshMonth();
      });
    },
    importData(parsed) {
      setState(() => mergeState(parsed));
    },
    resetAll() {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORE_KEY);
      }
      setState(defaultState());
    },
  };

  return React.createElement(StoreContext.Provider, { value: { state, actions } }, children);
}

function useStore() {
  return useContext(StoreContext);
}

// Selectores / cálculos
function childMonth(state, childId) {
  const mk = BC.monthKey();
  return (state.data[childId].months[mk]) || freshMonth();
}

// Monto de un gasto para un niño en un mes: usa el valor editado si existe,
// si no, el valor por defecto de BC.EXPENSES.
function budgetAmount(state, childId, mk, exp) {
  const ov = state.budgets && state.budgets[childId] && state.budgets[childId][mk];
  if (ov && ov[exp.id] != null) return ov[exp.id];
  return exp[childId] || 0;
}

// Lista de gastos del mes con su monto resuelto (editado o por defecto).
function childExpenses(state, childId, mk) {
  mk = mk || BC.monthKey();
  return BC.EXPENSES.map((e) => Object.assign({}, e, { amount: budgetAmount(state, childId, mk, e) }));
}

function fixedTotalFor(state, childId, mk) {
  return childExpenses(state, childId, mk).reduce((s, e) => s + e.amount, 0);
}

function childSummary(state, childId) {
  const child = state.data[childId];
  const mk = BC.monthKey();
  const month = childMonth(state, childId);
  const exps = childExpenses(state, childId, mk);
  const fixedTotal = exps.reduce((s, e) => s + e.amount, 0);
  const fixedPaid = exps.reduce((s, e) => s + (month.paid[e.id] ? e.amount : 0), 0);
  const diezmoDue = Math.round(month.income * 0.10);
  const ahorroGoal = Math.round(month.income * 0.10);
  return {
    balance: child.balance,
    savings: child.savings,
    income: month.income,
    fixedTotal,
    fixedPaid,
    fixedPending: fixedTotal - fixedPaid,
    billsPaidCount: BC.EXPENSES.filter((e) => month.paid[e.id]).length,
    billsTotalCount: BC.EXPENSES.length,
    diezmoDue,
    diezmoPaid: month.diezmoPaid,
    diezmoPending: Math.max(0, diezmoDue - month.diezmoPaid),
    ahorroGoal,
    ahorroDone: month.ahorroDone,
  };
}

Object.assign(window, { StoreProvider, useStore, StoreContext, childMonth, childSummary, childExpenses, fixedTotalFor, budgetAmount });
