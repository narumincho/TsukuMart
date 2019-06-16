import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as databaseLow from "./lib/databaseLow";
import * as query from "./lib/query";
import * as mutation from "./lib/mutation";
import * as signUpCallback from "./lib/signUpCallback";
import * as libSchema from "./lib/schema";

console.log("run index.js 2019-05-27");

export const indexHtml = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
        response.setHeader("Content-Type", "text/html");
        response.setHeader("Content-Security-Policy-Report-Only", "script-src 'self'")
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
    <meta property="og:url" content="https://tsukumart-f0971.web.app${
        request.url
    }">
    <meta property="og:title" content="つくマート">
    <meta property="og:description" content="記事の要約 デバッグ=${Math.random()}">
    <meta property="og:image" content="https://tsukumart-f0971.web.app/assets/logo_bird.png">
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
        response.setHeader("Access-Control-Allow-Origin", "*");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "Access-Control-Allow-Methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("Access-Control-Allow-Headers", "Content-Type");
            response.setHeader("Access-Control-Max-Age", 3600);
            response.status(200).send("");
            return;
        }
        await graphqlExpress({ schema: libSchema.schema, graphiql: true })(
            request,
            response
        );
    });

/** Googleでログインをしたあとのリダイレクト先 */
export const googleLogInReceiver = functions
    .region("asia-northeast1")
    .https.onRequest(signUpCallback.googleLogInReceiver);

/** GitHubでログインをしたあとのリダイレクト先 */
export const gitHubLogInReceiver = functions
    .region("asia-northeast1")
    .https.onRequest(signUpCallback.gitHubLogInReceiver);

/** Twitterでログインしたあとのリダイレクト先 */
export const twitterLogInReceiver = functions
    .region("asia-northeast1")
    .https.onRequest(signUpCallback.twitterLogInReceiver);

/** LINEでログインしたあとのリダイレクト先 */
export const lineLogInReceiver = functions
    .region("asia-northeast1")
    .https.onRequest(signUpCallback.lineLogInReceiver);

/* =====================================================================
 *                       ユーザーの画像などを返す
 * =====================================================================
 */
export const image = functions
    .region("asia-northeast1")
    .https.onRequest(async (request, response) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        if (request.method === "OPTIONS") {
            response.setHeader(
                "Access-Control-Allow-Methods",
                "POST, GET, OPTIONS"
            );
            response.setHeader("Access-Control-Allow-Headers", "Content-Type");
            response.setHeader("Access-Control-Max-Age", 3600);
            response.status(200).send("");
            return;
        }
        const pathSplited: Array<string> = request.path.split("/");
        const folderName: string | undefined = pathSplited[1];
        const fileName: string | undefined = pathSplited[2];
        if (folderName === undefined || fileName == undefined) {
            console.log("ファイルの指定がおかしい", request.path);
            response.status(404).send("invalid image path");
            return;
        }
        try {
            response.setHeader("Cache-Control", "public max-age=3600");
            databaseLow.getImageReadStream(folderName, fileName).pipe(response);
        } catch (e) {
            console.log(
                "指定した、ファイルがない",
                folderName + "/" + fileName
            );
            response.status(404).send("not found");
        }
    });
