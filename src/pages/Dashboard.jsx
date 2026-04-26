import { Link } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import {
  getNewWords,
  getDueForReview,
  pickNewWordsForToday,
} from '../utils/progress.js';
import { PHRASES } from '../data/phrases.js';
import PhraseCard from '../components/PhraseCard.jsx';

const RU_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const RU_WEEKDAYS = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота',
];

function todayHuman() {
  const d = new Date();
  return `${RU_WEEKDAYS[d.getDay()]}, ${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function pickPhraseOfTheDay() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000,
  );
  return PHRASES[dayOfYear % PHRASES.length];
}

export default function Dashboard() {
  const { words, settings, daily, pauseNewWordsToday } = useApp();

  const newWordsAll = getNewWords(words);
  const reviewDue = getDueForReview(words);

  const newToday = daily.newWordsPausedToday
    ? 0
    : pickNewWordsForToday(words, settings.newWordsPerDay, settings.activeCategories).length;

  const phrase = settings.phraseOfTheDay ? pickPhraseOfTheDay() : null;

  return (
    <div className="page">
      <section className="dashboard__hero">
        <div className="dashboard__date">{todayHuman()}</div>
        <h1 className="dashboard__greeting">
          {greeting()}.<br />
          <em>5 слов сегодня —</em>
          <br />
          и через месяц у тебя 150.
        </h1>
      </section>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__num">01 / Новые</div>
          <div className="stat-card__value stat-card__value--accent">{newToday}</div>
          <div className="stat-card__label">слов на сегодня</div>
          <div className="stat-card__hint">
            всего в базе: {newWordsAll.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">02 / Повторение</div>
          <div className="stat-card__value">{reviewDue.length}</div>
          <div className="stat-card__label">
            {reviewDue.length === 0 ? 'ничего не ждёт' : 'слов готовы'}
          </div>
          {daily.newWordsPausedToday && (
            <div className="stat-card__hint">сегодня без новых слов</div>
          )}
        </div>
      </div>

      {phrase && <PhraseCard phrase={phrase} accent={settings.voiceAccent} />}

      <div className="dashboard__actions">
        <Link
          to="/learn"
          className={
            'btn btn--green btn--big' +
            (newToday === 0 ? ' is-disabled' : '')
          }
          aria-disabled={newToday === 0}
          onClick={(e) => newToday === 0 && e.preventDefault()}
        >
          Учить новые слова →
        </Link>
        <Link
          to="/review"
          className={
            'btn btn--secondary btn--big' +
            (reviewDue.length === 0 ? ' is-disabled' : '')
          }
          aria-disabled={reviewDue.length === 0}
          onClick={(e) => reviewDue.length === 0 && e.preventDefault()}
        >
          Повторить слова
        </Link>
        <button
          className="btn btn--ghost btn--big"
          onClick={pauseNewWordsToday}
          disabled={daily.newWordsPausedToday}
        >
          {daily.newWordsPausedToday
            ? 'Пауза включена на сегодня'
            : 'Сегодня без новых слов'}
        </button>
      </div>
    </div>
  );
}
