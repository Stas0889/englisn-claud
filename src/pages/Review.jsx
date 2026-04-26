import { useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { getDueForReview } from '../utils/progress.js';
import { applyKnow, applyHard, applyForgot } from '../utils/srs.js';
import ReviewCard from '../components/ReviewCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Review() {
  const { words, settings, updateWord } = useApp();
  const [index, setIndex] = useState(0);

  // Список фиксируется один раз на сессию (на основании текущего state)
  const initialDue = useMemo(() => getDueForReview(words), []);
  // eslint-disable-line react-hooks/exhaustive-deps

  if (initialDue.length === 0) {
    return (
      <div className="page">
        <h1 className="page__title">Повторение</h1>
        <EmptyState
          title="Ничего повторять"
          description="Сейчас нет слов, у которых пришёл срок повторения. Возвращайся позже."
          action={{ to: '/', label: 'На главную' }}
        />
      </div>
    );
  }

  if (index >= initialDue.length) {
    return (
      <div className="page">
        <h1 className="page__title">Повторение</h1>
        <EmptyState
          title="Сессия закончена"
          description={`Ты повторил ${initialDue.length} слов. Молодец.`}
          action={{ to: '/', label: 'На главную' }}
        />
      </div>
    );
  }

  const current = initialDue[index];

  const handle = (action) => {
    updateWord(current.id, (w) => action(w));
    setIndex((i) => i + 1);
  };

  return (
    <div className="page">
      <h1 className="page__title">Повторение</h1>
      <div className="page__counter">
        {index + 1} / {initialDue.length}
      </div>

      <ReviewCard
        word={current}
        accent={settings.voiceAccent}
        onKnow={() => handle(applyKnow)}
        onHard={() => handle(applyHard)}
        onForgot={() => handle(applyForgot)}
      />
    </div>
  );
}
