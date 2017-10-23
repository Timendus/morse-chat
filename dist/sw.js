var serviceWorkerOption = {
  "assets": [
    "/bundle.js"
  ]
};
        
        /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// This awesomeness runs in the background of the website and can act
// as a proxy, manipulating requests. Combined with a cache, our app
// can work offline.

var DEBUG = true;

// We want to cache the root path (the HTML) plus the compiled assets
var assetsToCache = [].concat(_toConsumableArray(global.serviceWorkerOption.assets), ['./']).map(function (path) {
  return new URL(path, global.location).toString();
});

var CACHE_KEY = 'morse-chat-v0.1';

// Called when the SW is being installed (time to prefill cache)
self.addEventListener('install', function (event) {
  log("Installing your Service Worker Magic");

  event.waitUntil(caches.open(CACHE_KEY).then(function (cache) {
    cache.addAll(assetsToCache);
  }));
});

// Called when the SW is started (time to remove outdated stuff)
self.addEventListener('activate', function (event) {
  log("Activated!");

  // Nothing to do here yet
});

// Called when the browser makes a request (where the magic happens)
self.addEventListener('fetch', function (event) {
  log(event.request.method + ": " + event.request.url);

  // Respond with cached data or pass through
  event.respondWith(loadResource(event.request));

  // If this is a cache hit, attept to refresh the cache
  event.waitUntil(refreshCache(event.request));
});

function loadResource(request) {
  return cached(request, {
    hit: function hit(response) {
      log("Cache hit! Serve from cache");
      return response;
    },
    miss: function miss() {
      log("Cache miss, just pass through");
      return fetch(request);
    }
  });
}

function refreshCache(request) {
  return cached(request, {
    hit: function hit(response, cache) {
      log("Item is in cache, attempt a cache refresh");
      fetch(request).then(function (newResponse) {
        // Store the new result
        cache.put(request, newResponse.clone());

        // If the new result body unequals the old one, we've got an update
        response.text().then(function (responseText) {
          newResponse.text().then(function (newResponseText) {
            if (responseText != newResponseText) {
              log('Cache updated with new version of ' + request.url + '!');
              notifyBrowser();
            } else {
              log("Cache was already up to date");
            }
          });
        });
      });
    },
    miss: function miss() {
      log("Item is not in cache. DON'T put it there, because it's not part of our app");
      // Do nothing
    }
  });
}

function notifyBrowser() {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage({ action: 'new_version' });
    });
  });
}

