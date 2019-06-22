// Tsukumart Service Worker
const cachesName = "image-chase";

((self: ServiceWorkerGlobalScope) => {
    self.addEventListener("install", e => {
        e.waitUntil(
            (() => {
                console.log(
                    "Service Worker内でブラウザにインストールされたことを検知した!"
                );
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

    const cacheFn = async (request: Request): Promise<Response> => {
        console.log(request.url, "リクエストを検知");
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

        e.waitUntil(
            self.registration.showNotification("プッシュ通知です!", {
                body: "プッシュ通知はこのようにして送られるのです",
                icon: "assets/icon.png",
                tag: "push-notification-tag"
            })
        );
    });
})(self as ServiceWorkerGlobalScope);
