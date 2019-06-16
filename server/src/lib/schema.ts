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

const makeField = <
    Type extends { [k in string]: unknown } & { id: string },
    Key extends keyof Type,
    T extends { [k in string]: { type: g.GraphQLInputType } } // for allがあればなぁ
>(args: {
    type: g.GraphQLOutputType;
    args: T;
    resolve: (
        source: {
            [a in keyof Type]: a extends "id" ? Type[a] : Type[a] | undefined
        },
        args: T,
        context: void,
        info: g.GraphQLResolveInfo
    ) => Type[Key] extends { id: string }
        ? Partial<Type[Key]> & { id: string }
        : Type[Key];
    description: string;
}): GraphQLFieldConfigWithArgs<Type, Key> => ({
    type: args.type,
    args: args.args,
    resolve: args.resolve as any,
    description: args.description
});

type Return<Type extends { [k in string]: unknown } & { id: string }> = {
    id: string;
} & { [a in keyof Type]?: Type[a] };

/*  =============================================================
                            Product
    =============================================================
*/

const productGraphQLType: g.GraphQLObjectType<
    type.Product,
    void,
    {}
> = new g.GraphQLObjectType({
    name: "Item",
    fields: () =>
        makeObjectFieldMap<type.Product>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLString)
            },
            name: makeField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: (source, args, context, info) => {
                    return "商品名";
                },
                description: "商品名"
            }),
            price: makeField({
                type: g.GraphQLNonNull(g.GraphQLInt),
                args: {},
                resolve: (source, args, context, info) => {
                    return 12;
                },
                description: "値段"
            }),
            seller: makeField({
                type: g.GraphQLNonNull(userGraphQLType),
                args: {},
                resolve: (source, args, context, info): Return<type.User> => {
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
const userGraphQLType = new g.GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "ユーザーを識別するためのID"
        },
        displayName: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        imageUrl: {
            type: g.GraphQLNonNull(type.urlGraphQLType),
            description: "プロフィール画像のURL"
        },
        introduction: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "紹介文"
        },
        university: {
            type: g.GraphQLNonNull(type.universityGraphQLObjectType),
            description: "所属"
        },
        selledProductAll: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
            ),
            description: "出品した商品すべて"
        }
    }),
    description: "ユーザー"
});
/** ==============================
 *         User Private
 * ===============================
 */
export const userPrivateGraphQLType = new g.GraphQLObjectType({
    name: "UserPrivate",
    fields: () => ({
        id: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "ユーザーを識別するためのID"
        },
        displayName: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        imageUrl: {
            type: g.GraphQLNonNull(type.urlGraphQLType),
            description: "プロフィール画像のURL"
        },
        introduction: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "紹介文"
        },
        university: {
            type: g.GraphQLNonNull(type.universityGraphQLObjectType),
            description: "所属"
        },
        selledProductAll: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
            ),
            description: "出品した商品すべて"
        },
        buyedProductAll: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
            ),
            description: "購入した商品すべて"
        },
        likedProductAll: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
            ),
            description: "いいねした商品すべて"
        }
    }),
    description: "個人的な情報を含んだユーザーの情報"
});

/*  =============================================================
                            Query
    =============================================================
*/

const hello: g.GraphQLFieldConfig<void, void, {}> = {
    args: {},
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (): Promise<string> => {
        return "Hello World!";
    },
    description: "世界に挨拶する"
};

const userAll: g.GraphQLFieldConfig<void, void, {}> = {
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(userGraphQLType))),
    args: {},
    resolve: async (): Promise<Array<Return<type.UserInternal>>> => {
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
};

const userPrivate: g.GraphQLFieldConfig<void, void, { accessToken: string }> = {
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
};

const productAll: g.GraphQLFieldConfig<void, void, {}> = {
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
};

/*  =============================================================
                            Mutation
    =============================================================
*/

/**
 * 新規登録かログインするためのURLを得る。
 */
const getLogInUrl: g.GraphQLFieldConfig<
    void,
    void,
    { service: type.AccountService }
> = {
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
};

/**
 * ユーザー情報を登録して認証メールを送信する
 */
const sendConformEmail: g.GraphQLFieldConfig<
    void,
    void,
    {
        sendEmailToken: string;
        name: string;
        image: Maybe<type.DataURLInternal>;
        university: type.UniversityInternal;
        email: string;
    }
> = {
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
};

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
const getAccessTokenAndUpdateRefreshToken: g.GraphQLFieldConfig<
    void,
    void,
    { refreshToken: string }
> = {
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
};

const updateProfile: g.GraphQLFieldConfig<
    void,
    void,
    {
        accessToken: string;
        displayName: string;
        image: Maybe<type.DataURLInternal>;
        introduction: string;
        university: type.UniversityInternal;
    }
> = {
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
};

const sellProduct: g.GraphQLFieldConfig<
    void,
    void,
    { name: string; price: number }
> = {
    args: {
        name: {
            type: g.GraphQLString,
            description: "商品名"
        },
        price: {
            type: g.GraphQLInt,
            description: "値段"
        }
    },
    type: productGraphQLType,
    resolve: async (source, args) => {
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
};

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
            hello: hello as g.GraphQLFieldConfig<void, void, any>,
            userAll: userAll as g.GraphQLFieldConfig<void, void, any>,
            userPrivate: userPrivate as g.GraphQLFieldConfig<void, void, any>,
            productAll: productAll as g.GraphQLFieldConfig<void, void, any>
        }
    }),
    mutation: new g.GraphQLObjectType({
        name: "Mutation",
        description: "データを作成、更新ができる",
        fields: {
            getLogInUrl: getLogInUrl as g.GraphQLFieldConfig<void, void, any>,
            sendConformEmail: sendConformEmail as g.GraphQLFieldConfig<
                void,
                void,
                any
            >,
            getAccessTokenAndUpdateRefreshToken: getAccessTokenAndUpdateRefreshToken as g.GraphQLFieldConfig<
                void,
                void,
                any
            >,
            updateProfile: updateProfile as g.GraphQLFieldConfig<
                void,
                void,
                any
            >,
            sellProduct: sellProduct as g.GraphQLFieldConfig<void, void, any>
        }
    })
});
