import { getProcedure, getStylist, friendlyDate, formatPrice } from '../data';

const AVATAR_COLORS = ['#f472b6', '#a78bfa', '#34d399', '#fb923c', '#60a5fa'];

const BADGE = {
  confirmed: { cls: 'badge-confirmed', label: 'Confirmado' },
  pending:   { cls: 'badge-pending',   label: 'Pendente'   },
  cancelled: { cls: 'badge-cancelled', label: 'Cancelado'  },
};

export default function AppointmentCard({ appt, onConfirm, onCancel }) {
  const proc    = getProcedure(appt.procedure);
  const stylist = getStylist(appt.stylist);
  const badge   = BADGE[appt.status];
  const initials = appt.client.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const color    = AVATAR_COLORS[appt.id % AVATAR_COLORS.length];

  return (
    <div className="appt-card">
      {/* Header */}
      <div className="appt-header">
        <div className="appt-client">
          <div className="avatar" style={{ background: color }}>{initials}</div>
          <div>
            <div className="appt-client-name">{appt.client}</div>
            <div className="appt-client-phone">{appt.phone}</div>
          </div>
        </div>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
      </div>

      {/* Details */}
      <div className="appt-details">
        <div className="appt-detail">
          <span className="detail-icon">{proc?.icon}</span>
          <strong>{proc?.name}</strong>
        </div>
        <div className="appt-detail">
          <span className="detail-icon">👩‍🎨</span>
          <span>Prof.: <strong>{stylist?.name ?? 'Qualquer'}</strong></span>
        </div>
        <div className="appt-detail">
          <span className="detail-icon">📅</span>
          <span>{friendlyDate(appt.date)} às <strong>{appt.time}</strong></span>
        </div>
        <div className="appt-detail">
          <span className="detail-icon">⌛</span>
          <span>
            {proc?.duration} min &nbsp;·&nbsp;
            <strong style={{ color: 'var(--pink)' }}>{formatPrice(proc?.price ?? 0)}</strong>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="appt-footer">
        {appt.status === 'pending' && (
          <button className="btn btn-success btn-sm" onClick={() => onConfirm(appt.id)}>
            ✅ Confirmar
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => onCancel(appt.id)}>
          🗑️ Cancelar
        </button>
      </div>
    </div>
  );
}
