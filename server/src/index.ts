import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as database from "./lib/database";
import * as databaseLow from "./lib/databaseLow";
import * as signUpCallback from "./lib/signUpCallback";
import * as lineNotify from "./lib/lineNotify";
import * as libSchema from "./lib/schema";

console.log("サーバーのプログラムが読み込まれた!");

export const indexHtml = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
        if (request.host !== "tsukumart.com") {
            response.redirect("https://tsukumart.com");
        }
        response.setHeader("content-type", "text/html");
        response.send(`<!doctype html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="description" content="筑波大生専用手渡しフリーマーケットサービス">
    <meta name="theme-color" content="#733fa7">
    <title>つくマート</title>
    <link rel="stylesheet" href="https://tsukumart.com/style.css">
    <link rel="icon" href="https://tsukumart.com/assets/logo_bird.png">
    <link rel="manifest" href="https://tsukumart.com/manifest.json">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:url" content="https://tsukumart.com${request.url}">
    <meta property="og:title" content="つくマート">
    <meta property="og:description" content="記事の要約 デバッグ=${Math.random()}">
    <meta property="og:image" content="https://tsukumart.com/assets/logo_bird.png">
    <script src="https://tsukumart.com/main.js" defer></script>
    <script src="https://tsukumart.com/call.js" type="module"></script>
</head>

<body>
    プログラムをダウンロード中……
    <noscript>
        つくマートではJavaScriptを使用します。ブラウザの設定で有効にしてください。
    </noscript>
</body>
`);
    });

/** API */
export const api = functions
    .region("asia-northeast1")
    .runWith({
        memory: "2GB"
    })
    .https.onRequest(async (request, response) => {
        console.log("API called");
        response.setHeader(
            "access-control-allow-origin",
            "https://tsukumart.com"
        );
        response.setHeader("vary", "Origin");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "access-control-allow-methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("access-control-allow-headers", "content-type");
            response.status(200).send("");
            return;
        }
        await graphqlExpress({ schema: libSchema.schema, graphiql: true })(
            request,
            response
        );
    });

/** ソーシャルログインをしたあとのリダイレクト先 */
export const logInReceiver = functions
    .region("asia-northeast1")
    .https.onRequest(
        async (request, response): Promise<void> => {
            switch (request.path) {
                case "/google":
                    await signUpCallback.googleLogInReceiver(request, response);
                case "/gitHub":
                    await signUpCallback.gitHubLogInReceiver(request, response);
                case "/twitter":
                    await signUpCallback.twitterLogInReceiver(
                        request,
                        response
                    );
                case "/line":
                    await signUpCallback.lineLogInReceiver(request, response);
            }
        }
    );

export const notifyCallBack = functions
    .region("asia-northeast1")
    .https.onRequest(
        async (request, response): Promise<void> => {
            await lineNotify.callBack(request, response);
        }
    );
/* =====================================================================
 *                       ユーザーの画像などを返す
 * =====================================================================
 */
export const image = functions
    .region("asia-northeast1")
    .https.onRequest(async (request, response) => {
        response.setHeader(
            "access-control-allow-origin",
            "https://tsukumart.com"
        );
        response.setHeader("vary", "Origin");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "access-control-allow-methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("access-control-allow-headers", "content-type");
            response.status(200).send("");
            return;
        }
        try {
            response.setHeader("cache-control", "public, max-age=31536000");
            databaseLow
                .getImageReadStream(request.path.substring(1)) // /imageId -> imageId
                .pipe(response);
        } catch (e) {
            console.log(
                `指定した、ファイルID=(${request.path.substring(1)})がない`
            );
            response.status(404).send("not found");
        }
    });

/* =====================================================================
 *                  Google Search Console 用サイトマップ
 * =====================================================================
 */
export const sitemap = functions
    .region("us-central1")
    .https.onRequest(async (request, response) => {
        console.log("sitemap called");
        const productData = await database.getAllProducts();
        const userData = await database.getAllUser();

        response.setHeader("content-type", "application/xml");
        response.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pathToXml("")}
${productData.map(product => pathToXml("product/" + product.id)).join("\n")}
${userData.map(user => pathToXml("user/" + user.id)).join("\n")}
</urlset>`);
    });

const pathToXml = (path: string): string => `
    <url>
        <loc>https://tsukumart.com/${path}</loc>
        <lastmod>2019-07-12</lastmod>
    </url>
`;
/* =====================================================================
 *                  content-security-policy の 報告先
 * =====================================================================
 */
export const contentSecurityPolicyReport = functions.https.onRequest(
    async (request, response) => {
        await databaseLow.contentSecurityPolicyReport(request.body.toString());
    }
);
