import * as express from "express";
import * as database from "./database";
import axios, { AxiosResponse } from "axios";
import { URLSearchParams } from "url";
import * as key from "./key";

export const callBack = async (
    request: express.Request,
    response: express.Response
): Promise<void> => {
    const code: string | undefined = request.query.code;
    const state: string | undefined = request.query.state;
    if (code === undefined || state === undefined) {
        console.log(
            "LINE Notifyの設定で、codeかstateが送られて来なかった。ユーザーがキャンセルした?"
        );
        response.redirect("https://tsukumart.com/");
        return;
    }
    if (!(await database.checkExistsLineNotifyState(state))) {
        console.log("LINE Notifyで生成していないstateを指定された", state);
        response.send(
            `LINE Notify Error: tsukumart do not generate state =${state}`
        );
        return;
    }

    const lineData = await responseToAccessToken(
        await axios.post(
            "https://notify-bot.line.me/oauth/token",
            new URLSearchParams(
                new Map([
                    ["grant_type", "authorization_code"],
                    ["code", code],
                    ["redirect_uri", key.lineNotifyRedirectUri],
                    ["client_id", key.lineNotifyClientId],
                    ["client_secret	", key.lineNotifySecret]
                ])
            ).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
    );

    console.log("LINE Notify用のトークンを得た");
    console.log(lineData);
    const messageResponse = await axios.post(
        "https://notify-api.line.me/api/notify",
        new URLSearchParams(
            new Map([
                ["message", "つくマートからのメッセージだ!!!"],
                ["stickerPackageId", "2"],
                ["stickerId", "171"]
            ])
        ).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + lineData
            }
        }
    );
    console.log("メッセージを送信した!");
    console.log(messageResponse.status);
    console.log(messageResponse.headers["X-RateLimit-Limit"]);

    response.send(lineData);
};

const responseToAccessToken = (
    response: AxiosResponse<{ access_token: string }>
) => {
    return response.data.access_token;
};
