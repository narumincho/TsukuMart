import * as g from "graphql";
import * as key from "./key";
import * as database from "./database";
import * as logInWithTwitter from "./twitterLogIn";
import * as type from "./type";
import * as jwt from "jsonwebtoken";
import * as UtilUrl from "./util/url";
import { URL } from "url";

/**
 * 新規登録かログインするためのURLを得る。
 */
const getLogInUrl = type.makeGraphQLFieldConfig({
    type: type.urlOutputType,
    resolve: async args => {
        const accountService = args.service;
        switch (accountService) {
            case "google": {
                return UtilUrl.fromString(
                    "accounts.google.com/o/oauth2/v2/auth",
                    new Map([
                        ["response_type", "code"],
                        ["client_id", key.googleLogInClientId],
                        ["redirect_uri", key.googleLogInRedirectUri],
                        ["scope", "profile openid"],
                        [
                            "state",
                            await database.generateAndWriteGoogleLogInState()
                        ]
                    ])
                );
            }
            case "gitHub": {
                return UtilUrl.fromString(
                    "github.com/login/oauth/authorize",
                    new Map([
                        ["response_type", "code"],
                        ["client_id", key.gitHubLogInClientId],
                        ["redirect_uri", key.gitHubLogInRedirectUri],
                        ["scope", "read:user"],
                        [
                            "state",
                            await database.generateAndWriteGitHubLogInState()
                        ]
                    ])
                );
            }
            case "twitter": {
                const { tokenSecret, url } = await logInWithTwitter.getLoginUrl(
                    key.twitterLogInClientId,
                    key.twitterLogInSecret,
                    key.twitterLogInRedirectUri
                );
                await database.writeTwitterLogInTokenSecret(tokenSecret);
                return url;
            }
            case "line": {
                return UtilUrl.fromString(
                    "access.line.me/oauth2/v2.1/authorize",
                    new Map([
                        ["response_type", "code"],
                        ["client_id", key.lineLogInClientId],
                        ["redirect_uri", key.lineLogInRedirectUri],
                        ["scope", "profile openid"],
                        [
                            "state",
                            await database.generateAndWriteLineLogInState()
                        ]
                    ])
                );
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

/**
 * ユーザー情報を登録して認証メールを送信する
 */
const sendConformEmail = type.makeGraphQLFieldConfig({
    type: type.unitOutputType,
    resolve: async args => {
        const universityUnsafe = args.university;
        const logInAccountServiceId = verifySendEmailToken(args.sendEmailToken);
        // if (!args.email.match(/s(\d{7})@[a-zA-Z0-9]+\.tsukuba\.ac\.jp/)) {
        //     throw new Error("email address must be tsukuba.ac.jp domain");
        // }

        const userBeforeInputData = await database.getUserInUserBeforeInputData(
            logInAccountServiceId
        );
        let imageUrl: URL;
        if (args.image !== null && args.image !== undefined) {
            imageUrl = await database.saveUserImage(
                args.image.data,
                args.image.mimeType
            );
        } else {
            imageUrl = userBeforeInputData.imageUrl;
        }

        const university = type.universityFromInternal(universityUnsafe);
        await database.addUserBeforeEmailVerificationAndSendEmail(
            logInAccountServiceId,
            args.name,
            imageUrl,
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

const verifySendEmailToken = (
    sendEmailToken: string
): type.LogInServiceAndId => {
    const decoded = jwt.verify(sendEmailToken, key.sendEmailTokenSecret);
    const decodedMarked = decoded as { sub: unknown };
    if (typeof decodedMarked.sub !== "string") {
        throw new Error("sendEmailToken sub is not string");
    }
    return type.logInServiceAndIdFromString(decodedMarked.sub);
};

/**
 * アクセストークンの取得とリフレッシュトークンの更新
 */
const getAccessTokenAndUpdateRefreshToken = type.makeGraphQLFieldConfig({
    type: type.refreshTokenAndAccessTokenOutputType,
    args: {
        refreshToken: {
            type: type.stringInputType,
            description: "リフレッシュトークン"
        }
    },
    resolve: async args =>
        await database.getAccessTokenAndUpdateRefreshToken(args.refreshToken),
    description: "アクセストークンの取得とリフレッシュトークンの更新"
});

const updateProfile = type.makeGraphQLFieldConfig({
    type: type.userPrivateOutputType,
    args: {
        accessToken: {
            type: type.stringInputType,
            description: type.accessTokenDescription
        },
        displayName: {
            type: type.stringInputType,
            description: "表示名"
        },
        image: {
            type: type.nullableInputType(type.dataUrlInputType),
            description: "画像(DataURL) 変更しないならnull"
        },
        introduction: {
            type: type.stringInputType,
            description: "紹介文"
        },
        university: {
            type: type.universityInputType,
            description: type.inputTypeDescription(type.universityInputType)
        }
    },
    resolve: async ({
        accessToken,
        displayName,
        image,
        introduction,
        university
    }) => {
        const { id } = database.verifyAccessToken(accessToken);
        return type.userPrivateToInternal(
            await database.setProfile(
                id,
                displayName,
                image,
                introduction,
                type.universityFromInternal(university)
            )
        );
    },
    description: "プロフィールの更新"
});

const sellProduct = type.makeGraphQLFieldConfig({
    args: {
        name: {
            type: type.stringInputType,
            description: "商品名"
        }
    },
    type: type.productOutputType,
    resolve: async args => {

        return {
            id: "",
            name: "",
            price: 10,
            seller: {
                id: "",
                displayName: "",
                imageUrl: new URL(""),
                introduction: "",
                university: {
                    graduate: "chs",
                    schoolAndDepartment: "aandd"
                },
                selledProductAll: []
            }
        };
    },
    description: "商品の出品"
});

export const mutation = new g.GraphQLObjectType({
    name: "Mutation",
    description: "データを作成、更新ができる",
    fields: {
        getLogInUrl,
        sendConformEmail,
        getAccessTokenAndUpdateRefreshToken,
        updateProfile,
        sellProduct
    }
});
