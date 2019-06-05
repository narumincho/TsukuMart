import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as database from "./lib/database";
import * as query from "./lib/query";
import * as mutation from "./lib/mutation";
import * as signUpCallback from "./lib/signUpCallback";
import { request } from "http";

console.log("run index.js 2019-05-27");

const schema = new graphql.GraphQLSchema({
    query: query.query,
    mutation: mutation.mutation
});

export const indexHtml = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
        response.setHeader("Content-Type", "text/html");
        response.send(`
        <!doctype html>
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
            <!-- <script type="module">
                "use strict";
                requestAnimationFrame(() => {
                    /* Elmを起動!! */
                    const app = window.Elm.Main.init({
                        flags: {
                            refreshToken: localStorage.getItem("refreshToken"),
                        }
                    });
                    const windowResizeListener = (e) => {
                        if (1000 < innerWidth) {
                            app.ports.toWideScreenMode.send(null);
                        } else {
                            app.ports.toNarrowScreenMode.send(null);
                        }
                    };
                    /* ウィンドウサイズのリサイズ情報をElmに送信 */
                    addEventListener("resize", windowResizeListener);
                    windowResizeListener();
                    /* リフレッシュトークンを保存する */
                    // app.ports.saveRefreshTokenToLocalStorage.subscribe(refreshToken => {
                    //     localStorage.setItem("refreshToken", refreshToken);
                    // });
                    /* リフレッシュトークンとその他すべてを削除する */
                    app.ports.deleteRefreshTokenAndAllFromLocalStorage.subscribe(() => {
                        localStorage.clear();
                    });
                    /* 指定されたidの<input type="file">から1つファイルの情報を受け取りData URLに変換してElmに送信 */
                    app.ports.studentImageChange.subscribe(id => {
                        const fileInputElement = document.getElementById(id);
                        const imageFile = fileInputElement.files[0]
                        if (imageFile === undefined) {
                            return;
                        }
                        const fileReader = new FileReader();
                        fileReader.addEventListener("load", (e) => {
                            app.ports.receiveImageDataUrl.send(fileReader.result)
                        })
                        fileReader.readAsDataURL(imageFile);
                    });
                    /* 指定されたidの<input type="file">から複数のファイルの情報を受け取りFileとblob URLに変換してElmに送信 */
                    app.ports.exhibitionImageChange.subscribe(id => {
                        const fileInputElement = document.getElementById(id);
                        const result = [];
                        for (const imageFile of fileInputElement.files) {
                            result.push({
                                file: imageFile,
                                blobUrl: URL.createObjectURL(imageFile)
                            });
                        }
                        app.ports.receiveImageFileAndBlobUrl.send(result);
                    });
                    /* 指定されたidの要素のテキストの内容を変える */
                    app.ports.inputOrTextAreaReplaceText.subscribe(({ id, text }) => {
                        requestAnimationFrame(() => {
                            const element = document.getElementById(id);
                            if (element !== null) {
                                element.value = text;
                            }
                        })
                    });
                    /* 指定されたidの要素のselectedIndexを変更する */
                    app.ports.changeSelectedIndex.subscribe(({ id, index }) => {
                        requestAnimationFrame(() => {
                            const element = document.getElementById(id);
                            if (element !== null) {
                                element.selectedIndex = index;
                            }
                        })
                    });
                    /* 指定されたidの要素が表示されるようにスクロールさせる */
                    app.ports.elementScrollIntoView.subscribe(id => {
                        requestAnimationFrame(() => {
                            const element = document.getElementById(id);
                            if (element !== null) {
                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                            }
                        })
                    });
                    /* ファイルをドロップして追加 */
                    app.ports.addEventListenerDrop.subscribe(id => {
                        requestAnimationFrame(() => {
                            const element = document.getElementById(id);
                            if (element !== null) {
                                element.addEventListener("dragover", e => {
                                    e.preventDefault();
                                })
                                element.addEventListener("drop", e => {
                                    e.preventDefault();
                                    const result = [];
                                    for (const imageFile of e.dataTransfer.files) {
                                        result.push({
                                            file: imageFile,
                                            blobUrl: URL.createObjectURL(imageFile)
                                        });
                                    }
                                    app.ports.receiveImageFileAndBlobUrl.send(result);
                                })
                            }
                        })
                    });
                    /* 時間のパース */
                    app.ports.sendTimeStringToMillisecond.subscribe(({ goodId, timeString }) => {
                        app.ports.receiveTimeStringToMillisecond.send({
                            goodId: goodId,
                            second: timeString.map(e => (new Date(e)).getTime())
                        });
                    });
                    /* 画像ファイルのURLからFileとblob URLに変換してElmに送信 */
                    app.ports.getGoodImageFileAsFileAndBlobUrl.subscribe(async (urlList) => {
                        const result = [];
                        for (const url of urlList) {
                            // const imageFile = await ((await fetch(url, { mode: "cors" })).blob())
                            const imageFile = await imageToBlob(await loadImageFromURL(url))
                            console.log("blob", imageFile);
                            result.push({
                                file: imageFile,
                                blobUrl: URL.createObjectURL(imageFile)
                            });
                        }
                        app.ports.receiveGoodImageFileAsFileAndBlobUrl.send(result);
                    });
        
                    /** fetch でだめなら image.src = url で ok? */
                    const loadImageFromURL = (url) => new Promise((resolve, reject) => {
                        const image = new Image();
                        image.crossOrigin = "anonymous";
                        image.addEventListener("load", () => {
                            resolve(image);
                        });
                        image.addEventListener("error", (err) => {
                            reject(err);
                        });
                        image.src = url;
                    });
        
                    /** Imageをcanvasに描画すれば、アクセス制限からのがれられる? */
                    const imageToBlob = (image) => new Promise((resolve, reject) => {
                        const canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        canvas.getContext("2d").drawImage(
                            image,
                            0, 0,
                            image.width, image.height
                        )
                        canvas.toBlob(resolve, "image/png", 1);
                    })
        
                    navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
        
                })
            </script>
            -->
        </head>
        
        <body>
            動的に生成していることの証明(個人的な情報は含まれない) Math.random()=${Math.random()}
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
