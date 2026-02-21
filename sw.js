const CACHE_NAME = 'turnos-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css', // Asegúrate de que estos nombres coincidan con tus archivos
  '/script.js',
  '/icon-192.png'
];

// Instalación: Guarda los archivos en la memoria del móvil
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Estrategia: Cargar desde la memoria si no hay internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});