// Форматы дат хранятся как ISO-строки (YYYY-MM-DD) — без времени, чтобы не было путаницы с таймзонами

export function todayISO() {
  const d = new Date();
  return formatDate(d);
}

export function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Сравнение: дата меньше или равна сегодняшней
export function isDueToday(dateISO) {
  if (!dateISO) return false;
  return dateISO <= todayISO();
}

// Красивое отображение: "сегодня", "завтра", "через 3 дня", "23.04.2026"
export function humanDate(dateISO) {
  if (!dateISO) return '—';
  const today = todayISO();
  if (dateISO === today) return 'сегодня';
  if (dateISO === addDaysISO(1)) return 'завтра';
  const [y, m, d] = dateISO.split('-');
  return `${d}.${m}.${y}`;
}
