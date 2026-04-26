import { useState, useEffect } from 'react';
import AudioButton from './AudioButton.jsx';

export default function ReviewCard({ word, accent, onKnow, onHard, onForgot }) {
  const [revealed, setRevealed] = useState(false);

  // Сбрасываем "показать ответ" при смене слова
  useEffect(() => {
    setRevealed(false);
  }, [word.id]);

  return (
    <article className="review-card">
      <div className="review-card__image" aria-hidden="true">
        {word.image || '🔤'}
      </div>

      <h2 className="review-card__word">
        {word.word}{' '}
        <AudioButton text={word.audioText || word.word} accent={accent} />
      </h2>
      <div className="review-card__transcription">{word.transcription}</div>

      {!revealed ? (
        <button className="btn btn--primary btn--big" onClick={() => setRevealed(true)}>
          Показать ответ
        </button>
      ) : (
        <>
          <div className="review-card__translation">{word.translation}</div>

          <div className="review-card__block">
            <div className="review-card__label">Пример</div>
            <div>{word.example}</div>
            <div className="review-card__muted">{word.exampleTranslation}</div>
          </div>

          <div className="review-card__block">
            <div className="review-card__label">Рабочий пример</div>
            <div>{word.workExample}</div>
            <div className="review-card__muted">{word.workExampleTranslation}</div>
          </div>

          {word.mnemonic && (
            <div className="review-card__block">
              <div className="review-card__label">Мнемотехника</div>
              <div>{word.mnemonic}</div>
            </div>
          )}

          <div className="word-card__actions">
            <button className="btn btn--green" onClick={onKnow}>Знаю</button>
            <button className="btn btn--yellow" onClick={onHard}>Сложно</button>
            <button className="btn btn--red" onClick={onForgot}>Не помню</button>
          </div>
        </>
      )}
    </article>
  );
}
