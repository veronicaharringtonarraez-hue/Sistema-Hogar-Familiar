/* ============================================================
   Banco Crece — App raíz
   ============================================================ */

const FxContext = createContext(null);
function useFx() { return useContext(FxContext); }

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "caramelo",
  "textScale": 1,
  "corners": "redondas",
  "approval": "pedidos"
}/*EDITMODE-END*/;

const NAV = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "ganar", label: "Puntos", icon: "⭐" },
  { id: "pagar", label: "Pagar", icon: "🧾" },
  { id: "ahorro", label: "Ahorro", icon: "🐷" },
  { id: "logros", label: "Logros", icon: "🏅" },
  { id: "registro", label: "Registro", icon: "📜" },
  { id: "presupuesto", label: "Plan", icon: "📊" },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [confettiKey, setConfettiKey] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.corners = t.corners;
    document.documentElement.style.setProperty("--text-scale", t.textScale);
  }, [t.theme, t.corners, t.textScale]);

  const fx = {
    celebrate: () => setConfettiKey((k) => k + 1),
    toast: (msg) => {
      setToastMsg(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
    },
  };

  return (
    <FxContext.Provider value={fx}>
      <StoreProvider>
        <AppShell t={t} setTweak={setTweak} />
        <Confetti fire={confettiKey} />
        <Toast msg={toastMsg} />
        <TweaksPanel>
          <TweakSection label="Cómo ganan dinero" />
          <TweakRadio label="Aprobación" value={t.approval}
            options={["pedidos", "pin"]}
            onChange={(v) => setTweak("approval", v)} />
          <TweakSection label="Apariencia" />
          <TweakRadio label="Tema" value={t.theme}
            options={["caramelo", "aventura", "galaxia"]}
            onChange={(v) => setTweak("theme", v)} />
          <TweakRadio label="Esquinas" value={t.corners}
            options={["redondas", "suaves"]}
            onChange={(v) => setTweak("corners", v)} />
          <TweakSection label="Texto" />
          <TweakSlider label="Tamaño de letra" value={t.textScale} min={0.85} max={1.3} step={0.05}
            onChange={(v) => setTweak("textScale", v)} />
        </TweaksPanel>
      </StoreProvider>
    </FxContext.Provider>
  );
}

function AppShell({ t, setTweak }) {
  const { state, actions } = useStore();
  const fx = useFx();
  const [childId, setChildId] = useState(() => localStorage.getItem("bc.child") || "taylor");
  const [tab, setTab] = useState("inicio");
  const [parentOpen, setParentOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinErr, setPinErr] = useState("");
  const [newBadge, setNewBadge] = useState(null);
  const prevBadgesRef = useRef(null);

  useEffect(() => { localStorage.setItem("bc.child", childId); }, [childId]);

  // Desbloqueo automático de insignias (todos los niños)
  useEffect(() => {
    BC.CHILDREN.forEach((c) => {
      const cd = state.data[c.id];
      const unlocked = BC.evaluateBadges(cd, state.goals[c.id]);
      unlocked.forEach((bid) => {
        if (!(cd.badges || {})[bid]) actions.unlockBadge(c.id, bid);
      });
    });
  }, [state]);

  // Celebrar insignia nueva del niño actual
  useEffect(() => {
    const cur = Object.keys(state.data[childId].badges || {});
    const prev = prevBadgesRef.current;
    if (prev && prev.child === childId) {
      const newly = cur.filter((id) => !prev.ids.includes(id));
      if (newly.length) {
        setNewBadge(BC.BADGES.find((b) => b.id === newly[0]));
        fx.celebrate();
      }
    }
    prevBadgesRef.current = { child: childId, ids: cur };
  }, [state, childId]);

  const child = BC.CHILDREN.find((c) => c.id === childId);
  const pendingCount = (state.requests || []).length;

  return (
    <div className="bc-app">
      <header className="bc-header">
        <div className="bc-brand">
          <span className="bc-coin">P</span>
          <span className="bc-brand-name">Banco&nbsp;Crece</span>
        </div>
        <button className="bc-parent-btn" onClick={() => { setPinErr(""); setPinOpen(true); }}>
          👩‍👧‍👦 <span>Adulto</span>
          {pendingCount > 0 && <span className="bc-dot">{pendingCount}</span>}
        </button>
      </header>

      <div className="bc-child-switch">
        {BC.CHILDREN.map((c) => (
          <button key={c.id} className={"bc-child-tab " + (childId === c.id ? "on" : "")}
            style={{ "--cc": c.color, "--ccs": c.colorSoft }}
            onClick={() => { setChildId(c.id); setTab("inicio"); }}>
            <span className="bc-child-av">{c.avatar}</span>
            <span className="bc-child-nm">{c.name}</span>
          </button>
        ))}
      </div>

      <main className="bc-main">
        <ChildScreens child={child} tab={tab} nav={setTab} approval={t.approval} />
      </main>

      <nav className="bc-nav">
        {NAV.map((n) => (
          <button key={n.id} className={"bc-nav-btn " + (tab === n.id ? "on" : "")}
            style={{ "--cc": child.color }} onClick={() => setTab(n.id)}>
            <span className="bc-nav-ic">{n.icon}</span>
            <span className="bc-nav-lb">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* PIN para entrar a modo adulto */}
      <Modal open={pinOpen} onClose={() => setPinOpen(false)} title="Modo Mamá/Papá" accent="#A855F7">
        <PinChecker onOk={() => { setPinOpen(false); setParentOpen(true); }} onErr={setPinErr} error={pinErr} />
      </Modal>

      {parentOpen && (
        <div className="bc-overlay">
          <ParentPanel onClose={() => setParentOpen(false)} />
        </div>
      )}

      {/* Insignia nueva */}
      <Modal open={!!newBadge} onClose={() => setNewBadge(null)} title="¡Nueva insignia!" accent={newBadge ? newBadge.color : "#FFB020"}>
        {newBadge && (
          <div className="bc-newbadge">
            <div className="bc-newbadge-ic" style={{ background: newBadge.color + "22", boxShadow: `0 0 0 4px ${newBadge.color}` }}>{newBadge.icon}</div>
            <div className="bc-newbadge-name">{newBadge.name}</div>
            <div className="bc-newbadge-desc">{newBadge.desc}</div>
            <button className="bc-btn-primary full" onClick={() => setNewBadge(null)}>¡Genial! 🎉</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PinChecker({ onOk, onErr, error }) {
  const { state } = useStore();
  return (
    <PinPad
      error={error}
      length={state.pin.length}
      prompt="Ingresa el PIN de Mamá/Papá"
      onSubmit={(pin) => { if (pin === state.pin) onOk(); else onErr("PIN incorrecto, intenta otra vez"); }}
    />
  );
}

function ChildScreens({ child, tab, nav, approval }) {
  switch (tab) {
    case "ganar": return <ScreenGanar child={child} nav={nav} />;
    case "pagar": return <ScreenPagar child={child} />;
    case "ahorro": return <ScreenAhorro child={child} />;
    case "logros": return <ScreenLogros child={child} />;
    case "registro": return <ScreenRegistro child={child} />;
    case "presupuesto": return <ScreenPresupuesto child={child} />;
    default: return <ScreenInicio child={child} nav={nav} />;
  }
}

Object.assign(window, { useFx, FxContext });

// Esperamos a que la nube traiga el estado del banco antes de montar, para que
// el saldo/ahorros se vean igual en todos los dispositivos. Si no hay nube
// configurada, BankSync.whenReady llama de inmediato (modo local).
(window.BankSync ? window.BankSync.whenReady : function (cb) { cb(); })(function () {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});
