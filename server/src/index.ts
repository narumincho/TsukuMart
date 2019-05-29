import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as firebase from "firebase";
import * as jwt from "jsonwebtoken";
import * as result from "./lib/result";
import * as univ from "./lib/university";
import * as secret from "./secret";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as logInWithTwitter from "./lib/twitterLogIn";
import { AxiosResponse } from "axios";
import { URL, URLSearchParams } from "url";
import axios from "axios";
import * as storage from "@google-cloud/storage";

admin.initializeApp();
firebase.initializeApp({
    apiKey: secret.apiKey,
    projectId: "tsukumart-demo"
});

const dataBase = admin.firestore();
const dataBaseUserCollection = dataBase.collection("users");
const googleLogInStateCollection = dataBase.collection("googleState");
const googleLogInClientId =
    "253948313366-d7d6tju8iuo2h1pi9pdjsambnm0b99o3.apps.googleusercontent.com";
const googleLogInSecret = secret.googleLogInSecret;
const googleLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/google_receiver";
const gitHubLogInStateCollection = dataBase.collection("gitHubState");
const gitHubLogInClientId = "a20a09e6e876c0dbc348";
const gitHubLogInSecret = secret.gitHubLogInSecret;
const gitHubLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/github_receiver";
const dataBaseTwitterStateCollection = dataBase.collection("twitterState");
const twitterLogInClientId = "FpPSOcAoWSBtyrPaUcihCKRzi";
const twitterLogInSecret = secret.twitterLogInSecret;
const twitterLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/twitter_receiver";
const dataBaseLineStateCollection = dataBase.collection("lineState");
const lineLogInClientId = "1578506920";
const lineLogInSecret = secret.lineLogInSecret;
const lineLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/line_receiver";

const refreshSecretKey = secret.refreshTokenSecretKey;
const accessSecretKey = secret.accessTokenSecretKey;

console.log("run index.js 2019-05-27");

const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: "Query",
        description:
            "データを取得できる。データを取得したときに影響は他に及ばさない",
        fields: {
            hello: {
                description: "世界に挨拶する",
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: () => "Hello World!"
            }
        }
    }),
    mutation: new graphql.GraphQLObjectType({
        name: "Mutation",
        description: "データを作成、更新ができる",
        fields: {
            getGoogleLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) => {
                    const ref = await googleLogInStateCollection.add({});
                    return (
                        "https://accounts.google.com/o/oauth2/v2/auth?" +
                        new URLSearchParams({
                            response_type: "code",
                            client_id: googleLogInClientId,
                            redirect_uri: googleLogInRedirectUri,
                            scope: "profile openid",
                            state: ref.id
                        }).toString()
                    );
                },
                description:
                    "Googleで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Googleの認証画面へ"
            },
            getGitHubLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) => {
                    const ref = await gitHubLogInStateCollection.add({});
                    return (
                        "https://github.com/login/oauth/authorize?" +
                        new URLSearchParams({
                            response_type: "code",
                            client_id: gitHubLogInClientId,
                            redirect_uri: gitHubLogInRedirectUri,
                            scope: "read:user",
                            state: ref.id
                        }).toString()
                    );
                },
                description:
                    "GitHubで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、GitHubの認証画面へ"
            },
            getTwitterLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) => {
                    const {
                        tokenSecret,
                        url
                    } = await logInWithTwitter.getLoginUrl(
                        twitterLogInClientId,
                        twitterLogInSecret,
                        twitterLogInRedirectUri
                    );
                    await dataBaseTwitterStateCollection.doc("last").set({
                        tokenSecret: tokenSecret
                    });
                    return url;
                },
                description:
                    "Twitterで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Twitterの認証画面へ"
            },
            getLineLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) => {
                    const ref = await dataBaseLineStateCollection.add({});
                    return (
                        "https://access.line.me/oauth2/v2.1/authorize?" +
                        new URLSearchParams({
                            response_type: "code",
                            client_id: lineLogInClientId,
                            redirect_uri: lineLogInRedirectUri,
                            scope: "profile openid",
                            state: ref.id
                        }).toString()
                    );
                },
                description:
                    "LINEで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、LINEの認証画面へ"
            }
        }
    })
});

export const api = functions.https.onRequest(
    graphqlExpress({ schema: schema, graphiql: true })
);
/* =====================================================================
 *                              Google
 * =====================================================================
 */
