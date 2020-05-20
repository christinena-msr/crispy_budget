const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/assets/db.js",
    "/dist/bundle.js"
];

const PRE_CACHE = "precache-v1";
const RUNTIME_CACHE = "runtime";

self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(PRE_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
    const currentCaches = [PRE_CACHE, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            // return array of cache names that are old to delete
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
            }));
        })
        .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", function(evt) {
    console.log(evt.request.url);
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
      return;
    }

    evt.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return cache.match(evt.request).then(response => {
            return response || fetch(evt.request);
          });
        })
    );
});