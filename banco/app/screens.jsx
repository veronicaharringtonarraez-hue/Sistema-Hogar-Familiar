/* ============================================================
   Banco Crece — Pantallas del niño
   ============================================================ */

/* -------- INICIO -------- */
function ScreenInicio({ child, nav }) {
  const { state } = useStore();
  const s = childSummary(state, child.id);
  const goal = state.goals[child.id];
  const allPaid = s.billsPaidCount === s.billsTotalCount && s.diezmoPending === 0;

  return (
    <div className="bc-screen">
      <div className="bc-balance-card" style={{ background: `linear-gradient(135deg, ${child.color}, ${shade(child.color, -18)})` }}>
        <div className="bc-balance-top">
          <span>Mi saldo</span>
          <Avatar child={child} size={44} ring={false} />
        </div>
        <div className="bc-balance-amount">{BC.money(s.balance)}</div>
        <div className="bc-balance-sub">
          🐷 Ahorrado: <strong>{BC.money(s.savings)}</strong>
        </div>
      </div>

      <div className="bc-quick-grid">
        <button className="bc-quick" style={{ "--qc": "#1FB85A" }} onClick={() => nav("ganar")}>
          <span className="bc-quick-ic">⭐</span>
          <span>Puntos</span>
        </button>
        <button className="bc-quick" style={{ "--qc": "#FF7A45" }} onClick={() => nav("pagar")}>
          <span className="bc-quick-ic">🧾</span>
          <span>Pagar</span>
        </button>
        <button className="bc-quick" style={{ "--qc": "#2E8BFF" }} onClick={() => nav("ahorro")}>
          <span className="bc-quick-ic">🐷</span>
          <span>Ahorrar</span>
        </button>
        <button className="bc-quick" style={{ "--qc": "#A855F7" }} onClick={() => nav("registro")}>
          <span className="bc-quick-ic">📜</span>
          <span>Registro</span>
        </button>
      </div>

      <Card className="bc-goal-card">
        <div className="bc-goal-head">
          <span className="bc-goal-emoji">{goal.emoji}</span>
          <div>
            <div className="bc-goal-name">Mi meta: {goal.name}</div>
            <div className="bc-goal-nums"><MoneyText amount={s.savings} /> de <MoneyText amount={goal.target} /></div>
          </div>
        </div>
        <ProgressBar value={s.savings} max={goal.target} color={child.color} height={16} />
        {s.savings >= goal.target
          ? <div className="bc-goal-done">🎉 ¡Lograste tu meta!</div>
          : <div className="bc-goal-left">Te faltan <strong>{BC.money(goal.target - s.savings)}</strong></div>}
      </Card>

      <button className="bc-badge-teaser" onClick={() => nav("logros")}>
        <span className="bc-badge-teaser-ic">🏅</span>
        <div className="bc-badge-teaser-txt">
          <strong>Mis logros</strong>
          <span>{(BC.BADGES.filter((b) => (state.data[child.id].badges || {})[b.id]).length)} de {BC.BADGES.length} insignias</span>
        </div>
        <div className="bc-badge-teaser-row">
          {BC.BADGES.slice(0, 6).map((b) => {
            const on = (state.data[child.id].badges || {})[b.id];
            return <span key={b.id} className={on ? "" : "lock"}>{on ? b.icon : "·"}</span>;
          })}
        </div>
      </button>

      <FundTeaser nav={nav} />

      <div className="bc-section-title">Este mes — {BC.monthLabel(BC.monthKey())}</div>
      <div className="bc-mini-grid">
        <Stat label="Ganado este mes" value={BC.money(s.income)} color="#1FB85A" icon="💪" />
        <Stat label="Gastos pagados" value={`${s.billsPaidCount}/${s.billsTotalCount}`} color="#FF7A45" icon="🧾" />
        <Stat label="Diezmo pendiente" value={BC.money(s.diezmoPending)} color="#A855F7" icon="⛪" />
        <Stat label="Ahorro del mes" value={BC.money(s.ahorroDone)} color="#2E8BFF" icon="🐷" />
      </div>

      {allPaid && s.income > 0 && (
        <div className="bc-allpaid">✅ ¡Pagaste todo este mes! Eres muy responsable.</div>
      )}
    </div>
  );
}

