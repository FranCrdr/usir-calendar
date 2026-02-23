/// <reference lib="webworker" />

const CACHE_NAME = 'turnos-app-v5';

// No precachear index.html ni /. Así evitamos servir HTML/JS obsoletos tras un deploy (pantalla en blanco).
const PRECACHE_URLS: string[] = [];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar peticiones de nuestro origen
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navegación (documento) y scripts: network-first para evitar pantalla en blanco
  // tras un nuevo deploy (el HTML cacheado apuntaría a assets con hash antiguo).
  if (request.mode === 'navigate' || request.destination === 'script' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          if (response.ok && (request.mode === 'navigate' || request.destination === 'document')) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response('', { status: 503, statusText: 'Offline' })))
    );
    return;
  }

  // Estilos: network-first, fallback a caché para offline
  if (request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Resto (imágenes, fuentes, manifest, etc.): cache-first para offline, sin romper el primer load
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => (cache !== CACHE_NAME ? caches.delete(cache) : Promise.resolve()))
      )
    ).then(() => (self as ServiceWorkerGlobalScope).clients?.claim())
  );
});
