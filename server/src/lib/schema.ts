import * as g from "graphql";
import * as type from "./type";
import { URL } from "url";
import * as UtilUrl from "./util/url";
import * as key from "./key";
import * as database from "./database";
import * as twitterLogIn from "./twitterLogIn";
import * as jwt from "jsonwebtoken";

const makeObjectFieldMap = <
    Type extends { [k in string]: unknown },
    NeedReturn extends keyof Type
>(
    args: {
        [Key in keyof Type]: Key extends NeedReturn
            ? {
                  type: g.GraphQLOutputType;
              }
            : GraphQLFieldConfigWithArgs<Type, NeedReturn, Key>
    }
): g.GraphQLFieldConfigMap<Type, void, any> => args;

type GraphQLFieldConfigWithArgs<
    Type extends { [k in string]: unknown },
    NeedReturn extends keyof Type,
    Key extends keyof Type
> = {
    type: g.GraphQLOutputType;
    args: any;
    resolve: g.GraphQLFieldResolver<Type, void, any>;
    description: string;
};

const makeField = <
    Type extends { [k in string]: unknown },
    NeedReturn extends keyof Type,
    Key extends keyof Type,
    T extends { [k in string]: { type: g.GraphQLInputType } } // for allがあればなぁ
>(args: {
    type: g.GraphQLOutputType;
    args: T;
    resolve: (
        source: {
            [a in keyof Type]: a extends NeedReturn
                ? Type[a]
                : Type[a] | undefined
        },
        args: T,
        context: void,
        info: g.GraphQLResolveInfo
    ) => Type[Key];
    description: string;
}): GraphQLFieldConfigWithArgs<Type, NeedReturn, Key> => ({
    type: args.type,
    args: args.args,
    resolve: args.resolve as any,
    description: args.description
});

type InnerObject = {
    readonly id: string;
    name: string;
    imageUrl: string;
    number: number;
};

type InnerObjectNeedReturn = "id";

type Return<
    Type extends { [k in string]: unknown },
    NeedReturn extends keyof Type
> = { [a in NeedReturn]: Type[a] } & { [a in keyof Type]?: Type[a] };

/*  =============================================================
                            Query
    =============================================================
*/

const hello = makeField({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (): Promise<string> => {
        return "Hello World!";
    },
    description: "世界に挨拶する"
});

const userAll = type.makeGraphQLFieldConfig({
    args: {},
    type: type.listOutputType(type.userOutputType),
    resolve: async () => {
        return [
            {
                id: "id",
                introduction: "紹介文",
                imageUrl: new URL(
                    "https://tsukumart-f0971.web.app/temp_temp_temp"
                ),
                displayName: "表示名",
                university: {
                    graduate: "education",
                    schoolAndDepartment: "mast"
                },
                selledProductAll: []
            }
        ];
    },
    description: "すべてのユーザーの情報を取得する"
});

const userPrivate = type.makeGraphQLFieldConfig({
    args: {
        accessToken: {
            type: type.stringInputType,
            description: type.accessTokenDescription
        }
    },
    type: type.userPrivateOutputType,
    resolve: async ({ accessToken }) => {
        const accessTokenData = database.verifyAccessToken(accessToken);
        const userData = await database.getUserData(accessTokenData.id);
        return {
            id: accessTokenData.id,
            displayName: userData.displayName,
            imageUrl: userData.imageUrl,
            introduction: userData.introduction,
            university: type.universityToInternal(userData.university),
            selledProductAll: [],
            buyedProductAll: [],
            likedProductAll: []
        };
    },
    description: "個人的な情報を含んだユーザーの情報を取得する"
});

const productAll = type.makeGraphQLFieldConfig({
    args: {},
    type: type.listOutputType(type.productOutputType),
    resolve: async () => {
        return [
            {
                id: "id",
                name: "商品名",
                price: 100,
                seller: {
                    id: "id",
                    displayName: "出品者",
                    imageUrl: new URL(
                        "https://tsukumart-f0971.web.app/temp_temp_temp"
                    ),
                    introduction: "紹介文",
                    university: {
                        graduate: null,
                        schoolAndDepartment: "cis"
                    },
                    selledProductAll: []
                }
            }
        ];
    },
    description: "すべての商品(売れたものも含まれる)を取得する"
});

export const query = new g.GraphQLObjectType({
    name: "Query",
    description:
        "データを取得できる。データを取得したときに影響は他に及ばさない",
    fields: makeObjectFieldMap({
        hello,
        userAll,
        userPrivate,
        productAll
    })
});

/*  =============================================================
                            Mutation
    =============================================================
*/

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
                const { tokenSecret, url } = await twitterLogIn.getLoginUrl(
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

const innerObject: g.GraphQLObjectType<
    InnerObject,
    void,
    any
> = new g.GraphQLObjectType({
    name: "InnerObject",
    fields: makeObjectFieldMap<InnerObject, InnerObjectNeedReturn>({
        id: {
            type: g.GraphQLString
        },
        imageUrl: makeField({
            type: g.GraphQLString,
            args: {
                name: {
                    type: g.GraphQLString
                }
            },
            resolve: (source, args, context, info) => {
                source.name = "";
                return "htttp://image.com";
            },
            description: "画像のURL"
        }),
        name: makeField({
            type: g.GraphQLString,
            args: {},
            resolve: source => {
                return "namae";
            },
            description: "名前"
        }),
        number: makeField({
            type: g.GraphQLFloat,
            args: {},
            resolve: source => {
                return 65;
            },
            description: "数"
        })
    })
});

export const schema = new g.GraphQLSchema({
    query: new g.GraphQLObjectType({
        name: "Query",
        fields: {
            innerObject: makeField({
                type: innerObject,
                args: {},
                resolve: (): Return<InnerObject, InnerObjectNeedReturn> => {
                    return {
                        id: "53"
                    };
                },
                description: "サンプルオブジェクト"
            })
        },
        description: ""
    })
});
