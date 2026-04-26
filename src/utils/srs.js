import { addDaysISO, todayISO } from './dates.js';

// Интервалы повторений (в днях от сегодня)
export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30];
// stage 0 — сегодня
// stage 1 — через 1 день
// stage 2 — через 3 дня
// stage 3 — через 7 дней
// stage 4 — через 14 дней
// stage 5 — через 30 дней
// после stage 5 → learned

export const STATUS = {
  NEW: 'new',
  REVIEWING: 'reviewing',
  MISTAKE: 'mistake',
  LEARNED: 'learned',
  BACKLOG: 'backlog',
};

// Кнопка "Знаю"
export function applyKnow(word) {
  const nextStage = (word.reviewStage ?? 0) + 1;
  const completedReviews = (word.completedReviews ?? 0) + 1;

  if (nextStage > SRS_INTERVALS.length - 1) {
    return {
      ...word,
      reviewStage: SRS_INTERVALS.length - 1,
      nextReviewDate: addDaysISO(SRS_INTERVALS[SRS_INTERVALS.length - 1]),
      status: STATUS.LEARNED,
      completedReviews,
      lastReviewedAt: todayISO(),
    };
  }

  return {
    ...word,
    reviewStage: nextStage,
    nextReviewDate: addDaysISO(SRS_INTERVALS[nextStage]),
    status: STATUS.REVIEWING,
    completedReviews,
    lastReviewedAt: todayISO(),
  };
}

// Кнопка "Сложно"
export function applyHard(word) {
  return {
    ...word,
    errorCount: (word.errorCount ?? 0) + 1,
    nextReviewDate: addDaysISO(1),
    status: STATUS.MISTAKE,
    lastReviewedAt: todayISO(),
  };
}

// Кнопка "Не помню"
export function applyForgot(word) {
  return {
    ...word,
    errorCount: (word.errorCount ?? 0) + 1,
    reviewStage: 1,
    nextReviewDate: addDaysISO(1),
    status: STATUS.MISTAKE,
    lastReviewedAt: todayISO(),
  };
}

// Кнопка "Отложить"
export function applyBacklog(word) {
  return {
    ...word,
    status: STATUS.BACKLOG,
    nextReviewDate: null,
    lastReviewedAt: todayISO(),
  };
}

// Кнопка "Повторить сейчас" (из раздела ошибок)
export function applyReviewNow(word) {
  return {
    ...word,
    nextReviewDate: todayISO(),
    status: STATUS.REVIEWING,
  };
}
