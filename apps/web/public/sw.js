const CACHE_NAME = 'b2b-agm-cache-v8';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/globals.css',
  '/hero.png'
];

// Install event - caching core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // 🚀 CRITICAL: Bypass cache for Next.js development chunks and hot-reloads
  // These files change every time a developer saves a file.
  if (
    url.pathname.includes('/_next/static/webpack/') || 
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('hot-update.json') ||
    url.pathname.endsWith('.hot-update.js')
  ) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Only fallback to cache for static assets, not for dynamic build chunks
        if (url.pathname.startsWith('/_next/static/chunks/')) {
           return new Response('Stale Chunk Detected - Please Reload', { status: 404 });
        }
        return caches.match(event.request);
      })
  );
});
// Push event - handling incoming notifications
self.addEventListener('push', (event) => {
  let data = { title: 'B2B Empresas', body: 'Nueva notificación recibida' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'B2B Empresas', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/favicon.ico', // Ajustar a un icono premium
    badge: '/favicon.ico',
    data: data.url || '/',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Ver ahora' }
    ]
  };

  event.waitUntil(
    self.notificationAt.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
