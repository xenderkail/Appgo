// Force installation and skip waiting for immediate update
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Take control of all open clients immediately & clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => clients.claim())
  );
});

// Network-first strategy with cache fallback to prevent stale Vercel deployments
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
