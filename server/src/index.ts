import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as databaseLow from "./lib/databaseLow";
import * as signUpCallback from "./lib/signUpCallback";
import * as libSchema from "./lib/schema";

console.log("run index.js 2019-05-27");

export const indexHtml = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
        response.setHeader("content-type", "text/html");
        response.send(`<!doctype html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="description" content="筑波大生専用手渡しフリーマーケットサービス">
    <meta name="theme-color" content="#733fa7">
    <title>つくマート</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="icon" href="/assets/logo_bird.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:url" content="https://tsukumart.com${request.url}">
    <meta property="og:title" content="つくマート">
    <meta property="og:description" content="記事の要約 デバッグ=${Math.random()}">
    <meta property="og:image" content="https://tsukumart.com/assets/logo_bird.png">
    <script src="/main.js" defer></script>
    <script src="/call.js" type="module"></script>
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
            "Access-Control-Allow-Origin",
            "https://tsukumart.com"
        );
        response.setHeader("vary", "Origin");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "Access-Control-Allow-Methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("Access-Control-Allow-Headers", "content-type");
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
    .https.onRequest(async (request, response) => {
        switch (request.path) {
            case "/google":
                await signUpCallback.googleLogInReceiver(request, response);
            case "/gitHub":
                await signUpCallback.gitHubLogInReceiver(request, response);
            case "/twitter":
                await signUpCallback.twitterLogInReceiver(request, response);
            case "/line":
                await signUpCallback.lineLogInReceiver(request, response);
        }
    });

/* =====================================================================
 *                       ユーザーの画像などを返す
 * =====================================================================
 */
export const image = functions
    .region("asia-northeast1")
    .https.onRequest(async (request, response) => {
        response.setHeader(
            "Access-Control-Allow-Origin",
            "https://tsukumart.com"
        );
        response.setHeader("vary", "Origin");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "Access-Control-Allow-Methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("Access-Control-Allow-Headers", "content-type");
            response.status(200).send("");
            return;
        }
        try {
            response.setHeader("Cache-Control", "public max-age=3600");
            databaseLow
                .getImageReadStream(request.path.substring(1))
                .pipe(response);
        } catch (e) {
            console.log(
                `指定した、ファイルID=(${request.path.substring(1)})がない`
            );
            response.status(404).send("not found");
        }
    });
