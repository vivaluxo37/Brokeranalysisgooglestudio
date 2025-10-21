/**
 * Service Worker for Enhanced Security and Performance
 * Provides offline capabilities, caching, and security features
 */

const CACHE_NAME = 'brokeranalysis-v1.0.0';
const STATIC_CACHE = 'brokeranalysis-static-v1.0.0';
const API_CACHE = 'brokeranalysis-api-v1.0.0';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/_headers',
  // Add other critical assets as needed
];

// API endpoints that can be cached
const CACHEABLE_API_PATTERNS = [
  /^\/api\/health$/,
  /^\/api\/brokers$/,
];

// Security: Block suspicious requests
const BLOCKED_PATTERNS = [
  /admin/i,
  /wp-admin/i,
  /wp-login/i,
  /\.php$/i,
  /\.asp$/i,
  /\.jsp$/i,
  /\.exe$/i,
  /\.bat$/i,
  /\.cmd$/i,
  /\.scr$/i,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve requests with security and caching
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Security: Block suspicious requests
  if (BLOCKED_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    console.warn('Service Worker: Blocked suspicious request', url.pathname);
    event.respondWith(new Response('Blocked', { status: 403 }));
    return;
  }
  
  // Handle different request types
  if (request.method === 'GET') {
    if (isStaticAsset(request.url)) {
      event.respondWith(handleStaticRequest(request));
    } else if (isApiRequest(request.url)) {
      event.respondWith(handleApiRequest(request));
    } else {
      event.respondWith(handleNavigationRequest(request));
    }
  } else {
    // For non-GET requests, go to network
    event.respondWith(fetch(request));
  }
});

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static request failed', error);
    
    // Try to serve from cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Handle API requests
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API endpoint can be cached
  const isCacheable = CACHEABLE_API_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (isCacheable) {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse && !isStale(cachedResponse)) {
        return cachedResponse;
      }
      
      // Fetch from network
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('Service Worker: API request failed', error);
      
      // Try to serve stale cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response('Service Unavailable', { status: 503 });
    }
  } else {
    // For non-cacheable API requests, go to network
    return fetch(request);
  }
}

// Handle navigation requests (SPA routing)
async function handleNavigationRequest(request) {
  try {
    // Always try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.error('Service Worker: Navigation request failed', error);
  }
  
  // Fallback to cached index.html
  return caches.match('/') || new Response('Offline', { status: 503 });
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('.') && (
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.gif') ||
    url.endsWith('.svg') ||
    url.endsWith('.woff') ||
    url.endsWith('.woff2')
  );
}

function isApiRequest(url) {
  return url.includes('/api/');
}

function isStale(response) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  return (now - responseDate) > maxAge;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Service Worker: Background sync');
  // Implement background sync logic here
}

// Push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
      })
    );
  }
});

// Cleanup on message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
