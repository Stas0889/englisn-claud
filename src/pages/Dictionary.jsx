import { useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { STATUS } from '../utils/srs.js';
import { humanDate } from '../utils/dates.js';
import AudioButton from '../components/AudioButton.jsx';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'reviewing', label: 'В повторении' },
  { id: 'mistake', label: 'Ошибки' },
  { id: 'learned', label: 'Выученные' },
  { id: 'backlog', label: 'Отложенные' },
];

const STATUS_LABEL = {
  [STATUS.NEW]: 'новое',
  [STATUS.REVIEWING]: 'в повторении',
  [STATUS.MISTAKE]: 'ошибка',
  [STATUS.LEARNED]: 'выучено',
  [STATUS.BACKLOG]: 'отложено',
};

export default function Dictionary() {
  const { words, settings } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return words;
    if (filter === 'reviewing') {
      return words.filter(
        (w) => w.status === STATUS.REVIEWING || w.status === STATUS.MISTAKE,
      );
    }
    return words.filter((w) => w.status === filter);
  }, [words, filter]);

  return (
    <div className="page">
      <h1 className="page__title">Словарь</h1>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={'filter' + (filter === f.id ? ' is-active' : '')}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="page__empty">Нет слов в этой категории.</p>
      ) : (
        <ul className="dict-list">
          {filtered.map((w) => (
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
                <span className={`badge badge--${w.status}`}>
                  {STATUS_LABEL[w.status]}
                </span>
                <span className="dict-item__category">{w.category}</span>
                {w.errorCount > 0 && (
                  <span className="dict-item__errors">
                    ошибок: {w.errorCount}
                  </span>
                )}
                {w.nextReviewDate && (
                  <span className="dict-item__date">
                    повтор: {humanDate(w.nextReviewDate)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
