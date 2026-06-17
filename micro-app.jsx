/* ===========================================================
   SISTEMA INTELIGENTE DE TAREAS — app (flujo del día)
   Comparte perfiles/fotos con data.js pero usa su PROPIO
   almacenamiento (fam_micro_v1) y su propio documento en la nube.
   =========================================================== */
const { useState, useEffect, useMemo, useRef } = React;
const MKEY = 'fam_micro_v1';
const ORDER = ['mama', 'papa', 'taylor', 'emmeth', 'christopher', 'rachel'];

/* nombre "apodo" y nombre real (ambos) */
const NICK = p => p.name;
const REAL = p => p.realName || p.name;

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
  try { s = JSON.parse(localStorage.getItem(MKEY)) || {}; } catch (e) {}
  const wk = weekKey();
  if (s.week !== wk) { s.marks = {}; s.bonus = []; s.checks = {}; s.week = wk; }
  s.marks = s.marks || {}; s.bonus = s.bonus || []; s.checks = s.checks || {};
  s.profile = s.profile || 'taylor';
  return s;
}

/* ---- puntos ---- */
function bonusPts(pid, bonus) { return (bonus || []).filter(b => b.pid === pid).reduce((s, b) => s + (b.pts || 0), 0); }
function taskPts(pid, marks) { return window.routinesFor(pid).reduce((s, t) => s + window.routinePoints(t, marks[pid + ':' + t.id]), 0); }
function personPts(pid, store) { return taskPts(pid, store.marks) + bonusPts(pid, store.bonus); }

/* ---- momento sugerido según la hora ---- */
function currentMoment(d = new Date()) {
  const h = d.getHours();
  if (h < 11) return 'manana';
  if (h < 13) return 'escuela';
  if (h < 16) return 'tarde';
  if (h < 19) return 'estudio';
  if (h < 22) return 'noche';
  return 'manana';
}

/* ---- avatar ---- */
function Avatar({ p, size = 44 }) {
  if (p.pet && p.pet.img) return <img src={p.pet.img} alt={p.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 10px -4px rgba(0,0,0,.3)' }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,' + p.colors.a + ',' + p.colors.b + ')', fontSize: size * .5, border: '3px solid #fff' }}>{(p.pet && p.pet.emoji) || p.emoji}</div>;
}

/* =========================================================
   VISTA NIÑOS: mi día (por momentos)
   ========================================================= */
function TaskRow({ pid, t, store, onClaim, showToast }) {
  const mark = store.marks[pid + ':' + t.id];
  const st = window.microMarkState(mark);
  return (
    <div className={'mt ' + st} onClick={() => {
      if (st === 'ok') { showToast('Ya está aprobada ✓'); return; }
      onClaim(pid, t.id, st !== 'claim');
    }}>
      <div className={'box ' + st}>{st === 'ok' ? '✓' : st === 'claim' ? '⏳' : ''}</div>
      <span className="mt-ic">{t.icon}</span>
      <span className="mt-t">{t.label}</span>
      {st === 'claim' && <span className="tagp">por revisar</span>}
      {st === 'ok' && <span className="tagp ok">+{window.routinePoints(t, mark)}</span>}
    </div>
  );
}

