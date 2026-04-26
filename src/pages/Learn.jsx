import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { pickNewWordsForToday } from '../utils/progress.js';
import { applyKnow, applyHard, applyForgot, applyBacklog } from '../utils/srs.js';
import WordCard from '../components/WordCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Learn() {
  const { words, settings, daily, updateWord, setTodayNewWordIds } = useApp();
  const [index, setIndex] = useState(0);

  // Берём слова сегодняшней сессии. Если в daily уже есть зафиксированные id —
  // показываем их, чтобы при обновлении страницы не "слетал" список
  const todayWords = useMemo(() => {
    if (daily.newWordsPausedToday) return [];

    if (Array.isArray(daily.newWordIdsToday) && daily.newWordIdsToday.length > 0) {
      const fromDaily = daily.newWordIdsToday
        .map((id) => words.find((w) => w.id === id))
        .filter(Boolean)
        .filter((w) => w.status === 'new'); // если уже отметили — не показываем повторно
      if (fromDaily.length > 0) return fromDaily;
    }

    return pickNewWordsForToday(
      words,
      settings.newWordsPerDay,
      settings.activeCategories,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily.newWordIdsToday, daily.newWordsPausedToday]);

  // Сохраняем выбор слов в daily, чтобы он был стабильным в течение дня
  useEffect(() => {
    if (
      !daily.newWordsPausedToday &&
      todayWords.length > 0 &&
      (!daily.newWordIdsToday || daily.newWordIdsToday.length === 0)
    ) {
      setTodayNewWordIds(todayWords.map((w) => w.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (daily.newWordsPausedToday) {
    return (
      <div className="page">
        <h1 className="page__title">Новые слова</h1>
        <EmptyState
          title="Сегодня без новых слов"
          description="Ты включил паузу. Завтра снова появятся новые. А пока можно повторить старые."
          action={{ to: '/review', label: 'Повторить слова' }}
        />
      </div>
    );
  }

  if (todayWords.length === 0) {
    return (
      <div className="page">
        <h1 className="page__title">Новые слова</h1>
        <EmptyState
          title="На сегодня всё"
          description="Ты выучил новые слова на сегодня. Можно повторить старые — это закрепит результат."
          action={{ to: '/review', label: 'Повторить слова' }}
        />
      </div>
    );
  }

  if (index >= todayWords.length) {
    return (
      <div className="page">
        <h1 className="page__title">Новые слова</h1>
        <EmptyState
          title="Готово!"
          description={`Сегодня ты прошёл ${todayWords.length} новых слов. Молодец.`}
          action={{ to: '/', label: 'На главную' }}
        />
      </div>
    );
  }

  const current = todayWords[index];

  const handle = (action) => {
    updateWord(current.id, (w) => action(w));
    setIndex((i) => i + 1);
  };

  return (
    <div className="page">
      <h1 className="page__title">Новые слова</h1>
      <div className="page__counter">
        {index + 1} / {todayWords.length}
      </div>

      <WordCard
        word={current}
        accent={settings.voiceAccent}
        onKnow={() => handle(applyKnow)}
        onHard={() => handle(applyHard)}
        onForgot={() => handle(applyForgot)}
        onBacklog={() => handle(applyBacklog)}
      />
    </div>
  );
}