/* -------- GANAR (dinero por puntos aprobados) --------
   Ya no hay tareas manuales aquí: el dinero entra solo. Por cada punto que
   los padres aprueban en el Panel de Padres, el banco abona 1 $ (1 punto = 1 $).
   Esta pantalla solo explica de dónde viene el dinero y muestra lo ganado. */
function ScreenGanar({ child, nav }) {
  const { state } = useStore();
  const s = childSummary(state, child.id);
  // Últimos ingresos por puntos de tareas (los abona reconcilePoints).
  const fromTasks = (state.data[child.id].tx || [])
    .filter((t) => t.type === "income" && t.cat === "tareas")
    .slice(0, 5);

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>⭐ Cómo gano mi salario</h2>
        <p>Tu salario entra solo: cada tarea aprobada por Mamá o Papá vale <strong>10 puntos</strong> (más si fue un trabajo excelente). 🎉</p>
      </div>

      <Card className="bc-goal-card">
        <div className="bc-how-step"><span className="bc-how-ic">✅</span><div><strong>1. Haz tus tareas</strong><div className="muted">Marca "listo" cuando termines.</div></div></div>
        <div className="bc-how-step"><span className="bc-how-ic">👀</span><div><strong>2. Mamá o Papá revisan</strong><div className="muted">10 puntos base, y pueden subirlos por buen trabajo.</div></div></div>
        <div className="bc-how-step"><span className="bc-how-ic">💰</span><div><strong>3. Tu salario llega al banco</strong><div className="muted">Los puntos aprobados se depositan automático.</div></div></div>
      </Card>

      <div className="bc-mini-grid">
        <Stat label="Ganado este mes (neto)" value={BC.money(s.income)} color="#1FB85A" icon="⭐" />
        <Stat label="Mi saldo ahora" value={BC.money(s.balance)} color="#2E8BFF" icon="💰" />
      </div>

      {s.iva > 0 && (
        <Card className="bc-iva-note">
          🏛 De tus <strong>{BC.money(s.gross)}</strong> ganados este mes, <strong>{BC.money(s.iva)}</strong> fueron al
          <strong> Fondo IVA Familiar</strong> para el bienestar de todos. Recibiste <strong>{BC.money(s.income)}</strong>.
        </Card>
      )}

      {fromTasks.length > 0 && (
        <>
          <div className="bc-section-title">Últimos puntos que se hicieron dinero</div>
          <div className="bc-chore-list">
            {fromTasks.map((t) => (
              <Card key={t.id} className="bc-chore">
                <span className="bc-chore-ic">{t.icon || "⭐"}</span>
                <div className="bc-chore-info">
                  <div className="bc-chore-label">{t.label}</div>
                  <div className="bc-chore-pts muted">{new Date(t.ts).toLocaleDateString()}</div>
                </div>
                <span className="bc-pending-amt" style={{ color: "#1FB85A" }}>+{BC.money(t.amount)}</span>
              </Card>
            ))}
          </div>
        </>
      )}

      <button className="bc-btn-primary" style={{ marginTop: 14 }} onClick={() => nav && nav("registro")}>Ver todo mi registro 📜</button>
    </div>
  );
}

