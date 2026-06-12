/* ===========================================================
   PANEL PADRES — estilo Dynamics 365 / Fluent
   Comparte localStorage con la app de los niños (index.html)
   Modelo de calidad + inspección (marks) y bonos.
   =========================================================== */
const { useState, useEffect, useMemo } = React;
const KEY = 'fam_tareas_v1';
const ORDER = ['mama', 'papa', 'taylor', 'emmeth', 'christopher', 'rachel'];
const MAXP = window.MAX_ORDER + window.MAX_CLEAN; // 10

/* ---- semana ISO (igual que la app) ---- */
function weekKey(d = new Date()) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(dt.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((dt - firstThu) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return dt.getUTCFullYear() + '-W' + week;
}
function loadStore() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const wk = weekKey();
  if (s.week !== wk) { s.marks = {}; s.bonus = []; s.week = wk; }
  if (!s.marks && s.done) { // migración del modelo viejo
    s.marks = {};
    Object.keys(s.done).forEach(k => { if (s.done[k]) s.marks[k] = { s: 'ok', o: 5, c: 5 }; });
  }
  s.marks = s.marks || {}; s.bonus = s.bonus || []; s.custom = s.custom || [];
  return s;
}

/* ---- nombres / categorías ---- */
const NAME = p => p.realName || p.name;
const CAT_LABEL = {
  cocina: 'Cocina y comida', social: 'Áreas comunes', oficina: 'Oficinas',
  cuarto: 'Cuartos', bano: 'Baños', orden: 'Orden y ropa', exterior: 'Exteriores',
  escuela: 'Escuela', bebe: 'Cuidado de Rachel', compras: 'Compras y despensa',
  mantenimiento: 'Mantenimiento', gestion: 'Gestión del hogar', custom: 'Personalizada',
};
const COIN = {
  mama: '#1F3A5C', papa: '#C8102E', taylor: '#B98FE8',
  emmeth: '#2962FF', christopher: '#F5B500', rachel: '#CE93D8',
};
const KPI_COLORS = {
  mama: ['#1AA89A', '#1F3A5C', '#C99700', '#7B8B3D'],   // turquesa · navy · mostaza · oliva
  maykol: ['#C8102E', '#1a1a1a', '#C8102E', '#1a1a1a'], // rojo · negro
};

/* ---- tareas + puntos ---- */
function allTasksFor(pid, dist, custom) {
  const a = window.DISTRIBUTIONS[dist].assign;
  const house = (a[pid] || []).map(id => window.TASK(id));
  const personal = (window.PERSONAL[pid] || []).map(id => window.PDEF(id));
  const cust = (custom || []).filter(c => c.owner === pid);
  return house.concat(personal).concat(cust).filter(Boolean);
}
function houseCount(pid, dist) {
  return (window.DISTRIBUTIONS[dist].assign[pid] || []).length;
}
function taskPts(pid, dist, custom, marks) {
  return allTasksFor(pid, dist, custom).reduce((s, t) => s + window.markPoints(marks[pid + ':' + t.id]), 0);
}
function personPts(pid, dist, store) {
  return taskPts(pid, dist, store.custom, store.marks) + window.bonusPointsFor(pid, store.bonus);
}
function freqText(t) { return window.freqLabel(t); }
function appliesToday(t) {
  return t.freq === 'diario' || (t.freq === 'semanal' && t.day === new Date().getDay());
}
function buildRows(dist, custom) {
  const rows = [];
  ORDER.forEach(pid => {
    const p = window.PERSON(pid);
    allTasksFor(pid, dist, custom).forEach(t => rows.push({ pid, person: p, task: t }));
  });
  return rows;
}

/* =========================================================
   COMPONENTES PEQUEÑOS
   ========================================================= */
