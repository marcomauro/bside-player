// ============================================
// B-SIDE Service Worker v1.0
// ============================================

const CACHE_NAME = 'bside-cache-v2';
const AUDIO_CACHE_NAME = 'bside-audio-cache-v1';

// Asset statici da cachare all'installazione
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // CSS Modules
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',
  // JavaScript Modules
  './js/config.js',
  './js/utils.js',
  './js/engine.js',
  './js/storage.js',
  './js/network.js',
  './js/audio.js',
  './js/ui.js',
  './js/theme.js',
  './js/favorites.js',
  './js/sleep.js',
  './js/mediasession.js',
  './js/install.js',
  './js/app.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap'
];

// ============================================
// INSTALL - Cache degli asset statici
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Install complete');
        // Attiva subito il nuovo SW senza aspettare
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// ============================================
// ACTIVATE - Pulizia vecchie cache
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Elimina cache vecchie
            if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activate complete');
        // Prendi controllo di tutte le pagine aperte
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH - Strategia di caching
// ============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // === AUDIO STREAMING: Network Only ===
  // Non cachare mai l'audio - deve sempre passare dalla rete
  if (url.hostname === 'media.capital.it' || 
      event.request.url.includes('.mp3')) {
    event.respondWith(
      fetch(event.request)
        .catch((err) => {
          console.log('[SW] Audio fetch failed:', err);
          // Restituisci un errore gestibile
          return new Response(null, {
            status: 503,
            statusText: 'Audio not available offline'
          });
        })
    );
    return;
  }
  
  // === FONT GOOGLE: Cache First ===
  if (url.hostname === 'fonts.googleapis.com' || 
      url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(event.request)
            .then((response) => {
              // Clona e salva in cache
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
              return response;
            });
        })
    );
    return;
  }
  
  // === ASSET STATICI: Stale While Revalidate ===
  // Serve dalla cache immediatamente, poi aggiorna in background
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        // Fetch in background per aggiornare la cache
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Aggiorna la cache con la nuova versione
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.log('[SW] Fetch failed, serving cached:', err);
            return cached;
          });
        
        // Restituisci subito la cache se disponibile, altrimenti aspetta la rete
        return cached || fetchPromise;
      })
  );
});

// ============================================
// MESSAGE - Comunicazione con la pagina
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  // Forza aggiornamento del SW
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  // Pulisci tutta la cache
  if (event.data === 'clearCache') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});

// ============================================
// BACKGROUND SYNC (per future implementazioni)
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-position') {
    // Potrebbe essere usato per sincronizzare la posizione
    // di ascolto con un server in futuro
  }
});

// ============================================
// PUSH NOTIFICATIONS (per future implementazioni)
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  // Potrebbe essere usato per notifiche su nuove puntate
  const options = {
    body: event.data ? event.data.text() : 'Nuova puntata disponibile!',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('B-SIDE', options)
  );
});

// ============================================
// NOTIFICATION CLICK
// ============================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] Service Worker loaded');
