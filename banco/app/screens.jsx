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

      <div className="bc-section-title">{BC.periodLabel(BC.periodKey())}</div>
      <div className="bc-mini-grid">
        <Stat label="Ganado (neto)" value={BC.money(s.income)} color="#1FB85A" icon="💪" />
        <Stat label="Obligaciones" value={`${s.obligPaidCount}/${s.obligTotalCount}`} color="#FF7A45" icon="🧾" />
        <Stat label="Diezmo pendiente" value={BC.money(s.diezmoPending)} color="#A855F7" icon="⛪" />
        <Stat label="Ahorro de la quincena" value={BC.money(s.ahorroDone)} color="#2E8BFF" icon="🐷" />
      </div>

      {allPaid && s.income > 0 && (
        <div className="bc-allpaid">✅ ¡Cubriste todas tus obligaciones! Eres muy responsable.</div>
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
        <Stat label="Ganado esta quincena (neto)" value={BC.money(s.income)} color="#1FB85A" icon="⭐" />
        <Stat label="Mi saldo ahora" value={BC.money(s.balance)} color="#2E8BFF" icon="💰" />
      </div>

      {s.iva > 0 && (
        <Card className="bc-iva-note">
          🏛 De tus <strong>{BC.money(s.gross)}</strong> ganados esta quincena, <strong>{BC.money(s.iva)}</strong> fueron al
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

/* -------- PAGAR (cubrir obligaciones de la quincena) -------- */
function ScreenPagar({ child }) {
  const { state, actions } = useStore();
  const fx = useFx();
  const s = childSummary(state, child.id);
  const oblig = s.budget.filter((c) => c.kind === "obligacion");

  const pay = (id) => {
    const ok = actions.payBill(child.id, id);
    if (ok) fx.toast("Cubierto ✅");
    else fx.toast("No te alcanza el saldo todavía");
  };

  return (
    <div className="bc-screen">
      <div className="bc-pay-balance" style={{ borderColor: child.color }}>
        <span>Tienes para gastar</span>
        <MoneyText amount={s.balance} className="big" style={{ color: child.color }} />
      </div>
      <div className="bc-screen-head tight">
        <h2>🧾 Servicios de la casa</h2>
        <p>Tu cuenta de la quincena. {s.obligPaidCount} de {s.obligTotalCount} pagadas. Total: {BC.money(s.obligTotal)}.</p>
      </div>

      <Card className="bc-iva-note">
        Tus cuentas son un % de tu <strong>salario esperado</strong> (lo que ganas si haces todas tus tareas). Se renueva cada quincena (1 y 16). Los bonos no cuentan aquí: ¡esos son para ahorrar! 🐷
      </Card>

      <div className="bc-bill-list">
        {oblig.map((c) => {
          const paid = c.paid;
          const cant = !paid && s.balance < c.amount;
          return (
            <Card key={c.id} className={"bc-bill " + (paid ? "paid" : "")}>
              <span className="bc-bill-ic">{c.icon}</span>
              <div className="bc-bill-info">
                <div className="bc-bill-label">{c.label} <span className="bc-pct-tag">{c.pct}%</span></div>
                <div className="bc-bill-desc">{c.desc}</div>
              </div>
              <div className="bc-bill-amount">{BC.money(c.amount)}</div>
              {paid
                ? <span className="bc-bill-done">Cubierto ✅</span>
                : <button className="bc-bill-pay" disabled={cant || c.amount <= 0} onClick={() => pay(c.id)}>
                    {cant ? "Sin saldo" : "Cubrir"}
                  </button>}
            </Card>
          );
        })}
      </div>

      <Card className="bc-iva-note">
        Después de las obligaciones: aparta <strong>{BC.money(s.ahorroGoal)}</strong> en tu ahorro 🐷 y te quedan
        <strong> {BC.money(s.gustos)}</strong> para tus gustos 🎉.
      </Card>
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
  // canje por dinero real
  const rate = (typeof state.redeemRate === "number") ? state.redeemRate : 1;
  const cur = state.currency || "₡";
  const realMoney = (pts) => cur + Math.round(pts * rate).toLocaleString("en-US");
  const [rOpen, setROpen] = useState(false);
  const [rErr, setRErr] = useState("");
  const [rAmt, setRAmt] = useState(5);

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
  const redeem = (pin) => {
    if (pin !== state.pin) { setRErr("PIN incorrecto"); return; }
    const ok = actions.redeemSavings(child.id, rAmt);
    if (ok) { fx.celebrate(); fx.toast(`¡Canjeaste ${realMoney(rAmt)}! Pídeselo a Mamá/Papá 💵`); }
    setROpen(false); setRErr("");
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
          ? <div className="bc-goal-left">Te faltan <strong>{BC.money(goal.target - s.savings)}</strong> · <strong>{weeksLabel(goalEstimate(state, child.id, s, goal).weeks)}</strong> 💪</div>
          : <div className="bc-goal-done">🎉 ¡Meta cumplida! Habla con Mamá/Papá.</div>}
      </Card>

      <Card className="bc-save-box">
        <div className="bc-save-title">Apartar dinero para mi meta</div>
        <div className="bc-save-hint">Tu meta de la quincena: ahorrar {BC.money(s.ahorroGoal)} · llevas {BC.money(s.ahorroDone)}</div>
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

      {/* Canjear ahorro por dinero real */}
      <Card className="bc-redeem-box">
        <div className="bc-save-title">💵 Usar mi ahorro (dinero real)</div>
        <div className="bc-save-hint">Cambia tus puntos ahorrados por dinero real con Mamá o Papá. 1 punto = {realMoney(1)}.</div>
        <button className="bc-btn-primary full" disabled={s.savings <= 0}
          onClick={() => { setRAmt(Math.min(10, s.savings) || 1); setRErr(""); setROpen(true); }}>
          {s.savings <= 0 ? "Aún no tienes ahorro" : "Canjear por dinero real 💵"}
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

      <Modal open={rOpen} onClose={() => setROpen(false)} title="Canjear por dinero real" accent={child.color}>
        <p className="bc-modal-note">Cambias puntos de tu ahorro por dinero real. Lo entrega Mamá o Papá.</p>
        <div className="bc-amount-row">
          <button onClick={() => setRAmt((a) => Math.max(1, a - 1))}>−</button>
          <div className="bc-amount-val">{BC.money(rAmt)}</div>
          <button onClick={() => setRAmt((a) => Math.min(s.savings, a + 1))}>+</button>
        </div>
        <div className="bc-redeem-eq">= <strong style={{ color: child.color }}>{realMoney(rAmt)}</strong> en dinero real</div>
        <div className="bc-chip-row" style={{ justifyContent: "center", marginBottom: 8 }}>
          {[10, 20, 50].filter((v) => v <= s.savings).map((v) => (
            <button key={v} className="bc-chip" onClick={() => setRAmt(v)}>{BC.money(v)}</button>
          ))}
        </div>
        <PinPad onSubmit={redeem} error={rErr} length={state.pin.length} prompt="PIN de Mamá/Papá para canjear" />
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
          <span>Ingresos de la quincena</span>
          <strong>+{BC.money(s.income)}</strong>
        </div>
        <div className="bc-reg-sum-item out">
          <span>Obligaciones cubiertas</span>
          <strong>−{BC.money(s.fixedPaid)}</strong>
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

/* -------- PRESUPUESTO / RECIBO DE PAGO (quincenal) -------- */
function ScreenPresupuesto({ child }) {
  const { state } = useStore();
  const s = childSummary(state, child.id);
  const groups = [];
  s.budget.forEach((c) => {
    let g = groups.find((x) => x.name === c.group);
    if (!g) { g = { name: c.group, cats: [], pct: 0, amount: 0 }; groups.push(g); }
    g.cats.push(c); g.pct += c.pct; g.amount += c.amount;
  });
  const groupColors = { "Necesidades básicas": "#FF7A45", "Futuro y compromisos": "#A855F7", "Protección financiera": "#2E8BFF", "Estilo de vida": "#1FB85A" };

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>📊 Mi plan de dinero</h2>
        <p>Tu salario se reparte como el de un adulto: obligaciones, ahorro y, al final, tus gustos.</p>
      </div>

      <Card className="bc-salary-card" style={{ background: child.colorSoft }}>
        <div className="bc-salary-label">Salario esperado por quincena</div>
        <div className="bc-salary-amount" style={{ color: child.color }}>{BC.money(s.expectedNet)}</div>
        <div className="bc-salary-sub">si cumples todas tus responsabilidades (ya con IVA descontado)</div>
      </Card>

      {/* Recibo de pago de la quincena */}
      <Card className="bc-receipt">
        <div className="bc-receipt-head">🧾 Recibo · {BC.periodLabel(BC.periodKey())}</div>
        <div className="bc-receipt-row"><span>Ingreso bruto</span><strong>{BC.money(s.gross)}</strong></div>
        <div className="bc-receipt-row sub"><span>− IVA Familiar</span><strong>−{BC.money(s.iva)}</strong></div>
        <div className="bc-receipt-row total" style={{ borderColor: child.color }}>
          <span>Ingreso neto</span><strong style={{ color: child.color }}>{BC.money(s.income)}</strong>
        </div>
      </Card>

      <div className="bc-section-title">Servicios de la casa · % del salario esperado</div>
      <div className="bc-rule-bars" style={{ marginBottom: 4 }}>
        {groups.map((g) => (
          <div key={g.name} className="bc-rule-seg" style={{ flex: g.pct, background: groupColors[g.name] || child.color }}><span>{g.pct}%</span></div>
        ))}
      </div>

      {groups.map((g) => (
        <Card key={g.name} className="bc-budget-list" style={{ borderLeft: `4px solid ${groupColors[g.name] || child.color}` }}>
          <div className="bc-budget-group">{g.name} · {g.pct}%</div>
          {g.cats.map((c) => (
            <div key={c.id} className="bc-budget-row">
              <span className="bc-budget-ic">{c.icon}</span>
              <div className="bc-budget-main">
                <div className="bc-budget-top"><span>{c.label} <span className="bc-pct-tag">{c.pct}%</span></span><strong>{BC.money(c.amount)}</strong></div>
                <ProgressBar value={c.pct} max={100} color={groupColors[g.name] || child.color} height={8} />
              </div>
            </div>
          ))}
        </Card>
      ))}

      <Card className="bc-budget-tip">
        💡 Tu salario esperado sube solo cuando asumes más responsabilidades en "Mi día".
        ¡Mientras más ayudas en casa, mayor tu capacidad de generar ingresos!
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

/* -------- PANEL FINANCIERO -------- */
// Estimación de una meta de ahorro: % completado y semanas para alcanzarla
// (según el ahorro esperado por semana = % de ahorro sobre el salario esperado).
function goalEstimate(state, childId, s, goal) {
  const pct = goal.target > 0 ? Math.min(100, Math.round((s.savings / goal.target) * 100)) : 0;
  const remaining = Math.max(0, goal.target - s.savings);
  const ahorroPct = budgetPctOf(state, "ahorro");
  const weeklySave = (s.expectedNet * ahorroPct / 100) / 2; // quincena = 2 semanas
  const weeks = remaining <= 0 ? 0 : (weeklySave > 0 ? Math.ceil(remaining / weeklySave) : null);
  return { pct, remaining, weeks };
}
function weeksLabel(weeks) {
  if (weeks == null) return "Ahorra un poco para estimarlo";
  if (weeks === 0) return "¡Ya la alcanzaste! 🎉";
  if (weeks === 1) return "~1 semana";
  if (weeks < 8) return "~" + weeks + " semanas";
  const months = Math.round(weeks / 4.3);
  return "~" + months + (months === 1 ? " mes" : " meses");
}

function ScreenPanel({ child }) {
  const { state } = useStore();
  const s = childSummary(state, child.id);
  const tx = state.data[child.id].tx || [];
  const goal = state.goals[child.id];

  const now = new Date();
  const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
  const dow = now.getDay(); const diff = dow === 0 ? -6 : 1 - dow;
  const startWeek = new Date(now); startWeek.setDate(now.getDate() + diff); startWeek.setHours(0, 0, 0, 0);
  const incSince = (from) => tx.filter((t) => t.type === "income" && t.ts >= from).reduce((a, t) => a + t.amount, 0);
  const daily = incSince(startToday.getTime());
  const weekly = incSince(startWeek.getTime());
  const totalNet = tx.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const f = fundSummary(state);
  const ivaAport = f.byChild[child.id] || 0;
  const est = goalEstimate(state, child.id, s, goal);

  return (
    <div className="bc-screen">
      <div className="bc-screen-head">
        <h2>📈 Mi panel financiero</h2>
        <p>Tu dinero de un vistazo, como un adulto responsable.</p>
      </div>

      <div className="bc-mini-grid">
        <Stat label="Ingreso de hoy" value={BC.money(daily)} color="#1FB85A" icon="☀️" />
        <Stat label="Ingreso de la semana" value={BC.money(weekly)} color="#2E8BFF" icon="📆" />
        <Stat label="Ingreso de la quincena" value={BC.money(s.income)} color="#A855F7" icon="🗓️" />
        <Stat label="Salario esperado" value={BC.money(s.expectedNet)} color="#FF7A45" icon="💼" />
      </div>

      <Card className="bc-goal-card">
        <div className="bc-goal-head">
          <span className="bc-goal-emoji">{goal.emoji}</span>
          <div>
            <div className="bc-goal-name">Meta: {goal.name}</div>
            <div className="bc-goal-nums"><MoneyText amount={s.savings} /> de <MoneyText amount={goal.target} /> · {est.pct}%</div>
          </div>
        </div>
        <ProgressBar value={s.savings} max={goal.target} color={child.color} height={16} showPct />
        <div className="bc-goal-left">
          {est.remaining > 0
            ? <>Te faltan <strong>{BC.money(est.remaining)}</strong> · <strong>{weeksLabel(est.weeks)}</strong></>
            : <>🎉 ¡Meta cumplida!</>}
        </div>
      </Card>

      <div className="bc-section-title">Mis estadísticas</div>
      <div className="bc-mini-grid">
        <Stat label="Saldo ahora" value={BC.money(s.balance)} color="#2E8BFF" icon="💰" />
        <Stat label="Ahorrado total" value={BC.money(s.savings)} color="#FF7AB0" icon="🐷" />
        <Stat label="Ganado en total" value={BC.money(totalNet)} color="#1FB85A" icon="💪" />
        <Stat label="Aportado al fondo" value={BC.money(ivaAport)} color="#7C5CFF" icon="🏛" />
      </div>

      <Card className="bc-budget-tip">
        💡 Obligaciones cubiertas esta quincena: <strong>{s.obligPaidCount}/{s.obligTotalCount}</strong>.
        Recuerda: primero las obligaciones, luego el ahorro y al final tus gustos.
      </Card>
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
  ScreenFondo, FundTeaser, ScreenPanel,
});
