import * as functions from "firebase-functions";
import { initializedFirebaseAdmin } from "./lib/firebaseInit";
import * as firebase from "firebase";
import * as jwt from "jsonwebtoken";
import * as univ from "./lib/university";
import * as secret from "./secret";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as logInWithTwitter from "./lib/twitterLogIn";
import { AxiosResponse } from "axios";
import { URL, URLSearchParams } from "url";
import axios from "axios";
import * as storage from "@google-cloud/storage";
import * as database from "./lib/database";

const googleLogInClientId =
    "253948313366-d7d6tju8iuo2h1pi9pdjsambnm0b99o3.apps.googleusercontent.com";
const googleLogInSecret = secret.googleLogInSecret;
const googleLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/google_receiver";
const gitHubLogInClientId = "a20a09e6e876c0dbc348";
const gitHubLogInSecret = secret.gitHubLogInSecret;
const gitHubLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/github_receiver";
const twitterLogInClientId = "FpPSOcAoWSBtyrPaUcihCKRzi";
const twitterLogInSecret = secret.twitterLogInSecret;
const twitterLogInRedirectUri =
    "https://tsukumart-demo.firebaseapp.com/social_login/twitter_receiver";
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
                resolve: async (source, args, context, info) =>
                    "https://accounts.google.com/o/oauth2/v2/auth?" +
                    new URLSearchParams({
                        response_type: "code",
                        client_id: googleLogInClientId,
                        redirect_uri: googleLogInRedirectUri,
                        scope: "profile openid",
                        state: await database.generateAndWriteGoogleLogInState()
                    }).toString(),

                description:
                    "Googleで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Googleの認証画面へ"
            },
            getGitHubLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) =>
                    "https://github.com/login/oauth/authorize?" +
                    new URLSearchParams({
                        response_type: "code",
                        client_id: gitHubLogInClientId,
                        redirect_uri: gitHubLogInRedirectUri,
                        scope: "read:user",
                        state: await database.generateAndWriteGitHubLogInState()
                    }).toString(),
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
                    await database.saveTwitterLogInTokenSecret(tokenSecret);
                    return url;
                },
                description:
                    "Twitterで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Twitterの認証画面へ"
            },
            getLineLogInUrl: {
                type: graphql.GraphQLNonNull(graphql.GraphQLString),
                resolve: async (source, args, context, info) =>
                    "https://access.line.me/oauth2/v2.1/authorize?" +
                    new URLSearchParams({
                        response_type: "code",
                        client_id: lineLogInClientId,
                        redirect_uri: lineLogInRedirectUri,
                        scope: "profile openid",
                        state: await database.generateAndWriteLineLogInState()
                    }).toString(),
                description:
                    "LINEで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、LINEの認証画面へ"
            },
            sendConformEmail: {
                type: graphql.GraphQLNonNull(graphql.GraphQLBoolean),
                resolve: async (source, args, context, info) => false,
                args: {
                    name: {
                        type: graphql.GraphQLNonNull(graphql.GraphQLString),
                        description: "表示名"
                    },
                    image: {
                        type: graphql.GraphQLString,
                        description:
                            "画像(DataURL) ソーシャルログインで使ったサービスのままならnull"
                    },
                    schoolAndDepartment: {
                        type: new graphql.GraphQLEnumType({
                            name: "",
                            values: {
                                humanity: {
                                    description: "人文・文化学群 / 人文学類"
                                },
                                culture: {
                                    description: "人文・文化学群 / 比較文化学類"
                                },
                                japanese: {
                                    description:
                                        "人文・文化学群 / 日本語・日本文化学類"
                                }
                            }
                        })
                    }
                },
                description: "ユーザー情報を登録して認証メールを送信する"
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
        if (!(await database.checkExistsGoogleLogInState(state))) {
            console.log(
                "Googleのログインで生成していないstateを指定された",
                state
            );
            response.send(
                `Google LogIn Error: Tsukumart do not generate state =${state}`
            );
            return;
        }

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
        const imageUrl = await getAndSaveUserImage(new URL(googleData.picture));
        const sendEmailToken = createSendEmailToken(
            await database.addUserInUserBeforeInputData(
                "google",
                googleData.sub,
                googleData.name,
                imageUrl
            )
        );
        response.redirect(
            "/signup?" +
                new URLSearchParams(
                    new Map([
                        ["sendEmailToken", sendEmailToken],
                        ["name", googleData.name],
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
        response.setHeader("Cache-Control", "public max-age=3600");
        const file = initializedFirebaseAdmin
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
    initializedFirebaseAdmin
        .storage()
        .bucket()
        .file(folderName + "/" + createRandomId());

/**
 * 情報をまだ入力していないユーザーのトークン
 * @param accountService
 */
const createSendEmailToken = (id: string) => {
    const time = new Date();
    time.setUTCMinutes(time.getUTCMinutes() + 30); // 有効期限は30分後
    return jwt.sign(
        { sub: id, exp: Math.round(time.getTime() / 1000) },
        secret.beforeInputUniversity,
        { algorithm: "HS256" }
    );
};