/* -------- PAGAR -------- */
function ScreenPagar({ child }) {
  const { state, actions } = useStore();
  const fx = useFx();
  const s = childSummary(state, child.id);
  const month = childMonth(state, child.id);

  const pay = (id) => {
    const ok = actions.payBill(child.id, id);
    if (ok) { fx.toast("Pagado ✅"); }
  };
  const payDiezmo = () => {
    const ok = actions.payDiezmo(child.id);
    if (ok) fx.toast("Diezmo pagado ⛪");
  };

  return (
    <div className="bc-screen">
      <div className="bc-pay-balance" style={{ borderColor: child.color }}>
        <span>Tienes para gastar</span>
        <MoneyText amount={s.balance} className="big" style={{ color: child.color }} />
      </div>
      <div className="bc-screen-head tight">
        <h2>🧾 Mis gastos del mes</h2>
        <p>Paga tus cuentas como un adulto. {s.billsPaidCount} de {s.billsTotalCount} pagadas.</p>
      </div>

      <div className="bc-bill-list">
        {childExpenses(state, child.id).map((e) => {
          const amount = e.amount;
          const paid = !!month.paid[e.id];
          const cant = !paid && s.balance < amount;
          return (
            <Card key={e.id} className={"bc-bill " + (paid ? "paid" : "")}>
              <span className="bc-bill-ic">{e.icon}</span>
              <div className="bc-bill-info">
                <div className="bc-bill-label">{e.label}</div>
                <div className="bc-bill-desc">{e.desc}</div>
              </div>
              <div className="bc-bill-amount">{BC.money(amount)}</div>
              {paid
                ? <span className="bc-bill-done">Pagado ✅</span>
                : <button className="bc-bill-pay" disabled={cant} onClick={() => pay(e.id)}>
                    {cant ? "Sin saldo" : "Pagar"}
                  </button>}
            </Card>
          );
        })}

        {/* Diezmo */}
        <Card className={"bc-bill diezmo " + (s.diezmoPending === 0 && s.income > 0 ? "paid" : "")}>
          <span className="bc-bill-ic">⛪</span>
          <div className="bc-bill-info">
            <div className="bc-bill-label">Diezmo (10%)</div>
            <div className="bc-bill-desc">
              {s.income > 0
                ? `10% de lo que ganaste (${BC.money(s.income)})`
                : "Aparece cuando ganas dinero"}
            </div>
          </div>
          <div className="bc-bill-amount">{BC.money(s.diezmoDue)}</div>
          {s.diezmoPending === 0
            ? <span className="bc-bill-done">{s.income > 0 ? "Al día ✅" : "—"}</span>
            : <button className="bc-bill-pay" disabled={s.balance <= 0} onClick={payDiezmo}>
                Pagar {BC.money(s.diezmoPending)}
              </button>}
        </Card>
      </div>
    </div>
  );
}

/* -------- AHORRO -------- */
function ScreenAhorro({ child }) {
  const { state, actions } = useStore();
  const fx = useFx();
  const s = childSummary(state, child.id);
  const goal = state.goals[child.id];
  const [amt, setAmt] = useState(5);
  const [wOpen, setWOpen] = useState(false);
  const [wErr, setWErr] = useState("");
  const [wAmt, setWAmt] = useState(5);

  const save = () => {
    const ok = actions.saveToGoal(child.id, amt);
    if (ok) { fx.celebrate(); fx.toast(`¡Ahorraste ${BC.money(amt)}! 🐷`); }
    else fx.toast("No tienes saldo suficiente");
  };
  const withdraw = (pin) => {
    if (pin !== state.pin) { setWErr("PIN incorrecto"); return; }
    const ok = actions.withdrawSavings(child.id, wAmt);
    if (ok) fx.toast(`Retiraste ${BC.money(wAmt)} del ahorro`);
    setWOpen(false); setWErr("");
  };

  return (
    <div className="bc-screen">
      <div className="bc-piggy-card">
        <div className="bc-piggy-emoji">🐷</div>
        <div className="bc-piggy-amount">{BC.money(s.savings)}</div>
        <div className="bc-piggy-label">en mi alcancía</div>
      </div>

      <Card className="bc-goal-card">
        <div className="bc-goal-head">
          <span className="bc-goal-emoji">{goal.emoji}</span>
          <div>
            <div className="bc-goal-name">{goal.name}</div>
            <div className="bc-goal-nums"><MoneyText amount={s.savings} /> de <MoneyText amount={goal.target} /></div>
          </div>
        </div>
        <ProgressBar value={s.savings} max={goal.target} color={child.color} height={18} showPct />
        {s.savings < goal.target
          ? <div className="bc-goal-left">Te faltan <strong>{BC.money(goal.target - s.savings)}</strong> 💪</div>
          : <div className="bc-goal-done">🎉 ¡Meta cumplida! Habla con Mamá/Papá.</div>}
      </Card>

      <Card className="bc-save-box">
        <div className="bc-save-title">Apartar dinero para mi meta</div>
        <div className="bc-save-hint">Tu meta del mes: ahorrar {BC.money(s.ahorroGoal)} · llevas {BC.money(s.ahorroDone)}</div>
        <div className="bc-amount-row">
          <button onClick={() => setAmt((a) => Math.max(1, a - 1))}>−</button>
          <div className="bc-amount-val">{BC.money(amt)}</div>
          <button onClick={() => setAmt((a) => a + 1)}>+</button>
        </div>
        <div className="bc-chip-row">
          {[5, 10, 20].map((v) => (
            <button key={v} className="bc-chip" onClick={() => setAmt(v)}>{BC.money(v)}</button>
          ))}
        </div>
        <button className="bc-btn-primary full" disabled={s.balance < amt} onClick={save}>
          {s.balance < amt ? "Sin saldo suficiente" : `Ahorrar ${BC.money(amt)} 🐷`}
        </button>
        <button className="bc-link-btn" onClick={() => { setWAmt(Math.min(5, s.savings)); setWErr(""); setWOpen(true); }}>
          Retirar de mi ahorro (con permiso)
        </button>
      </Card>

      <Modal open={wOpen} onClose={() => setWOpen(false)} title="Retirar del ahorro" accent={child.color}>
        <p className="bc-modal-note">Retirar del ahorro necesita permiso de un adulto.</p>
        <div className="bc-amount-row">
          <button onClick={() => setWAmt((a) => Math.max(1, a - 1))}>−</button>
          <div className="bc-amount-val">{BC.money(wAmt)}</div>
          <button onClick={() => setWAmt((a) => Math.min(s.savings, a + 1))}>+</button>
        </div>
        <PinPad onSubmit={withdraw} error={wErr} length={state.pin.length} prompt="PIN de Mamá/Papá para retirar" />
      </Modal>
    </div>
  );
}

