/* ===========================================================
   App de Tareas Familiares — lógica + pantallas (React)
   =========================================================== */
const { useState, useEffect, useMemo, useRef } = React;

/* ---------- helpers de datos ---------- */
const STORE_KEY = 'fam_tareas_v1';
const PPT = window.POINTS_PER_TASK;

function weekKey(d = new Date()) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(dt.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((dt - firstThu) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return dt.getUTCFullYear() + '-W' + week;
}
/* clave del día (hora local): cambia a la medianoche */
function dayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
/* etiqueta legible del día de hoy, p. ej. "Sábado 16 de junio" */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function todayLabel(d = new Date()) {
  return window.DAYS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()];
}

let CUSTOM_TASKS = [];
let ACCUM = {};  // puntos acumulados de días anteriores (por persona)
function tasksFor(pid, distKey) {
  const a = window.DISTRIBUTIONS[distKey].assign;
  const houseIds = (a[pid] || []);
  const personalIds = (window.PERSONAL[pid] || []);
  const defs = houseIds.map(id => window.TASK(id))
    .concat(personalIds.map(id => window.PDEF(id)))
    .concat(CUSTOM_TASKS.filter(c => c.owner === pid));
  return defs.filter(Boolean);
}
function houseTasksFor(pid, distKey) {
  const a = window.DISTRIBUTIONS[distKey].assign;
  return (a[pid] || []).map(id => window.TASK(id)).filter(Boolean);
}
function ownerOf(taskId, distKey) {
  const a = window.DISTRIBUTIONS[distKey].assign;
  for (const pid of Object.keys(a)) {
    if (pid === 'bebeTurnos') continue;
    if ((a[pid] || []).includes(taskId)) return pid;
  }
  return null;
}
/* puntos de una tarea: personales = 1, áreas de la casa = 10 (PPT) */
function taskPtsOf(t) { return (t && t.pts != null) ? t.pts : PPT; }
function pointsFor(pid, distKey, done) {
  return tasksFor(pid, distKey).reduce((s, t) => s + (done[pid + ':' + t.id] ? taskPtsOf(t) : 0), 0);
}
/* puntos aprobados en el sistema "Mi día" (Microtareas), leídos directo de
   su almacenamiento (misma clave que usa el banco). No depende del catálogo:
   las áreas traen orden+limpieza (o/c) y las rutinas su valor (pts, 10 base). */
function microPtsByPerson() {
  const out = {};
  let store;
  try { store = JSON.parse(localStorage.getItem('fam_micro_v1')); } catch (e) { return out; }
  if (!store || typeof store !== 'object') return out;
  const marks = store.marks || {};
  Object.keys(marks).forEach(k => {
    const m = marks[k];
    if (!m || m.s !== 'ok') return;
    const pid = k.split(':')[0];
    const pts = (typeof m.o === 'number' || typeof m.c === 'number')
      ? ((m.o || 0) + (m.c || 0))
      : (typeof m.pts === 'number' ? m.pts : 10);
    out[pid] = (out[pid] || 0) + pts;
  });
  (store.bonus || []).forEach(b => { if (b && b.pid && b.pts) out[b.pid] = (out[b.pid] || 0) + b.pts; });
  return out;
}
/* puntos totales = acumulado de días anteriores + lo de hoy + Microtareas */
function totalPts(pid, distKey, done) {
  return (ACCUM[pid] || 0) + pointsFor(pid, distKey, done) + (microPtsByPerson()[pid] || 0);
}
function maxPointsFor(pid, distKey) {
  return tasksFor(pid, distKey).reduce((s, t) => s + taskPtsOf(t), 0);
}
function happinessFor(pid, distKey, done) {
  const ts = tasksFor(pid, distKey);
  if (!ts.length) return 50;
  const c = ts.filter(t => done[pid + ':' + t.id]).length;
  return Math.round(25 + 75 * (c / ts.length));
}
function moodFor(h) {
  return window.MOODS.find(m => h >= m.min) || window.MOODS[window.MOODS.length - 1];
}

/* ---------- persistencia ---------- */
function loadState() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) {}
  CUSTOM_TASKS = s.custom || [];            // para poder calcular puntos al acumular
  const dist = s.dist || 'equitativo';
  const today = dayKey();
  s.accum = s.accum || {};
  // Cambió el día → acumular los puntos de ayer y desmarcar todas las tareas
  if (s.day && s.day !== today && s.done) {
    window.FAMILY.forEach(p => { s.accum[p.id] = (s.accum[p.id] || 0) + pointsFor(p.id, dist, s.done); });
    s.done = {};
  }
  return {
    profile: s.profile || 'taylor',
    dist,
    tab: s.tab || 'inicio',
    day: today,
    accum: s.accum || {},
    done: s.done || {},
    custom: s.custom || [],
  };
}

/* ---------- componentes UI pequeños ---------- */
function applyTheme(p) {
  const r = document.querySelector('.phone');
  if (!r || !p) return;
  r.style.setProperty('--a', p.colors.a);
  r.style.setProperty('--b', p.colors.b);
  r.style.setProperty('--c', p.colors.c);
  r.style.setProperty('--tink', p.colors.ink);
}

function Avatar({ p, size = 46, ring }) {
  const cls = 'ava' + (ring ? ' ring' : '');
  if (p.pet && p.pet.img) return <img className={cls} src={p.pet.img} style={{ width: size, height: size }} alt={p.name} />;
  const glyph = (p.pet && p.pet.emoji) || p.emoji;
  return <div className={cls} style={{ width: size, height: size, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,' + p.colors.a + ',' + p.colors.b + ')', fontSize: size * 0.5 }}>{glyph}</div>;
}

function Confetti({ go }) {
  if (!go) return null;
  const cols = ['#FFC107', '#42BDEE', '#E53935', '#5CB85C', '#B98FE8', '#F48FB1'];
  const bits = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="confetti">
      {bits.map(i => (
        <i key={i} style={{
          left: Math.random() * 100 + '%',
          background: cols[i % cols.length],
          animationDelay: (Math.random() * 0.3) + 's',
          animationDuration: (1.1 + Math.random() * 0.8) + 's',
        }} />
      ))}
    </div>
  );
}

