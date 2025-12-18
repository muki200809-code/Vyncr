const CACHE_NAME = 'vyncr-v1';
const OFFLINE_ASSETS = [
  '/',
  '/manifest.json',
  '/styles/globals.css'
];

// 1. Install & Cache UI Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
});

// 2. Network-First Strategy
self.addEventListener('fetch', (event) => {
  // Always fetch API/AI data from the internet (don't cache trust scores)
  if (event.request.url.includes('/api/') || event.request.url.includes('/health')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For UI assets, try Network first, fallback to Cache for speed
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});


