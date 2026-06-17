/* ============================================================
   Banco Crece — Store (estado + localStorage)
   ============================================================ */
const STORE_KEY = "bancoCrece.v1";
// Clave del módulo de tareas (Panel de Padres). El banco lee de aquí los
// puntos ya aprobados por los padres para abonarlos 1:1 (1 punto = 1 $).
const TASKS_KEY = "fam_tareas_v1";
// Clave del NUEVO sistema inteligente de tareas (módulo Microtareas / "Mi día").
// El banco también lee de aquí los puntos aprobados: rutinas (1 punto) y áreas
// calificadas por orden + limpieza (la marca trae o/c → puntos = o + c).
const MICRO_KEY = "fam_micro_v1";

// Puntos de una marca del nuevo sistema, sin depender del catálogo:
//   • aprobada con orden/limpieza (área) → o + c
//   • aprobada con valor ajustado (rutina) → m.pts (10 base por defecto)
function microMarkPoints(m) {
  if (!m || m.s !== "ok") return 0;
  if (typeof m.o === "number" || typeof m.c === "number") return (m.o || 0) + (m.c || 0);
  return (typeof m.pts === "number") ? m.pts : 10;
}

function genId() { return Date.now() + "-" + Math.random().toString(36).slice(2, 7); }

// income = neto (lo que llega al saldo); gross = bruto; iva = retenido al fondo.
function freshMonth() {
  return { income: 0, gross: 0, iva: 0, paid: {}, diezmoPaid: 0, ahorroDone: 0 };
}

function freshChild() {
  return { balance: 0, savings: 0, months: {}, tx: [], badges: {} };
}

function freshFund() {
  return { balance: 0, tx: [], months: {} };
}

// % de IVA efectivo según la configuración.
function ivaPct(next) {
  const c = next.ivaCfg || {};
  return c.enabled ? (c.pct || 0) : 0;
}