/* =========================================================
   TOP BAR + PROFILE SWITCHER
   ========================================================= */
function TopBar({ person, points, onParents }) {
  return (
    <div className="topbar">
      <div className="hi-wrap">
        <Avatar p={person} ring />
        <div className="hi-text">
          <div className="sm">{greeting()},</div>
          <div className="nm">{person.name} {person.tree || person.emoji}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {person.isKid && (
          <div className="pts-pill"><span className="star">⭐</span>{points}</div>
        )}
        <button onClick={onParents} title="Panel de Padres" aria-label="Panel de Padres"
          style={{ border: 0, cursor: 'pointer', width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,.22)', color: '#fff', fontSize: 17, display: 'grid', placeItems: 'center' }}>🔒</button>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL: PIN PARA EL PANEL DE PADRES
   ========================================================= */
function PinModal({ onClose, onSuccess }) {
  const [entry, setEntry] = useState('');
  const [err, setErr] = useState(false);
  const PIN = String(window.PARENT_PIN || '1234');

  function push(d) {
    if (entry.length >= PIN.length) return;
    const v = entry + d;
    setErr(false);
    setEntry(v);
    if (v.length === PIN.length) {
      if (v === PIN) setTimeout(onSuccess, 180);
      else setTimeout(() => { setErr(true); setEntry(''); }, 220);
    }
  }
  function back() { setErr(false); setEntry(entry.slice(0, -1)); }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: 320 }}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <h2 style={{ fontSize: 22 }}>Panel de Padres</h2>
          <button onClick={onClose} style={{ border: 0, background: '#f0eef8', borderRadius: 12, width: 34, height: 34, fontSize: 18, cursor: 'pointer', color: 'var(--ink-2)' }}>×</button>
        </div>
        <p className="muted" style={{ fontWeight: 600, fontSize: 13.5, margin: '0 0 16px' }}>
          {err ? '❌ PIN incorrecto, inténtalo de nuevo' : 'Escribe el PIN para entrar 🔒'}
        </p>

        <div className="row" style={{ justifyContent: 'center', gap: 12, margin: '4px 0 18px' }}>
          {Array.from({ length: PIN.length }).map((_, i) => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: '50%',
              background: i < entry.length ? (err ? '#E53935' : 'var(--a, #7C5CFF)') : '#e3e0ee',
              transition: 'background .15s'
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {keys.map((k, i) => k === ''
            ? <div key={i} />
            : (
              <button key={i} onClick={() => k === '⌫' ? back() : push(k)}
                style={{
                  border: 0, cursor: 'pointer', height: 58, borderRadius: 16,
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                  background: k === '⌫' ? 'transparent' : '#f4f2fb', color: 'var(--ink, #2a2540)'
                }}>{k}</button>
            ))}
        </div>
      </div>
    </div>
  );
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function ProfileSwitcher({ active, onPick, done, dist }) {
  return (
    <div className="who-row">
      {window.FAMILY.map(p => (
        <div key={p.id} className={'who' + (p.id === active ? ' on' : '')}
          style={{ '--who-a': p.colors.a }} onClick={() => onPick(p.id)}>
          {p.pet && p.pet.img
            ? <img src={p.pet.img} alt={p.name} />
            : <div className="face" style={{ background: 'linear-gradient(135deg,' + p.colors.a + ',' + p.colors.b + ')' }}>{(p.pet && p.pet.emoji) || p.emoji}</div>}
          <div className="lbl">{p.short}</div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   PANTALLA: INICIO
   ========================================================= */
function HomeScreen({ person, dist, done, toggle, go, onDelete, onAdd }) {
  const kids = window.FAMILY.filter(p => p.isKid);
  const ranking = kids.map(k => ({ k, pts: totalPts(k.id, dist, done) }))
    .sort((a, b) => b.pts - a.pts);
  const king = ranking[0];

  return (
    <div className="pad fade">
      {/* fecha de hoy (las tareas se reinician cada día a medianoche) */}
      <div className="center muted" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, margin: '8px 0 -2px', textTransform: 'capitalize' }}>
        📅 {todayLabel()}
      </div>
      {/* Rey de la semana */}
      <div className="hero" style={{ marginTop: 6 }}>
        <div className="crown">👑</div>
        <div className="deco">{king.k.tree || '🏆'}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, opacity: .9 }}>Líder de puntos 🏆</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <img src={king.k.pet.img} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.8)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{king.k.name}</div>
            <div style={{ fontWeight: 800, fontSize: 14, opacity: .95, whiteSpace: 'nowrap' }}>{king.pts} puntos acumulados</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
          {ranking.slice(1).map((r, i) => (
            <div key={r.k.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 15 }}>{i === 0 ? '🥈' : '🥉'}</span>
              <img src={r.k.pet.img} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,.7)' }} />
              <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{r.k.short} · {r.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* tiles */}
      <div className="tiles" style={{ marginTop: 16 }}>
        <div className="tile" style={{ background: 'linear-gradient(140deg,#7C5CFF,#B69DFF)' }} onClick={() => go('misiones')}>
          <div className="ic">🎯</div><div className="tl">Misiones</div>
        </div>
        <div className="tile" style={{ background: 'linear-gradient(140deg,#1FB6A6,#5FD3C6)' }} onClick={() => go('mascotas')}>
          <div className="ic">🐾</div><div className="tl">Mascotas</div>
        </div>
        <div className="tile" style={{ background: 'linear-gradient(140deg,#FF8A3D,#FFC107)' }} onClick={() => go('familia')}>
          <div className="ic">👨‍👩‍👧‍👦</div><div className="tl">Familia</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <a className="add-btn" href="Microtareas.html" style={{ textDecoration: 'none', margin: 0 }}>
          <span style={{ fontSize: 18 }}>🧩</span> Microtareas
        </a>
        <button className="add-btn" style={{ margin: 0 }} onClick={onAdd}>
          <span style={{ fontSize: 18 }}>➕</span> Agregar tarea
        </button>
      </div>

      {person.isBaby && (
        <div className="card" style={{ padding: 16, marginTop: 4 }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ fontSize: 30 }}>🍼</div>
            <div className="grow">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>A Che-Che la cuidan por turnos</div>
              <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Yue, Max, Tay-Yay y Dondo</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* fila de misión reutilizable */
function MissionRow({ task, owner, done, toggle, showOwner, onDelete }) {
  const key = owner.id + ':' + task.id;
  const isDone = !!done[key];
  return (
    <div className={'mission' + (isDone ? ' done' : '')} onClick={() => toggle(owner.id, task.id)}>
      <div className="m-ic" style={isDone ? { background: '#eafaf2' } : null}>{task.icon}</div>
      <div className="m-body">
        <div className="m-title">{task.label}</div>
        <div className="m-sub">
          {showOwner && <span className="chip gray">{owner.short}</span>}
          <span className="chip">{task.freq === 'diario' ? 'Cada día' : window.DAYS_SHORT[task.day]}</span>
          {task.shared && <span className="chip out">por turnos</span>}
          {task.custom && <span className="chip out">tuya</span>}
          <span className="chip pts">+{taskPtsOf(task)}</span>
        </div>
      </div>
      <div className={'check' + (isDone ? ' on' : '')}>{isDone ? '✓' : ''}</div>
      {task.custom && onDelete && (
        <button className="del" onClick={e => { e.stopPropagation(); onDelete(task); }}>×</button>
      )}
    </div>
  );
}

/* =========================================================
   PANTALLA: MISIONES (Persona / Área / Día)
   ========================================================= */
function MissionsScreen({ view, setView, onAdd }) {
  return (
    <div className="pad fade">
      <div className="sec-h" style={{ marginTop: 8 }}>
        <h2>Misiones</h2>
        <a className="link" href="Microtareas.html" style={{ textDecoration: 'none' }}>Abrir Microtareas 🧩</a>
      </div>
      <button className="add-btn" onClick={onAdd}><span style={{ fontSize: 18 }}>➕</span> Agregar una tarea</button>
      <div className="seg" style={{ marginBottom: 16 }}>
        {[['persona', 'Por persona'], ['area', 'Por área'], ['dia', 'Por día']].map(([k, l]) => (
          <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>
      {view === 'persona' && <ByPerson />}
      {view === 'area' && <ByArea />}
      {view === 'dia' && <ByDay />}
    </div>
  );
}

/* ---- helpers de Misiones (catálogo de Microtareas / "Mi día") ---- */
const ROUTS = () => (window.ROUTINES || []);
/* prioridad de limpieza: espacios comunes primero, dormitorios al final */
const CLEAN_PRIORITY = ['cocina', 'comedor', 'sala', 'baño', 'bano', 'lavand', 'entrada', 'recibidor', 'pasillo', 'escalera', 'patio', 'garaje', 'jard', 'cuarto', 'habitaci', 'dormitor', 'closet', 'clóset'];
function cleanPrio(group) {
  const g = (group || '').toLowerCase();
  for (let i = 0; i < CLEAN_PRIORITY.length; i++) if (g.indexOf(CLEAN_PRIORITY[i]) >= 0) return i;
  return 99;
}
/* rutinas de una persona agrupadas por momento → grupo (como en "Mi día") */
function microGrouped(pid) {
  const rs = ROUTS().filter(t => t.pid === pid);
  const out = [];
  (window.MOMENTS || []).forEach(mo => {
    const inMo = rs.filter(t => t.moment === mo.id);
    if (!inMo.length) return;
    const groups = [];
    inMo.forEach(t => {
      let g = groups.find(x => x.name === t.group);
      if (!g) { g = { name: t.group, items: [] }; groups.push(g); }
      g.items.push(t);
    });
    out.push({ moment: mo, groups });
  });
  return out;
}

/* fila desplegable reutilizable */
function Foldable({ open, onToggle, children, head }) {
  return (
    <div className="card fold" style={{ marginBottom: 10, overflow: 'hidden' }}>
      <div className="fold-h row between" onClick={onToggle}>
        {head}
        <span className="chev">{open ? '▾' : '▸'}</span>
      </div>
      {open && <div className="fold-b">{children}</div>}
    </div>
  );
}

function ByPerson() {
  const people = window.FAMILY.filter(p => ROUTS().some(t => t.pid === p.id));
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p className="muted" style={{ fontWeight: 600, fontSize: 13, margin: '0 0 12px' }}>
        Las mismas listas de cada persona en Microtareas. Toca un nombre para desplegar.
      </p>
      {people.map(p => {
        const rs = ROUTS().filter(t => t.pid === p.id);
        const isOpen = open === p.id;
        return (
          <Foldable key={p.id} open={isOpen} onToggle={() => setOpen(isOpen ? null : p.id)}
            head={
              <div className="row" style={{ gap: 10 }}>
                <Avatar p={p} size={36} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{p.name}{p.age ? ' (' + p.age + ')' : ''}</div>
                  <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{rs.length} tareas</div>
                </div>
              </div>
            }>
            {microGrouped(p.id).map(blk => (
              <div key={blk.moment.id} style={{ marginBottom: 12 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>{blk.moment.icon} {blk.moment.label}</div>
                {blk.groups.map((g, gi) => (
                  <div key={gi} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--ink-2,#667)', marginBottom: 4 }}>{g.name}</div>
                    {g.items.map(t => (
                      <div key={t.id} className="micro-li">
                        <span className="mli-ic">{t.icon}</span>
                        <span className="grow">{t.label}{t.type === 'area' ? ' · área' : ''}</span>
                        {t.type === 'area' && t.micro ? <span className="chip">{t.micro.length} pasos</span> : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </Foldable>
        );
      })}
    </div>
  );
}

function ByArea() {
  const areas = ROUTS().filter(t => t.type === 'area')
    .slice().sort((a, b) => cleanPrio(a.group) - cleanPrio(b.group) || a.group.localeCompare(b.group));
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p className="muted" style={{ fontWeight: 600, fontSize: 13, margin: '0 0 12px' }}>
        Áreas de limpieza de la casa. Toca un área para ver sus microtareas.
      </p>
      {areas.length === 0 && <div className="card muted" style={{ padding: 16, textAlign: 'center' }}>No hay áreas en el catálogo.</div>}
      {areas.map(t => {
        const p = window.PERSON(t.pid);
        const key = t.pid + ':' + t.id;
        const isOpen = open === key;
        return (
          <Foldable key={key} open={isOpen} onToggle={() => setOpen(isOpen ? null : key)}
            head={
              <div className="row" style={{ gap: 10 }}>
                <div className="m-ic">{t.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1 }}>{t.group}</div>
                  <div className="m-sub" style={{ marginTop: 4 }}>
                    {p && <span className="chip gray">{p.short}</span>}
                    <span className="chip">{t.freq === 'semanal' ? 'Semanal' : 'Cada día'}</span>
                  </div>
                </div>
              </div>
            }>
            {(t.micro || []).map((m, i) => (
              <div key={i} className="micro-li"><span className="mli-ic">·</span><span className="grow">{m}</span></div>
            ))}
          </Foldable>
        );
      })}
    </div>
  );
}

function ByDay() {
  const today = new Date().getDay();
  const [day, setDay] = useState(today);
  const byPrio = (a, b) => cleanPrio(a.group) - cleanPrio(b.group) || a.group.localeCompare(b.group);

  // Solo tareas de la casa (momento 'hogar'); sin cuidado personal.
  const hogar = ROUTS().filter(t => t.moment === 'hogar');
  // Cada día: diarias sin día específico.
  const daily = hogar.filter(t => t.freq !== 'semanal' && !(t.days && t.days.length)).slice().sort(byPrio);
  // Fecha del día elegido en la semana actual (para respetar la semana del mes).
  const now = new Date();
  const selDate = new Date(now); selDate.setDate(now.getDate() + (day - now.getDay()));
  // Específicas del día (lavandería, basura, limpiezas profundas con días/semana).
  const dayTasks = hogar.filter(t => t.days && t.days.length && window.appliesToday(t, selDate));
  // Áreas semanales sin día fijo: se reparten de lunes a sábado.
  const weeklyAreas = hogar.filter(t => t.freq === 'semanal' && t.type === 'area' && !(t.days && t.days.length)).slice().sort(byPrio);
  const weeklyForDay = weeklyAreas.filter((t, i) => (1 + (i % 6)) === day);
  const forDay = dayTasks.concat(weeklyForDay).sort(byPrio);

  const opts = [[1, 'Lunes'], [2, 'Martes'], [3, 'Miércoles'], [4, 'Jueves'], [5, 'Viernes'], [6, 'Sábado'], [0, 'Domingo']];

  const Item = ({ t, n }) => {
    const p = window.PERSON(t.pid);
    const label = t.type === 'area' ? t.group : t.label;
    return (
      <div className="micro-li">
        <span className="prio">{n}</span>
        <span className="mli-ic">{t.icon}</span>
        <span className="grow">{label}{t.type === 'area' ? ' · área' : ''}</span>
        {p && <span className="chip gray">{p.short}</span>}
      </div>
    );
  };

  return (
    <div>
      <p className="muted" style={{ fontWeight: 600, fontSize: 13, margin: '0 0 10px' }}>
        Prioridades de la casa por día, en orden (sin tareas de cuidado personal). Hoy es <b>{opts.find(o => o[0] === today)[1]}</b>.
      </p>
      <select className="day-select" value={day} onChange={e => setDay(Number(e.target.value))}>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}{v === today ? ' · hoy' : ''}</option>)}
      </select>

      <div className="eyebrow" style={{ margin: '14px 0 8px' }}>🧹 Cada día</div>
      {daily.length === 0 && <div className="muted" style={{ fontSize: 13 }}>Nada diario.</div>}
      {daily.map((t, i) => <Item key={t.pid + t.id} t={t} n={i + 1} />)}

      <div className="eyebrow" style={{ margin: '16px 0 8px' }}>📅 {opts.find(o => o[0] === day)[1]} — además, hoy toca</div>
      {forDay.length === 0
        ? <div className="muted" style={{ fontSize: 13 }}>{day === 0 ? 'Domingo de descanso: solo lo de cada día. 💛' : 'Nada extra asignado a este día.'}</div>
        : forDay.map((t, i) => <Item key={t.pid + t.id} t={t} n={i + 1} />)}
    </div>
  );
}

/* =========================================================
   PANTALLA: MASCOTAS
   ========================================================= */
function PetsScreen({ dist, done, person, setProfile }) {
  const owners = window.FAMILY.filter(p => p.pet && p.petCared);
  return (
    <div className="pad fade">
      <div className="sec-h" style={{ marginTop: 8 }}>
        <h2>Mascotas 🐾</h2>
      </div>
      <p className="muted" style={{ fontWeight: 600, fontSize: 14, margin: '2px 0 14px' }}>
        Mientras más tareas cumplen, más feliz está su mascota. ¡Cuídala y dale premios con los puntos que ganas!
      </p>
      {owners.map(p => <PetCard key={p.id} p={p} dist={dist} done={done} />)}
    </div>
  );
}

/* emociones de la mascota (versión animada) */
const PET_EMO = {
  triste:     { emoji: '😢', label: 'Triste' },
  timido:     { emoji: '😳', label: 'Tímido' },
  tranquilo:  { emoji: '😌', label: 'Tranquilo' },
  feliz:      { emoji: '😊', label: 'Feliz' },
  emocionado: { emoji: '🤩', label: 'Emocionado' },
  amoroso:    { emoji: '🥰', label: 'Amoroso' },
  jugueton:   { emoji: '😜', label: 'Juguetón' },
  sorprendido:{ emoji: '😮', label: 'Sorprendido' },
  curioso:    { emoji: '🤔', label: 'Curioso' },
  dormido:    { emoji: '😴', label: 'Dormido' },
  asustado:   { emoji: '😨', label: 'Asustado' },
  enfadado:   { emoji: '😠', label: 'Enfadado' },
};
const PET_ALL_EMOS = ['feliz', 'emocionado', 'tranquilo', 'curioso', 'dormido', 'triste', 'asustado', 'enfadado', 'timido', 'amoroso', 'jugueton', 'sorprendido'];
/* el ánimo base depende de los puntos ganados esta semana en "Mi día" */
function petMood(pts) {
  if (pts <= 0) return 'triste';
  if (pts < 150) return 'timido';
  if (pts < 400) return 'tranquilo';
  if (pts < 800) return 'feliz';
  if (pts < 1500) return 'emocionado';
  return 'amoroso';
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* Imagen de la mascota por emoción. Busca assets/<dir>/<emocion>.(png|gif|webp);
   si no existe ninguna, muestra el emoji del animal. Soporta imágenes animadas
   (GIF/WebP) sin cambiar nada más: basta con subir el archivo al repositorio. */
const PET_EXTS = ['png', 'gif', 'webp'];
function PetVisual({ pet, emotion }) {
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [emotion, pet && pet.dir]);
  if (!pet.dir || i >= PET_EXTS.length) return <span className="pet-face-emoji">{pet.face}</span>;
  const src = 'assets/' + pet.dir + '/' + emotion + '.' + PET_EXTS[i];
  return <img className="pet-img" src={src} alt="" onError={() => setI(i + 1)} />;
}

function PetCard({ p }) {
  const pet = p.pet;
  const name = pet.name;
  const kind = pet.kind;
  const persona = pet.persona;          // mascota con personalidad (mensajes propios)
  const voices = (window.PET_VOICES && window.PET_VOICES[pet.dir]) || null; // 10 frases x 12 emociones
  const sayEmo = (e) => {
    if (window.petTalk) { const g = window.petTalk(pet.dir, e); if (g) return g; }
    const a = voices && voices[e]; return (a && a.length) ? a[Math.floor(Math.random() * a.length)] : null;
  };
  const isRachel = p.id === 'rachel';

  // Puntos que dan ánimo a la mascota (esfuerzo de la semana en "Mi día").
  // La mascota de la bebé depende de cómo la cuida la familia (mamá, papá, Tay-Yay y Dondo).
  const micro = microPtsByPerson();
  const pts = isRachel
    ? ['mama', 'papa', 'taylor', 'emmeth'].reduce((s, id) => s + (micro[id] || 0), 0)
    : (micro[p.id] || 0);
  const goal = isRachel ? 3000 : 1500;
  const happy = Math.min(100, Math.round(pts / goal * 100));
  const base = petMood(pts);

  const [act, setAct] = useState(null);          // { type, mood, msg, home }
  const timer = useRef(null);
  const emo = act ? act.mood : base;
  const E = PET_EMO[emo] || PET_EMO.feliz;
  // Si la mascota tiene videos (Mochi), se elige un clip según la emoción.
  const anim = (pet.anim && pet.anim.length) ? pet.anim : null;
  const clip = anim ? anim[Math.max(0, PET_ALL_EMOS.indexOf(emo)) % anim.length] : null;

  const idleMsg = isRachel ? {
    triste: `${name} extraña mimos 🥺 ¡Cuidemos juntos a ${p.short}!`,
    timido: `${name} pide un poco más de cariño para ${p.short}.`,
    tranquilo: `${name} está tranquilo cuando cuidan a ${p.short}.`,
    feliz: `${name} está feliz: la familia cuida bien a ${p.short} 😊`,
    emocionado: `¡${name} está feliz porque todos cuidan a ${p.short}! 🤩`,
    amoroso: `${name} y ${p.short} se sienten muy amados 🥰`,
  } : {
    triste: `${name} te extraña 🥺 Haz tus tareas para alegrarlo.`,
    timido: `${name} es un poco tímido… un poco más de cariño lo animará.`,
    tranquilo: `${name} está tranquilo. ¡Sigue cumpliendo tus tareas!`,
    feliz: `${name} está feliz porque cumpliste tus tareas 😊`,
    emocionado: `¡${name} está súper emocionado contigo! 🤩`,
    amoroso: `${name} te quiere muchísimo 🥰 ¡Gran trabajo!`,
  };
  const message = act ? act.msg : (sayEmo(base) || (persona ? pick(persona.idle) : (idleMsg[base] || idleMsg.feliz)));

  // mensajes según el tipo de animal (o su personalidad, si la tiene)
  const carinoMsgs = persona ? persona.carino
    : kind === 'perro' ? [`${name} mueve la colita de felicidad 💖`, `¡A ${name} le encantan tus mimos! 🥰`]
    : kind === 'gato' ? [`${name} ronronea con tus mimos 💖`, `¡A ${name} le encantan tus caricias! 🥰`]
    : [`${name} se acurruca contento con tus mimos 💖`, `¡A ${name} le encanta tu cariño! 🥰`];
  const foodLabel = kind === 'perro' ? 'Dar hueso' : kind === 'gato' ? 'Dar pescado' : 'Dar comida';
  const foodMsgs = persona ? persona.comida
    : kind === 'perro' ? [`¡${name} mueve la cola! Ñam ñam 🦴`, `${name} te lo agradece con un lametón 🐶💕`]
    : kind === 'gato' ? [`¡${name} ronronea! Comió rico 🐟`, `${name} se relame feliz 😺`]
    : [`¡${name} ulula contento! 🦉`, `${name} agita sus alitas de felicidad ✨`];
  const jugarMsgs = persona ? persona.jugar : [`¡${name} salta y juega contigo! 🎉`, `${name} está muy juguetón 😜`];
  const casaMsgs = persona ? persona.casa : [`${name} entró feliz a su casita 🏠`, `¡${name} se siente seguro en casa! 💛`];

  // premios interactivos, se desbloquean con los puntos de la semana
  const treats = [
    { id: 'carino', icon: '💖', label: 'Dar cariño', min: 0, mood: 'amoroso', msgs: carinoMsgs },
    { id: 'comida', icon: pet.food, label: foodLabel, min: 150, mood: 'amoroso', msgs: foodMsgs },
    { id: 'jugar', icon: pet.toy || '🎾', label: 'Jugar', min: 400, mood: 'jugueton', msgs: jugarMsgs },
    { id: 'casa', icon: '🏠', label: 'Llevar a casa', min: 800, mood: 'amoroso', home: true, msgs: casaMsgs },
  ];

  // frases por emoción (voces) — fallback a las frases por puntos de la persona
  const phrasesAll = persona ? persona.phrases : [];
  const phrasesOpen = phrasesAll.filter(ph => pts >= ph[0]);
  const voiceCount = (window.petTalkCount && window.petTalkCount(pet.dir))
    || (voices ? PET_ALL_EMOS.reduce((s, e) => s + ((voices[e] || []).length), 0) : phrasesAll.length);
  // Cada "frase" muestra una emoción al azar (con su carita) y una frase acorde.
  function sayPhrase() {
    let e, m;
    if (voices) {
      const avail = PET_ALL_EMOS.filter(x => voices[x] && voices[x].length);
      e = avail[Math.floor(Math.random() * avail.length)];
      m = sayEmo(e);
    } else if (phrasesOpen.length) {
      e = base; m = phrasesOpen[Math.floor(Math.random() * phrasesOpen.length)][1];
    }
    if (!m) return;
    clearTimeout(timer.current);
    setAct({ type: 'frase', mood: e, msg: m });
    timer.current = setTimeout(() => setAct(null), 3600);
  }

  function doTreat(t) {
    if (pts < t.min) return;
    clearTimeout(timer.current);
    setAct({ type: t.id, mood: t.mood, msg: (sayEmo(t.mood) || pick(t.msgs)), home: !!t.home });
    timer.current = setTimeout(() => setAct(null), t.home ? 2600 : 2200);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  const stageCls = 'pet-stage'
    + (act && act.home ? ' to-home' : '')
    + (act && act.type === 'jugar' ? ' playing' : '')
    + ((emo === 'amoroso' || emo === 'feliz' || emo === 'emocionado') ? ' bouncy' : '')
    + (base === 'triste' && !act ? ' sad' : '');

  return (
    <div className="card pet-card" style={{ padding: 14, marginBottom: 16, '--a': p.colors.a, '--b': p.colors.b, '--c': p.colors.c, '--tink': p.colors.ink }}>
      <div className="row between" style={{ marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{name}</div>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>de {p.name} · {pet.species}</div>
        </div>
        <span className="chip" style={{ background: 'var(--c)', color: 'var(--tink)' }}>{E.emoji} {E.label}</span>
      </div>

      {/* escena animada */}
      <div className={stageCls}>
        <div className="pet-house">🏠</div>
        {(emo === 'amoroso') && <div className="pet-hearts"><span>💕</span><span>💖</span><span>💗</span></div>}
        {act && act.type === 'comida' && <div className="pet-treat">{pet.food}</div>}
        {act && act.type === 'jugar' && <div className="pet-treat">{pet.toy || '🎾'}</div>}
        <div className="pet-char">
          {clip
            ? <video key={clip} className="pet-vid" src={clip} autoPlay loop muted playsInline />
            : <PetVisual pet={pet} emotion={emo} />}
          <span className="pet-emo">{E.emoji}</span>
        </div>
        {base === 'triste' && !act && !clip && <div className="pet-zzz">💤</div>}
      </div>

      {/* mensaje motivador */}
      <div className="pet-msg">{message}</div>

      {/* felicidad por puntos */}
      <div style={{ marginTop: 10 }}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <span className="eyebrow" style={{ fontSize: 11 }}>Felicidad esta semana</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: p.colors.ink }}>{happy}% · {pts} pts</span>
        </div>
        <div className="bar"><i style={{ width: happy + '%' }} /></div>
      </div>

      {/* premios interactivos */}
      <div className="pet-treats">
        {treats.map(t => {
          const locked = pts < t.min;
          return (
            <button key={t.id} className={'pet-btn' + (locked ? ' locked' : '')}
              onClick={() => doTreat(t)} disabled={locked}>
              <span className="pet-btn-ic">{t.icon}</span>
              <span className="pet-btn-lb">{t.label}</span>
              {locked && <span className="pet-btn-lock">🔒 {t.min} pts</span>}
            </button>
          );
        })}
      </div>

      {/* frases por emoción según la personalidad */}
      {(voices || persona) && (
        <div className="pet-phrases">
          <button className="pet-phrase-btn" disabled={!voices && !phrasesOpen.length} onClick={sayPhrase}>{(persona && persona.btn) || '🎤 Frase'}</button>
          <span className="pet-phrase-count">💬 {voiceCount} frases</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PANTALLA: FAMILIA (Actual vs Equitativo)
   ========================================================= */
function FamilyScreen({ dist, setDist, done }) {
  const order = ['mama', 'papa', 'taylor', 'emmeth', 'christopher'];
  const loads = order.map(id => ({ p: window.PERSON(id), n: houseTasksFor(id, dist).length }));
  const maxN = Math.max(...loads.map(l => l.n), 1);
  const d = window.DISTRIBUTIONS[dist];

  return (
    <div className="pad fade fam-screen">
      <div className="sec-h" style={{ marginTop: 8 }}>
        <h2>Reparto familiar</h2>
      </div>
      <div className="seg" style={{ marginBottom: 8 }}>
        <button className={dist === 'actual' ? 'on' : ''} onClick={() => setDist('actual')}>Cómo está hoy</button>
        <button className={dist === 'equitativo' ? 'on' : ''} onClick={() => setDist('equitativo')}>Propuesta justa</button>
      </div>
      <p className="muted" style={{ fontWeight: 600, fontSize: 13.5, margin: '0 0 16px' }}>{d.sub}</p>

      <a className="add-btn" href="Plan del Hogar.html" target="_blank" rel="noopener"
        style={{ textDecoration: 'none', marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>📄</span> Ver el Plan del Hogar
      </a>

      <div className="fam-layout">
      {/* 1/3 — cuántas áreas lleva cada quien */}
      <aside className="fam-aside">
      <div className="card" style={{ padding: '16px 16px 8px' }}>
        <span className="eyebrow">Cuántas áreas lleva cada quien</span>
        <div style={{ marginTop: 12 }}>
          {loads.map(l => (
            <div key={l.p.id} style={{ marginBottom: 12 }}>
              <div className="row between" style={{ marginBottom: 5 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{l.p.short}{l.p.age ? ' (' + l.p.age + ')' : ''}</span>
                <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{l.n} {l.n === 1 ? 'área' : 'áreas'}</span>
              </div>
              <div className="loadbar">
                <i style={{ width: Math.max(8, l.n / maxN * 100) + '%', background: 'linear-gradient(90deg,' + l.p.colors.a + ',' + l.p.colors.b + ')' }} />
              </div>
            </div>
          ))}
        </div>
        {dist === 'actual'
          ? <div style={{ background: '#fff4e6', borderRadius: 14, padding: '10px 12px', marginTop: 4, fontSize: 13, fontWeight: 700, color: '#9a5a00' }}>⚠️ Yue carga casi todo y Misifu no tiene tareas.</div>
          : <div style={{ background: '#eafaf2', borderRadius: 14, padding: '10px 12px', marginTop: 4, fontSize: 13, fontWeight: 700, color: '#0f7a4a' }}>✅ Más parejo: Max ayuda más, Misifu entra con 1 área y la bebé se cuida entre 4.</div>}
      </div>
      </aside>

      {/* 2/3 — detalle por persona (quién hace qué) */}
      <div className="fam-main">
      <span className="eyebrow" style={{ marginLeft: 4 }}>Quién hace qué</span>
      <div style={{ marginTop: 12 }}>
        {order.concat(['rachel']).map(id => {
          const p = window.PERSON(id);
          const ts = houseTasksFor(id, dist);
          const turns = window.DISTRIBUTIONS[dist].assign.bebeTurnos || [];
          return (
            <div key={id} className="card" style={{ padding: 13, marginBottom: 10 }}>
              <div className="row" style={{ gap: 11, marginBottom: ts.length || (id === 'rachel') ? 9 : 0 }}>
                <Avatar p={p} size={40} />
                <div className="grow">
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{p.name}{p.age ? ' (' + p.age + ')' : ''}</div>
                  <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{p.note}</div>
                </div>
              </div>
              <div className="row wrap" style={{ gap: 6 }}>
                {id === 'rachel'
                  ? <span className="chip" style={{ background: p.colors.c, color: p.colors.ink }}>🍼 La cuidan: {turns.map(t => window.PERSON(t).short).join(', ') || '—'}</span>
                  : ts.length
                    ? ts.map(t => <span key={t.id} className="chip gray">{t.icon} {t.area}</span>)
                    : <span className="chip out">sin tareas</span>}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL: AGREGAR TAREA MANUAL
   ========================================================= */
function AddTaskModal({ onClose, onSave }) {
  const [owner, setOwner] = useState('taylor');
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [freq, setFreq] = useState('diario');
  const [day, setDay] = useState(1);
  const icons = ['⭐', '🧹', '🛏️', '🪥', '🛁', '🧺', '👕', '🍽️', '🐾', '🌱', '📖', '⚽', '🎹', '💧', '🚗', '🌿', '🧸', '🧷'];
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <h2 style={{ fontSize: 22 }}>Nueva tarea</h2>
          <button onClick={onClose} style={{ border: 0, background: '#f0eef8', borderRadius: 12, width: 34, height: 34, fontSize: 18, cursor: 'pointer', color: 'var(--ink-2)' }}>×</button>
        </div>

        <div className="fld">
          <label>¿De quién es?</label>
          <div className="pick-row">
            {window.FAMILY.map(p => (
              <div key={p.id} className={'pk' + (owner === p.id ? ' on' : '')} onClick={() => setOwner(p.id)}>
                <Avatar p={p} size={42} ring={owner === p.id} />
                <span className="lbl">{p.short}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fld">
          <label>¿Qué hay que hacer?</label>
          <input className="inp" value={label} placeholder="Ej: regar las plantas" autoFocus
            onChange={e => setLabel(e.target.value)} />
        </div>

        <div className="fld">
          <label>Ícono</label>
          <div className="ico-grid">
            {icons.map(ic => (
              <div key={ic} className={'ico' + (icon === ic ? ' on' : '')} onClick={() => setIcon(ic)}>{ic}</div>
            ))}
          </div>
        </div>

        <div className="fld">
          <label>¿Cada cuándo?</label>
          <div className="seg">
            <button className={freq === 'diario' ? 'on' : ''} onClick={() => setFreq('diario')}>Cada día</button>
            <button className={freq === 'semanal' ? 'on' : ''} onClick={() => setFreq('semanal')}>Un día a la semana</button>
          </div>
          {freq === 'semanal' && (
            <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
              {[1, 2, 3, 4, 5, 6, 0].map(d => (
                <button key={d} onClick={() => setDay(d)} className={'chip' + (day === d ? ' pts' : ' gray')}
                  style={{ border: 0, cursor: 'pointer', padding: '7px 11px', fontSize: 13 }}>{window.DAYS_SHORT[d]}</button>
              ))}
            </div>
          )}
        </div>

        <button className="btn-primary" disabled={!label.trim()} style={!label.trim() ? { opacity: .5 } : null}
          onClick={() => { if (label.trim()) onSave({ id: 'c' + Date.now(), label: label.trim(), icon, owner, freq, day: freq === 'semanal' ? Number(day) : undefined, custom: true }); }}>
          Agregar tarea (+{PPT} pts)
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   BOTTOM NAV
   ========================================================= */
function BottomNav({ tab, go }) {
  const items = [['inicio', '🏠', 'Inicio'], ['misiones', '🎯', 'Misiones'], ['mascotas', '🐾', 'Mascotas'], ['banco', '🏦', 'Banco'], ['familia', '👨‍👩‍👧‍👦', 'Familia']];
  return (
    <div className="nav">
      {items.map(([k, ic, l]) => (
        <button key={k} className={tab === k ? 'on' : ''} onClick={() => go(k)}>
          <span className="ni">{ic}</span>{l}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   APP ROOT
   ========================================================= */
function App() {
  const init = useMemo(loadState, []);
  const [profile, setProfile] = useState(init.profile);
  const [dist, setDist] = useState(init.dist);
  const [tab, setTab] = useState(init.tab);
  const [done, setDone] = useState(init.done);
  const [custom, setCustom] = useState(init.custom);
  const [accum, setAccum] = useState(init.accum);
  const [day, setDay] = useState(init.day);
  const [missView, setMissView] = useState('persona');
  const [showAdd, setShowAdd] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  CUSTOM_TASKS = custom;
  ACCUM = accum;
  const person = window.PERSON(profile);

  // persistir (fusionando con lo guardado para no pisar datos del panel de padres)
  useEffect(() => {
    let cur = {}; try { cur = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) {}
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...cur, profile, dist, tab, day, accum, done, custom }));
  }, [profile, dist, tab, day, accum, done, custom]);

  // reinicio a medianoche: acumula los puntos del día y desmarca todo
  useEffect(() => {
    const t = setInterval(() => {
      const today = dayKey();
      if (today !== day) {
        setAccum(prev => {
          const nx = { ...prev };
          window.FAMILY.forEach(p => { nx[p.id] = (nx[p.id] || 0) + pointsFor(p.id, dist, done); });
          return nx;
        });
        setDone({});
        setDay(today);
        showToast('¡Nuevo día! Las tareas se reiniciaron 🌅');
      }
    }, 30000);
    return () => clearInterval(t);
  }, [day, dist, done]);

  // tema según perfil
  useEffect(() => { applyTheme(person); }, [profile]);
  useEffect(() => { applyTheme(window.PERSON(profile)); }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }

  function toggle(pid, tid) {
    const key = pid + ':' + tid;
    setDone(prev => {
      const nx = { ...prev };
      if (nx[key]) {
        delete nx[key];
      } else {
        nx[key] = true;
        const p = window.PERSON(pid);
        const t = window.TASK(tid) || window.PDEF(tid) || custom.find(c => c.id === tid);
        const pts = taskPtsOf(t);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 1600);
        if (p.isKid) showToast('+' + pts + (pts === 1 ? ' punto para ' : ' pts para ') + p.short + ' · ' + (p.pet ? p.pet.name + ' feliz ' : '') + '🎉');
        else showToast('✓ ' + (t ? t.label : 'Tarea') + ' · ¡gracias ' + p.short + '!');
      }
      return nx;
    });
  }

  function addTask(t) {
    setCustom(prev => [...prev, t]);
    setShowAdd(false);
    const p = window.PERSON(t.owner);
    showToast('Nueva tarea para ' + p.short + ' ✨');
  }
  function deleteTask(t) {
    setCustom(prev => prev.filter(c => c.id !== t.id));
    setDone(prev => { const nx = { ...prev }; Object.keys(nx).forEach(k => { if (k.endsWith(':' + t.id)) delete nx[k]; }); return nx; });
  }

  const points = totalPts(profile, dist, done);

  return (
    <div className="stage">
      <div className="phone">
        <TopBar person={person} points={points} onParents={() => setShowPin(true)} />
        {tab !== 'banco' && <ProfileSwitcher active={profile} onPick={setProfile} done={done} dist={dist} />}
        {tab === 'banco'
          ? <iframe className="bank-frame" src="banco/index.html" title="Banco de la Familia" />
          : <div className="scroll">
              {tab === 'inicio' && <HomeScreen person={person} dist={dist} done={done} toggle={toggle} go={setTab} onDelete={deleteTask} onAdd={() => setShowAdd(true)} />}
              {tab === 'misiones' && <MissionsScreen dist={dist} done={done} toggle={toggle} view={missView} setView={setMissView} onAdd={() => setShowAdd(true)} onDelete={deleteTask} />}
              {tab === 'mascotas' && <PetsScreen dist={dist} done={done} person={person} setProfile={setProfile} />}
              {tab === 'familia' && <FamilyScreen dist={dist} setDist={setDist} done={done} />}
            </div>}
        {toast && <div className="toast">{toast}</div>}
        <BottomNav tab={tab} go={setTab} />
      </div>
      <Confetti go={confetti} />
      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onSave={addTask} />}
      {showPin && <PinModal onClose={() => setShowPin(false)} onSuccess={() => { window.location.href = 'Panel Padres.html'; }} />}
    </div>
  );
}

// Esperar a la sincronización en la nube (si está activa) antes de mostrar la app.
(window.CloudSync ? window.CloudSync.whenReady : function (cb) { cb(); })(function () {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
});
