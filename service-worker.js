const CACHE_NAME = 'rate-timer-v1'; // ชื่อแคชเดิม
const urlsToCache = [
  './',
  './index.html?app=rate-timer',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  // PATHS ถูกแก้ไขแล้ว
  './icon-192x192.png',
  './icon-512x512.png'
];

// ติดตั้ง Service Worker และแคชไฟล์ที่จำเป็น
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and added URLs');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ดักจับ Fetch Request เพื่อให้บริการไฟล์จาก Cache ก่อน
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// อัปเดต Service Worker (ล้างแคชเก่าทิ้ง)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); 
});
