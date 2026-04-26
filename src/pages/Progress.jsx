import { useApp } from '../AppContext.jsx';
import {
  getNewWords,
  getReviewing,
  getLearned,
  getMistakes,
  getBacklog,
  totalCompletedReviews,
} from '../utils/progress.js';
import { currentStreak, longestStreak, lastNDays } from '../utils/streak.js';
import ProgressCard from '../components/ProgressCard.jsx';

export default function Progress() {
  const { words, streak } = useApp();

  const total = words.length;
  const newCount = getNewWords(words).length;
  const reviewing = getReviewing(words).length;
  const learned = getLearned(words).length;
  const mistakes = getMistakes(words).length;
  const backlog = getBacklog(words).length;
  const completedReviews = totalCompletedReviews(words);

  const learnedPercent = total > 0 ? Math.round((learned / total) * 100) : 0;

  const days = lastNDays(streak, 14);
  const maxActivity = Math.max(1, ...days.map((d) => d.total));
  const cur = currentStreak(streak);
  const max = longestStreak(streak);

  return (
    <div className="page">
      <h1 className="page__title">Прогресс</h1>
      <p className="page__subtitle">
        Сухие цифры. Здесь и так всё видно.
      </p>

      <section className="streak-chart">
        <div className="streak-chart__head">
          <div className="streak-chart__title">Активность · 14 дней</div>
          <div className="streak-chart__count">
            серия: <strong>{cur}</strong> · рекорд: <strong>{max}</strong>
          </div>
        </div>
        <div className="streak-chart__bars">
          {days.map((d) => {
            const heightPercent = (d.total / maxActivity) * 100;
            const isEmpty = d.total === 0;
            return (
              <div key={d.date} className="streak-chart__bar-wrap" title={`${d.date}: ${d.total}`}>
                <div
                  className={'streak-chart__bar' + (isEmpty ? ' streak-chart__bar--empty' : '')}
                  style={{ height: isEmpty ? '4px' : `${Math.max(8, heightPercent)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="streak-chart__legend">
          <span>{days[0].date.slice(5)}</span>
          <span>сегодня</span>
        </div>
      </section>

      <div>
        <div className="progress-headline">
          <span className="progress-headline__label">Выучено</span>
          <span className="progress-headline__value">
            {learned} / {total} · {learnedPercent}%
          </span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${learnedPercent}%` }} />
        </div>
      </div>

      <div className="progress-grid">
        <ProgressCard label="Всего" value={total} />
        <ProgressCard label="Новых" value={newCount} accent="blue" />
        <ProgressCard label="В повторении" value={reviewing} />
        <ProgressCard label="Выученных" value={learned} accent="green" />
        <ProgressCard label="С ошибками" value={mistakes} accent="red" />
        <ProgressCard label="Отложено" value={backlog} accent="grey" />
        <ProgressCard label="Повторений" value={completedReviews} />
        <ProgressCard label="Серия дней" value={cur} accent="green" />
      </div>
    </div>
  );
}
