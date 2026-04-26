import { WORDS_SEED } from '../data/words.js';
import { isDueToday, todayISO } from './dates.js';
import { STATUS } from './srs.js';

// Инициализация прогресса для всех слов из seed
// Поля прогресса добавляются к каждому слову при первой загрузке
export function initWordsProgress() {
  return WORDS_SEED.map((w) => ({
    ...w,
    reviewStage: 0,
    nextReviewDate: null,
    errorCount: 0,
    status: STATUS.NEW,
    completedReviews: 0,
    lastReviewedAt: null,
    createdAt: todayISO(),
  }));
}

// Если в localStorage уже есть прогресс, но в seed добавились новые слова — мерджим
export function syncWithSeed(savedWords) {
  const savedIds = new Set(savedWords.map((w) => w.id));
  const newOnes = WORDS_SEED.filter((w) => !savedIds.has(w.id)).map((w) => ({
    ...w,
    reviewStage: 0,
    nextReviewDate: null,
    errorCount: 0,
    status: STATUS.NEW,
    completedReviews: 0,
    lastReviewedAt: null,
    createdAt: todayISO(),
  }));

  // Также обновляем "статичные" поля у уже существующих слов
  // (на случай если в seed подправили перевод/пример)
  const updatedSaved = savedWords.map((sw) => {
    const seed = WORDS_SEED.find((s) => s.id === sw.id);
    if (!seed) return sw;
    return {
      ...sw,
      word: seed.word,
      translation: seed.translation,
      transcription: seed.transcription,
      audioText: seed.audioText,
      example: seed.example,
      exampleTranslation: seed.exampleTranslation,
      workExample: seed.workExample,
      workExampleTranslation: seed.workExampleTranslation,
      image: seed.image,
      imagePrompt: seed.imagePrompt,
      mnemonic: seed.mnemonic,
      category: seed.category,
      difficulty: seed.difficulty,
    };
  });

  return [...updatedSaved, ...newOnes];
}

// Селекторы

export function getNewWords(words) {
  return words.filter((w) => w.status === STATUS.NEW);
}

export function getDueForReview(words) {
  return words.filter(
    (w) =>
      w.status !== STATUS.NEW &&
      w.status !== STATUS.BACKLOG &&
      w.status !== STATUS.LEARNED &&
      isDueToday(w.nextReviewDate),
  );
}

export function getMistakes(words) {
  return words.filter((w) => (w.errorCount ?? 0) > 0);
}

export function getLearned(words) {
  return words.filter((w) => w.status === STATUS.LEARNED);
}

export function getBacklog(words) {
  return words.filter((w) => w.status === STATUS.BACKLOG);
}

export function getReviewing(words) {
  return words.filter(
    (w) => w.status === STATUS.REVIEWING || w.status === STATUS.MISTAKE,
  );
}

// Считает completedReviews по всем словам
export function totalCompletedReviews(words) {
  return words.reduce((sum, w) => sum + (w.completedReviews ?? 0), 0);
}

// Берём N новых слов из активных категорий
export function pickNewWordsForToday(words, count, activeCategories) {
  const filtered = words.filter(
    (w) =>
      w.status === STATUS.NEW &&
      (!activeCategories?.length || activeCategories.includes(w.category)),
  );
  return filtered.slice(0, count);
}
