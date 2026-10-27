// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTodayOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function friendlyDate(dateStr) {
  const today    = getTodayOffset(0);
  const tomorrow = getTodayOffset(1);
  if (dateStr === today)    return '📅 Hoje';
  if (dateStr === tomorrow) return '📅 Amanhã';
  return '📅 ' + formatDateDisplay(dateStr);
}

// ─── Static reference data ────────────────────────────────────────────────────

export const PROCEDURES = [
  { id: 1, name: 'Corte Feminino',     duration: 60,  price: 80.00,  icon: '✂️' },
  { id: 2, name: 'Corte Masculino',    duration: 30,  price: 45.00,  icon: '✂️' },
  { id: 3, name: 'Coloração',          duration: 120, price: 180.00, icon: '🎨' },
  { id: 4, name: 'Escova',             duration: 45,  price: 60.00,  icon: '💨' },
  { id: 5, name: 'Manicure',           duration: 45,  price: 40.00,  icon: '💅' },
  { id: 6, name: 'Pedicure',           duration: 60,  price: 50.00,  icon: '🦶' },
  { id: 7, name: 'Sobrancelha',        duration: 30,  price: 30.00,  icon: '👁️' },
  { id: 8, name: 'Hidratação Capilar', duration: 90,  price: 120.00, icon: '💧' },
];

export const STYLISTS = [
  { id: 1, name: 'Ana Paula', avatar: 'AP', color: '#f472b6' },
  { id: 2, name: 'Juliana',   avatar: 'JU', color: '#a78bfa' },
  { id: 3, name: 'Fernanda',  avatar: 'FE', color: '#34d399' },
];

// 09:00 – 18:30 em intervalos de 30 min
export const WORK_HOURS = (() => {
  const slots = [];
  for (let h = 9; h < 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

// ─── Initial fake appointments ────────────────────────────────────────────────

export const INITIAL_APPOINTMENTS = [
  { id: 1, client: 'Mariana Costa',    phone: '(11) 99234-5678', procedure: 1, stylist: 1, date: getTodayOffset(0), time: '09:00', status: 'confirmed' },
  { id: 2, client: 'Beatriz Lima',     phone: '(11) 98765-4321', procedure: 3, stylist: 2, date: getTodayOffset(0), time: '10:00', status: 'confirmed' },
  { id: 3, client: 'Joama Silva',     phone: '(11) 91234-0000', procedure: 2, stylist: 3, date: getTodayOffset(0), time: '11:00', status: 'confirmed' },
  { id: 4, client: 'Patrícia Santos',  phone: '(11) 97000-1111', procedure: 5, stylist: 1, date: getTodayOffset(1), time: '14:00', status: 'pending'   },
  { id: 5, client: 'Fernanda Rocha',   phone: '(11) 96000-2222', procedure: 8, stylist: 2, date: getTodayOffset(1), time: '15:30', status: 'confirmed' },
  { id: 6, client: 'V Andrade',    phone: '(11) 95500-3333', procedure: 2, stylist: 3, date: getTodayOffset(2), time: '09:30', status: 'confirmed' },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getProcedure(id) { return PROCEDURES.find(p => p.id === id); }
export function getStylist(id)   { return STYLISTS.find(s => s.id === id); }

export function getOccupiedSlots(appointments, date) {
  return appointments.filter(a => a.date === date).map(a => a.time);
}

export function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}
