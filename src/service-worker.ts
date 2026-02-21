/// <reference lib="webworker" />

const CACHE_NAME = 'turnos-app-v4';
// Solo precachear rutas que existen en producción. /src/* no existe en build.
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
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