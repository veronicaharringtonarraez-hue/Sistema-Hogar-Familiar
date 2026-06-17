/* ============================================================
   Banco Crece — Modo Papá/Mamá
   ============================================================ */

function ParentPanel({ onClose }) {
  const { state, actions } = useStore();
  const fx = useFx();
  const [tab, setTab] = useState(BC.CHILDREN[0].id);
  const child = BC.CHILDREN.find((c) => c.id === tab);
  const cfg = child;
  const s = childSummary(state, child.id);

  return (
    <div className="bc-parent">
      <div className="bc-parent-bar">
        <h2>👩‍👧‍👦 Modo Mamá/Papá</h2>
        <button className="bc-x big" onClick={onClose}>✕</button>
      </div>

      <div className="bc-parent-tabs">
        {BC.CHILDREN.map((c) => (
          <button key={c.id} className={"bc-ptab " + (tab === c.id ? "on" : "")}
            style={{ "--cc": c.color }} onClick={() => setTab(c.id)}>
            <span>{c.avatar}</span>{c.name}
          </button>
        ))}
      </div>

      <div className="bc-parent-body">
        <PendingRequests state={state} actions={actions} fx={fx} />
        <div className="bc-parent-balance" style={{ background: cfg.colorSoft }}>
          <div><span>Dinero</span><strong style={{ color: cfg.color }}>{BC.money(s.balance)}</strong></div>
          <div><span>Ahorro</span><strong style={{ color: cfg.color }}>{BC.money(s.savings)}</strong></div>
          <div><span>Ganado mes</span><strong style={{ color: cfg.color }}>{BC.money(s.income)}</strong></div>
        </div>

        <GivePoints child={cfg} actions={actions} fx={fx} />
        <ExamBonus child={cfg} actions={actions} fx={fx} />
        <BudgetEditor child={cfg} state={state} actions={actions} fx={fx} />
        <EditGoal childId={cfg.id} goal={state.goals[cfg.id]} actions={actions} fx={fx} color={cfg.color} />

        <Card className="bc-padmin">
          <div className="bc-padmin-title">Administrar</div>
          <button className="bc-admin-btn" onClick={() => {
            if (confirm(`¿Reiniciar el mes de ${cfg.name}? Se borran los pagos y el ingreso del mes (el saldo y ahorro se conservan).`)) {
              actions.resetChildMonth(cfg.id); fx.toast("Mes reiniciado");
            }
          }}>🔄 Reiniciar el mes de {cfg.name}</button>
        </Card>

        <ChangePin actions={actions} currentPin={state.pin} fx={fx} />
        <Backup state={state} actions={actions} fx={fx} />

        <Card className="bc-padmin danger">
          <button className="bc-admin-btn danger" onClick={() => {
            if (confirm("¿Borrar TODOS los datos de los tres niños y empezar de cero? Esto no se puede deshacer.")) {
              actions.resetAll(); fx.toast("Todo reiniciado");
            }
          }}>🗑️ Borrar todo y empezar de cero</button>
        </Card>
      </div>
    </div>
  );
}

