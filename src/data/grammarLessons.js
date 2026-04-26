export const GRAMMAR_LESSONS = [
  {
    id: 'g_001',
    title: 'am / is / are (глагол to be)',
    level: 'A1',
    description:
      'В английском обязательно нужен глагол "быть": I am, he/she/it is, you/we/they are.',
    examples: [
      { en: 'I am a developer.', ru: 'Я разработчик.' },
      { en: 'He is my client.', ru: 'Он мой клиент.' },
      { en: 'We are ready.', ru: 'Мы готовы.' },
      { en: 'The form is broken.', ru: 'Форма сломана.' },
    ],
    exercise: {
      question: 'They ___ designers.',
      options: ['am', 'is', 'are', 'be'],
      correctAnswer: 'are',
    },
  },
  {
    id: 'g_002',
    title: 'do / does (вспомогательный глагол)',
    level: 'A1',
    description:
      'Для I/you/we/they используем "do", для he/she/it — "does". Нужны для вопросов и отрицаний.',
    examples: [
      { en: 'Do you work in Webflow?', ru: 'Ты работаешь в Webflow?' },
      { en: 'Does she have time today?', ru: 'У неё есть время сегодня?' },
      { en: 'I do my best.', ru: 'Я делаю всё, что могу.' },
    ],
    exercise: {
      question: '___ he know about the new design?',
      options: ['Do', 'Does', 'Is', 'Are'],
      correctAnswer: 'Does',
    },
  },
  {
    id: 'g_003',
    title: "don't / doesn't (отрицание)",
    level: 'A1',
    description:
      'Отрицание: I/you/we/they → don’t, he/she/it → doesn’t. После них глагол в начальной форме.',
    examples: [
      { en: 'I do not see the bug.', ru: 'Я не вижу баг.' },
      { en: 'She doesn’t use Figma.', ru: 'Она не использует Figma.' },
      { en: 'We don’t have a deadline yet.', ru: 'У нас пока нет дедлайна.' },
    ],
    exercise: {
      question: 'He ___ work on weekends.',
      options: ["don't", "doesn't", "isn't", "aren't"],
      correctAnswer: "doesn't",
    },
  },
  {
    id: 'g_004',
    title: 'Present Simple — настоящее простое',
    level: 'A1',
    description:
      'Используем для регулярных действий и фактов. С he/she/it добавляем -s к глаголу.',
    examples: [
      { en: 'I work every day.', ru: 'Я работаю каждый день.' },
      { en: 'She publishes the site on Friday.', ru: 'Она публикует сайт в пятницу.' },
      { en: 'We send invoices monthly.', ru: 'Мы отправляем счета ежемесячно.' },
    ],
    exercise: {
      question: 'My client ___ feedback fast.',
      options: ['give', 'gives', 'giving', 'gived'],
      correctAnswer: 'gives',
    },
  },
  {
    id: 'g_005',
    title: 'Простые вопросы',
    level: 'A1',
    description:
      'Чтобы задать вопрос, ставим do/does/am/is/are в начало. Порядок: вспом. глагол + подлежащее + основной глагол.',
    examples: [
      { en: 'Are you ready?', ru: 'Ты готов?' },
      { en: 'Do you have the link?', ru: 'У тебя есть ссылка?' },
      { en: 'Does it work on mobile?', ru: 'Это работает на мобильном?' },
      { en: 'Is the page live?', ru: 'Страница опубликована?' },
    ],
    exercise: {
      question: '___ you see the new design?',
      options: ['Are', 'Is', 'Do', 'Does'],
      correctAnswer: 'Do',
    },
  },
];