/** Googleでログインをしたあとのリダイレクト先 */
export const googleLogInReceiver = functions.https.onRequest(
    async (request, response) => {
        const code: string | undefined = request.query.code;
        const state: string | undefined = request.query.state;
        if (code === undefined || state === undefined) {
            console.log(
                "Googleからcodeかstateが送られて来なかった。ユーザーがキャンセルした?"
            );
            response.redirect("/");
            return;
        }
        const docRef: FirebaseFirestore.DocumentReference = googleLogInStateCollection.doc(
            state
        );
        const doc: FirebaseFirestore.DocumentSnapshot = await docRef.get();
        if (!doc.exists) {
            console.log(
                "Googleのログインで生成していないstateを指定された",
                state
            );
            response.send(
                `Google LogIn Error: definy do not generate state =${state}`
            );
            return;
        }
        await docRef.delete();

        // ここでhttps://www.googleapis.com/oauth2/v4/tokenにqueryのcodeをつけて送信。IDトークンを取得する
        const googleData = googleTokenResponseToData(
            await axios.post(
                "https://www.googleapis.com/oauth2/v4/token",
                new URLSearchParams(
                    new Map([
                        ["grant_type", "authorization_code"],
                        ["code", code],
                        ["redirect_uri", googleLogInRedirectUri],
                        ["client_id", googleLogInClientId],
                        ["client_secret", googleLogInSecret]
                    ])
                ).toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )
        );
        console.log("googleData", googleData);
        // 取得したidトークンからプロフィール画像と名前とLINEのIDを取得する
        const existsData: FirebaseFirestore.QuerySnapshot = await dataBaseUserCollection
            .where("googleAccountId", "==", googleData.sub)
            .get();
        // そのあと、Definyにユーザーが存在するなら、そのユーザーのリフレッシュトークンを返す
        if (!existsData.empty) {
            console.log("Googleで登録したユーザーがいた");
            response.send("Googleで登録したユーザーがいた");
            return;
        }
        // ユーザーが存在しないならメール送信トークンを返す
        console.log("Googleで登録したユーザーがいなかった");
        const sendEmailToken = createSendEmailToken("google", googleData.sub);
        const imageUrl = await getAndSaveUserImage(new URL(googleData.picture));
        response.redirect(
            "/?" +
                new URLSearchParams(
                    new Map([
                        ["sendEmailToken", sendEmailToken],
                        ["imageUrl", imageUrl.toString()]
                    ])
                ).toString()
        );
    }
);

const googleTokenResponseToData = (
    response: AxiosResponse<{ id_token: string }>
): {
    iss: "https://accounts.google.com";
    sub: string;
    name: string;
    picture: string;
} => {
    const idToken = response.data.id_token;
    console.log("googleIdToken id_token=", idToken);
    return jwt.decode(idToken) as {
        iss: "https://accounts.google.com";
        sub: string;
        name: string;
        picture: string;
    };
};

/* =====================================================================
 *                              GitHub
 * =====================================================================
 */
/** GitHubでログインをしたあとのリダイレクト先 */
export const gitHubLogInReceiver = functions.https.onRequest(
    (request, response) => {
        response.send("つくり途中");
    }
);
/* =====================================================================
 *                             Twitter
 * =====================================================================
 */
/** Twitterでログインしたあとのリダイレクト先 */
export const twitterLogInReceiver = functions.https.onRequest(
    (request, response) => {
        response.send("つくり途中");
    }
);
/* =====================================================================
 *                              LINE
 * =====================================================================
 */
/** LINEでログインしたあとのリダイレクト先 */
export const lineLogInReceiver = functions.https.onRequest(
    (request, response) => {
        response.send("つくり途中");
    }
);

/* =====================================================================
 *                       ユーザーの画像などを返す
 * =====================================================================
 */
export const image = functions.https.onRequest(async (request, response) => {
    const pathSplited: Array<string> = request.path.split("/");
    const folderName: string | undefined = pathSplited[2];
    const fileName: string | undefined = pathSplited[3];
    if (folderName === undefined || fileName == undefined) {
        response.send("invalid image path");
        return;
    }
    try {
        const file = admin
            .storage()
            .bucket()
            .file(folderName + "/" + fileName);
        file.createReadStream().pipe(response);
    } catch (e) {
        console.log("指定した、ファイルがない", folderName + "/" + fileName);
        response.status(404).send("not found");
    }
});

/**
 * ユーザーのプロフィール画像の取得と保存
 * @param userId DefinyのuserId
 * @param imageUrl 画像のURL
 */
const getAndSaveUserImage = async (imageUrl: URL): Promise<URL> => {
    const response = await axios.get(imageUrl.toString(), {
        responseType: "arraybuffer"
    });
    const arrayBuffer: ArrayBuffer = response.data;
    const mimeType: string = response.headers["content-type"];

    const userImageFile: storage.File = await createStorageFile("user-image");
    await userImageFile.save(arrayBuffer, { contentType: mimeType });
    console.log("ランダムに作成したファイル名", userImageFile.name);
    return new URL(
        "https://tsukumart-demo.firebaseapp.com/image/" + userImageFile.name
    );
};

/**
 * ランダムなIDを生成する
 */
const createRandomId = (): string => {
    let id = "";
    const charTable: string =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 20; i++) {
        id += charTable[(Math.random() * charTable.length) | 0];
    }
    return id;
};

/**
 * Firebase Cloud Storageで新しくファイルを作成する
 * 被らないIDで保存したかったが、すでに存在しているかのチェックがうまくいかない
 * ごくまれにかぶるかも
 * @param folderName フォルダの名
 */
const createStorageFile = (folderName: string): storage.File =>
    admin
        .storage()
        .bucket()
        .file(folderName + "/" + createRandomId());

/**
 *
 * @param sub
 */
const createSendEmailToken = (accountService: AccountService, id: string) => {
    const time = new Date();
    time.setUTCMinutes(time.getUTCMinutes() + 30); // 有効期限は30分後
    return jwt.sign(
        { [accountService]: id, exp: Math.round(time.getTime() / 1000) },
        secret.beforeInputUniversity,
        { algorithm: "HS256" }
    );
};

type AccountService = "google" | "github" | "twitter" | "line";
