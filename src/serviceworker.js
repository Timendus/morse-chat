// This awesomeness runs in the background of the website and can act
// as a proxy, manipulating requests. Combined with a cache, our app
// can work offline.

const DEBUG = true;

// We want to cache the root path (the HTML) plus the compiled assets
const assetsToCache = [...global.serviceWorkerOption.assets, './'].map(path => {
  return new URL(path, global.location).toString()
});

const CACHE_KEY = 'morse-chat-v0.1';

// Called when the SW is being installed (time to prefill cache)
self.addEventListener('install', event => {
  log("Installing your Service Worker Magic");

  event.waitUntil(caches.open(CACHE_KEY).then(cache => {
    cache.addAll(assetsToCache);
  }));
});

// Called when the SW is started (time to remove outdated stuff)
self.addEventListener('activate', event => {
  log("Activated!");

  // Nothing to do here yet
});

// Called when the browser makes a request (where the magic happens)
self.addEventListener('fetch', event => {
  log(event.request.method + ": " + event.request.url);

  // Respond with cached data or pass through
  event.respondWith(loadResource(event.request));

  // If this is a cache hit, attept to refresh the cache
  event.waitUntil(refreshCache(event.request));
});

function loadResource(request) {
  return cached(request, {
    hit: response => {
      log("Cache hit! Serve from cache");
      return response;
    },
    miss: () => {
      log("Cache miss, just pass through");
      return fetch(request);
    }
  });
}

function refreshCache(request) {
  return cached(request, {
    hit: (response, cache) => {
      log("Item is in cache, attempt a cache refresh");
      fetch(request).then(newResponse => {
        // Store the new result
        cache.put(request, newResponse.clone());

        // If the new result body unequals the old one, we've got an update
        response.text().then(responseText => {
          newResponse.text().then(newResponseText => {
            if (responseText != newResponseText) {
              log(`Cache updated with new version of ${request.url}!`);
              notifyBrowser();
            } else {
              log("Cache was already up to date");
            }
          });
        });
      });
    },
    miss: () => {
      log("Item is not in cache. DON'T put it there, because it's not part of our app");
      // Do nothing
    }
  });
}

function notifyBrowser() {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ action: 'new_version' });
    })
  });
}

// Make use of the cache a little easier on the eyes for us
function cached(request, {hit, miss}) {
  return caches.open(CACHE_KEY).then(cache => {
    return cache.match(request).then(response => {
      if (response) {
        return hit(response, cache);
      } else {
        return miss(cache);
      }
    });
  });
}

// So we can easily disable debug output
function log(thing) {
  if ( DEBUG ) {
    console.log(thing);
  }
}
