# English Flow

PWA/web-приложение для изучения английского для русскоязычного пользователя уровня A1.
5 новых слов в день, интервальные повторения, озвучка, мнемотехника, грамматика A1.

## Стек

- React 19
- Vite
- React Router (HashRouter — для GitHub Pages)
- localStorage
- Web Speech API
- обычный CSS, без Tailwind, без backend

## Установка

```bash
npm install
```

## Запуск локально

```bash
npm run dev
```

Откроется на `http://localhost:5173`.

## Сборка

```bash
npm run build
```

Готовая статика появится в папке `dist/`.

## Превью production-сборки

```bash
npm run preview
```

## Публикация на GitHub Pages

1. В `package.json` поменяй `homepage` на свой репозиторий:
   ```json
   "homepage": "https://USERNAME.github.io/REPO/"
   ```
2. Закоммить и запушь проект на GitHub.
3. В настройках репозитория включи GitHub Pages с веткой `gh-pages`.
4. Задеплой:
   ```bash
   npm run deploy
   ```

`vite.config.js` использует `base: './'` — это работает и на GitHub Pages, и в любой подпапке. Роутер использует `HashRouter`, поэтому ссылки внутри SPA не зависят от серверной маршрутизации.

## Структура

```
src/
  components/      — компоненты UI
  pages/           — страницы (Dashboard, Learn, Review, Dictionary, Mistakes, Grammar, Progress, Settings)
  data/            — слова, фразы, уроки грамматики
  hooks/           — useLocalStorage, useSpeech
  utils/           — srs.js (логика повторений), dates, progress
  styles/main.css  — стили
  AppContext.jsx   — общий state поверх localStorage
  App.jsx          — роуты
  main.jsx         — entry point
```

## SRS (интервалы повторения)

| Стадия | Интервал |
|---:|:---|
| 0 | сегодня |
| 1 | +1 день |
| 2 | +3 дня |
| 3 | +7 дней |
| 4 | +14 дней |
| 5 | +30 дней |

После последней стадии слово получает статус `learned`.

## localStorage ключи

- `englishFlow_wordsProgress`
- `englishFlow_settings`
- `englishFlow_dailyState`
- `englishFlow_grammarProgress`

В разделе *Настройки* можно экспортировать и импортировать всё это в JSON.
