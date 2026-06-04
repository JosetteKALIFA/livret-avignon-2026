const CACHE = 'josette-avignon-static-v1';
const STATIC = [
  '/css/style.css',
  '/js/main.js',
  '/manifest.json',
  '/images/josette-jean-sommer.jpg',
  '/images/la-reparation-couverture.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Les pages HTML : toujours le réseau, jamais le cache
  if (e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Ressources statiques : cache d'abord
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
