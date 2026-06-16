/* ============================================================
   Banco Crece — Componentes compartidos
   ============================================================ */

function Avatar({ child, size = 56, ring = true }) {
  return (
    <div
      className="bc-avatar"
      style={{
        width: size, height: size, fontSize: size * 0.55,
        background: child.colorSoft,
        boxShadow: ring ? `0 0 0 3px ${child.color}` : "none",
      }}
    >
      <span>{child.avatar}</span>
    </div>
  );
}

function MoneyText({ amount, className = "", style = {} }) {
  return <span className={"bc-money " + className} style={style}>{BC.money(amount)}</span>;
}

function ProgressBar({ value, max, color = "var(--brand)", height = 14, showPct = false }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="bc-progress" style={{ height }}>
      <div className="bc-progress-fill" style={{ width: pct + "%", background: color }} />
      {showPct && <span className="bc-progress-label">{pct}%</span>}
    </div>
  );
}

function Card({ children, className = "", style = {}, onClick }) {
  return (
    <div className={"bc-card " + className} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children, accent = "var(--brand)", wide = false }) {
  if (!open) return null;
  return (
    <div className="bc-modal-overlay" onClick={onClose}>
      <div className={"bc-modal " + (wide ? "wide" : "")} style={{ "--accent": accent }} onClick={(e) => e.stopPropagation()}>
        <div className="bc-modal-head">
          <h3>{title}</h3>
          <button className="bc-x" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="bc-modal-body">{children}</div>
      </div>
    </div>
  );
}

function PinPad({ onSubmit, error, prompt = "Ingresa el PIN de Mamá/Papá", length = 4 }) {
  const [pin, setPin] = useState("");
  const press = (d) => {
    setPin((prev) => {
      if (prev.length >= length) return prev;
      const np = prev + d;
      if (np.length === length) {
        setTimeout(() => { onSubmit(np); setPin(""); }, 140);
      }
      return np;
    });
  };
  const del = () => setPin((p) => p.slice(0, -1));
  return (
    <div className="bc-pinpad">
      <p className="bc-pin-prompt">{prompt}</p>
      <div className="bc-pin-dots">
        {Array.from({ length }, (_, i) => (
          <span key={i} className={"bc-pin-dot " + (i < pin.length ? "on" : "")} />
        ))}
      </div>
      {error && <p className="bc-pin-error">{error}</p>}
      <div className="bc-pin-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="bc-pin-key" onClick={() => press(String(n))}>{n}</button>
        ))}
        <span />
        <button className="bc-pin-key" onClick={() => press("0")}>0</button>
        <button className="bc-pin-key del" onClick={del}>⌫</button>
      </div>
    </div>
  );
}

function Confetti({ fire }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!fire) return;
    const colors = ["#FF4D88", "#2E8BFF", "#1FB85A", "#FFB020", "#A855F7", "#FF7A45"];
    const arr = Array.from({ length: 80 }, (_, i) => ({
      id: i + "-" + fire,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.6 + Math.random() * 1.2,
      bg: colors[i % colors.length],
      size: 8 + Math.random() * 8,
      rot: Math.random() * 360,
      round: Math.random() > 0.5,
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 3200);
    return () => clearTimeout(t);
  }, [fire]);
  if (!pieces.length) return null;
  return (
    <div className="bc-confetti">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left + "%",
            width: p.size, height: p.size,
            background: p.bg,
            borderRadius: p.round ? "50%" : "2px",
            animationDelay: p.delay + "s",
            animationDuration: p.dur + "s",
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="bc-toast">{msg}</div>;
}

function Stat({ label, value, color, icon }) {
  return (
    <div className="bc-stat">
      {icon && <div className="bc-stat-icon" style={{ background: color + "22", color }}>{icon}</div>}
      <div>
        <div className="bc-stat-value" style={{ color }}>{value}</div>
        <div className="bc-stat-label">{label}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Avatar, MoneyText, ProgressBar, Card, Modal, PinPad, Confetti, Toast, Stat });
