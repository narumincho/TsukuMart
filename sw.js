// Tsukumart Service Worker
((self)=>{
    self.addEventListener("install", (e)=>{
        console.log("Service Worker内でServiceWorkerがブラウザにインストールされたことを検知した!");
        e.waitUntil(self.skipWaiting());
    });
    self.addEventListener("activate", (e)=>{
        console.log("Service Workerがアクティブな状態になった");
        e.waitUntil(self.clients.claim());
    });
    self.addEventListener("fetch", (e)=>{
        if (navigator.onLine) return;
        const accept = e.request.headers.get("accept");
        if (accept === null) return;
        if (accept.includes("text/html")) e.respondWith(new Response(`
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>つくマート | オフライン!</title>
    <style>
        body {
            font-size: 3rem;
            text-align: center;
        }
    </style>
</head>

<body>
    つくマートはオフラインでは利用できません。インターネットへの接続をしてください。
</body>

</html>`, {
            headers: {
                "content-type": "text/html"
            }
        }));
    });
    self.addEventListener("sync", (e)=>{
        console.log("syncを受け取った", e);
    });
    self.addEventListener("push", (e)=>{
        console.log("プッシュ通知をサーバーから受け取った", e);
        e.waitUntil(self.registration.showNotification("プッシュ通知です!", {
            body: "プッシュ通知はこのようにして送られるのです",
            icon: "/assets/logo_bird.png",
            tag: "push-notification-tag"
        }));
    });
})(self);

//# sourceMappingURL=sw.js.map
