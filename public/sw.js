// Service worker for PWA offline capability
const CACHE_NAME = 'itqan-v1';
const assets = ['/', '/index.html', '/src/main.tsx', '/src/index.css'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
