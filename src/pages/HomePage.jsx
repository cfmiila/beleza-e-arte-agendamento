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

  const today   = getTodayOffset(0);
  const tomorrow= getTodayOffset(1);
  const weekEnd = getTodayOffset(7);

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
    onToast({ message: 'Agendamento confirmado', type: 'success' });
  }
  function handleCancel(id) {
    if (!window.confirm('Cancelar este agendamento?')) return;
    cancelAppointment(id);
    onToast({ message: 'Agendamento cancelado', type: 'error' });
  }

  return (
    <>
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-ornament hero-ornament-1" />
        <div className="hero-ornament hero-ornament-2" />
        <div className="hero-ornament hero-ornament-3" />

        <p className="hero-eyebrow">✦ &nbsp; Beleza &amp; Arte Studio &nbsp; ✦</p>
        <h1>
          Arte que realça<br />
          <em>a sua beleza natural</em>
        </h1>
        <p className="hero-sub">
          Agende com os melhores profissionais e transforme cada visita em uma experiência única.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={onNewBooking}>
            Reservar horário
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => document.getElementById('appts-section')
              .scrollIntoView({ behavior: 'smooth' })}
          >
            Ver agenda
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats">
        {[
          { num: stats.today,     label: 'Hoje'        },
          { num: stats.tomorrow,  label: 'Amanhã'      },
          { num: stats.week,      label: 'Esta semana' },
          { num: stats.confirmed, label: 'Confirmados' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-number">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Appointments ── */}
      <div className="section" id="appts-section">
        <div className="section-header">
          <div className="section-title">
            <h2>Agenda de Clientes</h2>
            <p>Todos os agendamentos · {appointments.length} registros</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onNewBooking}>
            + Novo agendamento
          </button>
        </div>

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

        <div className="appointments-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◌</span>
              <h3>Nada por aqui</h3>
              <p>Nenhum agendamento para este filtro.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={onNewBooking}
              >
                + Novo Agendamento
              </button>
            </div>
          ) : (
            filtered.map((a, i) => (
              <div key={a.id} style={{ animationDelay: `${i * .05}s` }}>
                <AppointmentCard
                  appt={a}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
