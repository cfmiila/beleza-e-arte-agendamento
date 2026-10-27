import { useAppContext } from '../context/AppContext';
import { getProcedure, getStylist, formatDateDisplay, formatPrice } from '../data';

export default function ConfirmationPage({ appt, onGoHome, onToast }) {
  const { confirmAppointment } = useAppContext();

  if (!appt) return null;

  const proc    = getProcedure(appt.procedure);
  const stylist = getStylist(appt.stylist);

  function handleConfirm() {
    confirmAppointment(appt.id);
    onToast({ message: 'Agendamento confirmado com sucesso', type: 'success' });
    onGoHome();
  }

  return (
    <div className="confirm-container">
      <div className="confirm-icon-wrap">✦</div>

      <h2>Reserva <span>confirmada</span></h2>
      <p>Seu horário foi reservado. Aguarde a confirmação da nossa equipe.</p>

      <div className="confirm-card">
        <div className="confirm-card-header">
          <div className="confirm-proc-icon">{proc?.icon}</div>
          <div>
            <h3>{proc?.name}</h3>
            <p>com {stylist?.name}</p>
          </div>
        </div>

        <div className="confirm-details">
          {[
            { label: 'Cliente',  value: appt.client },
            { label: 'Telefone', value: appt.phone  },
            { label: 'Data',     value: formatDateDisplay(appt.date) },
            { label: 'Horário',  value: appt.time },
            { label: 'Duração',  value: `${proc?.duration} min` },
          ].map(row => (
            <div key={row.label} className="confirm-detail">
              <span className="confirm-detail-label">{row.label}</span>
              <span className="confirm-detail-value">{row.value}</span>
            </div>
          ))}

          <div
            className="confirm-detail"
            style={{ marginTop: '.6rem', borderTop: '1px solid var(--border-light)', paddingTop: '.8rem' }}
          >
            <span className="confirm-detail-label" style={{ fontWeight: 600 }}>Total</span>
            <span className="confirm-price">{formatPrice(proc?.price ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="confirm-note">
        <span style={{ flexShrink: 0 }}>◉</span>
        <span>
          Reserva com status <strong>pendente</strong>. Nossa equipe irá confirmar
          em breve. Em caso de dúvidas, entre em contato pelo WhatsApp.
        </span>
      </div>

      <div className="confirm-actions">
        <button className="btn btn-success btn-lg" onClick={handleConfirm}>
          Confirmar e abrir agenda
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onGoHome}>
          Ver todos os agendamentos
        </button>
      </div>
    </div>
  );
}
