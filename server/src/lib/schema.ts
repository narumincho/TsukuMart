import * as g from "graphql";
import * as type from "./type";
import { URL } from "url";
import * as UtilUrl from "./util/url";
import * as key from "./key";
import * as database from "./database";
import * as twitterLogIn from "./twitterLogIn";
import * as jwt from "jsonwebtoken";
import Maybe from "graphql/tsutils/Maybe";

const makeObjectFieldMap = <
    Type extends { [k in string]: unknown } & { id: string }
>(
    args: {
        [Key in keyof Type]: Key extends "id"
            ? {
                  type: g.GraphQLOutputType;
                  description: string;
              }
            : GraphQLFieldConfigWithArgs<Type, Key>
    }
): g.GraphQLFieldConfigMap<Type, void, any> => args;

type GraphQLFieldConfigWithArgs<
    Type extends { [k in string]: unknown },
    Key extends keyof Type
> = {
    type: g.GraphQLOutputType;
    args: any;
    resolve: g.GraphQLFieldResolver<Type, void, any>;
    description: string;
};

const makeObjectField = <
    Type extends { [k in string]: unknown } & { id: string },
    Key extends keyof Type,
    T extends { [k in string]: unknown } // for allがあればなぁ
>(args: {
    type: g.GraphQLOutputType;
    args: { [k in keyof T]: { type: g.GraphQLInputType } };
    resolve: (
        source: Return<Type>,
        args: T,
        context: void,
        info: g.GraphQLResolveInfo
    ) => Promise<Return<Type[Key]>>;
    description: string;
}): GraphQLFieldConfigWithArgs<Type, Key> => ({
    type: args.type,
    args: args.args,
    resolve: args.resolve as any,
    description: args.description
});

/** resolveで返すべき部分型を生成する */
type Return<Type> = Type extends Array<infer E>
    ? Array<ReturnLoop<E>>
    : ReturnLoop<Type>;

/** resolveで返すべき部分型を生成する型関数のループ */
type ReturnLoop<Type> = {
    0: Type;
    1: { id: string } & { [k in keyof Type]?: Return<Type[k]> };
}[Type extends { id: string } ? 1 : 0];

const makeQueryOrMutationField = <
    Args extends { [k in string]: unknown },
    Type
>(args: {
    type: g.GraphQLOutputType;
    args: {
        [a in keyof Args]: {
            type: g.GraphQLInputType;
            description: Maybe<string>;
        }
    };
    resolve: (
        source: void,
        args: Args,
        context: void,
        info: g.GraphQLResolveInfo
    ) => Promise<Type>;
    description: string;
}): g.GraphQLFieldConfig<void, void, any> => args;
/*  =============================================================
                            Product
    =============================================================
*/
const setProductData = async (
    source: Return<type.ProductInternal>
): ReturnType<typeof database.getProduct> => {
    const data = await database.getProduct(source.id);
    source.name = data.name;
    source.price = data.price;
    return data;
};

const productGraphQLType: g.GraphQLObjectType<
    type.ProductInternal,
    void,
    {}
> = new g.GraphQLObjectType({
    name: "Item",
    fields: () =>
        makeObjectFieldMap<type.ProductInternal>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "商品を識別するためのID"
            },
            name: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.name === undefined) {
                        return (await setProductData(source)).name;
                    }
                    return source.name;
                },
                description: "商品名"
            }),
            price: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLInt),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.price === undefined) {
                        return (await setProductData(source)).price;
                    }
                    return source.price;
                },
                description: "値段"
            }),
            seller: makeObjectField({
                type: g.GraphQLNonNull(userGraphQLType),
                args: {},
                resolve: async (
                    source,
                    args,
                    context,
                    info
                ): Promise<Return<type.UserInternal>> => {
                    return {
                        id: "10"
                    };
                },
                description: "出品者"
            })
        })
});
/*  =============================================================
                            User
    =============================================================
*/
const setUserData = async (
    source: Return<type.UserInternal>
): ReturnType<typeof database.getUserData> => {
    const userData = await database.getUserData(source.id);
    source.displayName = userData.displayName;
    source.imageUrl = userData.imageUrl;
    source.introduction = userData.introduction;
    source.university = type.universityToInternal(userData.university);
    return userData;
};

