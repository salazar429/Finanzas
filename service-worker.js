const CACHE_NAME = 'finanzas-v1';
const ARCHIVOS = [
  '/Finanzas/',
  '/Finanzas/index.html',
  '/Finanzas/manifest.json',
  '/Finanzas/icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
