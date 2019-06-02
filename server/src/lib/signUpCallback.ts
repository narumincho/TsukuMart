import * as express from "express";
import * as database from "./database";
import { URLSearchParams, URL } from "url";
import axios from "axios";
import { AxiosResponse } from "axios";
import * as key from "./key";
import * as jwt from "jsonwebtoken";

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
    if (!(await database.checkExistsGoogleLogInState(state))) {
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
};

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
export const gitHubLogInReceiver = (
    request: express.Request,
    response: express.Response
): void => {
    response.send("つくり途中");
};

/* =====================================================================
 *                             Twitter
 * =====================================================================
 */
/** Twitterでログインしたあとのリダイレクト先 */
export const twitterLogInReceiver = (
    request: express.Request,
    response: express.Response
): void => {
    response.send("つくり途中");
};
/* =====================================================================
 *                              LINE
 * =====================================================================
 */
/** LINEでログインしたあとのリダイレクト先 */
export const lineLogInReceiver = (
    request: express.Request,
    response: express.Response
) => {
    response.send("つくり途中");
};
