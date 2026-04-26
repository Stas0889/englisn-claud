import AudioButton from './AudioButton.jsx';

export default function WordCard({ word, accent, onKnow, onHard, onForgot, onBacklog }) {
  return (
    <article className="word-card">
      <div className="word-card__top">
        <div className="word-card__image" aria-hidden="true">
          {word.image || '🔤'}
        </div>
        <div className="word-card__head">
          <h2 className="word-card__word">{word.word}</h2>
          <div className="word-card__transcription">{word.transcription}</div>
          <AudioButton text={word.audioText || word.word} accent={accent} />
        </div>
      </div>

      <div className="word-card__translation">{word.translation}</div>

      <div className="word-card__block">
        <div className="word-card__label">Простой пример</div>
        <div className="word-card__example">
          {word.example}{' '}
          <AudioButton text={word.example} accent={accent} size="sm" />
        </div>
        <div className="word-card__example-tr">{word.exampleTranslation}</div>
      </div>

      <div className="word-card__block">
        <div className="word-card__label">Рабочий пример</div>
        <div className="word-card__example">
          {word.workExample}{' '}
          <AudioButton text={word.workExample} accent={accent} size="sm" />
        </div>
        <div className="word-card__example-tr">{word.workExampleTranslation}</div>
      </div>

      {word.mnemonic && (
        <div className="word-card__block word-card__block--mnemo">
          <div className="word-card__label">Мнемотехника</div>
          <div>{word.mnemonic}</div>
        </div>
      )}

      <div className="word-card__actions">
        <button className="btn btn--green" onClick={onKnow}>Знаю</button>
        <button className="btn btn--yellow" onClick={onHard}>Сложно</button>
        <button className="btn btn--red" onClick={onForgot}>Не помню</button>
        <button className="btn btn--ghost" onClick={onBacklog}>Отложить</button>
      </div>
    </article>
  );
}