function Coin({ p, size = 30 }) {
  const ini = NAME(p).slice(0, 2).toUpperCase();
  return <div className="coin" style={{ width: size, height: size, background: COIN[p.id] || '#888', fontSize: size * 0.4 }}>{ini}</div>;
}
function StatusPill({ st, pts }) {
  if (st === 'ok') return <span className="pill done dot">Aprobado · {pts}/{MAXP}</span>;
  if (st === 'claim') return <span className="pill review dot">Por revisar</span>;
  return <span className="pill pend dot">Pendiente</span>;
}
function LevelBadge({ pts, small }) {
  const lv = window.levelFor(pts);
  return <span className={'lvl-badge' + (small ? ' sm' : '')}>{lv.icon} {lv.label}</span>;
}

/* =========================================================
   DATA GRID
   ========================================================= */
function DataGrid({ dist, store, openInspect, groupBy, query }) {
  let rows = buildRows(dist, store.custom);
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter(r => r.task.label.toLowerCase().includes(q) || NAME(r.person).toLowerCase().includes(q) || (r.task.area || '').toLowerCase().includes(q));
  }
  const groups = [];
  const idx = {};
  rows.forEach(r => {
    let key, label, persona = null;
    if (groupBy === 'persona') { key = r.pid; label = NAME(r.person) + (r.person.title ? ' · ' + r.person.title : ''); persona = r.person; }
    else if (groupBy === 'categoria') { key = r.task.cat || 'custom'; label = CAT_LABEL[r.task.cat] || 'Otras'; }
    else if (groupBy === 'frecuencia') { key = r.task.freq || 'diario'; label = (window.FREQS[r.task.freq] || window.FREQS.diario).label; }
    else { key = '_'; label = null; }
    if (!(key in idx)) { idx[key] = groups.length; groups.push({ key, label, persona, rows: [] }); }
    groups[idx[key]].rows.push(r);
  });
  if (groupBy === 'frecuencia') groups.sort((a, b) => (window.FREQS[a.key] || {}).order - (window.FREQS[b.key] || {}).order);

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table className="grid">
        <thead>
          <tr>
            <th style={{ width: 30 }}></th>
            <th>Tarea</th>
            <th>Responsable</th>
            <th>Categoría</th>
            <th>Frecuencia</th>
            <th style={{ textAlign: 'right' }}>Puntos</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(g => (
            <React.Fragment key={g.key}>
              {g.label && (
                <tr className="grp-row">
                  <td></td>
                  <td colSpan={6}>
                    <div className="grp-cell">
                      {g.persona && <Coin p={g.persona} size={22} />}
                      {g.label}
                      <span className="cnt">· {g.rows.length} {g.rows.length === 1 ? 'tarea' : 'tareas'} · {g.rows.filter(r => window.markState(store.marks[r.pid + ':' + r.task.id]) === 'ok').length} aprobadas</span>
                    </div>
                  </td>
                </tr>
              )}
              {g.rows.map(r => {
                const k = r.pid + ':' + r.task.id;
                const m = store.marks[k];
                const st = window.markState(m);
                const pts = window.markPoints(m);
                return (
                  <tr key={k} className="clickable" onClick={() => openInspect(r)}>
                    <td><div className={'qled ' + st}></div></td>
                    <td><div className="cell-task"><span className="ti">{r.task.icon}</span>{r.task.label}</div></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Coin p={r.person} size={22} /><span className="tag" style={{ color: 'var(--np)' }}>{NAME(r.person)}</span></div></td>
                    <td><span className="tag">{CAT_LABEL[r.task.cat] || 'Personalizada'}</span></td>
                    <td><span className="tag">{freqText(r.task)}</span></td>
                    <td className="pts-cell" style={{ textAlign: 'right' }}>{st === 'ok' ? pts : MAXP}</td>
                    <td><StatusPill st={st} pts={pts} /></td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
          {rows.length === 0 && <tr><td colSpan={7}><div className="empty">No hay tareas que coincidan.</div></td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   ASIDE: carga + ranking
   ========================================================= */
function LoadCard({ dist }) {
  const people = ['mama', 'papa', 'taylor', 'emmeth', 'christopher'].map(window.PERSON);
  const counts = people.map(p => houseCount(p.id, dist));
  const max = Math.max(...counts, 1);
  const msg = {
    actual: { cls: 'warn', ic: '⚠', txt: <span><b>Desbalance:</b> Verónica concentra casi toda la casa y Christopher no tiene áreas.</span> },
    equitativo: { cls: 'ok', ic: '✓', txt: <span><b>Equilibrado:</b> Maykol asume más, Christopher entra con 1 y la bebé se cuida entre 4.</span> },
    zonas: { cls: 'info', ic: '🏰', txt: <span><b>Por cargos:</b> cada quien es guardián de su zona (Emmeth zapatos, Taylor orden, Chris juguetes…).</span> },
  }[dist];
  return (
    <div className="card">
      <div className="card-h"><h3>Carga por persona</h3><span className="meta">áreas asignadas</span></div>
      <div className="bars">
        {people.map((p, i) => (
          <div className="barrow" key={p.id}>
            <div className="bl"><span className="bn">{NAME(p)}</span><span className="bv">{counts[i]} {counts[i] === 1 ? 'área' : 'áreas'}</span></div>
            <div className="track"><i style={{ width: Math.max(6, counts[i] / max * 100) + '%', background: COIN[p.id] }} /></div>
          </div>
        ))}
      </div>
      {msg && <div className={'note ' + msg.cls}><span>{msg.ic}</span>{msg.txt}</div>}
    </div>
  );
}
function RankCard({ dist, store }) {
  const kids = window.FAMILY.filter(p => p.isKid)
    .map(k => ({ k, pts: personPts(k.id, dist, store) }))
    .sort((a, b) => b.pts - a.pts);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="card">
      <div className="card-h"><h3>Puntos y niveles</h3><span className="meta">esta semana</span></div>
      <div style={{ padding: '8px 0 4px' }}>
        {kids.map((r, i) => (
          <div className="rankrow" key={r.k.id}>
            <span className="medal">{medals[i] || ''}</span>
            <Coin p={r.k} size={26} />
            <div className="rn"><div>{r.k.name}</div><LevelBadge pts={r.pts} small /></div>
            <span className="rp">{r.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COLA DE INSPECCIÓN
   ========================================================= */
function InspectionQueue({ dist, store, openInspect }) {
  const claims = buildRows(dist, store.custom).filter(r => window.markState(store.marks[r.pid + ':' + r.task.id]) === 'claim');
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="card-h">
        <h3>🔍 Por inspeccionar {claims.length > 0 && <span className="qbadge">{claims.length}</span>}</h3>
        <span className="meta">los niños marcaron "listo"</span>
      </div>
      {claims.length === 0
        ? <div className="empty" style={{ padding: 26 }}>Nada pendiente de revisar. ¡Todo al día! ✨</div>
        : <div style={{ padding: '6px 0 8px' }}>
            {claims.map(r => (
              <div className="qrow" key={r.pid + ':' + r.task.id} onClick={() => openInspect(r)}>
                <div className="qled claim"></div>
                <span className="ti" style={{ fontSize: 16 }}>{r.task.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.task.label}</div>
                  <div className="tag">{NAME(r.person)} · {r.task.area || ''}</div>
                </div>
                <button className="btn primary sm" onClick={e => { e.stopPropagation(); openInspect(r); }}>Inspeccionar</button>
              </div>
            ))}
          </div>}
    </div>
  );
}

/* =========================================================
   VISTA: PANEL
   ========================================================= */
function PanelView({ dist, store, openInspect, groupBy, query, theme }) {
  const rows = buildRows(dist, store.custom);
  const today = rows.filter(r => appliesToday(r.task));
  const approvedToday = today.filter(r => window.markState(store.marks[r.pid + ':' + r.task.id]) === 'ok').length;
  const claims = rows.filter(r => window.markState(store.marks[r.pid + ':' + r.task.id]) === 'claim').length;
  const avance = today.length ? Math.round(approvedToday / today.length * 100) : 0;
  const kidPts = window.FAMILY.filter(p => p.isKid).reduce((s, k) => s + personPts(k.id, dist, store), 0);

  const kc = KPI_COLORS[theme] || KPI_COLORS.mama;
  const kpiData = [
    { ic: '◷', l: 'Tareas de hoy', v: today.length, s: approvedToday + ' aprobadas' },
    { ic: '🔍', l: 'Por revisar', v: claims, s: claims === 1 ? 'tarea pendiente' : 'tareas pendientes' },
    { ic: '◑', l: 'Avance de hoy', v: avance + '%', s: (today.length - approvedToday) + ' por completar' },
    { ic: '★', l: 'Puntos de la semana', v: kidPts, s: 'sumados por los niños' },
  ];

  return (
    <>
      <div className="kpis">
        {kpiData.map((k, i) => (
          <div className="kpi" key={i} style={{ borderTopColor: kc[i] }}>
            <div className="kl"><span className="kic" style={{ color: kc[i] }}>{k.ic}</span>{k.l}</div>
            <div className="kv" style={{ color: kc[i] }}>{k.v}</div>
            <div className="ks">{k.s}</div>
          </div>
        ))}
      </div>
      <div className="cols">
        <div>
          <InspectionQueue dist={dist} store={store} openInspect={openInspect} />
          <DataGrid dist={dist} store={store} openInspect={openInspect} groupBy={groupBy} query={query} />
        </div>
        <div className="aside">
          <LoadCard dist={dist} />
          <RankCard dist={dist} store={store} />
        </div>
      </div>
    </>
  );
}

/* =========================================================
   VISTA: REPARTO
   ========================================================= */
function RepartoView({ dist, store }) {
  return (
    <div className="cols">
      <div>
        <div className="card" style={{ marginBottom: dist === 'zonas' ? 16 : 0 }}>
          <div className="card-h"><h3>Quién hace qué</h3><span className="meta">{window.DISTRIBUTIONS[dist].sub}</span></div>
          <table className="grid">
            <thead><tr><th>Persona</th><th>Áreas asignadas</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
            <tbody>
              {ORDER.map(pid => {
                const p = window.PERSON(pid);
                const ids = window.DISTRIBUTIONS[dist].assign[pid] || [];
                const turns = window.DISTRIBUTIONS[dist].assign.bebeTurnos || [];
                return (
                  <tr key={pid}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Coin p={p} size={26} /><div><div style={{ fontWeight: 600 }}>{NAME(p)}</div><div className="tag">{p.title || p.note}</div></div></div></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {pid === 'rachel'
                          ? <span className="tag">🍼 La cuidan: {turns.map(t => NAME(window.PERSON(t))).join(', ') || '—'}</span>
                          : ids.length
                            ? ids.map(id => <span key={id} className="pill pend" style={{ background: 'var(--nll)' }}>{window.TASK(id).icon} {window.TASK(id).area}</span>)
                            : <span className="tag">— sin áreas —</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>{ids.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {dist === 'zonas' && (
          <div className="card">
            <div className="card-h"><h3>🏰 Guardianes por zona</h3><span className="meta">responsable + ayudantes</span></div>
            <table className="grid">
              <thead><tr><th>Zona</th><th>Responsable</th><th>Ayudantes</th></tr></thead>
              <tbody>
                {window.ZONES.map(z => (
                  <tr key={z.zone}>
                    <td><div className="cell-task"><span className="ti">{z.icon}</span>{z.zone}</div></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Coin p={window.PERSON(z.resp)} size={22} /><span className="tag" style={{ color: 'var(--np)', fontWeight: 600 }}>{NAME(window.PERSON(z.resp))}</span></div></td>
                    <td><div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{z.helps.map(h => <span key={h} className="pill pend" style={{ background: 'var(--nll)' }}>{NAME(window.PERSON(h))}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="aside"><LoadCard dist={dist} /></div>
    </div>
  );
}

/* =========================================================
   VISTA: PERSONAS
   ========================================================= */
function PersonasView({ dist, store, openInspect }) {
  return (
    <div className="pgrid">
      {ORDER.map(pid => {
        const p = window.PERSON(pid);
        const ts = allTasksFor(pid, dist, store.custom);
        const approved = ts.filter(t => window.markState(store.marks[pid + ':' + t.id]) === 'ok').length;
        const pts = personPts(pid, dist, store);
        const myBonus = (store.bonus || []).filter(b => b.pid === pid);
        return (
          <div className="card" key={pid}>
            <div className="pcard-h">
              <Coin p={p} size={40} />
              <div style={{ flex: 1 }}>
                <div className="pn">{NAME(p)}{p.age ? ' (' + p.age + ')' : ''}</div>
                <div className="pr">{p.title || p.role}</div>
              </div>
              {p.isKid && <div style={{ textAlign: 'right' }}><div className="pill done" style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}>★ {pts}</div><div style={{ marginTop: 4 }}><LevelBadge pts={pts} small /></div></div>}
            </div>
            <div className="pcard-body">
              {ts.length === 0 && <div className="empty" style={{ padding: 18, fontSize: 13 }}>Sin tareas asignadas</div>}
              {ts.map(t => {
                const st = window.markState(store.marks[pid + ':' + t.id]);
                return (
                  <div className={'tline' + (st === 'ok' ? ' done' : '')} key={pid + ':' + t.id} onClick={() => openInspect({ pid, person: p, task: t })}>
                    <div className={'qled ' + st}></div>
                    <span style={{ fontSize: 15 }}>{t.icon}</span>
                    <span className="tl-t">{t.label}</span>
                    {st === 'claim' && <span className="pill review" style={{ fontSize: 11 }}>revisar</span>}
                    <span className="tag">{freqText(t)}</span>
                  </div>
                );
              })}
              {myBonus.length > 0 && (
                <div style={{ borderTop: '1px solid var(--nl)', marginTop: 6, paddingTop: 8 }}>
                  {myBonus.map((b, i) => {
                    const def = window.BONUS(b.type) || {};
                    return <div key={i} className="tline"><span style={{ fontSize: 15 }}>{def.icon}</span><span className="tl-t">{def.label}</span><span className="pill done">+{b.pts}</span></div>;
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   VISTA: RECOMPENSAS (niveles + premios para mascotas)
   ========================================================= */
function RecompensasView({ dist, store }) {
  const kids = window.FAMILY.filter(p => p.isKid);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* escala de niveles */}
      <div className="card">
        <div className="card-h"><h3>🏅 Niveles de la semana</h3><span className="meta">se reinician cada lunes</span></div>
        <div className="tiers">
          {window.LEVELS.map(l => (
            <div className="tier" key={l.min}>
              <div className="te" style={{ filter: 'none', opacity: 1 }}>{l.icon}</div>
              <div className="tt">{l.label}</div>
              <div className="tp">{l.min}+ pts</div>
            </div>
          ))}
        </div>
      </div>
      {/* premios mascota por niño */}
      {kids.map(k => {
        const pts = personPts(k.id, dist, store);
        const next = window.REWARDS.find(r => r.at > pts);
        const lv = window.levelFor(pts);
        return (
          <div className="card" key={k.id}>
            <div className="card-h">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Coin p={k} size={26} /> {k.name} <LevelBadge pts={pts} small /></h3>
              <span className="meta">{next ? 'Faltan ' + (next.at - pts) + ' pts para ' + next.icon : '¡Todo desbloqueado!'} · {pts} pts</span>
            </div>
            <div className="tiers">
              {window.REWARDS.map(r => (
                <div className={'tier' + (pts >= r.at ? ' un' : '')} key={r.at}>
                  <div className="te">{r.icon}</div>
                  <div className="tt">{r.label}</div>
                  <div className="tp">{pts >= r.at ? '✓ logrado' : r.at + ' pts'}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   PANEL DESLIZANTE: INSPECCIÓN DE CALIDAD
   ========================================================= */
function InspectPanel({ row, store, onClose, onApprove, onReset }) {
  const k = row.pid + ':' + row.task.id;
  const m = store.marks[k];
  const [o, setO] = useState(m && m.s === 'ok' ? m.o : window.MAX_ORDER);
  const [c, setC] = useState(m && m.s === 'ok' ? m.c : window.MAX_CLEAN);
  const total = o + c;
  const isOk = window.markState(m) === 'ok';
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div>
            <h2>Inspección de calidad</h2>
            <p>{row.task.icon} {row.task.label} · {NAME(row.person)}</p>
          </div>
          <button className="x" onClick={onClose}>✕</button>
        </div>
        <div className="panel-b">
          <div className="inspect-q">
            <div className="iq">1 · ¿Se ve ordenado?</div>
            <div className="iq">2 · ¿Se ve limpio?</div>
            <div className="iq">3 · ¿Todo está en su lugar?</div>
          </div>

          <div className="field">
            <label>📦 Orden <span className="rate-val">{o}/5</span></label>
            <input type="range" min="0" max="5" step="1" value={o} onChange={e => setO(Number(e.target.value))} className="range" />
          </div>
          <div className="field">
            <label>🧹 Limpieza <span className="rate-val">{c}/5</span></label>
            <input type="range" min="0" max="5" step="1" value={c} onChange={e => setC(Number(e.target.value))} className="range" />
          </div>

          <div className="total-box">
            <span>Total a otorgar</span>
            <span className="total-pts">{total} <small>/ {MAXP} pts</small></span>
          </div>

          <div className="quick-row">
            <button className="chipbtn" onClick={() => { setO(5); setC(5); }}>Excelente 10</button>
            <button className="chipbtn" onClick={() => { setO(4); setC(4); }}>Bien 8</button>
            <button className="chipbtn" onClick={() => { setO(3); setC(3); }}>Regular 6</button>
            <button className="chipbtn" onClick={() => { setO(0); setC(0); }}>No hecho 0</button>
          </div>
        </div>
        <div className="panel-f">
          <button className="btn primary" onClick={() => onApprove(k, o, c)}>Aprobar · {total} pts</button>
          {isOk
            ? <button className="btn" onClick={() => onReset(k)}>Quitar aprobación</button>
            : <button className="btn" onClick={() => onReset(k)}>Dejar pendiente</button>}
        </div>
      </div>
    </>
  );
}

/* =========================================================
   PANEL: AGREGAR TAREA
   ========================================================= */
function AddPanel({ onClose, onSave }) {
  const [owner, setOwner] = useState('mama');
  const [label, setLabel] = useState('');
  const [cat, setCat] = useState('orden');
  const [icon, setIcon] = useState('🧹');
  const [freq, setFreq] = useState('semanal');
  const [day, setDay] = useState(1);
  const icons = ['🧹', '🧼', '🧺', '👕', '🛏️', '🚿', '🍽️', '🌿', '🚗', '📋', '🪴', '⛪', '🛒', '💊', '🐾'];
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div><h2>Nueva tarea</h2><p>Se agrega al reparto y a la app de los niños</p></div>
          <button className="x" onClick={onClose}>✕</button>
        </div>
        <div className="panel-b">
          <div className="field">
            <label>Responsable <span className="req">*</span></label>
            <select className="sel" value={owner} onChange={e => setOwner(e.target.value)}>
              {ORDER.map(id => <option key={id} value={id}>{NAME(window.PERSON(id))}{window.PERSON(id).age ? ' (' + window.PERSON(id).age + ')' : ''}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Nombre de la tarea <span className="req">*</span></label>
            <input className="inp" value={label} placeholder="Ej: Sacar la basura" autoFocus onChange={e => setLabel(e.target.value)} />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select className="sel" value={cat} onChange={e => setCat(e.target.value)}>
              {Object.keys(CAT_LABEL).filter(c => c !== 'custom').map(c => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Ícono</label>
            <div className="ico-row">{icons.map(ic => <div key={ic} className={'io' + (icon === ic ? ' on' : '')} onClick={() => setIcon(ic)}>{ic}</div>)}</div>
          </div>
          <div className="field">
            <label>Frecuencia</label>
            <select className="sel" value={freq} onChange={e => setFreq(e.target.value)}>
              {Object.keys(window.FREQS).map(f => <option key={f} value={f}>{window.FREQS[f].label}</option>)}
            </select>
            {freq === 'semanal' && (
              <select className="sel" style={{ marginTop: 8 }} value={day} onChange={e => setDay(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 0].map(d => <option key={d} value={d}>{window.DAYS[d]}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="panel-f">
          <button className="btn primary" disabled={!label.trim()}
            onClick={() => onSave({ id: 'c' + Date.now(), label: label.trim(), area: label.trim(), icon, owner, cat, freq, day: freq === 'semanal' ? day : undefined, custom: true })}>Guardar</button>
          <button className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   PANEL: DAR BONO
   ========================================================= */
function BonusPanel({ onClose, onGrant }) {
  const [pid, setPid] = useState('taylor');
  const [type, setType] = useState('iniciativa');
  const def = window.BONUS(type);
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <div className="panel">
        <div className="panel-h">
          <div><h2>Dar un bono ✨</h2><p>Premia un buen gesto (suma puntos extra)</p></div>
          <button className="x" onClick={onClose}>✕</button>
        </div>
        <div className="panel-b">
          <div className="field">
            <label>¿A quién?</label>
            <select className="sel" value={pid} onChange={e => setPid(e.target.value)}>
              {ORDER.map(id => <option key={id} value={id}>{NAME(window.PERSON(id))}{window.PERSON(id).age ? ' (' + window.PERSON(id).age + ')' : ''}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Tipo de bono</label>
            {window.BONUSES.map(b => (
              <div key={b.id} className={'bonus-opt' + (type === b.id ? ' on' : '')} onClick={() => setType(b.id)}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ flex: 1 }}>{b.label}</span>
                <span className="pill done">+{b.pts}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel-f">
          <button className="btn primary" onClick={() => onGrant({ pid, type, pts: def.pts, at: Date.now() })}>Dar bono · +{def.pts} pts</button>
          <button className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   APP
   ========================================================= */
const NAVS = [
  { id: 'panel', label: 'Panel', icon: '▦' },
  { id: 'tareas', label: 'Tareas', icon: '✔' },
  { id: 'reparto', label: 'Reparto', icon: '⚖' },
  { id: 'personas', label: 'Personas', icon: '👥' },
  { id: 'recompensas', label: 'Recompensas', icon: '★' },
];
const PAGE_TITLE = { panel: 'Panel', tareas: 'Tareas', reparto: 'Reparto de la casa', personas: 'Personas', recompensas: 'Niveles y recompensas' };
const DIST_LABEL = [['actual', 'Actual'], ['equitativo', 'Equitativo'], ['zonas', 'Por zonas']];

function App() {
  const [theme, setTheme] = useState('mama');
  const [view, setView] = useState('panel');
  const [dist, setDist] = useState('zonas');
  const [groupBy, setGroupBy] = useState('persona');
  const [query, setQuery] = useState('');
  const [store, setStore] = useState(loadStore);
  const [adding, setAdding] = useState(false);
  const [bonusing, setBonusing] = useState(false);
  const [inspect, setInspect] = useState(null);

  useEffect(() => { document.body.parentElement.setAttribute('data-theme', theme); }, [theme]);

  function persist(next) { setStore(next); localStorage.setItem(KEY, JSON.stringify(next)); }
  function approve(k, o, c) { persist({ ...store, marks: { ...store.marks, [k]: { s: 'ok', o, c } } }); setInspect(null); }
  function resetMark(k) { const marks = { ...store.marks }; delete marks[k]; persist({ ...store, marks }); setInspect(null); }
  function addTask(t) { persist({ ...store, custom: [...store.custom, t] }); setAdding(false); }
  function grantBonus(b) { persist({ ...store, bonus: [...(store.bonus || []), b] }); setBonusing(false); }
  function refresh() { setStore(loadStore()); }

  const themePerson = window.PERSON(theme === 'mama' ? 'mama' : 'papa');
  const showGroup = (view === 'panel' || view === 'tareas');

  return (
    <div id="appwrap">
      <div className="appbar">
        <button className="waffle" title="Aplicaciones">
          <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="3" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="17" cy="3" r="1.5"/><circle cx="3" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="17" cy="10" r="1.5"/><circle cx="3" cy="17" r="1.5"/><circle cx="10" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>
        </button>
        <span className="title">Tareas de la Familia</span>
        <span className="sep"></span>
        <span className="env">Hogar</span>
        <span className="spacer"></span>
        <button className="ic-btn" title="Ir a la app de los niños" onClick={() => { window.location.href = 'index.html'; }}>🏠</button>
        <button className="ic-btn" title="Configuración">⚙</button>
        <button className="ic-btn" title="Ayuda">？</button>
        <div className="seg" style={{ margin: '0 6px', height: 32 }}>
          <button className={theme === 'mama' ? 'on' : ''} onClick={() => setTheme('mama')}>Verónica</button>
          <button className={theme === 'maykol' ? 'on' : ''} onClick={() => setTheme('maykol')}>Maykol</button>
        </div>
        <div className="me"><Coin p={themePerson} size={30} /></div>
      </div>

      <div className="body" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <nav className="nav">
          <div className="grp">Hogar</div>
          {NAVS.map(n => (
            <a key={n.id} className={view === n.id ? 'on' : ''} onClick={() => setView(n.id)}>
              <span className="ni">{n.icon}</span>{n.label}
            </a>
          ))}
        </nav>

        <div className="main">
          <div className="pagehead">
            <div className="crumb">Hogar › {PAGE_TITLE[view]}</div>
            <h1>{PAGE_TITLE[view]}</h1>
          </div>

          <div className="cmdbar">
            <button className="cmd primary" onClick={() => setAdding(true)}><span className="ci">＋</span>Nueva tarea</button>
            <button className="cmd" onClick={() => setBonusing(true)}><span className="ci">✨</span>Dar bono</button>
            <button className="cmd" onClick={refresh}><span className="ci">↻</span>Actualizar</button>
            <span className="cmd-sep"></span>
            <span style={{ fontSize: 13, color: 'var(--ns)', marginRight: 4 }}>Reparto:</span>
            <div className="seg">
              {DIST_LABEL.map(([k, l]) => <button key={k} className={dist === k ? 'on' : ''} onClick={() => setDist(k)}>{l}</button>)}
            </div>
            {showGroup && (
              <>
                <span className="cmd-sep"></span>
                <span style={{ fontSize: 13, color: 'var(--ns)', marginRight: 4 }}>Agrupar:</span>
                <div className="seg">
                  <button className={groupBy === 'persona' ? 'on' : ''} onClick={() => setGroupBy('persona')}>Persona</button>
                  <button className={groupBy === 'categoria' ? 'on' : ''} onClick={() => setGroupBy('categoria')}>Categoría</button>
                  <button className={groupBy === 'frecuencia' ? 'on' : ''} onClick={() => setGroupBy('frecuencia')}>Frecuencia</button>
                </div>
                <div className="search">
                  <span className="si">🔍</span>
                  <input placeholder="Buscar…" value={query} onChange={e => setQuery(e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className="content">
            {view === 'panel' && <PanelView dist={dist} store={store} openInspect={setInspect} groupBy={groupBy} query={query} theme={theme} />}
            {view === 'tareas' && <DataGrid dist={dist} store={store} openInspect={setInspect} groupBy={groupBy} query={query} />}
            {view === 'reparto' && <RepartoView dist={dist} store={store} />}
            {view === 'personas' && <PersonasView dist={dist} store={store} openInspect={setInspect} />}
            {view === 'recompensas' && <RecompensasView dist={dist} store={store} />}
          </div>
        </div>
      </div>

      {adding && <AddPanel onClose={() => setAdding(false)} onSave={addTask} />}
      {bonusing && <BonusPanel onClose={() => setBonusing(false)} onGrant={grantBonus} />}
      {inspect && <InspectPanel row={inspect} store={store} onClose={() => setInspect(null)} onApprove={approve} onReset={resetMark} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
