import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as database from "./lib/database";
import * as query from "./lib/query";
import * as mutation from "./lib/mutation";
import * as signUpCallback from "./lib/signUpCallback";

console.log("run index.js 2019-05-27");

const schema = new graphql.GraphQLSchema({
    query: query.query,
    mutation: mutation.mutation
});

export const indexHtml = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
        response.setHeader("Content-Type", "text/html");
        response.send(`<!doctype html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="description" content="筑波大生専用手渡しフリーマーケットサービス">
    <meta name="theme-color" content="#733fa7">
    <title>つくマート 読み込み中</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="icon" href="/assets/logo_bird.png">
    <link rel="manifest" href="/manifest.json">
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
        response.setHeader("Access-Control-Allow-Origin", "*");
        // response.setHeader("Access-Control-Allow-Methods", "OPTIONS POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age", 3600);
        if (request.method === "OPTIONS") {
            response.status(200).send("");
            return;
        }
        await graphqlExpress({ schema: schema, graphiql: true })(
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
        const pathSplited: Array<string> = request.path.split("/");
        const folderName: string | undefined = pathSplited[2];
        const fileName: string | undefined = pathSplited[3];
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age", 3600);
        if (folderName === undefined || fileName == undefined) {
            response.send("invalid image path");
            return;
        }
        try {
            response.setHeader("Cache-Control", "public max-age=3600");
            database.getImageReadStream(folderName, fileName).pipe(response);
        } catch (e) {
            console.log(
                "指定した、ファイルがない",
                folderName + "/" + fileName
            );
            response.status(404).send("not found");
        }
    });
