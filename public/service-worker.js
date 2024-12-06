const CACHE_NAME = 'optispan-v1';
const DYNAMIC_CACHE = 'optispan-dynamic-v1';

// Add additional assets to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/js/app.js',
    '/js/components/Login.js',
    '/js/components/Dashboard.js',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png'
];

// Install and cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Enhanced fetch handler
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 