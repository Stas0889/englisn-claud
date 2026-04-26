import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { initWordsProgress, syncWithSeed } from './utils/progress.js';
import { todayISO } from './utils/dates.js';
import { EMPTY_STREAK, recordActivity } from './utils/streak.js';
import { STATUS } from './utils/srs.js';

const STORAGE_KEYS = {
  words: 'englishFlow_wordsProgress',
  settings: 'englishFlow_settings',
  daily: 'englishFlow_dailyState',
  grammar: 'englishFlow_grammarProgress',
  streak: 'englishFlow_streak',
};

const DEFAULT_SETTINGS = {
  newWordsPerDay: 5,
  interfaceLanguage: 'ru',
  voiceAccent: 'en-US',
  phraseOfTheDay: true,
  grammarEnabled: true,
  activeCategories: ['Basic A1', 'Webflow', 'Design', 'Client Communication'],
};

const DEFAULT_DAILY = {
  date: null,
  newWordsPausedToday: false,
  newWordIdsToday: [],
};

const DEFAULT_GRAMMAR = {};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [words, setWords, resetWords] = useLocalStorage(STORAGE_KEYS.words, () =>
    initWordsProgress(),
  );
  const [settings, setSettings, resetSettings] = useLocalStorage(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
  );
  const [daily, setDaily, resetDaily] = useLocalStorage(STORAGE_KEYS.daily, DEFAULT_DAILY);
  const [grammar, setGrammar, resetGrammar] = useLocalStorage(
    STORAGE_KEYS.grammar,
    DEFAULT_GRAMMAR,
  );
  const [streak, setStreak, resetStreak] = useLocalStorage(STORAGE_KEYS.streak, EMPTY_STREAK);

  // Синхронизация со seed при первом запуске после обновлений
  useEffect(() => {
    if (Array.isArray(words) && words.length > 0) {
      const synced = syncWithSeed(words);
      if (synced.length !== words.length) {
        setWords(synced);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Автосброс daily в новый день
  useEffect(() => {
    const today = todayISO();
    if (daily.date !== today) {
      setDaily({
        date: today,
        newWordsPausedToday: false,
        newWordIdsToday: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Универсальное обновление слова с автоматической фиксацией активности
  // type: 'learned' (был new и стал не-new) | 'reviewed' (повторили существующее)
  const updateWord = (id, updater) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const before = w;
        const after = typeof updater === 'function' ? updater(w) : updater;

        // Записываем активность в стрик
        if (before.status === STATUS.NEW && after.status !== STATUS.NEW) {
          // Это первое прохождение (Learn)
          setStreak((s) => recordActivity(s, 'learned'));
        } else if (before.status !== STATUS.NEW) {
          // Это повторение
          setStreak((s) => recordActivity(s, 'reviewed'));
        }

        return after;
      }),
    );
  };

  const pauseNewWordsToday = () => {
    setDaily({ ...daily, newWordsPausedToday: true, date: todayISO() });
  };

  const setTodayNewWordIds = (ids) => {
    setDaily({ ...daily, newWordIdsToday: ids, date: todayISO() });
  };

  const updateSettings = (patch) => {
    setSettings({ ...settings, ...patch });
  };

  const setGrammarLessonResult = (lessonId, completed, lastAnswer) => {
    setGrammar({ ...grammar, [lessonId]: { completed, lastAnswer } });
  };

  const resetAll = () => {
    resetWords();
    resetSettings();
    resetDaily();
    resetGrammar();
    resetStreak();
  };

  const exportData = () => {
    return JSON.stringify(
      {
        version: 2,
        exportedAt: new Date().toISOString(),
        words,
        settings,
        daily,
        grammar,
        streak,
      },
      null,
      2,
    );
  };

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.words) setWords(data.words);
      if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      if (data.daily) setDaily(data.daily);
      if (data.grammar) setGrammar(data.grammar);
      if (data.streak) setStreak(data.streak);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      words,
      setWords,
      updateWord,
      settings,
      updateSettings,
      daily,
      pauseNewWordsToday,
      setTodayNewWordIds,
      grammar,
      setGrammarLessonResult,
      streak,
      resetAll,
      exportData,
      importData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [words, settings, daily, grammar, streak],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
