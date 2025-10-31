// กำหนดชื่อแคชเพื่อให้สามารถอัปเดตเวอร์ชันได้ง่าย
const CACHE_NAME = 'rate-timer-app-v1';

// กำหนดรายการไฟล์ที่จำเป็นในการทำงานแบบออฟไลน์
const urlsToCache = [
    './index.html',
    './manifest.json',
    // URLs สำหรับไฟล์ภายนอกที่จำเป็น (Tailwind, Font Inter)
    'https://cdn.tailwindcss.com', 
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
    // ต้องรวมไฟล์ไอคอนด้วย (สมมติว่าคุณสร้างโฟลเดอร์ icons แล้ว)
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// 1. Install Event: ติดตั้ง service worker และแคชไฟล์ที่จำเป็น
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and caching essential files.');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Fetch Event: จัดการการดึงข้อมูล โดยพยายามดึงจากแคชก่อน หากไม่มีจึงดึงจากเครือข่าย
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // คืนค่าจากแคชหากมี
                if (response) {
                    return response;
                }
                // ถ้าไม่มีในแคช ให้เรียกจากเครือข่าย
                return fetch(event.request);
            })
    );
});

// 3. Activate Event: ล้างแคชเก่าที่ไม่ได้ใช้งานแล้ว
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
