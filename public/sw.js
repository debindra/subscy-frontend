const CACHE_NAME = 'subsy-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/subscriptions',
  '/auth/login',
  '/auth/signup',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isGet = request.method === 'GET';
  
  // Completely bypass service worker for:
  // 1. Non-GET requests (POST, PUT, DELETE, etc.)
  // 2. Cross-origin requests (API calls, Supabase, etc.)
  // 3. Supabase auth endpoints (to avoid CORS issues)
  // 4. API endpoints
  const isSupabaseRequest = requestUrl.hostname.includes('supabase.co');
  const isApiRequest = requestUrl.pathname.startsWith('/api/') || 
                       requestUrl.searchParams.has('grant_type'); // Auth token refresh
  
  if (!isGet || !isSameOrigin || isSupabaseRequest || isApiRequest) {
    // Don't intercept these requests at all - let them go directly to the network
    return;
  }

  // Cache-first strategy for same-origin GET requests only
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Subsy Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/subsy-logo.png',
    badge: '/subsy-logo.png',
    image: data.image,
    data: data.data || {},
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

