import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';
import { getTodayOffset } from '../data';

const FILTERS = [
  { key: 'all',       label: 'Todos'       },
  { key: 'today',     label: 'Hoje'        },
  { key: 'tomorrow',  label: 'Amanhã'      },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'pending',   label: 'Pendentes'   },
];

export default function HomePage({ onNewBooking, onToast }) {
  const { appointments, confirmAppointment, cancelAppointment } = useAppContext();
  const [filter, setFilter] = useState('all');

  const today    = getTodayOffset(0);
  const tomorrow = getTodayOffset(1);
  const weekEnd  = getTodayOffset(7);

  const stats = useMemo(() => ({
    today:     appointments.filter(a => a.date === today).length,
    tomorrow:  appointments.filter(a => a.date === tomorrow).length,
    week:      appointments.filter(a => a.date >= today && a.date <= weekEnd).length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
  }), [appointments, today, tomorrow, weekEnd]);

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (filter === 'today')     list = list.filter(a => a.date === today);
    if (filter === 'tomorrow')  list = list.filter(a => a.date === tomorrow);
    if (filter === 'confirmed') list = list.filter(a => a.status === 'confirmed');
    if (filter === 'pending')   list = list.filter(a => a.status === 'pending');
    return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments, filter, today, tomorrow]);

  function handleConfirm(id) {
    confirmAppointment(id);
    onToast({ message: '✅ Agendamento confirmado!', type: 'success' });
  }

  function handleCancel(id) {
    if (!window.confirm('Cancelar este agendamento?')) return;
    cancelAppointment(id);
    onToast({ message: '🗑️ Agendamento cancelado.', type: 'error' });
  }

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1>Seu salão favorito,<br /><span>na palma da mão</span></h1>
          <p>Agende seu horário em segundos e cuide da sua beleza com quem entende do assunto.</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={onNewBooking}>✨ Agendar agora</button>
            <button className="btn btn-outline btn-lg"
              onClick={() => document.getElementById('appts-section')
                .scrollIntoView({ behavior: 'smooth' })}>
              Ver agendamentos
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.today}</div>
          <div className="stat-label">Hoje</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.tomorrow}</div>
          <div className="stat-label">Amanhã</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.week}</div>
          <div className="stat-label">Esta semana</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.confirmed}</div>
          <div className="stat-label">Confirmados</div>
        </div>
      </div>

      {/* Appointments list */}
      <div className="section" id="appts-section">
        <div className="section-header">
          <h2>📅 Agendamentos <span>dos clientes</span></h2>
          <button className="btn btn-primary btn-sm" onClick={onNewBooking}>➕ Novo</button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="appointments-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Nenhum agendamento encontrado</h3>
              <p>Tente outro filtro ou crie um novo agendamento.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onNewBooking}>
                ➕ Novo Agendamento
              </button>
            </div>
          ) : (
            filtered.map(a => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