// Abona un ingreso BRUTO a un niño aplicando el IVA Familiar: el neto va al
// saldo del niño y el IVA al Fondo IVA Familiar. Centraliza todo el crédito de
// ingresos (tareas, bonos, pedidos) para que el impuesto se aplique siempre.
function creditIncome(next, childId, gross, label, cat, icon) {
  const child = next.data[childId];
  if (!child || gross <= 0) return;
  const mk = BC.monthKey();
  if (!child.months[mk]) child.months[mk] = freshMonth();
  const month = child.months[mk];
  const pct = ivaPct(next);
  const iva = Math.round(gross * pct);
  const net = gross - iva;
  child.balance += net;
  month.gross = (month.gross || 0) + gross;
  month.iva = (month.iva || 0) + iva;
  month.income += net;
  const note = iva > 0 ? (label + " · neto (IVA " + Math.round(pct * 100) + "% al fondo)") : label;
  child.tx.unshift({ id: genId(), ts: Date.now(), type: "income", amount: net, label: note, cat, icon });
  if (child.tx.length > 400) child.tx.length = 400;
  if (iva > 0) {
    if (!next.fund) next.fund = freshFund();
    next.fund.balance += iva;
    if (!next.fund.months[mk]) next.fund.months[mk] = { in: 0, out: 0 };
    next.fund.months[mk].in += iva;
    const cn = (BC.CHILDREN.find((c) => c.id === childId) || {}).name || childId;
    next.fund.tx.unshift({ id: genId(), ts: Date.now(), type: "in", childId, amount: iva, gross, label: "IVA de " + cn });
    if (next.fund.tx.length > 600) next.fund.tx.length = 600;
  }
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
    // Libro mayor del NUEVO sistema (fam_micro_v1), separado del anterior para
    // que cada fuente se abone de forma independiente y nunca se duplique.
    pointsCreditedMicro: {},
    // IVA Familiar: % que se retiene de cada ingreso para el Fondo compartido.
    ivaCfg: { enabled: true, pct: BC.IVA_DEFAULT },
    // Fondo IVA Familiar (cuenta compartida administrada por los padres).
    fund: freshFund(),
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
  base.pointsCreditedMicro = (parsed.pointsCreditedMicro && typeof parsed.pointsCreditedMicro === "object") ? parsed.pointsCreditedMicro : {};
  base.ivaCfg = Object.assign({ enabled: true, pct: BC.IVA_DEFAULT }, parsed.ivaCfg || {});
  base.fund = (parsed.fund && typeof parsed.fund === "object")
    ? Object.assign(freshFund(), parsed.fund) : freshFund();
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
  // Lee de una fuente de tareas (su clave en localStorage) los puntos
  // aprobados de la semana por hijo. `pointFn` traduce cada marca a puntos.
  function readApprovedPoints(taskKey, pointFn) {
    let tasks;
    try { tasks = JSON.parse(localStorage.getItem(taskKey)); } catch (e) { return null; }
    if (!tasks || typeof tasks !== "object") return null;
    const marks = tasks.marks || {};
    const bonus = tasks.bonus || [];
    const byChild = {};
    Object.keys(marks).forEach((k) => {
      const pid = k.split(":")[0];
      const pts = pointFn(marks[k]);
      if (pts) byChild[pid] = (byChild[pid] || 0) + pts;
    });
    bonus.forEach((b) => {
      if (b && b.pid && b.pts) byChild[b.pid] = (byChild[b.pid] || 0) + b.pts;
    });
    return { week: tasks.week || "", byChild };
  }

  // Abona una fuente de tareas usando su propio libro mayor (`ledgerKey`), de
  // forma idempotente por semana: solo abona la diferencia nueva, nunca quita,
  // y reinicia la línea base al cambiar de semana. Cada fuente lleva su libro
  // por separado para que jamás se dupliquen entre sí.
  function reconcileSource(taskKey, ledgerKey, pointFn, label) {
    const info = readApprovedPoints(taskKey, pointFn);
    if (!info) return;
    setState((prev) => {
      let changed = false;
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[ledgerKey]) next[ledgerKey] = {};
      BC.CHILDREN.forEach((c) => {
        if (!next.data[c.id]) return;
        const total = Math.round(info.byChild[c.id] || 0);
        const rec = next[ledgerKey][c.id];
        const base = (rec && rec.week === info.week) ? rec.amount : 0;
        const add = total - base; // solo abonamos lo nuevo; nunca quitamos
        if (add > 0) {
          creditIncome(next, c.id, add, label || "Puntos de tareas aprobados", "tareas", "⭐");
          next[ledgerKey][c.id] = { week: info.week, amount: base + add };
          changed = true;
        } else if (!rec || rec.week !== info.week) {
          // Semana nueva sin puntos todavía: fija la línea base sin abonar.
          next[ledgerKey][c.id] = { week: info.week, amount: base };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }

  const reconcilePoints = useCallback(() => {
    // Sistema anterior (Panel de Padres): usa window.markPoints si está cargado.
    reconcileSource(TASKS_KEY, "pointsCredited",
      (m) => (typeof window.markPoints === "function") ? window.markPoints(m) : 0,
      "Puntos de tareas aprobados");
    // Sistema nuevo ("Mi día"): rutinas (1 pt) y áreas por orden + limpieza.
    reconcileSource(MICRO_KEY, "pointsCreditedMicro", microMarkPoints,
      "Puntos de tareas aprobados");
  }, []);

  // Reconcilia al abrir el banco y cada vez que cambian las tareas (otra
  // pestaña/ventana escribe localStorage, o al volver a la app).
  useEffect(() => {
    reconcilePoints();
    const onStorage = (e) => { if (!e || e.key === null || e.key === TASKS_KEY || e.key === MICRO_KEY) reconcilePoints(); };
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
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        creditIncome(next, childId, amount, label, cat, icon);
        return next;
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
        req.items.forEach((i) => {
          creditIncome(next, req.childId, i.subtotal, i.label, i.cat, i.icon);
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
    setIva(patch) {
      setState((prev) => Object.assign({}, prev, {
        ivaCfg: Object.assign({ enabled: true, pct: BC.IVA_DEFAULT }, prev.ivaCfg, patch),
      }));
    },
    fundSpend(amount, cat, label) {
      let ok = false;
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        amount = Math.round(Number(amount) || 0);
        if (!next.fund) next.fund = freshFund();
        if (amount <= 0 || next.fund.balance < amount) return prev;
        next.fund.balance -= amount;
        const mk = BC.monthKey();
        if (!next.fund.months[mk]) next.fund.months[mk] = { in: 0, out: 0 };
        next.fund.months[mk].out += amount;
        next.fund.tx.unshift({ id: genId(), ts: Date.now(), type: "out", cat, amount, label: label || "Gasto del fondo" });
        if (next.fund.tx.length > 600) next.fund.tx.length = 600;
        ok = true;
        return next;
      });
      return ok;
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
    gross: month.gross || 0,
    iva: month.iva || 0,
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

// Resumen del Fondo IVA Familiar.
function fundSummary(state) {
  const f = state.fund || freshFund();
  const mk = BC.monthKey();
  const year = String(new Date().getFullYear());
  const thisMonth = f.months[mk] || { in: 0, out: 0 };
  let yearIn = 0, yearOut = 0;
  Object.keys(f.months || {}).forEach((k) => {
    if (k.indexOf(year + "-") === 0) { yearIn += f.months[k].in || 0; yearOut += f.months[k].out || 0; }
  });
  const byChild = {};
  (f.tx || []).forEach((t) => {
    if (t.type === "in" && t.childId) byChild[t.childId] = (byChild[t.childId] || 0) + t.amount;
  });
  return {
    balance: f.balance || 0,
    monthIn: thisMonth.in || 0, monthOut: thisMonth.out || 0,
    yearIn, yearOut, byChild, tx: f.tx || [],
  };
}

Object.assign(window, { StoreProvider, useStore, StoreContext, childMonth, childSummary, childExpenses, fixedTotalFor, budgetAmount, fundSummary });
