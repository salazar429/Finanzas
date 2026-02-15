const CACHE_NAME = 'finanzas-pwa-v1';
const urlsToCache = [
  '/Finanzas/',
  '/Finanzas/index.html',
  '/Finanzas/manifest.json',
  '/Finanzas/icons/icon-72x72.png',
  '/Finanzas/icons/icon-96x96.png',
  '/Finanzas/icons/icon-128x128.png',
  '/Finanzas/icons/icon-144x144.png',
  '/Finanzas/icons/icon-152x152.png',
  '/Finanzas/icons/icon-192x192.png',
  '/Finanzas/icons/icon-384x384.png',
  '/Finanzas/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  console.log('✅ Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('✅ Service Worker activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
