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

admin.initializeApp();
firebase.initializeApp({
    apiKey: secret.apiKey,
    projectId: "tsukumart-demo"
});

const dataBase = admin.firestore();
const dataBaseUsersCollection = dataBase.collection("users");
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
    (request, response) => {
        response.send("つくり途中");
    }
);
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
