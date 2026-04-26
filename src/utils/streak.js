// Стрик: считаем подряд идущие дни, в которые что-то изучали или повторяли
// История хранится как { dates: ["2026-04-25", ...], byDay: { "2026-04-25": { learned: 5, reviewed: 3 } } }

import { todayISO, addDaysISO } from './dates.js';

export const EMPTY_STREAK = {
  dates: [],
  byDay: {},
};

// Зафиксировать активность (учёт learned/reviewed по дню)
export function recordActivity(streak, type) {
  const today = todayISO();
  const dates = streak.dates.includes(today) ? streak.dates : [...streak.dates, today];
  const dayKey = today;
  const day = streak.byDay[dayKey] || { learned: 0, reviewed: 0 };

  return {
    dates,
    byDay: {
      ...streak.byDay,
      [dayKey]: {
        ...day,
        learned: type === 'learned' ? day.learned + 1 : day.learned,
        reviewed: type === 'reviewed' ? day.reviewed + 1 : day.reviewed,
      },
    },
  };
}

// Посчитать текущий стрик (подряд идущие дни до сегодня включительно или до вчера)
export function currentStreak(streak) {
  if (!streak.dates || streak.dates.length === 0) return 0;
  const set = new Set(streak.dates);
  const today = todayISO();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  // Если сегодня ещё ничего не делали, но вчера было — стрик ещё жив
  let cursor;
  if (set.has(today)) cursor = today;
  else if (set.has(yesterday)) cursor = yesterday;
  else return 0;

  let count = 0;
  while (set.has(cursor)) {
    count += 1;
    // отнимаем день
    const d = new Date(cursor + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    cursor = `${y}-${m}-${day}`;
  }
  return count;
}

// Получить активность последних N дней (для мини-графика)
export function lastNDays(streak, n = 14) {
  const result = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = addDaysISO(-i);
    const day = streak.byDay[d];
    result.push({
      date: d,
      learned: day?.learned || 0,
      reviewed: day?.reviewed || 0,
      total: (day?.learned || 0) + (day?.reviewed || 0),
    });
  }
  return result;
}

// Длиннейший стрик в истории
export function longestStreak(streak) {
  if (!streak.dates || streak.dates.length === 0) return 0;
  const sorted = [...streak.dates].sort();
  let max = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const next = new Date(sorted[i] + 'T00:00:00');
    const diff = Math.round((next - prev) / 86400000);
    if (diff === 1) {
      cur += 1;
      if (cur > max) max = cur;
    } else {
      cur = 1;
    }
  }
  return max;
}
