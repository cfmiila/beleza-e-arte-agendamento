import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import {
  PROCEDURES,
  STYLISTS,
  getProcedure,
  getStylist,
  formatDateDisplay,
  formatPrice,
  getTodayOffset,
  getOccupiedSlots,
} from '../data';

export default function BookingPage({ onConfirm, onToast }) {
  const { appointments, addAppointment } = useAppContext();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    client: '',
    phone: '',
    stylist: null,
    procedure: null,
    date: getTodayOffset(0),
    time: null,
  });

  function nextStep() { setStep(s => s + 1); }
  function prevStep() { setStep(s => s - 1); }

  function step1Next() {
    if (!form.client.trim()) { onToast({ message: 'Informe o nome do cliente', type: 'error' }); return; }
    if (!form.phone.trim())  { onToast({ message: 'Informe o telefone', type: 'error' }); return; }
    nextStep();
  }
  function step2Next() {
    if (!form.procedure) { onToast({ message: 'Selecione um serviço', type: 'error' }); return; }
    nextStep();
  }
  function submit() {
    if (!form.date) { onToast({ message: 'Selecione uma data', type: 'error' }); return; }
    if (!form.time) { onToast({ message: 'Selecione um horário', type: 'error' }); return; }
    const stylist = form.stylist || STYLISTS[Math.floor(Math.random() * STYLISTS.length)].id;
    const appt = { ...form, stylist };
    const newId = addAppointment(appt);
    onConfirm({ ...appt, id: newId, status: 'pending' });
  }

  const busyDates = useMemo(
    () => [...new Set(appointments.map(a => a.date))],
    [appointments]
  );
  const occupiedSlots = useMemo(
    () => getOccupiedSlots(appointments, form.date),
    [appointments, form.date]
  );

  const proc    = getProcedure(form.procedure);
  const stylist = form.stylist ? getStylist(form.stylist) : null;
  const showSummary = step === 3 && form.date && form.time;

  return (
    <div className="booking-container">
      {/* Header */}
      <div className="booking-header">
        <h2>Novo <span>Agendamento</span></h2>
        <p>Preencha os dados abaixo para reservar o horário do cliente.</p>
      </div>

      {/* Progress */}
      <div className="steps">
        <Step num={1} label="Cliente"  active={step === 1} done={step > 1} />
        <div className={`step-line ${step > 1 ? 'done' : ''}`} />
        <Step num={2} label="Serviço"  active={step === 2} done={step > 2} />
        <div className={`step-line ${step > 2 ? 'done' : ''}`} />
        <Step num={3} label="Horário"  active={step === 3} done={false} />
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <>
          <div className="form-card">
            <h3>Dados do cliente</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nome completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={form.client}
                  onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Profissional</label>
                <select
                  value={form.stylist ?? ''}
                  onChange={e => setForm(f => ({ ...f, stylist: +e.target.value || null }))}
                >
                  <option value="">Sem preferência</option>
                  {STYLISTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={step1Next}>
              Continuar →
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <>
          <div className="form-card">
            <h3>Escolha o serviço</h3>
            <div className="procedures-grid">
              {PROCEDURES.map(p => (
                <div
                  key={p.id}
                  className={`proc-card ${form.procedure === p.id ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, procedure: p.id }))}
                >
                  <span className="proc-icon">{p.icon}</span>
                  <div className="proc-name">{p.name}</div>
                  <div className="proc-info">{p.duration} min</div>
                  <div className="proc-price">{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-ghost btn-lg" onClick={prevStep}>← Voltar</button>
            <button className="btn btn-primary btn-lg" onClick={step2Next}>Continuar →</button>
          </div>
        </>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <>
          <div className="form-card">
            <h3>Data &amp; Horário</h3>
            <div className="form-row">
              <Calendar
                selectedDate={form.date}
                busyDates={busyDates}
                onChange={d => setForm(f => ({ ...f, date: d, time: null }))}
              />
              <TimeSlots
                selectedDate={form.date}
                selectedTime={form.time}
                occupiedSlots={occupiedSlots}
                onChange={t => setForm(f => ({ ...f, time: t }))}
              />
            </div>
          </div>

          {showSummary && (
            <div className="booking-summary">
              <h3>Resumo da reserva</h3>
              {[
                { label: 'Cliente',     value: form.client },
                { label: 'Serviço',     value: `${proc?.icon} ${proc?.name}` },
                { label: 'Profissional',value: stylist?.name ?? 'Sem preferência' },
                { label: 'Data',        value: formatDateDisplay(form.date) },
                { label: 'Horário',     value: form.time },
                { label: 'Duração',     value: `${proc?.duration} min` },
              ].map(row => (
                <div key={row.label} className="summary-row">
                  <span className="summary-label">{row.label}</span>
                  <span className="summary-value">{row.value}</span>
                </div>
              ))}
              <div className="summary-row">
                <span className="summary-label" style={{ color: 'var(--ivory)' }}>Total</span>
                <span className="summary-price">{formatPrice(proc?.price ?? 0)}</span>
              </div>
            </div>
          )}

          <div className="booking-actions">
            <button className="btn btn-ghost btn-lg" onClick={prevStep}>← Voltar</button>
            <button className="btn btn-success btn-lg" onClick={submit}>
              Confirmar reserva
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Step({ num, label, active, done }) {
  const cls = ['step', active && 'active', done && 'done'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="step-number">{done ? '✓' : num}</div>
      <div className="step-label">{label}</div>
    </div>
  );
}
