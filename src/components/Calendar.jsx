import { useState, useMemo } from 'react';
import { formatDate } from '../data';

const MONTH_NAMES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export default function Calendar({ selectedDate, busyDates = [], onChange }) {
  const today = formatDate(new Date());

  const [view, setView] = useState(() => {
    const d = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const days = useMemo(() => {
    const { year, month } = view;
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth  = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push(dateStr);
    }
    return cells;
  }, [view]);

  function prev() {
    setView(v => v.month === 0
      ? { year: v.year - 1, month: 11 }
      : { ...v, month: v.month - 1 }
    );
  }
  function next() {
    setView(v => v.month === 11
      ? { year: v.year + 1, month: 0 }
      : { ...v, month: v.month + 1 }
    );
  }

  return (
    <div className="calendar-wrapper">
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prev}>‹</button>
        <h4>{MONTH_NAMES[view.month]} {view.year}</h4>
        <button className="cal-nav-btn" onClick={next}>›</button>
      </div>

      <div className="cal-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}

        {days.map((dateStr, i) => {
          if (!dateStr) return <div key={`e-${i}`} className="cal-day empty" />;

          const isPast     = dateStr < today;
          const isToday    = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasBusy    = busyDates.includes(dateStr);

          const classes = [
            'cal-day',
            isPast     && 'disabled',
            isToday    && 'today',
            isSelected && 'selected',
            hasBusy    && 'has-appts',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={dateStr}
              className={classes}
              onClick={() => !isPast && onChange(dateStr)}
            >
              {new Date(dateStr + 'T12:00:00').getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
