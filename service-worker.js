const CACHE_NAME = 'ict-sweep-tracker-v079-price-api-20260707';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/styles.css?v=0.7.9-price-api-20260707',
  './assets/app.js?v=0.7.9-price-api-20260707'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.pathname.startsWith('/api/')) return;
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});
