const CACHE_NAME = 'sport-site-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/Picture/Icon.png',
  '/Picture/Medal.png',
  '/Picture/Certificate.png',
  '/Picture/Cup.png',
  '/Picture/icon.png',
];

// Установка: кладём статику в кеш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Активация: удаляем старые кеши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Запросы: сначала кеш, потом сеть
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API не кешируем — пусть идёт в сеть как есть
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (event.request.method === 'GET' && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, copy)
            );
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});