function AreaCard({ pid, t, store, onClaim, onCheck, showToast }) {
  const k = pid + ':' + t.id;
  const st = window.microMarkState(store.marks[k]);
  const mark = store.marks[k];
  const checks = store.checks[k] || [];
  const doneCount = t.micro.filter((_, i) => checks[i]).length;
  const score = window.routinePoints(t, mark);

  return (
    <div className={'areacard ' + st}>
      <div className="area-h">
        <span className="area-ic">{t.icon}</span>
        <div className="grow">
          <div className="area-t">{t.label} <span className="ptbadge">10 pts</span></div>
          <div className="area-c">{doneCount}/{t.micro.length} pasos · {t.freq === 'semanal' ? 'semanal' : 'cada día'}</div>
        </div>
        {st === 'ok' && <span className="tagp ok big">+{score}</span>}
        {st === 'claim' && <span className="tagp">por revisar ⏳</span>}
      </div>

      <div className="checklist">
        {t.micro.map((label, i) => (
          <div key={i} className={'chk ' + (checks[i] ? 'on' : '')} onClick={() => { if (st !== 'ok') onCheck(pid, t.id, i); }}>
            <div className="cbox">{checks[i] ? '✓' : ''}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {st !== 'ok' && (
        <button className={'area-claim' + (st === 'claim' ? ' claimed' : '')}
          onClick={() => onClaim(pid, t.id, st !== 'claim')}>
          {st === 'claim' ? 'Marcada lista ⏳ (toca para deshacer)' : 'Marcar área lista para revisar'}
        </button>
      )}
    </div>
  );
}

function MyDay({ pid, store, onClaim, onCheck, showToast }) {
  const today = new Date();
  const [open, setOpen] = useState(currentMoment(today));
  const mine = window.routinesFor(pid).filter(t => window.appliesToday(t, today));
  if (!mine.length) return <div className="empty">Hoy no hay tareas para esta persona. 🌿</div>;

  const total = mine.length;
  const okCount = mine.filter(t => window.microMarkState(store.marks[pid + ':' + t.id]) === 'ok').length;

  // agrupar por momento (en orden del día) y dentro por "group"
  const byMoment = window.MOMENTS.map(m => {
    const items = mine.filter(t => t.moment === m.id);
    return { m, items };
  }).filter(g => g.items.length);

  const now = currentMoment(today);

  return (
    <>
      <div className="card progress">
        <div className="row between">
          <span className="eyebrow">{okCount} de {total} aprobadas hoy</span>
          <span className="chip pts">⭐ {personPts(pid, store)} pts</span>
        </div>
        <div className="bar"><i style={{ width: (total ? okCount / total * 100 : 0) + '%' }} /></div>
      </div>

      {byMoment.map(({ m, items }) => {
        const isOpen = open === m.id;
        const mOk = items.filter(t => window.microMarkState(store.marks[pid + ':' + t.id]) === 'ok').length;
        const isNow = m.id === now;
        // subgrupos por "group"
        const groups = [];
        items.forEach(t => { let g = groups.find(x => x.group === t.group); if (!g) { g = { group: t.group, items: [] }; groups.push(g); } g.items.push(t); });

        return (
          <div className={'moment' + (isNow ? ' now' : '') + (isOpen ? ' open' : '')} key={m.id}>
            <button className="moment-h" onClick={() => setOpen(isOpen ? null : m.id)}>
              <span className="moment-ic">{m.icon}</span>
              <div className="grow">
                <div className="moment-t">{m.label} {isNow && <span className="nowtag">ahora</span>}</div>
                <div className="moment-c">{mOk}/{items.length} listas</div>
              </div>
              <span className="chev">{isOpen ? '▾' : '▸'}</span>
            </button>

            {isOpen && (
              <div className="moment-body">
                {groups.map(g => (
                  <div className="grp" key={g.group}>
                    <div className="grp-h">{g.group}</div>
                    {g.items.map(t => t.type === 'area'
                      ? <AreaCard key={t.id} pid={pid} t={t} store={store} onClaim={onClaim} onCheck={onCheck} showToast={showToast} />
                      : <TaskRow key={t.id} pid={pid} t={t} store={store} onClaim={onClaim} showToast={showToast} />)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

/* =========================================================
   PRIVILEGIOS POR MÉRITO (vista del niño)
   ========================================================= */
function PrivCard({ icon, title, sub, pct, state, remaining, children }) {
  // pct: 0..100+ ; state: 'lock' | 'prog' | 'open'
  const w = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className={'priv ' + state}>
      <div className="priv-h">
        <span className="priv-ic">{icon}</span>
        <div className="grow">
          <div className="priv-t">{title} {state === 'open' && <span className="priv-badge">Disponible</span>}</div>
          <div className="priv-c">{sub}</div>
        </div>
      </div>
      <div className="priv-bar"><i style={{ width: w + '%' }} /></div>
      <div className="priv-meta">
        <span>{w}%</span>
        <span>{state === 'open' ? '¡Lo lograste! 🎉' : (remaining > 0 ? 'Faltan ' + remaining + ' pts' : '—')}</span>
      </div>
      {children}
    </div>
  );
}

function Privileges({ pid, store, showToast }) {
  const p = window.PERSON(pid);
  const cfg = window.getPrivCfg(store);
  const today = new Date();

  if (!p.isKid) {
    return <div className="empty">Los premios por mérito son para los niños. Elige a Tay-Yay o Dondo arriba. 🌟</div>;
  }

  // ---- Tiempo de pantalla (hoy) ----
  const db = window.dayBounds(today);
  const possToday = window.possiblePointsForDay(pid, today);
  const earnToday = window.earnedInRange(pid, store, db.from, db.to, false);
  const pctToday = possToday ? (earnToday / possToday * 100) : 0;
  const screenOn = cfg.screen.enabled && cfg.screen.kids.includes(pid);
  const minutes = window.screenMinutes(cfg, pctToday);
  const screenState = !screenOn ? 'lock' : (minutes > 0 ? 'open' : 'prog');
  const screenThreshold = Math.ceil(possToday * cfg.screen.minPct / 100);
  const screenRemaining = Math.max(0, screenThreshold - earnToday);

  // ---- Visita a los Titos (Lun..Vie) ----
  const wk = window.weekMonFri(today);
  const possWeek = window.possibleInRange(pid, wk.mon, wk.fri);
  const earnWeek = window.earnedInRange(pid, store, wk.mon, wk.fri, true);
  const pctWeek = possWeek ? (earnWeek / possWeek * 100) : 0;
  const titosOn = cfg.titos.enabled && cfg.titos.kids.includes(pid);
  const titosThreshold = Math.ceil(possWeek * cfg.titos.minPct / 100);
  const titosUnlocked = titosOn && earnWeek >= titosThreshold && titosThreshold > 0;
  const titosState = !titosOn ? 'lock' : (titosUnlocked ? 'open' : 'prog');
  const titosRemaining = Math.max(0, titosThreshold - earnWeek);

  // ---- Mascotas (semana completa) ----
  const earnFullWeek = personPts(pid, store);
  const petsOn = cfg.pets.enabled;
  const petsUnlocked = petsOn && earnFullWeek >= cfg.pets.weeklyMin;
  const petsState = !petsOn ? 'lock' : (petsUnlocked ? 'open' : 'prog');
  const petsPct = cfg.pets.weeklyMin ? (earnFullWeek / cfg.pets.weeklyMin * 100) : 0;
  const petsRemaining = Math.max(0, cfg.pets.weeklyMin - earnFullWeek);

  function avisarTita() {
    const url = window.titosWaLink(cfg, REAL(p));
    window.open(url, '_blank');
    showToast('Abriendo mensaje para Tita… un adulto confirma el envío 💕');
  }

  return (
    <>
      <div className="card progress">
        <div className="row between">
          <span className="eyebrow">Premios por esfuerzo</span>
          <span className="chip pts">⭐ {earnFullWeek} pts esta semana</span>
        </div>
        <div className="area-c" style={{ marginTop: 6 }}>Se ganan con los puntos que <b>obtienes</b>, no con tu saldo. Aunque gastes, tus premios se mantienen.</div>
      </div>

      {(cfg.screen.kids.includes(pid) || pid === 'christopher') && (
        <PrivCard icon="📺" title="Tiempo de pantalla"
          sub={screenOn ? ('Hoy: ' + earnToday + '/' + possToday + ' pts del día') : 'Disponible cuando tengas la edad'}
          pct={pctToday} state={screenState} remaining={screenRemaining}>
          {screenOn && (
            <div className={'priv-prize' + (minutes > 0 ? ' on' : '')}>
              {minutes > 0 ? ('🎮 ' + minutes + ' min de pantalla hoy') : ('Llega al ' + cfg.screen.minPct + '% para ganar pantalla')}
            </div>
          )}
        </PrivCard>
      )}

      <PrivCard icon="🐶" title="Actividades con mascotas"
        sub={petsOn ? ('Semana: ' + earnFullWeek + '/' + cfg.pets.weeklyMin + ' pts') : 'Desactivado'}
        pct={petsPct} state={petsState} remaining={petsRemaining}>
        {petsUnlocked && <div className="priv-prize on">🐾 ¡Puedes jugar, cepillar y pasear!</div>}
      </PrivCard>

      {titosOn && (
        <PrivCard icon="👵" title="Visita a los Titos"
          sub={'Lun a Vie: ' + earnWeek + '/' + possWeek + ' pts'}
          pct={pctWeek} state={titosState} remaining={titosRemaining}>
          {titosUnlocked
            ? <button className="priv-action" onClick={avisarTita}>📩 Avisar a Tita</button>
            : <div className="priv-prize">Junta el {cfg.titos.minPct}% de tu semana para el premio del viernes</div>}
        </PrivCard>
      )}
    </>
  );
}

/* =========================================================
   PANEL PADRES: inspección + ranking + bonos
   ========================================================= */
function InspectRow({ pid, t, onApproveTask, onApproveArea, onReject }) {
  const p = window.PERSON(pid);
  const [o, setO] = useState(5);
  const [c, setC] = useState(5);
  const [pts, setPts] = useState(window.MICRO_POINTS); // rutina: 10 base, ajustable
  const isArea = t.type === 'area';

  return (
    <div className="qrow">
      <Avatar p={p} size={30} />
      <div className="grow">
        <div className="mt-t">{t.icon} {t.label}</div>
        <div className="area-c">{NICK(p)} · {t.group}{isArea ? ' · área' : ''}</div>
        {isArea ? (
          <div className="oc">
            <div className="oc-row"><span>Orden</span>
              <button onClick={() => setO(v => Math.max(0, v - 1))}>−</button><b>{o}</b><button onClick={() => setO(v => Math.min(5, v + 1))}>+</button>
            </div>
            <div className="oc-row"><span>Limpieza</span>
              <button onClick={() => setC(v => Math.max(0, v - 1))}>−</button><b>{c}</b><button onClick={() => setC(v => Math.min(5, v + 1))}>+</button>
            </div>
          </div>
        ) : (
          <div className="oc">
            <div className="oc-row"><span>Puntos</span>
              <button onClick={() => setPts(v => Math.max(0, v - 5))}>−5</button>
              <button onClick={() => setPts(v => Math.max(0, v - 1))}>−</button>
              <b>{pts}</b>
              <button onClick={() => setPts(v => v + 1)}>+</button>
              <button onClick={() => setPts(v => v + 5)}>+5</button>
            </div>
          </div>
        )}
      </div>
      {isArea
        ? <button className="mini ok" onClick={() => onApproveArea(pid, t.id, o, c)}>Aprobar +{o + c}</button>
        : <button className="mini ok" onClick={() => onApproveTask(pid, t.id, pts)}>Aprobar +{pts}</button>}
      <button className="mini no" onClick={() => onReject(pid, t.id)}>✕</button>
    </div>
  );
}

function NumRow({ label, value, step = 5, min = 0, onChange, suffix }) {
  return (
    <div className="oc-row" style={{ marginTop: 6 }}>
      <span style={{ width: 'auto', flex: 1 }}>{label}</span>
      <button onClick={() => onChange(Math.max(min, (value || 0) - step))}>−</button>
      <b>{value}{suffix || ''}</b>
      <button onClick={() => onChange((value || 0) + step)}>+</button>
    </div>
  );
}

function PrivConfig({ store, onCfg }) {
  const cfg = window.getPrivCfg(store);
  return (
    <div className="card area">
      <div className="area-h"><span className="area-ic">🌟</span><div><div className="area-t">Premios por mérito</div><div className="area-c">desbloqueo por esfuerzo (puntos ganados)</div></div></div>

      <div className="sub">
        <div className="sub-h">📺 Tiempo de pantalla <Toggle on={cfg.screen.enabled} onClick={() => onCfg('screen', 'enabled', !cfg.screen.enabled)} /></div>
        <NumRow label="% mínimo del día" value={cfg.screen.minPct} step={5} onChange={v => onCfg('screen', 'minPct', v)} suffix="%" />
        <NumRow label="Máximo diario (min)" value={cfg.screen.max} step={15} onChange={v => onCfg('screen', 'max', v)} />
        <div className="area-c" style={{ marginTop: 6 }}>Escalones: 70%→30 · 80%→60 · 90%→90 · 100%→120 min</div>
      </div>

      <div className="sub">
        <div className="sub-h">👵 Visita a los Titos <Toggle on={cfg.titos.enabled} onClick={() => onCfg('titos', 'enabled', !cfg.titos.enabled)} /></div>
        <NumRow label="% requerido (Lun-Vie)" value={cfg.titos.minPct} step={5} onChange={v => onCfg('titos', 'minPct', v)} suffix="%" />
        <div className="sub-h" style={{ marginTop: 8 }}>Teléfono (WhatsApp)</div>
        <input className="sel" value={cfg.titos.phone} onChange={e => onCfg('titos', 'phone', e.target.value)} />
        <div className="sub-h" style={{ marginTop: 8 }}>Mensaje (usa {'{nombre}'})</div>
        <textarea className="sel" rows={5} value={cfg.titos.message} onChange={e => onCfg('titos', 'message', e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <div className="sub">
        <div className="sub-h">🐶 Mascotas <Toggle on={cfg.pets.enabled} onClick={() => onCfg('pets', 'enabled', !cfg.pets.enabled)} /></div>
        <NumRow label="Puntos de la semana" value={cfg.pets.weeklyMin} step={50} onChange={v => onCfg('pets', 'weeklyMin', v)} />
      </div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return <button className={'toggle' + (on ? ' on' : '')} onClick={onClick}>{on ? 'ON' : 'OFF'}</button>;
}

function ParentPanel({ store, onApproveTask, onApproveArea, onReject, onGrant, onCfg, showToast }) {
  const [bonusPid, setBonusPid] = useState('taylor');
  const [bonusType, setBonusType] = useState('hermano');

  const claims = [];
  ORDER.forEach(pid => window.routinesFor(pid).forEach(t => {
    if (window.microMarkState(store.marks[pid + ':' + t.id]) === 'claim') claims.push({ pid, t });
  }));

  const ranking = window.FAMILY.filter(p => p.isKid)
    .map(k => ({ k, pts: personPts(k.id, store) })).sort((a, b) => b.pts - a.pts);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      <div className="card area">
        <div className="area-h"><span className="area-ic">🔍</span><div><div className="area-t">Por inspeccionar</div><div className="area-c">{claims.length} marcadas como listas</div></div></div>
        {claims.length === 0
          ? <div className="empty">¡Todo al día! Nada por revisar. ✨</div>
          : claims.map(({ pid, t }) => (
            <InspectRow key={pid + ':' + t.id} pid={pid} t={t}
              onApproveTask={onApproveTask} onApproveArea={onApproveArea} onReject={onReject} />
          ))}
      </div>

      <div className="card area">
        <div className="area-h"><span className="area-ic">🏅</span><div><div className="area-t">Ranking de la semana</div><div className="area-c">puntos acumulados</div></div></div>
        {ranking.map((r, i) => (
          <div className="qrow" key={r.k.id}>
            <span style={{ width: 22, textAlign: 'center' }}>{medals[i] || ''}</span>
            <Avatar p={r.k} size={30} />
            <div className="grow mt-t">{NICK(r.k)} <span className="real">· {REAL(r.k)}</span></div>
            <span className="chip pts">{r.pts} pts</span>
          </div>
        ))}
      </div>

      <div className="card area">
        <div className="area-h"><span className="area-ic">✨</span><div><div className="area-t">Dar un bono</div><div className="area-c">ayudas espontáneas (puntos extra)</div></div></div>
        <div className="sub">
          <div className="sub-h">¿A quién?</div>
          <select className="sel" value={bonusPid} onChange={e => setBonusPid(e.target.value)}>
            {ORDER.map(id => { const p = window.PERSON(id); return <option key={id} value={id}>{NICK(p)} · {REAL(p)}</option>; })}
          </select>
        </div>
        <div className="sub">
          <div className="sub-h">Tipo de bono</div>
          {window.MICRO_BONUSES.map(b => (
            <div key={b.id} className={'mt ' + (bonusType === b.id ? 'claim' : 'todo')} onClick={() => setBonusType(b.id)}>
              <span className="mt-ic">{b.icon}</span>
              <span className="mt-t">{b.label}</span>
              <span className="tagp ok">+{b.pts}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => { const b = window.MICRO_BONUS(bonusType); onGrant({ pid: bonusPid, type: bonusType, pts: b.pts, at: Date.now() }); showToast('Bono +' + b.pts + ' para ' + NICK(window.PERSON(bonusPid)) + ' ✨'); }}>
          Dar bono
        </button>
      </div>

      {onCfg && <PrivConfig store={store} onCfg={onCfg} />}
    </>
  );
}

/* ---- gate de PIN ---- */
function PinGate({ onOk, onCancel }) {
  const [entry, setEntry] = useState('');
  const [err, setErr] = useState(false);
  const PIN = String(window.PARENT_PIN || '1234');
  function push(d) { if (entry.length >= PIN.length) return; const v = entry + d; setErr(false); setEntry(v); if (v.length === PIN.length) { if (v === PIN) setTimeout(onOk, 150); else setTimeout(() => { setErr(true); setEntry(''); }, 200); } }
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <div className="pinwrap">
      <div className="card pinbox">
        <h2>Panel de Padres</h2>
        <p className="area-c">{err ? '❌ PIN incorrecto' : 'Escribe el PIN para inspeccionar 🔒'}</p>
        <div className="dots">{Array.from({ length: PIN.length }).map((_, i) => <i key={i} className={i < entry.length ? (err ? 'bad' : 'on') : ''} />)}</div>
        <div className="keypad">
          {keys.map((k, i) => k === '' ? <div key={i} /> : <button key={i} onClick={() => k === '⌫' ? setEntry(entry.slice(0, -1)) : push(k)}>{k}</button>)}
        </div>
        <button className="link" onClick={onCancel}>Volver</button>
      </div>
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */
function App() {
  const [store, setStore] = useState(loadStore);
  const [profile, setProfile] = useState(store.profile);
  const [tab, setTab] = useState('mis');
  const [pinOk, setPinOk] = useState(false);
  const [toast, setToast] = useState(null);
  const tRef = useRef(null);
  const remoteRef = useRef(null);
  const lastJSON = useRef('');

  const person = window.PERSON(profile);

  function showToast(m) { setToast(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 1800); }

  function persist(next) {
    next.profile = profile;
    setStore(next);
    const json = JSON.stringify(next);
    lastJSON.current = json;
    localStorage.setItem(MKEY, json);
    if (remoteRef.current) remoteRef.current(json);
  }
  useEffect(() => { const n = { ...store, profile }; setStore(n); const j = JSON.stringify(n); lastJSON.current = j; localStorage.setItem(MKEY, j); if (remoteRef.current) remoteRef.current(j); }, [profile]);

  function claim(pid, id, on) { const k = pid + ':' + id; const marks = { ...store.marks }; if (on) marks[k] = { s: 'claim' }; else delete marks[k]; persist({ ...store, marks }); if (on) showToast('Marcada como lista ⏳ (espera aprobación)'); }
  function check(pid, id, idx) {
    const k = pid + ':' + id;
    const checks = { ...store.checks };
    const arr = (checks[k] || []).slice();
    arr[idx] = !arr[idx];
    checks[k] = arr;
    persist({ ...store, checks });
  }
  function approveTask(pid, id, pts) { const v = (typeof pts === 'number') ? pts : window.MICRO_POINTS; persist({ ...store, marks: { ...store.marks, [pid + ':' + id]: { s: 'ok', pts: v, at: Date.now() } } }); showToast('Aprobada +' + v + ' ✓'); }
  function approveArea(pid, id, o, c) { persist({ ...store, marks: { ...store.marks, [pid + ':' + id]: { s: 'ok', o, c, at: Date.now() } } }); showToast('Área aprobada +' + (o + c) + ' ✓'); }
  function reject(pid, id) { const marks = { ...store.marks }; delete marks[pid + ':' + id]; persist({ ...store, marks }); }
  function grant(b) { persist({ ...store, bonus: [...(store.bonus || []), b] }); }
  function setPrivCfg(section, key, value) { const cfg = { ...(store.privCfg || {}) }; cfg[section] = { ...(cfg[section] || {}), [key]: value }; persist({ ...store, privCfg: cfg }); }

  /* ---- sincronización en la nube (documento propio: hogar-micro) ---- */
  useEffect(() => {
    const cfg = window.FIREBASE_CONFIG || {};
    const ok = cfg.apiKey && !/PEGA_AQUI|REEMPLAZAR/i.test(cfg.apiKey) && cfg.projectId;
    if (!ok || typeof firebase === 'undefined') return;
    let ref;
    try { if (!firebase.apps.length) firebase.initializeApp(cfg); ref = firebase.firestore().collection('hogares').doc('hogar-micro'); }
    catch (e) { console.warn('[micro nube] no inició', e); return; }

    let writeTimer = null;
    remoteRef.current = function (json) {
      clearTimeout(writeTimer);
      writeTimer = setTimeout(() => { ref.set({ state: json, updated: Date.now() }).catch(e => console.warn('[micro nube] guardar', e)); }, 600);
    };
    ref.get().then(snap => {
      if (snap.exists && snap.data().state) { applyRemote(snap.data().state); }
      else if (lastJSON.current) { ref.set({ state: lastJSON.current, updated: Date.now() }).catch(() => {}); }
    }).catch(e => console.warn('[micro nube] leer', e)).then(() => {
      ref.onSnapshot(snap => { if (snap.exists && snap.data().state) applyRemote(snap.data().state); }, e => console.warn('[micro nube] escucha', e));
    });

    function applyRemote(json) {
      if (json === lastJSON.current) return;
      lastJSON.current = json;
      try { const s = JSON.parse(json); const wk = weekKey(); if (s.week !== wk) { s.marks = {}; s.bonus = []; s.checks = {}; s.week = wk; } s.marks = s.marks || {}; s.bonus = s.bonus || []; s.checks = s.checks || {}; localStorage.setItem(MKEY, JSON.stringify(s)); setStore(prev => ({ ...s, profile: prev.profile })); } catch (e) {}
    }
    return () => { remoteRef.current = null; };
  }, []);

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="hi"><Avatar p={person} /><div><div className="sm">Mi día</div><div className="nm">{NICK(person)} <span className="nm-real">· {REAL(person)}</span> {person.emoji}</div></div></div>
        <div className="row" style={{ gap: 8 }}>
          {person.isKid && <span className="chip pts big">⭐ {personPts(profile, store)}</span>}
          <a className="home" href="index.html" title="Volver a la app">🏠</a>
        </div>
      </div>

      <div className="who">
        {window.FAMILY.map(p => (
          <div key={p.id} className={'w' + (p.id === profile ? ' on' : '')} onClick={() => setProfile(p.id)} style={{ '--wa': p.colors.a }}>
            <Avatar p={p} size={46} />
            <span>{p.short}</span>
            <small>{REAL(p)}</small>
          </div>
        ))}
      </div>

      <div className="seg">
        <button className={tab === 'mis' ? 'on' : ''} onClick={() => setTab('mis')}>🎯 Mi día</button>
        <button className={tab === 'priv' ? 'on' : ''} onClick={() => setTab('priv')}>🌟 Premios</button>
        <button className={tab === 'padres' ? 'on' : ''} onClick={() => setTab('padres')}>🔍 Padres</button>
      </div>

      <div className="content">
        {tab === 'mis' && <MyDay pid={profile} store={store} onClaim={claim} onCheck={check} showToast={showToast} />}
        {tab === 'priv' && <Privileges pid={profile} store={store} showToast={showToast} />}
        {tab === 'padres' && (pinOk
          ? <ParentPanel store={store} onApproveTask={approveTask} onApproveArea={approveArea} onReject={reject} onGrant={grant} onCfg={setPrivCfg} showToast={showToast} />
          : <PinGate onOk={() => setPinOk(true)} onCancel={() => setTab('mis')} />)}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
