// Service worker ThermoPro — cache l'appli (HTML/JS/CSS) pour qu'elle continue
// de s'ouvrir même sans réseau du tout (les données, elles, sont gérées séparément
// par le cache local de Firestore — voir src/App.jsx).
//
// Stratégie : "réseau d'abord, cache en secours". Si le réseau répond, on sert
// la version fraîche et on met le cache à jour. Si le réseau est absent, on sert
// la dernière version connue en cache. Ainsi Pierre a toujours la version la plus
// récente quand il a du réseau, et une version fonctionnelle sinon.

const CACHE_NAME = "thermopro-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne met en cache que les requêtes GET du même site (jamais les appels
  // Firebase/API externes, qui doivent suivre leur propre logique réseau/cache).
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/index.html"))
      )
  );
});
