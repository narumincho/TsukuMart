import * as express from "express";
import * as database from "./database";
import { URLSearchParams, URL } from "url";
import axios from "axios";
import { AxiosResponse } from "axios";
import * as key from "./key";
import * as jwt from "jsonwebtoken";
import * as logInWithTwitter from "./twitterLogIn";

/* =====================================================================
 *                              Google
 * =====================================================================
 */
/** GitHubでログインをしたあとのリダイレクト先 */
export const googleLogInReceiver = async (
    request: express.Request,
    response: express.Response
): Promise<void> => {
    const code: string | undefined = request.query.code;
    const state: string | undefined = request.query.state;
    if (code === undefined || state === undefined) {
        console.log(
            "Googleからcodeかstateが送られて来なかった。ユーザーがキャンセルした?"
        );
        response.redirect("/");
        return;
    }
    if (!(await database.checkExistsLogInState(state, "google"))) {
        console.log("Googleのログインで生成していないstateを指定された", state);
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
                    ["redirect_uri", key.googleLogInRedirectUri],
                    ["client_id", key.googleLogInClientId],
                    ["client_secret", key.googleLogInSecret]
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
            googleData.id,
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
};

const googleTokenResponseToData = (
    response: AxiosResponse<{ id_token: string }>
): {
    id: string;
    name: string;
    picture: string;
} => {
    const idToken = response.data.id_token;
    console.log("googleIdToken id_token=", idToken);
    const decoded = jwt.decode(idToken);
    if (typeof decoded === "string") {
        throw new Error("Google jwt include string only!");
    }
    const markedDecoded = decoded as {
        iss: unknown;
        sub: unknown;
        name: unknown;
        picture: unknown;
    };
    if (
        markedDecoded.iss !== "https://accounts.google.com" ||
        typeof markedDecoded.name !== "string" ||
        typeof markedDecoded.sub !== "string" ||
        typeof markedDecoded.picture !== "string"
    ) {
        throw new Error(
            "LINEから送られてきたトークンがおかしい" + markedDecoded
        );
    }

    return {
        id: markedDecoded.sub,
        name: markedDecoded.name,
        picture: markedDecoded.picture
    };
};

/**
 * 認証メールを送るのに必要なトークン
 * @param id データベースで作成したID
 */
const createSendEmailToken = (id: string) => {
    const time = new Date();
    time.setUTCMinutes(time.getUTCMinutes() + 30); // 有効期限は30分後
    const payload = { sub: id, exp: Math.round(time.getTime() / 1000) };
    return jwt.sign(payload, key.beforeInputUniversity, { algorithm: "HS256" });
};

const getAndSaveUserImage = async (imageUrl: URL): Promise<URL> => {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(
        imageUrl.toString(),
        {
            responseType: "arraybuffer"
        }
    );
    const mimeType: string = response.headers["content-type"];
    return await database.saveUserImage(response.data, mimeType);
};

/* =====================================================================
 *                              GitHub
 * =====================================================================
 */
/** GitHubでログインをしたあとのリダイレクト先 */
export const gitHubLogInReceiver = async (
    request: express.Request,
    response: express.Response
): Promise<void> => {
    const code: string | undefined = request.query.code;
    const state: string | undefined = request.query.state;
    if (code === undefined || state === undefined) {
        console.log(
            "GitHubからcodeかstateが送られて来なかった。ユーザーがキャンセルした?"
        );
        response.redirect("/");
        return;
    }
    if (!database.checkExistsLogInState(state, "gitHub")) {
        console.log("GitHubのログインで生成していないstateを指定された", state);
        response.send(
            `GitHub LogIn Error: Tsukumart do not generate state =${state}`
        );
        return;
    }
    // ここでhttps://github.com/login/oauth/access_tokenにqueryのcodeをつけて送信。IDトークンを取得する
    const gitHubAccessToken = (await axios.post(
        "https://github.com/login/oauth/access_token?",
        new URLSearchParams(
            new Map([
                ["grant_type", "authorization_code"],
                ["code", code],
                ["redirect_uri", key.gitHubLogInRedirectUri],
                ["client_id", key.gitHubLogInClientId],
                ["client_secret", key.gitHubLogInSecret]
            ])
        ).toString(),
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )).data.access_token;

    const gitHubData: {
        id: string;
        name: string;
        avatarUrl: string;
    } = (await axios.post(
        "https://api.github.com/graphql",
        {
            query: `
query {
    viewer {
        id
        name
        avatarUrl
    }
}
`
        },
        {
            headers: {
                Authorization: "token " + gitHubAccessToken
            }
        }
    )).data.data.viewer;
    // ユーザーが存在しないなら作成し、リフレッシュトークンを返す

    const imageUrl = await getAndSaveUserImage(new URL(gitHubData.avatarUrl));
    const sendEmailToken = createSendEmailToken(
        await database.addUserInUserBeforeInputData(
            "gitHub",
            gitHubData.id,
            gitHubData.name,
            imageUrl
        )
    );
    response.redirect(
        "/signup?" +
            new URLSearchParams(
                new Map([
                    ["sendEmailToken", sendEmailToken],
                    ["name", gitHubData.name],
                    ["imageUrl", imageUrl.toString()]
                ])
            ).toString()
    );
};

/* =====================================================================
 *                             Twitter
 * =====================================================================
 */
/** Twitterでログインしたあとのリダイレクト先 */
export const twitterLogInReceiver = async (
    request: express.Request,
    response: express.Response
): Promise<void> => {
    const oauthToken: string | undefined = request.query.oauth_token;
    const oauthVerifier: string | undefined = request.query.oauth_verifier;
    if (oauthToken === undefined || oauthVerifier === undefined) {
        console.error(
            "Twitterからoauth_tokenかoauth_verifierが送られて来なかった。ユーザーがキャンセルした?"
        );
        response.redirect("/");
        return;
    }
    const twitterData = await logInWithTwitter.authn(
        key.twitterLogInClientId,
        key.twitterLogInSecret,
        oauthToken,
        oauthVerifier,
        await database.getTwitterLastTokenSecret()
    );

    switch (twitterData.c) {
        case logInWithTwitter.AuthReturnC.NormalAccount: {
            const imageUrl = await getAndSaveUserImage(twitterData.imageUrl);
            const sendEmailToken = createSendEmailToken(
                await database.addUserInUserBeforeInputData(
                    "google",
                    twitterData.twitterUserId,
                    twitterData.name,
                    imageUrl
                )
            );
            response.redirect(
                "/signup?" +
                    new URLSearchParams(
                        new Map([
                            ["sendEmailToken", sendEmailToken],
                            ["name", twitterData.name],
                            ["imageUrl", imageUrl.toString()]
                        ])
                    ).toString()
            );
        }
        case logInWithTwitter.AuthReturnC.SecretAccount: {
            const imageUrl = await getAndSaveUserImage(
                new URL(
                    "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                )
            );
            const sendEmailToken = createSendEmailToken(
                await database.addUserInUserBeforeInputData(
                    "google",
                    twitterData.twitterUserId,
                    "",
                    imageUrl
                )
            );
            response.redirect(
                "/signup?" +
                    new URLSearchParams(
                        new Map([
                            ["sendEmailToken", sendEmailToken],
                            ["name", ""],
                            ["imageUrl", imageUrl.toString()]
                        ])
                    ).toString()
            );
        }
    }
};
/* =====================================================================
 *                              LINE
 * =====================================================================
 */
/** LINEでログインしたあとのリダイレクト先 */
export const lineLogInReceiver = async (
    request: express.Request,
    response: express.Response
): Promise<void> => {
    console.log("lineLogInCodeReceiver", request.query);
    const code: string | undefined = request.query.code;
    const state: string | undefined = request.query.state;
    if (code === undefined || state === undefined) {
        console.log(
            "LINEからcodeかstateが送られて来なかった。ユーザーがキャンセルした?"
        );
        response.redirect("/");
        return;
    }
    if (!(await database.checkExistsLogInState(state, "line"))) {
        console.log("lineのログインで生成していないstateを指定された", state);
        response.send(
            `LINE LogIn Error: definy do not generate state =${state}`
        );
        return;
    }

    // ここでhttps://api.line.me/oauth2/v2.1/tokenにqueryのcodeをつけて送信。IDトークンを取得する
    const lineData = await lineTokenResponseToData(
        await axios.post(
            "https://api.line.me/oauth2/v2.1/token",
            new URLSearchParams(
                new Map([
                    ["grant_type", "authorization_code"],
                    ["code", code],
                    ["redirect_uri", key.lineLogInRedirectUri],
                    ["client_id", key.lineLogInClientId],
                    ["client_secret", key.lineLogInSecret]
                ])
            ).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
    );

    const imageUrl = await getAndSaveUserImage(new URL(lineData.picture));
    const sendEmailToken = createSendEmailToken(
        await database.addUserInUserBeforeInputData(
            "line",
            lineData.id,
            lineData.name,
            imageUrl
        )
    );
    response.redirect(
        "/signup?" +
            new URLSearchParams(
                new Map([
                    ["sendEmailToken", sendEmailToken],
                    ["name", lineData.name],
                    ["imageUrl", imageUrl.toString()]
                ])
            ).toString()
    );
};

/**
 * 取得したidトークンからプロフィール画像と名前とLINEのIDを取得する
 */
const lineTokenResponseToData = (
    response: AxiosResponse<{ id_token: string }>
): {
    id: string;
    name: string;
    picture: string;
} => {
    const idToken = response.data.id_token;
    console.log("lineToken id_token=", idToken);
    const decoded = jwt.verify(idToken, key.lineLogInSecret, {
        algorithms: ["HS256"]
    });
    if (typeof decoded === "string") {
        throw new Error("LINE jwt include string only!");
    }
    const markedDecoded = decoded as {
        iss: unknown;
        sub: unknown;
        name: unknown;
        picture: unknown;
    };
    if (
        markedDecoded.iss !== "https://access.line.me" ||
        typeof markedDecoded.name !== "string" ||
        typeof markedDecoded.sub !== "string" ||
        typeof markedDecoded.picture !== "string"
    ) {
        throw new Error("LINEから送られてきたトークンがおかしい");
    }

    return {
        id: markedDecoded.sub,
        name: markedDecoded.name,
        picture: markedDecoded.picture
    };
};
