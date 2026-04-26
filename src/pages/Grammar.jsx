import { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { GRAMMAR_LESSONS } from '../data/grammarLessons.js';

function LessonExercise({ lesson, savedResult, onComplete }) {
  const [answer, setAnswer] = useState(savedResult?.lastAnswer || '');
  const [submitted, setSubmitted] = useState(!!savedResult);

  const isCorrect = answer === lesson.exercise.correctAnswer;

  const handleSubmit = () => {
    if (!answer) return;
    setSubmitted(true);
    onComplete(answer === lesson.exercise.correctAnswer, answer);
  };

  const handleReset = () => {
    setAnswer('');
    setSubmitted(false);
  };

  return (
    <div className="exercise">
      <div className="exercise__question">{lesson.exercise.question}</div>
      <div className="exercise__options">
        {lesson.exercise.options.map((opt) => {
          const isSelected = answer === opt;
          const isRight = submitted && opt === lesson.exercise.correctAnswer;
          const isWrong = submitted && isSelected && !isCorrect;
          return (
            <button
              key={opt}
              className={
                'option' +
                (isSelected ? ' is-selected' : '') +
                (isRight ? ' is-correct' : '') +
                (isWrong ? ' is-wrong' : '')
              }
              onClick={() => !submitted && setAnswer(opt)}
              disabled={submitted}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          className="btn btn--primary"
          onClick={handleSubmit}
          disabled={!answer}
        >
          Проверить
        </button>
      ) : (
        <div className="exercise__result">
          {isCorrect ? (
            <div className="exercise__correct">✅ Правильно!</div>
          ) : (
            <div className="exercise__wrong">
              ❌ Не совсем. Правильный ответ:{' '}
              <strong>{lesson.exercise.correctAnswer}</strong>
            </div>
          )}
          <button className="btn btn--ghost btn--small" onClick={handleReset}>
            Попробовать ещё раз
          </button>
        </div>
      )}
    </div>
  );
}

export default function Grammar() {
  const { grammar, setGrammarLessonResult, settings } = useApp();

  if (!settings.grammarEnabled) {
    return (
      <div className="page">
        <h1 className="page__title">Грамматика</h1>
        <p className="page__subtitle">
          Раздел отключён в настройках. Включи, чтобы видеть уроки.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page__title">Грамматика A1</h1>
      <p className="page__subtitle">Базовые темы для уверенного старта.</p>

      <div className="lessons">
        {GRAMMAR_LESSONS.map((lesson) => {
          const result = grammar[lesson.id];
          return (
            <article key={lesson.id} className="lesson">
              <div className="lesson__head">
                <h2 className="lesson__title">{lesson.title}</h2>
                <span className="lesson__level">{lesson.level}</span>
                {result?.completed && (
                  <span className="lesson__badge">пройдено</span>
                )}
              </div>
              <p className="lesson__desc">{lesson.description}</p>

              <div className="lesson__examples">
                <div className="lesson__label">Примеры</div>
                <ul>
                  {lesson.examples.map((ex, i) => (
                    <li key={i}>
                      <span className="lesson__en">{ex.en}</span>
                      <span className="lesson__ru"> — {ex.ru}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lesson__exercise">
                <div className="lesson__label">Упражнение</div>
                <LessonExercise
                  lesson={lesson}
                  savedResult={result}
                  onComplete={(correct, lastAnswer) =>
                    setGrammarLessonResult(lesson.id, correct, lastAnswer)
                  }
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
