const CACHE_NAME = 'finanzas-v1';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/Finanzas/', '/Finanzas/index.html', '/Finanzas/manifest.json']))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
