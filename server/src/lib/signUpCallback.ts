import * as express from "express";
import * as database from "./database";
import { URL, URLSearchParams } from "url";
import axios from "axios";
import { AxiosResponse } from "axios";
import * as key from "./key";
import * as jwt from "jsonwebtoken";
import * as logInWithTwitter from "./twitterLogIn";
import * as utilUrl from "./util/url";

/**
 * アクセストークンとリフレッシュトークンが含まれたURLを作成
 * @param refreshToken リフレッシュトークン
 * @param accessToken アクセストークン
 */
const tokenUrl = (refreshToken: string, accessToken: string): URL =>
    utilUrl.fromString(
        "tsukumart-f0971.web.app",
        new Map([["refreshToken", refreshToken], ["accessToken", accessToken]])
    );

/**
 * 新規登録フォームへのURLを作成
 * @param sendEmailToken
 * @param name
 * @param imageUrl
 */
const signUpUrl = (
    sendEmailToken: string,
    name: string,
    imageUrl: URL
): URL => {
    return utilUrl.fromString(
        "tsukumart-f0971.web.app/signup",
        new Map([
            ["sendEmailToken", sendEmailToken],
            ["name", name],
            ["imageUrl", imageUrl.toString()]
        ])
    );
};

/* =====================================================================
 *                              Google
 * =====================================================================
 */
/** Googleでログインをしたあとのリダイレクト先 */
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
        response.redirect("https://tsukumart-f0971.web.app/");
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
            utilUrl
                .fromString(
                    "www.googleapis.com/oauth2/v4/token",
                    new Map([
                        ["grant_type", "authorization_code"],
                        ["code", code],
                        ["redirect_uri", key.googleLogInRedirectUri],
                        ["client_id", key.googleLogInClientId],
                        ["client_secret", key.googleLogInSecret]
                    ])
                )
                .toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
    );
    try {
        // ユーザーを探す
        const token = await database.getAccessTokenAndRefreshToken({
            accountService: "google",
            accountServiceId: googleData.id
        });
        response.redirect(
            tokenUrl(token.refreshToken, token.accessToken).toString()
        );
    } catch {
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
            signUpUrl(sendEmailToken, googleData.name, imageUrl).toString()
        );
    }
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
const createSendEmailToken = (id: database.LogInAccountServiceId) => {
    const time = new Date();
    time.setUTCMinutes(time.getUTCMinutes() + 30); // 有効期限は30分後
    const payload = {
        sub: database.logInAccountServiceIdToString(id),
        exp: Math.round(time.getTime() / 1000)
    };
    return jwt.sign(payload, key.sendEmailTokenSecret, { algorithm: "HS256" });
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
        response.redirect("https://tsukumart-f0971.web.app/");
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
    try {
        // ユーザーを探す
        const token = await database.getAccessTokenAndRefreshToken({
            accountService: "gitHub",
            accountServiceId: gitHubData.id
        });
        response.redirect(
            tokenUrl(token.refreshToken, token.accessToken).toString()
        );
    } catch (e) {
        console.log("ユーザーを探すところでエラー発生" + e);
        // ユーザーが存在しないなら作成し、リフレッシュトークンを返す

        const imageUrl = await getAndSaveUserImage(
            new URL(gitHubData.avatarUrl)
        );
        const sendEmailToken = createSendEmailToken(
            await database.addUserInUserBeforeInputData(
                "gitHub",
                gitHubData.id,
                gitHubData.name,
                imageUrl
            )
        );
        response.redirect(
            signUpUrl(sendEmailToken, gitHubData.name, imageUrl).toString()
        );
    }
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
        response.redirect("https://tsukumart-f0971.web.app/");
        return;
    }
    const twitterData = await logInWithTwitter.authn(
        key.twitterLogInClientId,
        key.twitterLogInSecret,
        oauthToken,
        oauthVerifier,
        await database.getTwitterLastTokenSecret()
    );

    try {
        // ユーザーを探す
        const token = await database.getAccessTokenAndRefreshToken({
            accountService: "twitter",
            accountServiceId: twitterData.twitterUserId
        });
        response.redirect(
            tokenUrl(token.refreshToken, token.accessToken).toString()
        );
    } catch {
        switch (twitterData.c) {
            case logInWithTwitter.AuthReturnC.NormalAccount: {
                const imageUrl = await getAndSaveUserImage(
                    twitterData.imageUrl
                );
                const sendEmailToken = createSendEmailToken(
                    await database.addUserInUserBeforeInputData(
                        "twitter",
                        twitterData.twitterUserId,
                        twitterData.name,
                        imageUrl
                    )
                );
                response.redirect(
                    signUpUrl(
                        sendEmailToken,
                        twitterData.name,
                        imageUrl
                    ).toString()
                );
                return;
            }
            case logInWithTwitter.AuthReturnC.SecretAccount: {
                const imageUrl = await getAndSaveUserImage(
                    new URL(
                        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                    )
                );
                const sendEmailToken = createSendEmailToken(
                    await database.addUserInUserBeforeInputData(
                        "twitter",
                        twitterData.twitterUserId,
                        "",
                        imageUrl
                    )
                );
                response.redirect(
                    signUpUrl(sendEmailToken, "", imageUrl).toString()
                );
            }
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
        response.redirect("https://tsukumart-f0971.web.app/");
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
    try {
        // ユーザーを探す
        const token = await database.getAccessTokenAndRefreshToken({
            accountService: "line",
            accountServiceId: lineData.id
        });
        response.redirect(
            tokenUrl(token.refreshToken, token.accessToken).toString()
        );
    } catch {
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
            signUpUrl(sendEmailToken, lineData.name, imageUrl).toString()
        );
    }
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
