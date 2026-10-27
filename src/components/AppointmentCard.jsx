import { getProcedure, getStylist, friendlyDate, formatPrice } from '../data';

const AVATAR_COLORS = [
  '#c9a84c', '#8b7355', '#a0845c', '#b8975a', '#d4a853',
];
const AVATAR_BG = [
  'rgba(201,168,76,.25)',
  'rgba(139,115,85,.25)',
  'rgba(160,132,92,.25)',
  'rgba(184,151,90,.25)',
  'rgba(212,168,83,.25)',
];

const BADGE = {
  confirmed: { cls: 'badge-confirmed', label: 'Confirmado' },
  pending:   { cls: 'badge-pending',   label: 'Pendente'   },
  cancelled: { cls: 'badge-cancelled', label: 'Cancelado'  },
};

export default function AppointmentCard({ appt, onConfirm, onCancel }) {
  const proc    = getProcedure(appt.procedure);
  const stylist = getStylist(appt.stylist);
  const badge   = BADGE[appt.status];
  const initials = appt.client
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const ci = appt.id % AVATAR_COLORS.length;

  return (
    <div className="appt-card">
      <div className="appt-card-bar" />

      {/* Header */}
      <div className="appt-header">
        <div className="appt-client">
          <div
            className="avatar"
            style={{ background: AVATAR_BG[ci], color: AVATAR_COLORS[ci] }}
          >
            {initials}
          </div>
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
          <span className="detail-icon">◈</span>
          <span>{stylist?.name ?? 'Qualquer profissional'}</span>
        </div>
        <div className="appt-detail">
          <span className="detail-icon">◷</span>
          <span>{friendlyDate(appt.date)} · <strong>{appt.time}</strong></span>
        </div>
        <div className="appt-detail">
          <span className="detail-icon">◐</span>
          <span>
            {proc?.duration} min
            &nbsp;&nbsp;
            <span className="value-gold">{formatPrice(proc?.price ?? 0)}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="appt-footer">
        {appt.status === 'pending' && (
          <button className="btn btn-success btn-sm" onClick={() => onConfirm(appt.id)}>
            Confirmar
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => onCancel(appt.id)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
