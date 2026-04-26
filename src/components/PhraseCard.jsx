import AudioButton from './AudioButton.jsx';

export default function PhraseCard({ phrase, accent }) {
  if (!phrase) return null;
  return (
    <div className="phrase-card">
      <div className="phrase-card__label">Фраза дня</div>
      <div className="phrase-card__phrase">
        {phrase.phrase} <AudioButton text={phrase.audioText || phrase.phrase} accent={accent} />
      </div>
      <div className="phrase-card__translation">{phrase.translation}</div>
      {phrase.explanation && (
        <div className="phrase-card__explanation">{phrase.explanation}</div>
      )}
    </div>
  );
}
