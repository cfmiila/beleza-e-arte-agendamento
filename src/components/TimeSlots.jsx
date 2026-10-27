import { WORK_HOURS, formatDateDisplay } from '../data';

export default function TimeSlots({ selectedDate, selectedTime, occupiedSlots, onChange }) {
  if (!selectedDate) {
    return <p className="slots-placeholder">Selecione uma data no calendário.</p>;
  }

  return (
    <div>
      <div className="slots-header">
        ⏰ Horários disponíveis
        <span className="slots-date"> — {formatDateDisplay(selectedDate)}</span>
      </div>

      <div className="time-slots">
        {WORK_HOURS.map(t => {
          const isOccupied = occupiedSlots.includes(t);
          const isSelected = t === selectedTime;
          const cls = ['time-slot', isOccupied && 'occupied', isSelected && 'selected']
            .filter(Boolean).join(' ');
          return (
            <div key={t} className={cls} onClick={() => !isOccupied && onChange(t)}>
              {t}
            </div>
          );
        })}
      </div>

      <div className="time-legend">
        <div><span className="legend-dot" style={{ background: 'var(--pink)' }} /> Disponível</div>
        <div><span className="legend-dot" style={{ background: '#d1d5db' }} /> Ocupado</div>
      </div>
    </div>
  );
}
