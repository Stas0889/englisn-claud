import { useRef, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { CATEGORIES } from '../data/words.js';

export default function Settings() {
  const { settings, updateSettings, resetAll, exportData, importData } = useApp();
  const fileRef = useRef(null);
  const [message, setMessage] = useState(null);

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleNumWords = (e) => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v) && v > 0 && v <= 50) {
      updateSettings({ newWordsPerDay: v });
    }
  };

  const handleAccent = (e) => {
    updateSettings({ voiceAccent: e.target.value });
  };

  const toggleCategory = (cat) => {
    const set = new Set(settings.activeCategories);
    if (set.has(cat)) set.delete(cat);
    else set.add(cat);
    updateSettings({ activeCategories: Array.from(set) });
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-flow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash('Файл сохранён');
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const ok = importData(text);
    flash(ok ? 'Импорт успешен' : 'Не удалось импортировать файл');
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
      resetAll();
      flash('Прогресс сброшен');
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">Настройки</h1>

      <section className="setting">
        <label className="setting__label" htmlFor="newWordsPerDay">
          Новых слов в день
        </label>
        <input
          id="newWordsPerDay"
          type="number"
          min="1"
          max="50"
          value={settings.newWordsPerDay}
          onChange={handleNumWords}
          className="setting__input"
        />
      </section>

      <section className="setting">
        <div className="setting__label">Акцент озвучки</div>
        <label className="setting__radio">
          <input
            type="radio"
            name="accent"
            value="en-US"
            checked={settings.voiceAccent === 'en-US'}
            onChange={handleAccent}
          />
          en-US (американский)
        </label>
        <label className="setting__radio">
          <input
            type="radio"
            name="accent"
            value="en-GB"
            checked={settings.voiceAccent === 'en-GB'}
            onChange={handleAccent}
          />
          en-GB (британский)
        </label>
      </section>

      <section className="setting">
        <div className="setting__label">Активные категории</div>
        {CATEGORIES.map((cat) => (
          <label key={cat} className="setting__checkbox">
            <input
              type="checkbox"
              checked={settings.activeCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </section>

      <section className="setting">
        <div className="setting__label">Дополнительно</div>
        <label className="setting__checkbox">
          <input
            type="checkbox"
            checked={settings.phraseOfTheDay}
            onChange={(e) => updateSettings({ phraseOfTheDay: e.target.checked })}
          />
          Показывать фразу дня
        </label>
        <label className="setting__checkbox">
          <input
            type="checkbox"
            checked={settings.grammarEnabled}
            onChange={(e) => updateSettings({ grammarEnabled: e.target.checked })}
          />
          Включить раздел грамматики
        </label>
      </section>

      <section className="setting">
        <div className="setting__label">Данные</div>
        <div className="setting__actions">
          <button className="btn btn--secondary" onClick={handleExport}>
            Экспорт в JSON
          </button>
          <button className="btn btn--secondary" onClick={handleImportClick}>
            Импорт JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
          <button className="btn btn--red" onClick={handleReset}>
            Сбросить весь прогресс
          </button>
        </div>
      </section>

      {message && <div className="setting__flash">{message}</div>}
    </div>
  );
}
