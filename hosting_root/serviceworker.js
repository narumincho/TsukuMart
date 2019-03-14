// Tsukumart Service Worker

// @ts-check

// キャッシュファイルの指定
const cacheName = "pwa-caches";
const urlListToCache = [];

// 最初の読み込み。 Service Workerのインストール
self.addEventListener("install", (e) => {
    // e.waitUntil(
    //     caches
    //         .open(cacheName)
    //         .then((cache) => {
    //             console.log("cache", cache);
    //             return cache.addAll(urlListToCache);
    //         })
    // );
    console.log("Service Worker内でブラウザにインストールされたことを検知した");
});

// メインスレッドでfetchしたら
self.addEventListener("fetch", (e) => {
    console.log("fetch。キャッシュから取る処理をすべきだが、今はすべてサーバーに問い合わせている")
    return fetch(e.request);
    // e.respondWith(
    //     caches
    //         .match(e.request)
    //         .then((response) => {
    //             console.log("fetch@", e.request);
    //             return fetch(e.request);
    //         })
    // );
});


self.addEventListener("push", (e) => {
    console.log("プッシュ通知をサーバーから受け取った", e);

    e.waitUntil(
        self.registration.showNotification("プッシュ通知です!", {
            body: "プッシュ通知はこのようにして送られるのです",
            icon: "assets/icon.png",
            tag: 'push-notification-tag'
        })
    );
});