function PendingRequests({ state, actions, fx }) {
  const reqs = state.requests || [];
  if (reqs.length === 0) return null;
  const nameOf = (id) => BC.CHILDREN.find((c) => c.id === id);
  return (
    <div className="bc-pend-box">
      <div className="bc-pend-head">📥 Pedidos pendientes <span className="bc-pend-count">{reqs.length}</span></div>
      {reqs.map((r) => {
        const c = nameOf(r.childId);
        return (
          <Card key={r.id} className="bc-pend-card" style={{ borderColor: c.color }}>
            <div className="bc-pend-top">
              <span className="bc-pend-av">{c.avatar}</span>
              <strong>{c.name}</strong>
              <span className="bc-pend-total" style={{ color: c.color }}>{BC.money(r.total)}</span>
            </div>
            <ul className="bc-pend-items">
              {r.items.map((i, k) => (
                <li key={k}><span>{i.icon} {i.label}</span><b>{BC.money(i.subtotal)}</b></li>
              ))}
            </ul>
            <div className="bc-two-btn">
              <button className="bc-btn-primary" onClick={() => { actions.approveRequest(r.id); fx.celebrate(); fx.toast(`¡Aprobado! +${BC.money(r.total)} para ${c.name}`); }}>✅ Aprobar</button>
              <button className="bc-btn-ghost" onClick={() => { if (confirm("¿Rechazar este pedido?")) { actions.rejectRequest(r.id); fx.toast("Pedido rechazado"); } }}>Rechazar</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function GivePoints({ child, actions, fx }) {
  const [custom, setCustom] = useState(10);
  const [label, setLabel] = useState("");
  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">💪 Dar puntos extra</div>
      <div className="bc-chip-row wrap">
        {[10, 20, 50, 100].map((v) => (
          <button key={v} className="bc-chip green" onClick={() => { actions.earn(child.id, v, "Puntos extra de Mamá/Papá", "extra", "✨"); fx.toast(`+${BC.money(v)} para ${child.name}`); }}>
            +{BC.money(v)}
          </button>
        ))}
      </div>
      <div className="bc-amount-row sm">
        <button onClick={() => setCustom((c) => Math.max(1, c - 1))}>−</button>
        <div className="bc-amount-val">{BC.money(custom)}</div>
        <button onClick={() => setCustom((c) => c + 1)}>+</button>
      </div>
      <input className="bc-input" placeholder="Motivo (opcional)" value={label} onChange={(e) => setLabel(e.target.value)} />
      <div className="bc-two-btn">
        <button className="bc-btn-primary" onClick={() => { actions.earn(child.id, custom, label || "Puntos extra", "extra", "✨"); setLabel(""); fx.celebrate(); fx.toast(`+${BC.money(custom)}`); }}>Dar +{BC.money(custom)}</button>
        <button className="bc-btn-ghost" onClick={() => { actions.adjust(child.id, -custom, label || "Descuento"); setLabel(""); fx.toast(`−${BC.money(custom)}`); }}>Quitar −{BC.money(custom)}</button>
      </div>
    </Card>
  );
}

function ExamBonus({ child, actions, fx }) {
  const [avg, setAvg] = useState(child.examAvg != null ? child.examAvg : 90);
  if (!child.hasSchool) {
    return (
      <Card className="bc-padmin">
        <div className="bc-padmin-title">🎓 Bono de exámenes</div>
        <p className="bc-muted">{child.name} aún no va a la escuela. Cuando empiece, aquí aparece su bono trimestral.</p>
      </Card>
    );
  }
  const b = BC.examBonus(parseFloat(avg) || 0);
  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">🎓 Bono trimestral de exámenes</div>
      <p className="bc-muted">Promedio sobre 100 ({child.rubros} rubros). Bono máximo {BC.money(BC.EXAM_BONUS_MAX)}.</p>
      <div className="bc-exam-row">
        <label>Promedio</label>
        <input className="bc-input num" type="number" step="0.01" value={avg} onChange={(e) => setAvg(e.target.value)} />
      </div>
      <div className="bc-exam-result" style={{ background: b.amount > 0 ? "#1FB85A18" : "#FF4D5E18" }}>
        <span>{b.label}</span>
        <strong style={{ color: b.amount > 0 ? "#1FB85A" : "#FF4D5E" }}>{b.pct}% · {BC.money(b.amount)}</strong>
      </div>
      <div className="bc-exam-scale">
        ≥95 → 100 · 90-94 → 80 · 85-89 → 70 · 80-84 → 50 · &lt;80 → 0 (pts)
      </div>
      <button className="bc-btn-primary full" disabled={b.amount <= 0} onClick={() => {
        actions.earn(child.id, b.amount, `Bono de exámenes (prom. ${avg})`, "bono", "🎓");
        fx.celebrate(); fx.toast(`¡Bono de ${BC.money(b.amount)} para ${child.name}!`);
      }}>Dar bono de {BC.money(b.amount)}</button>
    </Card>
  );
}

function EditGoal({ childId, goal, actions, fx, color }) {
  const [name, setName] = useState(goal.name);
  const [target, setTarget] = useState(goal.target);
  const [emoji, setEmoji] = useState(goal.emoji);
  const emojis = ["🚲", "🧱", "🎁", "🎮", "🛹", "🎨", "⚽", "📱", "🧸", "👟", "🎸", "📚"];
  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">🎯 Meta de ahorro</div>
      <input className="bc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la meta" />
      <div className="bc-exam-row">
        <label>Costo</label>
        <input className="bc-input num" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      <div className="bc-emoji-row">
        {emojis.map((e) => (
          <button key={e} className={"bc-emoji-pick " + (emoji === e ? "on" : "")} style={{ "--cc": color }} onClick={() => setEmoji(e)}>{e}</button>
        ))}
      </div>
      <button className="bc-btn-primary full" onClick={() => {
        actions.setGoal(childId, { name, target: parseInt(target) || goal.target, emoji });
        fx.toast("Meta guardada 🎯");
      }}>Guardar meta</button>
    </Card>
  );
}

function BudgetEditor({ child, state, actions, fx }) {
  const mk = BC.monthKey();
  const exps = childExpenses(state, child.id, mk);
  const total = exps.reduce((s, e) => s + e.amount, 0);
  const hasOverride = !!(state.budgets && state.budgets[child.id] && state.budgets[child.id][mk]);

  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">📊 Presupuesto de {child.name}</div>
      <p className="bc-muted">
        Ajusta cuánto cuesta cada gasto este mes ({BC.monthLabel(mk)}). Se guarda solo y queda igual cuando vuelvas a abrir la app.
        El próximo mes empieza de nuevo con estos valores como base.
      </p>

      {exps.map((e) => (
        <BudgetRow key={e.id}
          icon={e.icon} label={e.label} value={e.amount}
          onSave={(v) => actions.setBudget(child.id, mk, e.id, v)} />
      ))}

      <div className="bc-bt-row" style={{ marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
        <span>Total gastos fijos del mes</span>
        <strong style={{ color: child.color }}>{BC.money(total)}</strong>
      </div>

      {hasOverride && (
        <button className="bc-admin-btn" onClick={() => {
          if (confirm(`¿Volver a los montos por defecto del presupuesto de ${child.name} para ${BC.monthLabel(mk)}?`)) {
            actions.resetBudget(child.id, mk); fx.toast("Presupuesto restablecido");
          }
        }}>↩️ Restablecer montos por defecto</button>
      )}
    </Card>
  );
}

function BudgetRow({ icon, label, value, onSave }) {
  const [draft, setDraft] = useState(String(value));
  // Si el valor guardado cambia desde fuera (p. ej. al restablecer), refrescamos el campo.
  useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => {
    const n = Math.max(0, Math.round(Number(draft) || 0));
    setDraft(String(n));
    if (n !== value) onSave(n);
  };
  return (
    <div className="bc-exam-row">
      <label style={{ flex: 1 }}>{icon} {label}</label>
      <input
        className="bc-input num"
        type="number"
        inputMode="numeric"
        min="0"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
      />
    </div>
  );
}

function ChangePin({ actions, currentPin, fx }) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState("");
  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">🔒 PIN de adulto</div>
      {!open
        ? <button className="bc-admin-btn" onClick={() => { setV(""); setOpen(true); }}>Cambiar PIN</button>
        : <div className="bc-pin-change">
            <input className="bc-input num" inputMode="numeric" maxLength={6} placeholder="Nuevo PIN (4 a 6 dígitos)" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, "").slice(0, 6))} />
            <div className="bc-two-btn">
              <button className="bc-btn-primary" disabled={v.length < 4} onClick={() => { actions.setPin(v); setOpen(false); fx.toast("PIN actualizado 🔒"); }}>Guardar</button>
              <button className="bc-btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
            </div>
          </div>}
    </Card>
  );
}

