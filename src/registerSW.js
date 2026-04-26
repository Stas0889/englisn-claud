// Регистрируем service worker только в production-сборке
export function registerSW() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    // Берём относительный путь от текущей страницы — работает на GitHub Pages в подпапке
    const swUrl = new URL('sw.js', document.baseURI).toString();
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('SW register failed:', err);
    });
  });
}
