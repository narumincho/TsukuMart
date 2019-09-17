"use strict";
((self) => {
    self.addEventListener("install", e => {
        e.waitUntil((async () => {
            console.log("Service Worker内でServiceWorkerがブラウザにインストールされたことを検知した!");
            const cache = await caches.open("indexHtml");
            await cache.add("https://tsukumart.com/");
            self.skipWaiting();
        })());
    });
    self.addEventListener("activate", e => {
        e.waitUntil((() => {
            console.log("Service Workerがアクティブな状態になった");
            self.clients.claim();
        })());
    });
    self.addEventListener("fetch", e => {
        e.waitUntil(async () => {
            if (!navigator.onLine) {
                e.respondWith(caches
                    .match(e.request)
                    .then(response => response !== undefined ? response : new Response()));
            }
        });
    });
    self.addEventListener("sync", e => {
        console.log("syncを受け取った", e);
    });
    self.addEventListener("push", e => {
        console.log("プッシュ通知をサーバーから受け取った", e);
        e.waitUntil(self.registration.showNotification("プッシュ通知です!", {
            body: "プッシュ通知はこのようにして送られるのです",
            icon: "assets/icon.png",
            tag: "push-notification-tag"
        }));
    });
})(self);