// Make use of the cache a little easier on the eyes for us
function cached(request, _ref) {
  var hit = _ref.hit,
      miss = _ref.miss;

  return caches.open(CACHE_KEY).then(function (cache) {
    return cache.match(request).then(function (response) {
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
  if (DEBUG) {
    console.log(thing);
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzlhY2NjNTAwOWM4YzQ1ZmQxNjciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2V3b3JrZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyJdLCJuYW1lcyI6WyJERUJVRyIsImFzc2V0c1RvQ2FjaGUiLCJnbG9iYWwiLCJzZXJ2aWNlV29ya2VyT3B0aW9uIiwiYXNzZXRzIiwibWFwIiwiVVJMIiwicGF0aCIsImxvY2F0aW9uIiwidG9TdHJpbmciLCJDQUNIRV9LRVkiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImxvZyIsImV2ZW50Iiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsImFkZEFsbCIsInJlcXVlc3QiLCJtZXRob2QiLCJ1cmwiLCJyZXNwb25kV2l0aCIsImxvYWRSZXNvdXJjZSIsInJlZnJlc2hDYWNoZSIsImNhY2hlZCIsImhpdCIsInJlc3BvbnNlIiwibWlzcyIsImZldGNoIiwicHV0IiwibmV3UmVzcG9uc2UiLCJjbG9uZSIsInRleHQiLCJyZXNwb25zZVRleHQiLCJuZXdSZXNwb25zZVRleHQiLCJub3RpZnlCcm93c2VyIiwiY2xpZW50cyIsIm1hdGNoQWxsIiwiZm9yRWFjaCIsImNsaWVudCIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwibWF0Y2giLCJ0aGluZyIsImNvbnNvbGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FB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S0Q7O0FBRUQ7QUFDQSxTQUFTakIsTUFBVCxDQUFnQk4sT0FBaEIsUUFBc0M7QUFBQSxNQUFaTyxHQUFZLFFBQVpBLEdBQVk7QUFBQSxNQUFQRSxJQUFPLFFBQVBBLElBQU87O0FBQ3BDLFNBQU9kLE9BQU9DLElBQVAsQ0FBWVAsU0FBWixFQUF1QlEsSUFBdkIsQ0FBNEIsaUJBQVM7QUFDMUMsV0FBT0MsTUFBTTBCLEtBQU4sQ0FBWXhCLE9BQVosRUFBcUJILElBQXJCLENBQTBCLG9CQUFZO0FBQzNDLFVBQUlXLFFBQUosRUFBYztBQUNaLGVBQU9ELElBQUlDLFFBQUosRUFBY1YsS0FBZCxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBT1csS0FBS1gsS0FBTCxDQUFQO0FBQ0Q7QUFDRixLQU5NLENBQVA7QUFPRCxHQVJNLENBQVA7QUFTRDs7QUFFRDtBQUNBLFNBQVNOLEdBQVQsQ0FBYWlDLEtBQWIsRUFBb0I7QUFDbEIsTUFBSzlDLEtBQUwsRUFBYTtBQUNYK0MsWUFBUWxDLEdBQVIsQ0FBWWlDLEtBQVo7QUFDRDtBQUNGLEM7Ozs7Ozs7QUMzR0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMiLCJmaWxlIjoic3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzOWFjY2M1MDA5YzhjNDVmZDE2NyIsIi8vIFRoaXMgYXdlc29tZW5lc3MgcnVucyBpbiB0aGUgYmFja2dyb3VuZCBvZiB0aGUgd2Vic2l0ZSBhbmQgY2FuIGFjdFxuLy8gYXMgYSBwcm94eSwgbWFuaXB1bGF0aW5nIHJlcXVlc3RzLiBDb21iaW5lZCB3aXRoIGEgY2FjaGUsIG91ciBhcHBcbi8vIGNhbiB3b3JrIG9mZmxpbmUuXG5cbmNvbnN0IERFQlVHID0gdHJ1ZTtcblxuLy8gV2Ugd2FudCB0byBjYWNoZSB0aGUgcm9vdCBwYXRoICh0aGUgSFRNTCkgcGx1cyB0aGUgY29tcGlsZWQgYXNzZXRzXG5jb25zdCBhc3NldHNUb0NhY2hlID0gWy4uLmdsb2JhbC5zZXJ2aWNlV29ya2VyT3B0aW9uLmFzc2V0cywgJy4vJ10ubWFwKHBhdGggPT4ge1xuICByZXR1cm4gbmV3IFVSTChwYXRoLCBnbG9iYWwubG9jYXRpb24pLnRvU3RyaW5nKClcbn0pO1xuXG5jb25zdCBDQUNIRV9LRVkgPSAnbW9yc2UtY2hhdC12MC4xJztcblxuLy8gQ2FsbGVkIHdoZW4gdGhlIFNXIGlzIGJlaW5nIGluc3RhbGxlZCAodGltZSB0byBwcmVmaWxsIGNhY2hlKVxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgZXZlbnQgPT4ge1xuICBsb2coXCJJbnN0YWxsaW5nIHlvdXIgU2VydmljZSBXb3JrZXIgTWFnaWNcIik7XG5cbiAgZXZlbnQud2FpdFVudGlsKGNhY2hlcy5vcGVuKENBQ0hFX0tFWSkudGhlbihjYWNoZSA9PiB7XG4gICAgY2FjaGUuYWRkQWxsKGFzc2V0c1RvQ2FjaGUpO1xuICB9KSk7XG59KTtcblxuLy8gQ2FsbGVkIHdoZW4gdGhlIFNXIGlzIHN0YXJ0ZWQgKHRpbWUgdG8gcmVtb3ZlIG91dGRhdGVkIHN0dWZmKVxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGV2ZW50ID0+IHtcbiAgbG9nKFwiQWN0aXZhdGVkIVwiKTtcblxuICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUgeWV0XG59KTtcblxuLy8gQ2FsbGVkIHdoZW4gdGhlIGJyb3dzZXIgbWFrZXMgYSByZXF1ZXN0ICh3aGVyZSB0aGUgbWFnaWMgaGFwcGVucylcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBldmVudCA9PiB7XG4gIGxvZyhldmVudC5yZXF1ZXN0Lm1ldGhvZCArIFwiOiBcIiArIGV2ZW50LnJlcXVlc3QudXJsKTtcblxuICAvLyBSZXNwb25kIHdpdGggY2FjaGVkIGRhdGEgb3IgcGFzcyB0aHJvdWdoXG4gIGV2ZW50LnJlc3BvbmRXaXRoKGxvYWRSZXNvdXJjZShldmVudC5yZXF1ZXN0KSk7XG5cbiAgLy8gSWYgdGhpcyBpcyBhIGNhY2hlIGhpdCwgYXR0ZXB0IHRvIHJlZnJlc2ggdGhlIGNhY2hlXG4gIGV2ZW50LndhaXRVbnRpbChyZWZyZXNoQ2FjaGUoZXZlbnQucmVxdWVzdCkpO1xufSk7XG5cbmZ1bmN0aW9uIGxvYWRSZXNvdXJjZShyZXF1ZXN0KSB7XG4gIHJldHVybiBjYWNoZWQocmVxdWVzdCwge1xuICAgIGhpdDogcmVzcG9uc2UgPT4ge1xuICAgICAgbG9nKFwiQ2FjaGUgaGl0ISBTZXJ2ZSBmcm9tIGNhY2hlXCIpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0sXG4gICAgbWlzczogKCkgPT4ge1xuICAgICAgbG9nKFwiQ2FjaGUgbWlzcywganVzdCBwYXNzIHRocm91Z2hcIik7XG4gICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaENhY2hlKHJlcXVlc3QpIHtcbiAgcmV0dXJuIGNhY2hlZChyZXF1ZXN0LCB7XG4gICAgaGl0OiAocmVzcG9uc2UsIGNhY2hlKSA9PiB7XG4gICAgICBsb2coXCJJdGVtIGlzIGluIGNhY2hlLCBhdHRlbXB0IGEgY2FjaGUgcmVmcmVzaFwiKTtcbiAgICAgIGZldGNoKHJlcXVlc3QpLnRoZW4obmV3UmVzcG9uc2UgPT4ge1xuICAgICAgICAvLyBTdG9yZSB0aGUgbmV3IHJlc3VsdFxuICAgICAgICBjYWNoZS5wdXQocmVxdWVzdCwgbmV3UmVzcG9uc2UuY2xvbmUoKSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIG5ldyByZXN1bHQgYm9keSB1bmVxdWFscyB0aGUgb2xkIG9uZSwgd2UndmUgZ290IGFuIHVwZGF0ZVxuICAgICAgICByZXNwb25zZS50ZXh0KCkudGhlbihyZXNwb25zZVRleHQgPT4ge1xuICAgICAgICAgIG5ld1Jlc3BvbnNlLnRleHQoKS50aGVuKG5ld1Jlc3BvbnNlVGV4dCA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0ICE9IG5ld1Jlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgICBsb2coYENhY2hlIHVwZGF0ZWQgd2l0aCBuZXcgdmVyc2lvbiBvZiAke3JlcXVlc3QudXJsfSFgKTtcbiAgICAgICAgICAgICAgbm90aWZ5QnJvd3NlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbG9nKFwiQ2FjaGUgd2FzIGFscmVhZHkgdXAgdG8gZGF0ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG1pc3M6ICgpID0+IHtcbiAgICAgIGxvZyhcIkl0ZW0gaXMgbm90IGluIGNhY2hlLiBET04nVCBwdXQgaXQgdGhlcmUsIGJlY2F1c2UgaXQncyBub3QgcGFydCBvZiBvdXIgYXBwXCIpO1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vdGlmeUJyb3dzZXIoKSB7XG4gIHJldHVybiBzZWxmLmNsaWVudHMubWF0Y2hBbGwoKS50aGVuKGNsaWVudHMgPT4ge1xuICAgIGNsaWVudHMuZm9yRWFjaChjbGllbnQgPT4ge1xuICAgICAgY2xpZW50LnBvc3RNZXNzYWdlKHsgYWN0aW9uOiAnbmV3X3ZlcnNpb24nIH0pO1xuICAgIH0pXG4gIH0pO1xufVxuXG4vLyBNYWtlIHVzZSBvZiB0aGUgY2FjaGUgYSBsaXR0bGUgZWFzaWVyIG9uIHRoZSBleWVzIGZvciB1c1xuZnVuY3Rpb24gY2FjaGVkKHJlcXVlc3QsIHtoaXQsIG1pc3N9KSB7XG4gIHJldHVybiBjYWNoZXMub3BlbihDQUNIRV9LRVkpLnRoZW4oY2FjaGUgPT4ge1xuICAgIHJldHVybiBjYWNoZS5tYXRjaChyZXF1ZXN0KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gaGl0KHJlc3BvbnNlLCBjYWNoZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWlzcyhjYWNoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBTbyB3ZSBjYW4gZWFzaWx5IGRpc2FibGUgZGVidWcgb3V0cHV0XG5mdW5jdGlvbiBsb2codGhpbmcpIHtcbiAgaWYgKCBERUJVRyApIHtcbiAgICBjb25zb2xlLmxvZyh0aGluZyk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXJ2aWNld29ya2VyLmpzIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=