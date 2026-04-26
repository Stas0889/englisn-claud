// English Flow service worker
// Стратегия: app shell precache + cache-first для assets, network-first для index.html

const CACHE_VERSION = 'ef-v1';
const CACHE_NAME = `${CACHE_VERSION}-static`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(CACHE_VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Не кэшируем не-GET и cross-origin (например, голосовые движки браузера)
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // index.html и навигации — network-first (чтобы получать обновления)
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('./index.html'))),
    );
    return;
  }

  // Хешированные assets — cache-first, на промах кладём в кэш
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok && (res.type === 'basic' || res.type === 'default')) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    }),
  );
});

// Сообщение от приложения для немедленного обновления
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
