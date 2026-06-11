/* ===========================================================
   PANEL PADRES — estilo Dynamics 365 / Fluent
   Comparte localStorage con la app de los niños (index.html)
   =========================================================== */
const { useState, useEffect, useMemo } = React;
const KEY = 'fam_tareas_v1';
const PPT = window.POINTS_PER_TASK;
const ORDER = ['mama', 'papa', 'taylor', 'emmeth', 'christopher', 'rachel'];

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
  if (s.week !== wk) { s.done = {}; s.week = wk; }
  s.done = s.done || {}; s.custom = s.custom || [];
  return s;
}

/* ---- nombres / categorías ---- */
const NAME = p => p.realName || p.name;
const CAT_LABEL = {
  cocina: 'Cocina y comida', social: 'Áreas comunes', oficina: 'Oficinas',
  cuarto: 'Cuartos', bano: 'Baños', orden: 'Orden y ropa', exterior: 'Exteriores',
  escuela: 'Escuela', bebe: 'Cuidado de Rachel', custom: 'Personalizada',
};
const COIN = {
  mama: '#1F3A5C', papa: '#C8102E', taylor: '#B98FE8',
  emmeth: '#2962FF', christopher: '#F5B500', rachel: '#CE93D8',
};
/* colores de las tarjetas KPI según el perfil padre activo */
const KPI_COLORS = {
  mama: ['#1AA89A', '#1F3A5C', '#C99700', '#7B8B3D'],   // turquesa · navy · mostaza · oliva
  maykol: ['#C8102E', '#1a1a1a', '#C8102E', '#1a1a1a'], // rojo · negro
};

/* ---- tareas (casa + personales + custom) ---- */
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
function freqLabel(t) {
  return t.freq === 'diario' ? 'Diario' : 'Cada ' + window.DAYS[t.day == null ? 1 : t.day].toLowerCase();
}
function appliesToday(t) {
  return t.freq === 'diario' || t.day === new Date().getDay();
}

/* ---- filas planas para el grid ---- */
function buildRows(dist, custom) {
  const rows = [];
  ORDER.forEach(pid => {
    const p = window.PERSON(pid);
    allTasksFor(pid, dist, custom).forEach(t => {
      rows.push({ pid, person: p, task: t });
    });
  });
  return rows;
}

/* =========================================================
   COMPONENTES PEQUEÑOS
   ========================================================= */
function Coin({ p, size = 30 }) {
  const ini = NAME(p).slice(0, p.id === 'mama' ? 2 : 2).toUpperCase();
  return <div className="coin" style={{ width: size, height: size, background: COIN[p.id] || '#888', fontSize: size * 0.4 }}>{ini}</div>;
}
function Status({ on }) {
  return on
    ? <span className="pill done dot">Hecho</span>
    : <span className="pill pend dot">Pendiente</span>;
}

/* =========================================================
   DATA GRID
   ========================================================= */
