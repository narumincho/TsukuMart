import * as g from "graphql";
import { URLSearchParams, URL } from "url";
import * as key from "./key";
import * as database from "./database";
import * as logInWithTwitter from "./twitterLogIn";
import * as type from "./type";
import Maybe from "graphql/tsutils/Maybe";
import * as jwt from "jsonwebtoken";

const getLogInUrl = type.makeGraphQLFieldConfig({
    type: type.urlOutputType,
    resolve: async args => {
        const accountService = args.service;
        switch (accountService) {
            case "google": {
                const url = new URL(
                    "https://accounts.google.com/o/oauth2/v2/auth"
                );
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.googleLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.googleLogInRedirectUri
                );
                url.searchParams.append("scope", "profile openid");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteGoogleLogInState()
                );
                return url;
            }
            case "gitHub": {
                const url = new URL("https://github.com/login/oauth/authorize");
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.gitHubLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.gitHubLogInRedirectUri
                );
                url.searchParams.append("scope", "read:user");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteGitHubLogInState()
                );
                return url;
            }
            case "twitter": {
                const { tokenSecret, url } = await logInWithTwitter.getLoginUrl(
                    key.twitterLogInClientId,
                    key.twitterLogInSecret,
                    key.twitterLogInRedirectUri
                );
                await database.saveTwitterLogInTokenSecret(tokenSecret);
                return url;
            }
            case "line": {
                const url = new URL(
                    "https://access.line.me/oauth2/v2.1/authorize"
                );
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.lineLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.lineLogInRedirectUri
                );
                url.searchParams.append("scope", "profile openid");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteLineLogInState()
                );
                return url;
            }
        }
    },
    args: {
        service: {
            type: type.accountServiceInputType,
            description: type.inputTypeDescription(type.accountServiceInputType)
        }
    },
    description:
        "新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、各サービスの認証画面へ"
});

const sendConformEmail = type.makeGraphQLFieldConfig({
    type: type.unitOutputType,
    resolve: async args => {
        const universityUnsafe = args.university;
        const logInAccountServiceId = sendEmailTokenVerify(args.sendEmailToken);
        // if (!args.email.match(/s(\d{7})@[a-zA-Z0-9]+\.tsukuba\.ac\.jp/)) {
        //     throw new Error("email address must be tsukuba.ac.jp domain");
        // }

        const userBeforeInputData = await database.getUserInUserBeforeInputData(
            logInAccountServiceId
        );
        const university = type.universityUnsafeToUniversity(universityUnsafe);
        await database.addUserBeforeEmailVerificationAndSendEmail(
            logInAccountServiceId,
            args.name,
            userBeforeInputData.imageUrl,
            args.email,
            university
        );
        return "ok";
    },
    args: {
        sendEmailToken: {
            type: type.stringInputType,
            description: "認証メールを送るのに必要なトークン"
        },
        name: {
            type: type.stringInputType,
            description: "表示名"
        },
        image: {
            type: type.nullableInputType(type.dataUrlInputType),
            description:
                "画像(DataURL) ソーシャルログインで使ったサービスのままならnull"
        },
        university: {
            type: type.universityInputType,
            description: type.inputTypeDescription(type.universityInputType)
        },
        email: {
            type: type.stringInputType,
            description: "メールアドレス"
        }
    },
    description: "ユーザー情報を登録して認証メールを送信する"
});

const sendEmailTokenVerify = (sendEmailToken: string): string => {
    const decoded = jwt.verify(sendEmailToken, key.sendEmailTokenSecret);
    if (typeof decoded === "string") {
        throw new Error("sendEmailToken include string only");
    }
    const decodedMarked = decoded as { sub: unknown };
    if (typeof decodedMarked.sub !== "string") {
        throw new Error("sendEmailToken sub is not string");
    }
    return decodedMarked.sub;
};

export const mutation = new g.GraphQLObjectType({
    name: "Mutation",
    description: "データを作成、更新ができる",
    fields: {
        getLogInUrl,
        sendConformEmail
    }
});