function exportBackup(state) {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date();
  const stamp = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  a.href = url;
  a.download = "banco-crece-respaldo-" + stamp + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Backup({ state, actions, fx }) {
  const fileRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (err) { fx.toast("El archivo no es un respaldo válido"); return; }
      if (!parsed || typeof parsed !== "object" || !parsed.data) {
        fx.toast("El archivo no es un respaldo válido"); return;
      }
      if (confirm("¿Reemplazar TODOS los datos actuales (saldos, ahorros, presupuestos, etc.) con los del archivo? Esto no se puede deshacer.")) {
        actions.importData(parsed);
        fx.toast("Datos restaurados ✅");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="bc-padmin">
      <div className="bc-padmin-title">💾 Respaldo de datos</div>
      <p className="bc-muted">
        Descarga una copia de todo (saldos, ahorros, presupuestos, logros…) para no perderla
        o para pasarla a otro teléfono o computadora. Guárdala en un lugar seguro.
      </p>
      <button className="bc-admin-btn" onClick={() => { exportBackup(state); fx.toast("Respaldo descargado ⬇️"); }}>
        ⬇️ Descargar respaldo
      </button>
      <button className="bc-admin-btn" onClick={() => fileRef.current && fileRef.current.click()}>
        ⬆️ Restaurar desde un archivo
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={onFile} />
    </Card>
  );
}

Object.assign(window, { ParentPanel });