const userGraphQLType = new g.GraphQLObjectType({
    name: "User",
    fields: () =>
        makeObjectFieldMap<type.UserInternal>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "ユーザーを識別するためのID"
            },
            displayName: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.displayName === undefined) {
                        return (await setUserData(source)).displayName;
                    }
                    return source.displayName;
                },
                description: "表示名"
            }),
            imageUrl: makeObjectField({
                type: g.GraphQLNonNull(type.urlGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.imageUrl === undefined) {
                        return (await setUserData(source)).imageUrl;
                    }
                    return source.imageUrl;
                },
                description: "プロフィール画像のURL"
            }),
            introduction: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                description: "紹介文",
                resolve: async (source, args, context, info) => {
                    if (source.introduction === undefined) {
                        return (await setUserData(source)).introduction;
                    }
                    return source.introduction;
                }
            }),
            university: makeObjectField({
                type: g.GraphQLNonNull(type.universityGraphQLObjectType),
                args: {},
                description: "所属",
                resolve: async (source, args, context, info) => {
                    if (source.university === undefined) {
                        return type.universityToInternal(
                            (await setUserData(source)).university
                        );
                    }
                    return source.university;
                }
            }),
            selledProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    return [];
                },
                description: "出品した商品すべて"
            })
        }),
    description: "ユーザー"
});
/** ==============================
 *         User Private
 * ===============================
 */
const userPrivateGraphQLType = new g.GraphQLObjectType({
    name: "UserPrivate",
    fields: () =>
        makeObjectFieldMap<type.UserPrivateInternal>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "ユーザーを識別するためのID"
            },
            displayName: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.displayName === undefined) {
                        return (await setUserData(source)).displayName;
                    }
                    return source.displayName;
                },
                description: "表示名"
            }),
            imageUrl: makeObjectField({
                type: g.GraphQLNonNull(type.urlGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.imageUrl === undefined) {
                        return (await setUserData(source)).imageUrl;
                    }
                    return source.imageUrl;
                },
                description: "プロフィール画像のURL"
            }),
            introduction: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.introduction === undefined) {
                        return (await setUserData(source)).introduction;
                    }
                    return source.introduction;
                },
                description: "紹介文"
            }),
            university: makeObjectField({
                type: g.GraphQLNonNull(type.universityGraphQLObjectType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.university === undefined) {
                        return type.universityToInternal(
                            (await setUserData(source)).university
                        );
                    }
                    return source.university;
                },
                description: "所属"
            }),
            selledProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    return [];
                },
                description: "出品した商品すべて"
            }),
            buyedProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    return [];
                },
                description: "購入した商品すべて"
            }),
            likedProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    return [];
                },
                description: "いいねした商品すべて"
            }),
            historyViewProductAll: makeObjectField<
                type.UserPrivateInternal,
                "historyViewProductAll",
                {}
            >({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.historyViewProductAll === undefined) {
                        const data = await database.getHistoryViewProduct(
                            source.id
                        );
                        source.historyViewProductAll = data;
                        return data;
                    }
                    return source.historyViewProductAll;
                },
                description: "閲覧した商品"
            })
        }),
    description: "個人的な情報を含んだユーザーの情報"
});
/*  =============================================================
                            Query
    =============================================================
*/

const hello = makeQueryOrMutationField<{}, string>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async () => {
        return "Hello World!";
    },
    description: "世界に挨拶する"
});

const userAll = makeQueryOrMutationField<{}, Array<Return<type.UserInternal>>>({
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(userGraphQLType))),
    args: {},
    resolve: async () => {
        return (await database.getAllUser()).map(
            ({ id, displayName, imageUrl, introduction }) => ({
                id,
                displayName,
                imageUrl,
                introduction
            })
        );
    },
    description: "すべてのユーザーの情報を取得する"
});

const userPrivate = makeQueryOrMutationField<
    { accessToken: string },
    Return<type.UserPrivateInternal>
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        }
    },
    type: userPrivateGraphQLType,
    resolve: async (
        source,
        args
    ): Promise<Return<type.UserPrivateInternal>> => {
        const accessTokenData = database.verifyAccessToken(args.accessToken);
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

const productAll = makeQueryOrMutationField<
    {},
    Array<Return<type.ProductInternal>>
>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(productGraphQLType))),
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

