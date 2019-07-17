// Tsukumart Service Worker
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

    self.addEventListener("fetch", e => {
        e.waitUntil(() => {
            const accept = e.request.headers.get("accept");
            if (accept === null) {
                return;
            }
            if (/text\/html/.test(accept) && !navigator.onLine) {
                return new Response(`
<!doctype html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>つくマート</title>
</head>

<body>
    オフライン時、つくマートを使うことはできません
</body>

</html>
`);
            }
        });
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
