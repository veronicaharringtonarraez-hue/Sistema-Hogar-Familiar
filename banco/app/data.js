/* ============================================================
   Banco Crece — Configuración y economía de la familia
   Moneda única: PUNTOS (salario virtual). 1 tarea = 10 puntos base.
   ============================================================ */
(function () {
  // ---- Cuentas (fusión) ----
  // Si la app del Hogar cargó window.FAMILY, las cuentas del banco se derivan
  // de ahí (incluye a mamá y papá; excluye a la bebé, que administran los
  // padres). Si no, se usa la lista propia de respaldo para que el banco
  // siga funcionando por sí solo.
  const FALLBACK_CHILDREN = [
    { id: "taylor",      name: "Taylor",      age: 10, avatar: "🦄", color: "#FF4D88", colorSoft: "#FFE3EC", dailyRate: 30, hasSchool: true,  rubros: 16, examAvg: 92.19 },
    { id: "emmeth",      name: "Emmeth",      age: 7,  avatar: "🦖", color: "#2E8BFF", colorSoft: "#DCEBFF", dailyRate: 20, hasSchool: true,  rubros: 15, examAvg: 95.9 },
    { id: "christopher", name: "Christopher", age: 4,  avatar: "🦁", color: "#1FB85A", colorSoft: "#D6F5E1", dailyRate: 10, hasSchool: false, rubros: 0,  examAvg: null },
  ];

  let CHILDREN;
  if (window.FAMILY && Array.isArray(window.FAMILY)) {
    CHILDREN = window.FAMILY
      .filter(function (p) { return !p.isBaby; })   // todos menos la bebé
      .map(function (p) {
        return {
          id: p.id,
          name: p.short || p.name,
          age: p.age,
          avatar: p.emoji || "🙂",
          color: (p.colors && p.colors.a) || "#2E8BFF",
          colorSoft: (p.colors && p.colors.c) || "#DCEBFF",
          dailyRate: p.isKid ? 10 : 0,
          hasSchool: p.age != null && p.age >= 5,
          rubros: 0,
          examAvg: null,
          isKid: !!p.isKid,
        };
      });
  } else {
    CHILDREN = FALLBACK_CHILDREN;
  }

  // ---- Gastos fijos mensuales (proporción 3:2:1) ----
  // diezmo y ahorro se calculan como % del ingreso del mes (no fijos)
  const EXPENSES = [
    { id: "alquiler",   label: "Alquiler",      icon: "🏠", desc: "El techo donde vives",            taylor: 120, emmeth: 80, christopher: 40 },
    { id: "alimentacion", label: "Alimentación", icon: "🍎", desc: "Comida de todo el mes",           taylor: 90,  emmeth: 60, christopher: 30 },
    { id: "transporte", label: "Transporte",     icon: "🚗", desc: "Carro, gasolina y viajes",        taylor: 45,  emmeth: 30, christopher: 15 },
    { id: "servicios",  label: "Servicios",      icon: "💡", desc: "Luz, agua e internet",            taylor: 36,  emmeth: 24, christopher: 12 },
    { id: "educacion",  label: "Educación",      icon: "📚", desc: "Útiles y materiales",             taylor: 30,  emmeth: 20, christopher: 10 },
    { id: "seguro",     label: "Seguro médico",  icon: "🏥", desc: "Para cuidar tu salud",            taylor: 24,  emmeth: 16, christopher: 8  },
    { id: "impuestos",  label: "Impuestos",      icon: "🏛️", desc: "Lo que aporta cada ciudadano",    taylor: 30,  emmeth: 20, christopher: 10 },
    { id: "actividades",label: "Actividades",    icon: "🎮", desc: "Diversión, juegos y paseos",      taylor: 30,  emmeth: 20, christopher: 10 },
    { id: "donacion",   label: "Donación",       icon: "❤️", desc: "Ayudar a quien lo necesita",      taylor: 15,  emmeth: 10, christopher: 5  },
  ];

  // Obligaciones que dependen del ingreso del mes (porcentaje)
  const PERCENT_DUES = [
    { id: "diezmo", label: "Diezmo",  icon: "⛪", desc: "10% para la iglesia", pct: 0.10 },
    { id: "ahorro", label: "Ahorro",  icon: "🐷", desc: "10% para tu meta",    pct: 0.10 },
  ];

  // ---- Tareas para ganar dinero ----
  const CHORES = [
    { id: "area",    label: "Limpiar un área de la casa", icon: "🧹", points: 10, big: true },
    { id: "plato",   label: "Lavar mi plato",             icon: "🍽️", points: 2 },
    { id: "ropa",    label: "Doblar y guardar mi ropa",   icon: "👕", points: 3 },
    { id: "raichel", label: "Cuidar a Raichel 👶",         icon: "🍼", points: 5 },
    { id: "servicio",label: "Acción de servicio",         icon: "⭐", points: 5, note: "Mamá/Papá decide el valor" },
  ];

  // ---- Bono trimestral de exámenes (sobre 100 pts) ----
  const EXAM_BONUS_MAX = 100;
  function examBonus(avg) {
    if (avg == null) return { pct: 0, amount: 0, label: "Sin escuela aún" };
    if (avg >= 95) return { pct: 100, amount: 100, label: "¡Bono completo!" };
    if (avg >= 90) return { pct: 80,  amount: 80,  label: "¡Excelente!" };
    if (avg >= 85) return { pct: 70,  amount: 70,  label: "¡Muy bien!" };
    if (avg >= 80) return { pct: 50,  amount: 50,  label: "Bien" };
    return { pct: 0, amount: 0, label: "Sin bono este trimestre" };
  }

  // Total de gastos fijos del mes para un niño (sin % dues)
  function fixedTotal(childId) {
    return EXPENSES.reduce((s, e) => s + (e[childId] || 0), 0);
  }

  // Única moneda del sistema: PUNTOS. Antes se mostraba en "$"; ahora todo
  // el banco habla en puntos (el salario virtual de cada integrante).
  function money(n) {
    const v = Math.round(n);
    return v.toLocaleString("en-US") + " pts";
  }

  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  function monthKey(d) { d = d || new Date(); return d.getFullYear() + "-" + d.getMonth(); }
  function monthLabel(key) {
    const [y, m] = key.split("-").map(Number);
    return MONTHS[m] + " " + y;
  }

  // ---- Insignias / medallas (se desbloquean solas) ----
  const BADGES = [
    { id: "primer_billete", icon: "🪙", color: "#FFB020", name: "Primer billete",       desc: "Ganaste dinero por primera vez." },
    { id: "trabajador",     icon: "💪", color: "#1FB85A", name: "Súper trabajador",      desc: "Ganaste $100 en total." },
    { id: "limpiador",      icon: "🧹", color: "#2E8BFF", name: "Maestro de la limpieza", desc: "Limpiaste 10 áreas de la casa." },
    { id: "ahorrador",      icon: "🐷", color: "#FF7AB0", name: "Ahorrador",             desc: "Apartaste dinero para tu meta." },
    { id: "alcancia",       icon: "💎", color: "#7C5CFF", name: "Alcancía llena",        desc: "Juntaste $50 en tu ahorro." },
    { id: "meta",           icon: "🎯", color: "#FF4D5E", name: "¡Meta cumplida!",       desc: "Llegaste a tu meta de ahorro." },
    { id: "puntual",        icon: "✅", color: "#1FB85A", name: "Todo pagado",           desc: "Pagaste todos tus gastos en un mes." },
    { id: "fiel",           icon: "⛪", color: "#A855F7", name: "Diezmo fiel",           desc: "Diste tu diezmo." },
    { id: "generoso",       icon: "❤️", color: "#FF4D88", name: "Corazón generoso",      desc: "Hiciste una donación." },
    { id: "estudiante",     icon: "🎓", color: "#FF9F1C", name: "Estrella escolar",      desc: "Ganaste tu bono de exámenes." },
  ];

  function evaluateBadges(childData, goal) {
    const tx = childData.tx || [];
    const sumCat = (cat) => tx.filter((t) => t.cat === cat).reduce((s, t) => s + t.amount, 0);
    const incomeTotal = tx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const has = (fn) => tx.some(fn);
    const monthsPaidAll = Object.values(childData.months || {}).some(
      (m) => Object.keys(m.paid || {}).filter((k) => m.paid[k]).length >= EXPENSES.length
    );
    const checks = {
      primer_billete: incomeTotal > 0,
      trabajador: incomeTotal >= 100,
      limpiador: sumCat("area") >= 100,
      ahorrador: has((t) => t.type === "saving"),
      alcancia: (childData.savings || 0) >= 50,
      meta: (childData.savings || 0) >= (goal ? goal.target : Infinity),
      puntual: monthsPaidAll,
      fiel: has((t) => t.cat === "diezmo" && t.type === "expense"),
      generoso: has((t) => t.cat === "donacion"),
      estudiante: has((t) => t.cat === "bono"),
    };
    return BADGES.filter((b) => checks[b.id]).map((b) => b.id);
  }

  window.BC = {
    CHILDREN, EXPENSES, PERCENT_DUES, CHORES, BADGES, evaluateBadges,
    EXAM_BONUS_MAX, examBonus, fixedTotal, money,
    MONTHS, monthKey, monthLabel,
    DEFAULT_PIN: (window.PARENT_PIN || "181215"),
  };
})();
