"use strict";
// Tsukumart Service Worker
// 2019/05/07
const cachesName = "image-chase";
((self) => {
    self.addEventListener("install", e => {
        e.waitUntil((() => {
            console.log("Service Worker内でブラウザにインストールされたことを検知した!");
            self.skipWaiting();
        })());
    });
    self.addEventListener("activate", e => {
        e.waitUntil((() => {
            console.log("Service Workerがアクティブな状態になった");
            self.clients.claim();
        })());
    });
    const cacheFn = async (request) => {
        console.log(request.url, "リクエストを検知");
        if (request.url.endsWith(".png") || request.url.endsWith(".jpg") || request.url.endsWith(".jpeg")) {
            const cache = await self.caches.open(cachesName);
            const responseFromCache = await cache.match(request);
            if (responseFromCache === undefined) {
                console.log("キャッシュになかった。リクエストする");
                const response = await fetch(request);
                await cache.put(request, response.clone());
                console.log("リクエストしてキャッシュに保存した", response);
                return response;
            }
            console.log("キャッシュにあった! キャッシュにあったものを使う");
            return responseFromCache;
        }
        return await fetch(request);
    };
    self.addEventListener("fetch", e => {
        e.respondWith(cacheFn(e.request));
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
