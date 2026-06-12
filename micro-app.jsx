/* ===========================================================
   MICROTAREAS — app independiente (1 punto + inspección)
   Comparte perfiles/fotos con data.js pero usa su PROPIO
   almacenamiento (fam_micro_v1) y su propio documento en la nube.
   =========================================================== */
const { useState, useEffect, useMemo, useRef } = React;
const MKEY = 'fam_micro_v1';
const ORDER = ['mama', 'papa', 'taylor', 'emmeth', 'christopher', 'rachel'];
const NAME = p => p.name;

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
  if (s.week !== wk) { s.marks = {}; s.bonus = []; s.week = wk; }
  s.marks = s.marks || {}; s.bonus = s.bonus || [];
  s.profile = s.profile || 'taylor';
  return s;
}

/* ---- puntos ---- */
function bonusPts(pid, bonus) { return (bonus || []).filter(b => b.pid === pid).reduce((s, b) => s + (b.pts || 0), 0); }
function taskPts(pid, marks) { return window.microTasksFor(pid).reduce((s, t) => s + window.microMarkPoints(marks[pid + ':' + t.id]), 0); }
function personPts(pid, store) { return taskPts(pid, store.marks) + bonusPts(pid, store.bonus); }
const FREQ_LBL = { diario: 'Cada día', semanal: 'Semanal', profundo: 'Profundo' };

/* ---- avatar ---- */
function Avatar({ p, size = 44 }) {
  if (p.pet && p.pet.img) return <img src={p.pet.img} alt={p.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 10px -4px rgba(0,0,0,.3)' }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,' + p.colors.a + ',' + p.colors.b + ')', fontSize: size * .5, border: '3px solid #fff' }}>{(p.pet && p.pet.emoji) || p.emoji}</div>;
}

/* =========================================================
   VISTA NIÑOS: mis microtareas por área → subárea
   ========================================================= */
