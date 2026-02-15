const CACHE_NAME = 'finanzas-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap'
];

// Instalación del Service Worker
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

// Activación del Service Worker
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

// Interceptar peticiones y servir desde caché
self.addEventListener('fetch', event => {
  console.log('🌐 Petición a:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devolver desde caché
        if (response) {
          console.log('✅ Desde caché:', event.request.url);
          return response;
        }

        // Si no está en caché, buscar en red
        console.log('🌐 Desde red:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Verificar si es una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para guardarla en caché
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('❌ Error en fetch:', error);
            // Aquí podrías devolver una página de fallback
          });
      })
  );
});

// Manejar sincronización en segundo plano (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('🔄 Sincronizando datos...');
    // Aquí iría la lógica de sincronización
  }
});
