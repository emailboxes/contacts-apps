self.addEventListener('install', e => {
  e.waitUntil(caches.open('contacts-cache').then(cache => cache.addAll(['./', './index.html'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});
