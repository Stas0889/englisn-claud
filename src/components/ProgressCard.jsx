export default function ProgressCard({ label, value, accent }) {
  return (
    <div className={'progress-card' + (accent ? ` progress-card--${accent}` : '')}>
      <div className="progress-card__value">{value}</div>
      <div className="progress-card__label">{label}</div>
    </div>
  );
}
