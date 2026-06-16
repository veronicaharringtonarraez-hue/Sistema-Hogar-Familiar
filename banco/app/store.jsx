/* ============================================================
   Banco Crece — Store (estado + localStorage)
   ============================================================ */
const STORE_KEY = "bancoCrece.v1";

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