/*  =============================================================
                            Mutation
    =============================================================
*/

/**
 * 新規登録かログインするためのURLを得る。
 */
const getLogInUrl = makeQueryOrMutationField<
    { service: type.AccountService },
    URL
>({
    type: g.GraphQLNonNull(type.urlGraphQLType),
    args: {
        service: {
            type: type.accountServiceGraphQLType,
            description: type.accountServiceGraphQLType.description
        }
    },
    resolve: async (source, args) => {
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
    description:
        "新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、各サービスの認証画面へ"
});

/**
 * ユーザー情報を登録して認証メールを送信する
 */
const sendConformEmail = makeQueryOrMutationField<
    {
        sendEmailToken: string;
        name: string;
        image: Maybe<type.DataURL>;
        university: type.UniversityInternal;
        email: string;
    },
    type.Unit
>({
    type: type.unitGraphQLType,
    args: {
        sendEmailToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "認証メールを送るのに必要なトークン"
        },
        name: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        image: {
            type: type.dataUrlGraphQLType,
            description:
                "画像(DataURL) ソーシャルログインで使ったサービスのままならnull"
        },
        university: {
            type: type.universityGraphQLInputType,
            description: type.universityGraphQLInputType.description
        },
        email: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "メールアドレス"
        }
    },
    resolve: async (source, args): Promise<type.Unit> => {
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
const getAccessTokenAndUpdateRefreshToken = makeQueryOrMutationField<
    { refreshToken: string },
    type.RefreshTokenAndAccessToken
>({
    type: type.refreshTokenAndAccessTokenGraphQLType,
    args: {
        refreshToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "リフレッシュトークン"
        }
    },
    resolve: async (source, args): Promise<type.RefreshTokenAndAccessToken> =>
        await database.getAccessTokenAndUpdateRefreshToken(args.refreshToken),
    description: "アクセストークンの取得とリフレッシュトークンの更新"
});

const updateProfile = makeQueryOrMutationField<
    {
        accessToken: string;
        displayName: string;
        image: Maybe<type.DataURL>;
        introduction: string;
        university: type.UniversityInternal;
    },
    type.UserPrivateInternal
>({
    type: userPrivateGraphQLType,
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        displayName: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        image: {
            type: type.dataUrlGraphQLType,
            description: "画像(DataURL) 変更しないならnull"
        },
        introduction: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "紹介文"
        },
        university: {
            type: type.universityGraphQLInputType,
            description: type.universityGraphQLInputType.description
        }
    },
    resolve: async (
        source,
        { accessToken, displayName, image, introduction, university }
    ) => {
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

const sellProduct = makeQueryOrMutationField<
    { accessToken: string; name: string; price: number },
    Return<type.ProductInternal>
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        name: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "商品名"
        },
        price: {
            type: g.GraphQLNonNull(g.GraphQLInt),
            description: "値段"
        }
    },
    type: productGraphQLType,
    resolve: async (source, args) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.sellProduct(id, {
            name: args.name,
            price: args.price
        });
    },
    description: "商品の出品する"
});

const markProductInHistory = makeQueryOrMutationField<
    { accessToken: string; productId: string },
    type.Unit
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "見たと記録する商品ID"
        }
    },
    type: g.GraphQLNonNull(type.unitGraphQLType),
    resolve: async (source, args) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        await database.markProductInHistory(id, args.productId);
        return "ok";
    },
    description: "商品を閲覧したと記録する"
});
/*  =============================================================
                            Schema
    =============================================================
*/

export const schema = new g.GraphQLSchema({
    query: new g.GraphQLObjectType({
        name: "Query",
        description:
            "データを取得できる。データを取得したときに影響は他に及ばさない",
        fields: {
            hello,
            userAll,
            userPrivate,
            productAll
        }
    }),
    mutation: new g.GraphQLObjectType({
        name: "Mutation",
        description: "データを作成、更新ができる",
        fields: {
            getLogInUrl,
            sendConformEmail,
            getAccessTokenAndUpdateRefreshToken,
            updateProfile,
            sellProduct,
            markProductInHistory
        }
    })
});