function MyTasks({ pid, store, onClaim, showToast }) {
  const mine = window.microTasksFor(pid);
  if (!mine.length) return <div className="empty">Esta persona no tiene microtareas asignadas. 🍼</div>;

  // agrupar por área (en el orden del catálogo)
  const byArea = window.MICRO_AREAS
    .map(a => ({ a, items: mine.filter(t => t.areaKey === a.key) }))
    .filter(g => g.items.length);

  const okCount = mine.filter(t => window.microMarkState(store.marks[pid + ':' + t.id]) === 'ok').length;
  const claimCount = mine.filter(t => window.microMarkState(store.marks[pid + ':' + t.id]) === 'claim').length;

  return (
    <>
      <div className="card progress">
        <div className="row between">
          <span className="eyebrow">{okCount} aprobadas · {claimCount} por revisar</span>
          <span className="chip pts">⭐ {personPts(pid, store)} pts</span>
        </div>
        <div className="bar"><i style={{ width: (mine.length ? okCount / mine.length * 100 : 0) + '%' }} /></div>
      </div>

      {byArea.map(({ a, items }) => {
        // subagrupar por subárea conservando orden
        const subs = [];
        items.forEach(t => { let g = subs.find(x => x.sub === t.sub); if (!g) { g = { sub: t.sub, freq: t.freq, items: [] }; subs.push(g); } g.items.push(t); });
        return (
          <div className="card area" key={a.key}>
            <div className="area-h"><span className="area-ic">{a.icon}</span><div><div className="area-t">{a.area}</div><div className="area-c">{a.cat}</div></div></div>
            {subs.map(s => (
              <div className="sub" key={s.sub}>
                <div className="sub-h">{s.sub} <span className="freq">{FREQ_LBL[s.freq] || ''}</span></div>
                {s.items.map(t => {
                  const st = window.microMarkState(store.marks[pid + ':' + t.id]);
                  return (
                    <div key={t.id} className={'mt ' + st} onClick={() => {
                      if (st === 'ok') { showToast('Ya está aprobada ✓'); return; }
                      onClaim(pid, t.id, st !== 'claim');
                    }}>
                      <div className={'box ' + st}>{st === 'ok' ? '✓' : st === 'claim' ? '⏳' : ''}</div>
                      <span className="mt-t">{t.label}</span>
                      {st === 'claim' && <span className="tagp">por revisar</span>}
                      {st === 'ok' && <span className="tagp ok">+1</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/* =========================================================
   PANEL PADRES: inspección + ranking + bonos
   ========================================================= */
function ParentPanel({ store, onApprove, onReject, onGrant, showToast }) {
  const [bonusPid, setBonusPid] = useState('taylor');
  const [bonusType, setBonusType] = useState('ayuda');

  // cola de inspección: todas las marcas en 'claim'
  const claims = [];
  ORDER.forEach(pid => window.microTasksFor(pid).forEach(t => {
    if (window.microMarkState(store.marks[pid + ':' + t.id]) === 'claim') claims.push({ pid, t });
  }));

  const ranking = window.FAMILY.filter(p => p.isKid)
    .map(k => ({ k, pts: personPts(k.id, store) })).sort((a, b) => b.pts - a.pts);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      {/* inspección */}
      <div className="card area">
        <div className="area-h"><span className="area-ic">🔍</span><div><div className="area-t">Por inspeccionar</div><div className="area-c">{claims.length} marcadas como listas</div></div></div>
        {claims.length === 0
          ? <div className="empty">¡Todo al día! Nada por revisar. ✨</div>
          : claims.map(({ pid, t }) => {
            const p = window.PERSON(pid);
            return (
              <div className="qrow" key={pid + ':' + t.id}>
                <Avatar p={p} size={30} />
                <div className="grow">
                  <div className="mt-t">{t.icon} {t.label}</div>
                  <div className="area-c">{NAME(p)} · {t.area}</div>
                </div>
                <button className="mini ok" onClick={() => onApprove(pid, t.id)}>Aprobar +1</button>
                <button className="mini no" onClick={() => onReject(pid, t.id)}>✕</button>
              </div>
            );
          })}
      </div>

      {/* ranking */}
      <div className="card area">
        <div className="area-h"><span className="area-ic">🏅</span><div><div className="area-t">Ranking de la semana</div><div className="area-c">puntos acumulados</div></div></div>
        {ranking.map((r, i) => (
          <div className="qrow" key={r.k.id}>
            <span style={{ width: 22, textAlign: 'center' }}>{medals[i] || ''}</span>
            <Avatar p={r.k} size={30} />
            <div className="grow mt-t">{r.k.name}</div>
            <span className="chip pts">{r.pts} pts</span>
          </div>
        ))}
      </div>

      {/* bonos */}
      <div className="card area">
        <div className="area-h"><span className="area-ic">✨</span><div><div className="area-t">Dar un bono</div><div className="area-c">suma puntos extra</div></div></div>
        <div className="sub">
          <div className="sub-h">¿A quién?</div>
          <select className="sel" value={bonusPid} onChange={e => setBonusPid(e.target.value)}>
            {ORDER.map(id => <option key={id} value={id}>{NAME(window.PERSON(id))}</option>)}
          </select>
        </div>
        <div className="sub">
          <div className="sub-h">Tipo de bono</div>
          {window.MICRO_BONUSES.map(b => (
            <div key={b.id} className={'mt ' + (bonusType === b.id ? 'claim' : 'todo')} onClick={() => setBonusType(b.id)}>
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              <span className="mt-t">{b.label}</span>
              <span className="tagp ok">+{b.pts}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => { const b = window.MICRO_BONUS(bonusType); onGrant({ pid: bonusPid, type: bonusType, pts: b.pts, at: Date.now() }); showToast('Bono +' + b.pts + ' para ' + NAME(window.PERSON(bonusPid)) + ' ✨'); }}>
          Dar bono
        </button>
      </div>
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
  const [tab, setTab] = useState('mis');     // 'mis' | 'padres'
  const [pinOk, setPinOk] = useState(false);
  const [toast, setToast] = useState(null);
  const tRef = useRef(null);
  const remoteRef = useRef(null);   // función de sync para subir
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
  // guardar perfil seleccionado
  useEffect(() => { const n = { ...store, profile }; setStore(n); const j = JSON.stringify(n); lastJSON.current = j; localStorage.setItem(MKEY, j); if (remoteRef.current) remoteRef.current(j); }, [profile]);

  function claim(pid, id, on) { const k = pid + ':' + id; const marks = { ...store.marks }; if (on) marks[k] = { s: 'claim' }; else delete marks[k]; persist({ ...store, marks }); if (on) showToast('Marcada como lista ⏳ (espera aprobación)'); }
  function approve(pid, id) { persist({ ...store, marks: { ...store.marks, [pid + ':' + id]: { s: 'ok' } } }); showToast('Aprobada +1 ✓'); }
  function reject(pid, id) { const marks = { ...store.marks }; delete marks[pid + ':' + id]; persist({ ...store, marks }); }
  function grant(b) { persist({ ...store, bonus: [...(store.bonus || []), b] }); }

  /* ---- sincronización en la nube (documento propio: hogar-micro) ---- */
  useEffect(() => {
    const cfg = window.FIREBASE_CONFIG || {};
    const ok = cfg.apiKey && !/PEGA_AQUI|REEMPLAZAR/i.test(cfg.apiKey) && cfg.projectId;
    if (!ok || typeof firebase === 'undefined') return;     // sin nube: solo local
    let ref;
    try { if (!firebase.apps.length) firebase.initializeApp(cfg); ref = firebase.firestore().collection('hogares').doc('hogar-micro'); }
    catch (e) { console.warn('[micro nube] no inició', e); return; }

    let writeTimer = null;
    remoteRef.current = function (json) {
      clearTimeout(writeTimer);
      writeTimer = setTimeout(() => { ref.set({ state: json, updated: Date.now() }).catch(e => console.warn('[micro nube] guardar', e)); }, 600);
    };
    // lectura inicial + escucha en vivo
    ref.get().then(snap => {
      if (snap.exists && snap.data().state) { applyRemote(snap.data().state); }
      else if (lastJSON.current) { ref.set({ state: lastJSON.current, updated: Date.now() }).catch(() => {}); }
    }).catch(e => console.warn('[micro nube] leer', e)).then(() => {
      ref.onSnapshot(snap => { if (snap.exists && snap.data().state) applyRemote(snap.data().state); }, e => console.warn('[micro nube] escucha', e));
    });

    function applyRemote(json) {
      if (json === lastJSON.current) return;   // eco propio
      lastJSON.current = json;
      try { const s = JSON.parse(json); const wk = weekKey(); if (s.week !== wk) { s.marks = {}; s.bonus = []; s.week = wk; } s.marks = s.marks || {}; s.bonus = s.bonus || []; localStorage.setItem(MKEY, JSON.stringify(s)); setStore(prev => ({ ...s, profile: prev.profile })); } catch (e) {}
    }
    return () => { remoteRef.current = null; };
  }, []);

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="hi"><Avatar p={person} /><div><div className="sm">Microtareas</div><div className="nm">{person.name} {person.emoji}</div></div></div>
        <div className="row" style={{ gap: 8 }}>
          {person.isKid && <span className="chip pts big">⭐ {personPts(profile, store)}</span>}
          <a className="home" href="index.html" title="Volver a la app">🏠</a>
        </div>
      </div>

      <div className="who">
        {window.FAMILY.map(p => (
          <div key={p.id} className={'w' + (p.id === profile ? ' on' : '')} onClick={() => setProfile(p.id)} style={{ '--wa': p.colors.a }}>
            <Avatar p={p} size={46} /><span>{p.short}</span>
          </div>
        ))}
      </div>

      <div className="seg">
        <button className={tab === 'mis' ? 'on' : ''} onClick={() => setTab('mis')}>🎯 Mis tareas</button>
        <button className={tab === 'padres' ? 'on' : ''} onClick={() => setTab('padres')}>🔍 Padres</button>
      </div>

      <div className="content">
        {tab === 'mis' && <MyTasks pid={profile} store={store} onClaim={claim} showToast={showToast} />}
        {tab === 'padres' && (pinOk
          ? <ParentPanel store={store} onApprove={approve} onReject={reject} onGrant={grant} showToast={showToast} />
          : <PinGate onOk={() => setPinOk(true)} onCancel={() => setTab('mis')} />)}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
