import { useApp } from '../AppContext.jsx';
import { getMistakes } from '../utils/progress.js';
import { applyReviewNow } from '../utils/srs.js';
import { humanDate } from '../utils/dates.js';
import AudioButton from '../components/AudioButton.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Mistakes() {
  const { words, settings, updateWord } = useApp();
  const mistakes = getMistakes(words);

  if (mistakes.length === 0) {
    return (
      <div className="page">
        <h1 className="page__title">Ошибки</h1>
        <EmptyState
          title="Чисто"
          description="Сейчас нет слов с ошибками. Возможно, ты ещё не делал повторений — или ты молодец."
          action={{ to: '/review', label: 'Перейти к повторению' }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page__title">Ошибки</h1>
      <p className="page__subtitle">
        Слова, в которых ты ошибался — на них стоит сделать акцент.
      </p>

      <ul className="dict-list">
        {mistakes.map((w) => (
          <li key={w.id} className="dict-item">
            <div className="dict-item__main">
              <div className="dict-item__word">
                <span className="dict-item__emoji" aria-hidden="true">
                  {w.image || '🔤'}
                </span>
                <strong>{w.word}</strong>
                <AudioButton
                  text={w.audioText || w.word}
                  accent={settings.voiceAccent}
                  size="sm"
                />
              </div>
              <div className="dict-item__translation">{w.translation}</div>
            </div>
            <div className="dict-item__meta">
              <span className="dict-item__errors">
                ошибок: <strong>{w.errorCount}</strong>
              </span>
              <span className="dict-item__date">
                повтор: {humanDate(w.nextReviewDate)}
              </span>
              <button
                className="btn btn--small btn--primary"
                onClick={() => updateWord(w.id, applyReviewNow)}
              >
                Повторить сейчас
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
