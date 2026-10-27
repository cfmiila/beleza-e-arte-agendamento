export default function Navbar({ onHome, onNewBooking }) {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={onHome} role="button" tabIndex={0}
           onKeyDown={e => e.key === 'Enter' && onHome()}>
        <div className="nav-logo-mark">✦</div>
        <div className="nav-logo-text">
          <strong>Beleza &amp; Arte</strong>
          <span>Salão de Beleza</span>
        </div>
      </div>
      <div className="nav-actions">
        <button className="btn btn-outline" onClick={onHome}>
          Agenda
        </button>
        <button className="btn btn-primary" onClick={onNewBooking}>
          + Agendar
        </button>
      </div>
    </nav>
  );
}
