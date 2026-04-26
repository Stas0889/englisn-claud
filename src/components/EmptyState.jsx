import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">🌿</div>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__desc">{description}</p>}
      {action && (
        <Link to={action.to} className="btn btn--primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}