function DataGrid({ dist, custom, store, toggle, groupBy, query }) {
  let rows = buildRows(dist, custom);
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter(r => r.task.label.toLowerCase().includes(q) || NAME(r.person).toLowerCase().includes(q));
  }
  // agrupar
  const groups = [];
  const idx = {};
  rows.forEach(r => {
    let key, label, persona = null;
    if (groupBy === 'persona') { key = r.pid; label = NAME(r.person) + (r.person.age ? ' · ' + r.person.age + ' años' : ''); persona = r.person; }
    else if (groupBy === 'categoria') { key = r.task.cat || 'custom'; label = CAT_LABEL[r.task.cat] || (r.task.custom ? 'Personalizada' : 'Otras'); }
    else { key = '_'; label = null; }
    if (!(key in idx)) { idx[key] = groups.length; groups.push({ key, label, persona, rows: [] }); }
    groups[idx[key]].rows.push(r);
  });

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table className="grid">
        <thead>
          <tr>
            <th style={{ width: 36 }}></th>
            <th>Tarea <span className="car">▾</span></th>
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
                      {g.persona && <Coin p={g.persona} size={24} />}
                      {g.label}
                      <span className="cnt">· {g.rows.length} {g.rows.length === 1 ? 'tarea' : 'tareas'} · {g.rows.filter(r => store.done[r.pid + ':' + r.task.id]).length} hechas</span>
                    </div>
                  </td>
                </tr>
              )}
              {g.rows.map(r => {
                const k = r.pid + ':' + r.task.id;
                const on = !!store.done[k];
                return (
                  <tr key={k}>
                    <td><div className={'chk' + (on ? ' on' : '')} onClick={() => toggle(k)}>{on ? '✓' : ''}</div></td>
                    <td>
                      <div className="cell-task">
                        <span className="ti">{r.task.icon}</span>
                        {r.task.label}
                      </div>
                    </td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Coin p={r.person} size={22} /><span className="tag" style={{ color: 'var(--np)' }}>{NAME(r.person)}</span></div></td>
                    <td><span className="tag">{CAT_LABEL[r.task.cat] || 'Personalizada'}</span></td>
                    <td><span className="tag">{freqLabel(r.task)}</span></td>
                    <td className="pts-cell" style={{ textAlign: 'right' }}>{PPT}</td>
                    <td><Status on={on} /></td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
          {rows.length === 0 && <tr><td colSpan={7}><div className="empty">No hay tareas que coincidan con la búsqueda.</div></td></tr>}
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
  return (
    <div className="card">
      <div className="card-h"><h3>Carga por persona</h3><span className="meta">áreas de la casa</span></div>
      <div className="bars">
        {people.map((p, i) => (
          <div className="barrow" key={p.id}>
            <div className="bl"><span className="bn">{NAME(p)}</span><span className="bv">{counts[i]} {counts[i] === 1 ? 'área' : 'áreas'}</span></div>
            <div className="track"><i style={{ width: Math.max(6, counts[i] / max * 100) + '%', background: COIN[p.id] }} /></div>
          </div>
        ))}
      </div>
      {dist === 'actual'
        ? <div className="note warn"><span>⚠</span><span><b>Desbalance:</b> Verónica concentra casi toda la casa y Christopher no tiene áreas asignadas.</span></div>
        : <div className="note ok"><span>✓</span><span><b>Equilibrado:</b> Maykol asume más áreas, Christopher entra con 1 y la bebé se cuida entre 4.</span></div>}
    </div>
  );
}
function RankCard({ dist, store }) {
  const kids = window.FAMILY.filter(p => p.isKid)
    .map(k => ({ k, pts: allTasksFor(k.id, dist, store.custom).filter(t => store.done[k.id + ':' + t.id]).length * PPT }))
    .sort((a, b) => b.pts - a.pts);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="card">
      <div className="card-h"><h3>Puntos de los niños</h3><span className="meta">esta semana</span></div>
      <div style={{ padding: '8px 0 4px' }}>
        {kids.map((r, i) => (
          <div className="rankrow" key={r.k.id}>
            <span className="medal">{medals[i] || ''}</span>
            <Coin p={r.k} size={26} />
            <span className="rn">{r.k.name}</span>
            <span className="rp">{r.pts} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   VISTA: PANEL
   ========================================================= */
function PanelView({ dist, store, toggle, groupBy, query, theme }) {
  const rows = buildRows(dist, store.custom);
  const today = rows.filter(r => appliesToday(r.task));
  const doneToday = today.filter(r => store.done[r.pid + ':' + r.task.id]).length;
  const avance = today.length ? Math.round(doneToday / today.length * 100) : 0;
  const kidPts = window.FAMILY.filter(p => p.isKid)
    .reduce((s, k) => s + allTasksFor(k.id, dist, store.custom).filter(t => store.done[k.id + ':' + t.id]).length * PPT, 0);

  const kc = KPI_COLORS[theme] || KPI_COLORS.mama;
  const kpiData = [
    { ic: '▦', l: 'Tareas asignadas', v: rows.length, s: 'en ' + window.TASKS.length + ' áreas de la casa' },
    { ic: '◷', l: 'Para hoy', v: today.length, s: doneToday + ' completadas' },
    { ic: '◑', l: 'Avance de hoy', v: avance + '%', s: (today.length - doneToday) + ' pendientes' },
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
        <DataGrid dist={dist} custom={store.custom} store={store} toggle={toggle} groupBy={groupBy} query={query} />
        <div className="aside">
          <LoadCard dist={dist} />
          <RankCard dist={dist} store={store} />
        </div>
      </div>
    </>
  );
}

/* =========================================================
   VISTA: REPARTO (Actual vs Equitativo)
   ========================================================= */
function RepartoView({ dist, store }) {
  const order = ['mama', 'papa', 'taylor', 'emmeth', 'christopher', 'rachel'];
  return (
    <div className="cols">
      <div className="card">
        <div className="card-h"><h3>Quién hace qué</h3><span className="meta">{window.DISTRIBUTIONS[dist].sub}</span></div>
        <table className="grid">
          <thead><tr><th>Persona</th><th>Áreas de la casa</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
          <tbody>
            {order.map(pid => {
              const p = window.PERSON(pid);
              const ids = window.DISTRIBUTIONS[dist].assign[pid] || [];
              const turns = window.DISTRIBUTIONS[dist].assign.bebeTurnos || [];
              return (
                <tr key={pid}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Coin p={p} size={26} /><div><div style={{ fontWeight: 600 }}>{NAME(p)}</div><div className="tag">{p.note}</div></div></div></td>
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
      <div className="aside"><LoadCard dist={dist} /></div>
    </div>
  );
}

/* =========================================================
   VISTA: PERSONAS
   ========================================================= */
function PersonasView({ dist, store, toggle }) {
  return (
    <div className="pgrid">
      {ORDER.map(pid => {
        const p = window.PERSON(pid);
        const ts = allTasksFor(pid, dist, store.custom);
        const done = ts.filter(t => store.done[pid + ':' + t.id]).length;
        return (
          <div className="card" key={pid}>
            <div className="pcard-h">
              <Coin p={p} size={40} />
              <div style={{ flex: 1 }}><div className="pn">{NAME(p)}{p.age ? ' (' + p.age + ')' : ''}</div><div className="pr">{p.role} · {done}/{ts.length} hechas</div></div>
              {p.isKid && <span className="pill done" style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}>★ {done * PPT}</span>}
            </div>
            <div className="pcard-body">
              {ts.length === 0 && <div className="empty" style={{ padding: 20, fontSize: 13 }}>Sin tareas asignadas</div>}
              {ts.map(t => {
                const k = pid + ':' + t.id;
                const on = !!store.done[k];
                return (
                  <div className={'tline' + (on ? ' done' : '')} key={k}>
                    <div className={'chk' + (on ? ' on' : '')} onClick={() => toggle(k)}>{on ? '✓' : ''}</div>
                    <span style={{ fontSize: 15 }}>{t.icon}</span>
                    <span className="tl-t">{t.label}</span>
                    <span className="tag">{t.freq === 'diario' ? 'Diario' : window.DAYS_SHORT[t.day]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   VISTA: RECOMPENSAS
   ========================================================= */
function RecompensasView({ dist, store }) {
  const kids = window.FAMILY.filter(p => p.isKid);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {kids.map(k => {
        const pts = allTasksFor(k.id, dist, store.custom).filter(t => store.done[k.id + ':' + t.id]).length * PPT;
        const next = window.REWARDS.find(r => r.at > pts);
        return (
          <div className="card" key={k.id}>
            <div className="card-h">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Coin p={k} size={26} /> {k.name} <span style={{ color: 'var(--ns)', fontWeight: 400, fontSize: 13 }}>· {k.pet.name}</span></h3>
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
            <div className="seg" style={{ height: 34 }}>
              <button className={freq === 'diario' ? 'on' : ''} onClick={() => setFreq('diario')}>Diario</button>
              <button className={freq === 'semanal' ? 'on' : ''} onClick={() => setFreq('semanal')}>Semanal</button>
            </div>
            {freq === 'semanal' && (
              <select className="sel" style={{ marginTop: 8 }} value={day} onChange={e => setDay(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 0].map(d => <option key={d} value={d}>{window.DAYS[d]}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="panel-f">
          <button className="btn primary" disabled={!label.trim()}
            onClick={() => onSave({ id: 'c' + Date.now(), label: label.trim(), icon, owner, cat, freq, day: freq === 'semanal' ? day : undefined, custom: true })}>Guardar</button>
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
const PAGE_TITLE = { panel: 'Panel', tareas: 'Tareas', reparto: 'Reparto de la casa', personas: 'Personas', recompensas: 'Recompensas' };

function App() {
  const [theme, setTheme] = useState('mama');
  const [view, setView] = useState('panel');
  const [dist, setDist] = useState('equitativo');
  const [groupBy, setGroupBy] = useState('persona');
  const [query, setQuery] = useState('');
  const [store, setStore] = useState(loadStore);
  const [adding, setAdding] = useState(false);

  useEffect(() => { document.body.parentElement.setAttribute('data-theme', theme); }, [theme]);

  function persist(next) { setStore(next); localStorage.setItem(KEY, JSON.stringify(next)); }
  function toggle(k) {
    const done = { ...store.done };
    if (done[k]) delete done[k]; else done[k] = true;
    persist({ ...store, done });
  }
  function addTask(t) {
    persist({ ...store, custom: [...store.custom, t] });
    setAdding(false);
  }
  function refresh() { setStore(loadStore()); }

  const themePerson = window.PERSON(theme === 'mama' ? 'mama' : 'papa');

  return (
    <div id="appwrap">
      {/* TOP APP BAR */}
      <div className="appbar">
        <button className="waffle" title="Aplicaciones">
          <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="3" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="17" cy="3" r="1.5"/><circle cx="3" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="17" cy="10" r="1.5"/><circle cx="3" cy="17" r="1.5"/><circle cx="10" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>
        </button>
        <span className="title">Tareas de la Familia</span>
        <span className="sep"></span>
        <span className="env">Hogar</span>
        <span className="spacer"></span>
        <button className="ic-btn" title="Buscar">🔍</button>
        <button className="ic-btn" title="Configuración">⚙</button>
        <button className="ic-btn" title="Ayuda">？</button>
        {/* selector de perfil padre */}
        <div className="seg" style={{ margin: '0 6px', height: 32 }}>
          <button className={theme === 'mama' ? 'on' : ''} onClick={() => setTheme('mama')}>Verónica</button>
          <button className={theme === 'maykol' ? 'on' : ''} onClick={() => setTheme('maykol')}>Maykol</button>
        </div>
        <div className="me"><Coin p={themePerson} size={30} /></div>
      </div>

      {/* BODY */}
      <div className="body" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* NAV */}
        <nav className="nav">
          <div className="grp">Hogar</div>
          {NAVS.map(n => (
            <a key={n.id} className={view === n.id ? 'on' : ''} onClick={() => setView(n.id)}>
              <span className="ni">{n.icon}</span>{n.label}
            </a>
          ))}
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="pagehead">
            <div className="crumb">Hogar › {PAGE_TITLE[view]}</div>
            <h1>{PAGE_TITLE[view]}</h1>
          </div>

          {/* COMMAND BAR */}
          <div className="cmdbar">
            <button className="cmd primary" onClick={() => setAdding(true)}><span className="ci">＋</span>Nueva tarea</button>
            <button className="cmd" onClick={refresh}><span className="ci">↻</span>Actualizar</button>
            <span className="cmd-sep"></span>
            <span style={{ fontSize: 13, color: 'var(--ns)', marginRight: 4 }}>Reparto:</span>
            <div className="seg">
              <button className={dist === 'actual' ? 'on' : ''} onClick={() => setDist('actual')}>Actual</button>
              <button className={dist === 'equitativo' ? 'on' : ''} onClick={() => setDist('equitativo')}>Equitativo</button>
            </div>
            {(view === 'panel' || view === 'tareas') && (
              <>
                <span className="cmd-sep"></span>
                <span style={{ fontSize: 13, color: 'var(--ns)', marginRight: 4 }}>Agrupar:</span>
                <div className="seg">
                  <button className={groupBy === 'persona' ? 'on' : ''} onClick={() => setGroupBy('persona')}>Persona</button>
                  <button className={groupBy === 'categoria' ? 'on' : ''} onClick={() => setGroupBy('categoria')}>Categoría</button>
                  <button className={groupBy === 'none' ? 'on' : ''} onClick={() => setGroupBy('none')}>Ninguno</button>
                </div>
                <div className="search">
                  <span className="si">🔍</span>
                  <input placeholder="Buscar tareas…" value={query} onChange={e => setQuery(e.target.value)} />
                </div>
              </>
            )}
          </div>

          {/* CONTENT */}
          <div className="content">
            {view === 'panel' && <PanelView dist={dist} store={store} toggle={toggle} groupBy={groupBy} query={query} theme={theme} />}
            {view === 'tareas' && <DataGrid dist={dist} custom={store.custom} store={store} toggle={toggle} groupBy={groupBy} query={query} />}
            {view === 'reparto' && <RepartoView dist={dist} store={store} />}
            {view === 'personas' && <PersonasView dist={dist} store={store} toggle={toggle} />}
            {view === 'recompensas' && <RecompensasView dist={dist} store={store} />}
          </div>
        </div>
      </div>

      {adding && <AddPanel onClose={() => setAdding(false)} onSave={addTask} />}
    </div>
  );
}

// Esperar a la sincronización en la nube (si está activa) antes de mostrar el panel.
(window.CloudSync ? window.CloudSync.whenReady : function (cb) { cb(); })(function () {
  ReactDOM.createRoot(document.getElementById('app')).render(<App />);
});
