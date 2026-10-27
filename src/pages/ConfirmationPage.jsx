import { useAppContext } from '../context/AppContext';
import { getProcedure, getStylist, formatDateDisplay, formatPrice } from '../data';

export default function ConfirmationPage({ appt, onGoHome, onToast }) {
  const { confirmAppointment } = useAppContext();

  if (!appt) return null;

  const proc    = getProcedure(appt.procedure);
  const stylist = getStylist(appt.stylist);

  function handleConfirm() {
    confirmAppointment(appt.id);
    onToast({ message: '✅ Agendamento confirmado com sucesso!', type: 'success' });
    onGoHome();
  }

  return (
    <div className="confirm-container">
      <div className="confirm-icon-wrap">✅</div>
      <h2>Agendamento <span>realizado!</span></h2>
      <p>Seu horário foi reservado com sucesso. Aguarde a confirmação da equipe.</p>

      <div className="confirm-card">
        <div className="confirm-card-header">
          <div className="proc-icon" style={{ fontSize: '2rem' }}>{proc?.icon}</div>
          <div>
            <h3>{proc?.name}</h3>
            <p>com {stylist?.name}</p>
          </div>
        </div>

        <div className="confirm-details">
          <div className="confirm-detail">
            <span className="confirm-detail-label">👤 Cliente</span>
            <span className="confirm-detail-value">{appt.client}</span>
          </div>
          <div className="confirm-detail">
            <span className="confirm-detail-label">📱 Telefone</span>
            <span className="confirm-detail-value">{appt.phone}</span>
          </div>
          <div className="confirm-detail">
            <span className="confirm-detail-label">📅 Data</span>
            <span className="confirm-detail-value">{formatDateDisplay(appt.date)}</span>
          </div>
          <div className="confirm-detail">
            <span className="confirm-detail-label">⏰ Horário</span>
            <span className="confirm-detail-value">{appt.time}</span>
          </div>
          <div className="confirm-detail">
            <span className="confirm-detail-label">⌛ Duração</span>
            <span className="confirm-detail-value">{proc?.duration} min</span>
          </div>
          <div className="confirm-detail" style={{ marginTop: '.5rem', borderTop: '1px solid var(--border)', paddingTop: '.6rem' }}>
            <span className="confirm-detail-label" style={{ fontWeight: 700 }}>💰 Total</span>
            <span className="confirm-price">{formatPrice(proc?.price ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="confirm-note">
        <span>⚠️</span>
        <span>
          Sua reserva está como <strong>pendente</strong>. Nossa equipe irá confirmar em breve.
          Em caso de dúvidas, entre em contato pelo WhatsApp.
        </span>
      </div>

      <div className="confirm-actions">
        <button className="btn btn-success btn-lg" onClick={handleConfirm}>
          ✅ Confirmar e ir para agenda
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onGoHome}>
          📋 Ver todos os agendamentos
        </button>
      </div>
    </div>
  );
}
