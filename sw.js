const CACHE_NAME = 'phone-brain-v2';
const ASSETS = ['./', './index.html', './style.css', './script.js', './assistant.js', './storage.js', './speech.js', './device.js', './manifest.json', './sw.js'];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    var urls = ASSETS.map(function (asset) { return new URL(asset, self.registration.scope).toString(); });
    return cache.addAll(urls);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(function (cached) {
    if (cached) return cached;
    return fetch(event.request).then(function (response) {
      if (response.ok && new URL(event.request.url).origin === self.location.origin) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    }).catch(function () {
      if (event.request.mode === 'navigate') return caches.match(new URL('./index.html', self.registration.scope).toString());
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    });
  }));
});