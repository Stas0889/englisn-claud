import { NavLink } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { currentStreak } from '../utils/streak.js';

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/learn', label: 'Учить' },
  { to: '/review', label: 'Повтор' },
  { to: '/dictionary', label: 'Словарь' },
  { to: '/mistakes', label: 'Ошибки' },
  { to: '/grammar', label: 'Грамматика' },
  { to: '/progress', label: 'Прогресс' },
  { to: '/settings', label: 'Настройки' },
];

export default function Header() {
  const { streak } = useApp();
  const days = currentStreak(streak);

  return (
    <header className="header">
      <div className="header__inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <NavLink to="/" className="header__logo">
            <span className="header__logo-mark" aria-hidden="true"></span>
            English Flow
          </NavLink>
          {days > 0 && (
            <span className="header__streak" title="Текущая серия дней">
              <span className="header__streak-flame" aria-hidden="true">●</span>
              {days} {pluralDays(days)}
            </span>
          )}
        </div>
        <nav className="header__nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'header__link' + (isActive ? ' is-active' : '')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня';
  return 'дней';
}
