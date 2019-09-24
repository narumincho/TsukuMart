// Tsukumart Service Worker
((self: ServiceWorkerGlobalScope) => {
    self.addEventListener("install", e => {
        e.waitUntil(
            (async () => {
                console.log(
                    "Service Worker内でServiceWorkerがブラウザにインストールされたことを検知した!"
                );
                const cache = await caches.open("indexHtml");
                await cache.add("/");
                self.skipWaiting();
            })()
        );
    });

    self.addEventListener("activate", e => {
        e.waitUntil(
            (() => {
                console.log("Service Workerがアクティブな状態になった");
                self.clients.claim();
            })()
        );
    });

    self.addEventListener("fetch", e => {
        e.waitUntil(
            (() => {
                console.log("fetch!");
                if (!navigator.onLine) {
                    console.log("fetchでオフライン");
                    e.respondWith(
                        caches
                            .match(e.request)
                            .then(response =>
                                response !== undefined
                                    ? response
                                    : new Response()
                            )
                    );
                }
            })()
        );
    });

    self.addEventListener("sync", e => {
        console.log("syncを受け取った", e);
    });

    self.addEventListener("push", e => {
        console.log("プッシュ通知をサーバーから受け取った", e);

        e.waitUntil(
            self.registration.showNotification("プッシュ通知です!", {
                body: "プッシュ通知はこのようにして送られるのです",
                icon: "assets/icon.png",
                tag: "push-notification-tag"
            })
        );
    });
})((self as unknown) as ServiceWorkerGlobalScope);
