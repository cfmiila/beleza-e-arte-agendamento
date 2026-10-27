export default function Navbar({ onHome, onNewBooking }) {
  return (
    <nav className="navbar">
      <a className="nav-logo" onClick={onHome} style={{ cursor: 'pointer' }}>
        <span className="logo-icon">💄</span>
        <span>Beleza<span className="accent">&Arte</span></span>
      </a>
      <div className="nav-actions">
        <button className="btn btn-outline" onClick={onHome}>
          📋 Agendamentos
        </button>
        <button className="btn btn-primary" onClick={onNewBooking}>
          ➕ Novo Agendamento
        </button>
      </div>
    </nav>
  );
}
