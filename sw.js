const CACHE = 'josette-avignon-v5';
const ASSETS = [
  '/', '/index.html',
  '/spectacle.html', '/josette.html', '/jean.html',
  '/naissance.html', '/livre.html', '/galerie.html', '/infos.html',
  '/css/style.css', '/js/main.js', '/manifest.json',
  '/images/josette-jean-sommer.jpg', '/images/la-reparation-couverture.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (sameOrigin) {
    // Réseau d'abord : toujours la dernière version quand on est en ligne,
    // cache en secours hors-ligne. Évite tout problème de fichier périmé.
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
  } else {
    // Ressources externes (polices, icônes CDN) : cache d'abord, réseau ensuite
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