/* -------- REGISTRO -------- */
function ScreenRegistro({ child }) {
  const { state } = useStore();
  const tx = state.data[child.id].tx;
  const [filter, setFilter] = useState("todo");
  const s = childSummary(state, child.id);

  const filtered = tx.filter((t) =>
    filter === "todo" ? true :
    filter === "ingresos" ? t.type === "income" :
    filter === "gastos" ? t.type === "expense" :
    t.type === "saving"
  );

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>📜 Mi registro</h2>
        <p>Todo lo que ganas, gastas y ahorras.</p>
      </div>

      <div className="bc-reg-summary">
        <div className="bc-reg-sum-item in">
          <span>Ingresos del mes</span>
          <strong>+{BC.money(s.income)}</strong>
        </div>
        <div className="bc-reg-sum-item out">
          <span>Gastos del mes</span>
          <strong>−{BC.money(s.fixedPaid + s.diezmoPaid)}</strong>
        </div>
      </div>

      <div className="bc-filter-row">
        {[["todo", "Todo"], ["ingresos", "Ingresos"], ["gastos", "Gastos"], ["ahorro", "Ahorro"]].map(([k, l]) => (
          <button key={k} className={"bc-filter " + (filter === k ? "on" : "")} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      <div className="bc-tx-list">
        {filtered.length === 0 && <div className="bc-empty">Aún no hay movimientos aquí 🐣</div>}
        {filtered.map((t) => (
          <div key={t.id} className="bc-tx">
            <span className="bc-tx-ic" style={{ background: txColor(t.type) + "22" }}>{t.icon || "💰"}</span>
            <div className="bc-tx-info">
              <div className="bc-tx-label">{t.label}</div>
              <div className="bc-tx-date">{fmtDate(t.ts)}</div>
            </div>
            <div className="bc-tx-amount" style={{ color: txColor(t.type) }}>
              {t.type === "expense" ? "−" : t.type === "saving" ? "→" : "+"}{BC.money(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- PRESUPUESTO -------- */
function ScreenPresupuesto({ child }) {
  const { state } = useStore();
  const s = childSummary(state, child.id);
  const exps = childExpenses(state, child.id);
  const fixed = exps.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>📊 Mi presupuesto</h2>
        <p>Así se reparte el dinero de un adulto. Tú lo aprendes desde ya.</p>
      </div>

      <Card className="bc-budget-rule">
        <div className="bc-rule-title">La regla del dinero inteligente</div>
        <div className="bc-rule-bars">
          <div className="bc-rule-seg" style={{ flex: 70, background: "#FF7A45" }}><span>70%</span></div>
          <div className="bc-rule-seg" style={{ flex: 10, background: "#A855F7" }}><span>10%</span></div>
          <div className="bc-rule-seg" style={{ flex: 10, background: "#2E8BFF" }}><span>10%</span></div>
          <div className="bc-rule-seg" style={{ flex: 10, background: "#1FB85A" }}><span>10%</span></div>
        </div>
        <div className="bc-rule-legend">
          <span><i style={{ background: "#FF7A45" }} />Gastos</span>
          <span><i style={{ background: "#A855F7" }} />Diezmo</span>
          <span><i style={{ background: "#2E8BFF" }} />Ahorro</span>
          <span><i style={{ background: "#1FB85A" }} />Libre</span>
        </div>
      </Card>

      <div className="bc-section-title">Gastos fijos cada mes</div>
      <div className="bc-budget-list">
        {exps.map((e) => {
          const amt = e.amount;
          const pct = fixed > 0 ? Math.round((amt / fixed) * 100) : 0;
          return (
            <div key={e.id} className="bc-budget-row">
              <span className="bc-budget-ic">{e.icon}</span>
              <div className="bc-budget-main">
                <div className="bc-budget-top">
                  <span>{e.label}</span>
                  <strong>{BC.money(amt)}</strong>
                </div>
                <ProgressBar value={pct} max={100} color={child.color} height={8} />
              </div>
            </div>
          );
        })}
      </div>

      <Card className="bc-budget-total">
        <div className="bc-bt-row"><span>🏠 Total gastos fijos</span><strong>{BC.money(fixed)}</strong></div>
        <div className="bc-bt-row"><span>⛪ Diezmo</span><strong>10% de lo que ganas</strong></div>
        <div className="bc-bt-row"><span>🐷 Ahorro</span><strong>10% de lo que ganas</strong></div>
      </Card>

      <Card className="bc-budget-tip">
        💡 Si limpias todos los días puedes ganar hasta <strong>{BC.money(child.dailyRate * 30)}</strong> al mes.
        ¡Mientras más ayudas, más te sobra para tus metas!
      </Card>
    </div>
  );
}

/* -------- LOGROS -------- */
function ScreenLogros({ child }) {
  const { state } = useStore();
  const badges = state.data[child.id].badges || {};
  const unlocked = BC.BADGES.filter((b) => badges[b.id]);
  const count = unlocked.length;

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>🏅 Mis logros</h2>
        <p>Gana insignias por portarte como un campeón del dinero.</p>
      </div>

      <Card className="bc-logros-head" style={{ background: child.colorSoft }}>
        <div className="bc-logros-big" style={{ color: child.color }}>{count}<span>/{BC.BADGES.length}</span></div>
        <div className="bc-logros-sub">insignias ganadas</div>
        <ProgressBar value={count} max={BC.BADGES.length} color={child.color} height={12} />
      </Card>

      <div className="bc-badge-grid">
        {BC.BADGES.map((b) => {
          const on = !!badges[b.id];
          return (
            <div key={b.id} className={"bc-badge " + (on ? "on" : "off")} style={on ? { "--bc": b.color } : {}}>
              <div className="bc-badge-ic">{on ? b.icon : "🔒"}</div>
              <div className="bc-badge-name">{b.name}</div>
              <div className="bc-badge-desc">{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------- FONDO IVA FAMILIAR -------- */
function FundTeaser({ nav }) {
  const { state } = useStore();
  const f = fundSummary(state);
  return (
    <button className="bc-fund-teaser" onClick={() => nav("fondo")}>
      <span className="bc-fund-teaser-ic">🏛</span>
      <div className="bc-fund-teaser-txt">
        <strong>Fondo IVA Familiar</strong>
        <span>El ahorro de toda la familia</span>
      </div>
      <span className="bc-fund-teaser-amt">{BC.money(f.balance)}</span>
    </button>
  );
}

function ScreenFondo({ child }) {
  const { state } = useStore();
  const f = fundSummary(state);
  const nameOf = (id) => (BC.CHILDREN.find((c) => c.id === id) || {});

  // mensaje motivador sencillo
  const lastOut = (f.tx || []).find((t) => t.type === "out");

  return (
    <div className="bc-screen">
      <div className="bc-fund-hero">
        <div className="bc-fund-hero-ic">🏛</div>
        <div className="bc-fund-hero-label">Fondo IVA Familiar</div>
        <div className="bc-fund-hero-amount">{BC.money(f.balance)}</div>
        <div className="bc-fund-hero-sub">El dinero que entre todos cuidamos 💛</div>
      </div>

      <Card className="bc-iva-note">
        Cada vez que alguien gana puntos, una parte va a este fondo común. Sirve para reparar la casa,
        cuidar el carro y vivir experiencias juntos. ¡Todos aportamos, todos ganamos!
      </Card>

      <div className="bc-mini-grid">
        <Stat label="Aportes este mes" value={BC.money(f.monthIn)} color="#1FB85A" icon="📥" />
        <Stat label="Gastos este mes" value={BC.money(f.monthOut)} color="#FF7A45" icon="📤" />
        <Stat label="Aportes del año" value={BC.money(f.yearIn)} color="#2E8BFF" icon="📅" />
        <Stat label="Gastos del año" value={BC.money(f.yearOut)} color="#A855F7" icon="🧾" />
      </div>

      {lastOut && (
        <Card className="bc-fund-msg">
          🎉 Lo último que logramos juntos: <strong>{lastOut.label}</strong> ({BC.money(lastOut.amount)}).
        </Card>
      )}

      <div className="bc-section-title">Quién ha aportado</div>
      <div className="bc-budget-list">
        {BC.CHILDREN.map((c) => {
          const amt = f.byChild[c.id] || 0;
          const max = Math.max(1, ...BC.CHILDREN.map((k) => f.byChild[k.id] || 0));
          return (
            <div key={c.id} className="bc-budget-row">
              <span className="bc-budget-ic">{c.avatar}</span>
              <div className="bc-budget-main">
                <div className="bc-budget-top"><span>{c.name}</span><strong>{BC.money(amt)}</strong></div>
                <ProgressBar value={amt} max={max} color={c.color} height={8} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bc-section-title">Movimientos del fondo</div>
      <div className="bc-tx-list">
        {(f.tx || []).length === 0 && <div className="bc-empty">Aún no hay movimientos 🐣</div>}
        {(f.tx || []).slice(0, 30).map((t) => (
          <div key={t.id} className="bc-tx">
            <span className="bc-tx-ic" style={{ background: (t.type === "in" ? "#1FB85A" : "#FF7A45") + "22" }}>
              {t.type === "in" ? (nameOf(t.childId).avatar || "⭐") : (BC.fundCat(t.cat) || {}).icon || "🛠️"}
            </span>
            <div className="bc-tx-info">
              <div className="bc-tx-label">{t.label}</div>
              <div className="bc-tx-date">{fmtDate(t.ts)}</div>
            </div>
            <div className="bc-tx-amount" style={{ color: t.type === "in" ? "#1FB85A" : "#FF7A45" }}>
              {t.type === "in" ? "+" : "−"}{BC.money(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- helpers -------- */
function txColor(type) {
  return type === "income" ? "#1FB85A" : type === "expense" ? "#FF4D5E" : "#2E8BFF";
}
function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("es", { day: "numeric", month: "short" }) + " · " +
    d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}
function shade(hex, amt) {
  // amt en % (negativo = más oscuro)
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt / 100) * 255)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

Object.assign(window, {
  ScreenInicio, ScreenGanar, ScreenPagar, ScreenAhorro, ScreenRegistro, ScreenPresupuesto, ScreenLogros,
  ScreenFondo, FundTeaser,
});
