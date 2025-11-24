self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html' ,
                '/history.html' ,
                '/customise.html' ,
                '/style.css' ,
                '/app.js' ,
                '/manifest.json' ,
                '/images/d4.gif' ,
                '/images/d6.gif' ,
                '/images/d8.gif' ,
                '/images/d10.gif' ,
                '/images/d12.gif' ,
                '/images/d20.gif' ,
                '/images/d20 roll.gif' ,
                '/images/d100.gif' ,
                '/images/icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});