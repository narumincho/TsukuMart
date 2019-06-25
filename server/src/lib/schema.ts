import * as g from "graphql";
import * as type from "./type";
import { URL } from "url";
import * as UtilUrl from "./util/url";
import * as key from "./key";
import * as database from "./database";
import * as twitterLogIn from "./twitterLogIn";
import * as jwt from "jsonwebtoken";
import Maybe from "graphql/tsutils/Maybe";

const makeObjectFieldMap = <Type extends { [k in string]: unknown }>(
    args: Type extends { id: string }
        ? ({
              [Key in keyof Type]: Key extends "id"
                  ? {
                        type: g.GraphQLOutputType;
                        description: string;
                    }
                  : GraphQLFieldConfigWithArgs<Type, Key>
          })
        : {
              [Key in keyof Type]: {
                  type: g.GraphQLOutputType;
                  description: string;
              }
          }
): g.GraphQLFieldConfigMap<Type, void, any> => args;

type GraphQLFieldConfigWithArgs<
    Type extends { [k in string]: unknown },
    Key extends keyof Type // この型変数は型推論に使われる
> = {
    type: g.GraphQLOutputType;
    args: any;
    resolve: g.GraphQLFieldResolver<Type, void, any>;
    description: string;
    __byMakeObjectFieldFunctionBrand: never;
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
}): GraphQLFieldConfigWithArgs<Type, Key> =>
    ({
        type: args.type,
        args: args.args,
        resolve: args.resolve as any,
        description: args.description
    } as GraphQLFieldConfigWithArgs<Type, Key>);

/** resolveで返すべき部分型を生成する */
type Return<Type> = Type extends Array<infer E>
    ? Array<ReturnLoop<E>>
    : ReturnLoop<Type>;

/** resolveで返すべき部分型を生成する型関数のループ */
type ReturnLoop<Type> = {
    0: { [k in keyof Type]: Return<Type[k]> };
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
    ) => Promise<Return<Type>>;
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
    source.description = data.description;
    source.condition = data.condition;
    source.category = data.category;
    source.likedCount = data.likedCount;
    source.viewedCount = data.viewedCount;
    source.createdAt = data.createdAt;
    source.seller = data.seller;
    source.updateAt = data.updateAt;
    return data;
};

const productGraphQLType: g.GraphQLObjectType<
    type.ProductInternal,
    void,
    {}
> = new g.GraphQLObjectType({
    name: "Product",
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
            description: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.description === undefined) {
                        return (await setProductData(source)).description;
                    }
                    return source.description;
                },
                description: "説明文"
            }),
            condition: makeObjectField({
                type: type.conditionGraphQLType,
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.condition === undefined) {
                        return (await setProductData(source)).condition;
                    }
                    return source.condition;
                },
                description: type.conditionDescription
            }),
            category: makeObjectField({
                type: g.GraphQLNonNull(type.categoryGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.category === undefined) {
                        return (await setProductData(source)).category;
                    }
                    return source.category;
                },
                description: type.categoryDescription
            }),
            likedCount: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLInt),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.likedCount === undefined) {
                        return (await setProductData(source)).likedCount;
                    }
                    return source.likedCount;
                },
                description: "いいねされた数"
            }),
            viewedCount: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLInt),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.viewedCount === undefined) {
                        return (await setProductData(source)).viewedCount;
                    }
                    return source.viewedCount;
                },
                description: "閲覧履歴に登録された数"
            }),
            seller: makeObjectField({
                type: g.GraphQLNonNull(userGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.seller === undefined) {
                        return (await setProductData(source)).seller;
                    }
                    return source.seller;
                },
                description: "出品者"
            }),
            comments: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productCommentGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.comments === undefined) {
                        const comments = await database.getProductComments(
                            source.id
                        );
                        source.comments = comments;
                        return comments;
                    }
                    return source.comments;
                },
                description: ""
            }),
            createdAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.createdAt === undefined) {
                        return (await setProductData(source)).createdAt;
                    }
                    return source.createdAt;
                },
                description: "出品された日時"
            }),
            updateAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.updateAt === undefined) {
                        return (await setProductData(source)).updateAt;
                    }
                    return source.updateAt;
                },
                description: "更新日時"
            })
        })
});
/*  =============================================================
                         Product Comment
    =============================================================
*/
const productCommentGraphQLType = new g.GraphQLObjectType({
    name: "ProductComment",
    fields: () =>
        makeObjectFieldMap<type.TradeComment>({
            commentId: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description:
                    "商品のコメントを識別するためのID。商品内で閉じたID。"
            },
            body: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "本文"
            },
            speaker: {
                type: g.GraphQLNonNull(userGraphQLType),
                description: "発言者"
            },
            createdAt: {
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                description: "コメントが作成された日時"
            }
        })
});

/*  =============================================================
                        Draft Product
    =============================================================
*/
/**
 * 商品の下書き。すべてフィールドをresolveで返さなければならない
 */
export const draftProductGraphQLType = new g.GraphQLObjectType<
    type.DraftProduct,
    void,
    {}
>({
    name: "DraftProduct",
    fields: () =>
        makeObjectFieldMap<type.DraftProduct>({
            draftId: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description:
                    "下書きの商品を識別するためのID。ユーザー内で閉じたID。"
            },
            name: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "商品名"
            },
            price: {
                type: g.GraphQLInt,
                description: "値段 まだ決めていない場合はnull"
            },
            description: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "商品の説明文"
            },
            condition: {
                type: type.conditionGraphQLType,
                description: "商品の品質状態 まだ決めていない場合はnull"
            },
            category: {
                type: type.categoryGraphQLType,
                description:
                    "商品を分類するカテゴリー まだ決めていない場合はnull"
            },
            createdAt: {
                type: type.dateTimeGraphQLType,
                description: "作成日時"
            },
            updateAt: {
                type: type.dateTimeGraphQLType,
                description: "更新日時"
            }
        }),
    description: "商品の下書き"
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
    source.createdAt = userData.createdAt;
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
            createdAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.createdAt === undefined) {
                        return (await setUserData(source)).createdAt;
                    }
                    return source.createdAt;
                },
                description: "ユーザーが作成された日時"
            }),
            soldProductAll: makeObjectField({
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

/*  =============================================================
                            User Private
    =============================================================
*/
const setUserPrivateData = async (
    source: Return<type.UserPrivateInternal>
): ReturnType<typeof database.getUserData> => {
    const userData = await database.getUserData(source.id);
    source.displayName = userData.displayName;
    source.imageUrl = userData.imageUrl;
    source.introduction = userData.introduction;
    source.university = type.universityToInternal(userData.university);
    source.createdAt = userData.createdAt;
    return userData;
};

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
            createdAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.createdAt === undefined) {
                        return (await setUserData(source)).createdAt;
                    }
                    return source.createdAt;
                },
                description: "ユーザーが作成された日時"
            }),
            soldProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    return [];
                },
                description: "出品した商品すべて"
            }),
            boughtProductAll: makeObjectField({
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
            }),
            draftProducts: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(draftProductGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.draftProducts === undefined) {
                        const draftProducts = await database.getDraftProducts(
                            source.id
                        );
                        source.draftProducts = draftProducts;
                        return draftProducts;
                    }
                    return source.draftProducts;
                },
                description: "下書きの商品"
            }),
            tradeAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(tradeGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.tradeAll === undefined) {
                        return []; // TODO
                    }
                    return source.tradeAll;
                },
                description: "取引データ"
            })
        }),
    description: "個人的な情報を含んだユーザーの情報"
});

/*  =============================================================
                            Trade
    =============================================================
*/
const setTradeData = async (
    source: Return<type.Trade>
): ReturnType<typeof database.getTrade> => {
    const data = await database.getTrade(source.id);
    source.product = data.product;
    source.buyer = data.buyer;
    source.comment = data.comment;
    source.createdAt = data.createdAt;
    source.updateAt = data.updateAt;
    return data;
};

const tradeGraphQLType = new g.GraphQLObjectType({
    name: "Trade",
    fields: () =>
        makeObjectFieldMap<type.Trade>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "取引データを識別するためのID"
            },
            product: makeObjectField({
                type: g.GraphQLNonNull(productGraphQLType),
                args: {},
                description: "取引中の商品",
                resolve: async (source, args, context, info) => {
                    if (source.product === undefined) {
                        return (await setTradeData(source)).product;
                    }
                    return source.product;
                }
            }),
            buyer: makeObjectField({
                type: g.GraphQLNonNull(userGraphQLType),
                args: {},
                description: "商品を買いたい人",
                resolve: async (source, args, context, info) => {
                    if (source.buyer === undefined) {
                        return (await setTradeData(source)).buyer;
                    }
                    return source.buyer;
                }
            }),
            comment: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(tradeCommentGraphQLType))
                ),
                args: {},
                description: "コメント",
                resolve: async (source, args, context, info) => {
                    if (source.comment === undefined) {
                        return (await setTradeData(source)).comment;
                    }
                    return source.comment;
                }
            }),
            createdAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                description: "取引開始日時",
                resolve: async (source, args, context, info) => {
                    if (source.createdAt === undefined) {
                        return (await setTradeData(source)).createdAt;
                    }
                    return source.createdAt;
                }
            }),
            updateAt: makeObjectField({
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                args: {},
                description: "更新日時",
                resolve: async (source, args, context, info) => {
                    if (source.updateAt === undefined) {
                        return (await setTradeData(source)).updateAt;
                    }
                    return source.updateAt;
                }
            })
        }),
    description: "取引データ"
});
/*  =============================================================
                         Trade Comment
    =============================================================
*/
const tradeCommentGraphQLType = new g.GraphQLObjectType({
    name: "TradeComment",
    fields: () =>
        makeObjectFieldMap<type.TradeComment>({
            commentId: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description:
                    "取引のコメントを識別するためのID。取引内で閉じたID。"
            },
            body: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "本文"
            },
            speaker: {
                type: g.GraphQLNonNull(type.sellerOrBuyerGraphQLType),
                description: "発言者"
            },
            createdAt: {
                type: g.GraphQLNonNull(type.dateTimeGraphQLType),
                description: "コメントが作成された日時"
            }
        })
});

/*  =============================================================
                            Query
    =============================================================
*/

const hello = makeQueryOrMutationField<{}, string>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async () => {
        return "Hello World! I'm Tsuku Bird.";
    },
    description: "世界に挨拶する"
});

const user = makeQueryOrMutationField<
    Pick<type.UserInternal, "id">,
    type.UserInternal
>({
    type: g.GraphQLNonNull(userGraphQLType),
    args: {
        id: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "ユーザーを識別するためのID"
        }
    },
    resolve: async (source, args) => {
        const userData = await database.getUserData(args.id);
        return {
            id: args.id,
            displayName: userData.displayName,
            imageUrl: userData.imageUrl,
            introduction: userData.introduction,
            university: type.universityToInternal(userData.university)
        };
    },
    description: "ユーザーの情報を取得する"
});

const userAll = makeQueryOrMutationField<{}, Array<type.UserInternal>>({
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
    type.UserPrivateInternal
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        }
    },
    type: g.GraphQLNonNull(userPrivateGraphQLType),
    resolve: async (source, args) => {
        const accessTokenData = database.verifyAccessToken(args.accessToken);
        const userData = await database.getUserData(accessTokenData.id);
        return {
            id: accessTokenData.id,
            displayName: userData.displayName,
            imageUrl: userData.imageUrl,
            introduction: userData.introduction,
            university: type.universityToInternal(userData.university),
            soldProductAll: [],
            boughtProductAll: [],
            likedProductAll: []
        };
    },
    description: "個人的な情報を含んだユーザーの情報を取得する"
});

const product = makeQueryOrMutationField<
    Pick<type.ProductInternal, "id">,
    type.ProductInternal
>({
    args: {
        id: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "商品を識別するためのID"
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args) => {
        if (await database.existsProduct(args.id)) {
            return {
                id: args.id
            };
        }
        throw new Error(`product (id=${args.id}) dose not exists`);
    },
    description: "商品の情報を取得する"
});

const productAll = makeQueryOrMutationField<{}, Array<type.ProductInternal>>({
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
                    soldProductAll: []
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
            type: g.GraphQLNonNull(type.accountServiceGraphQLType),
            description: type.accountServiceGraphQLType.description
        }
    },
    resolve: async (source, args) => {
        const accountService = args.service;
        switch (accountService) {
            case "google": {
                return UtilUrl.fromStringWithQuery(
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
                return UtilUrl.fromStringWithQuery(
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
                return UtilUrl.fromStringWithQuery(
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
        image: Maybe<type.DataURL>;
        email: string;
    } & Pick<type.UserPrivateInternal, "displayName" | "university">,
    type.Unit
>({
    type: g.GraphQLNonNull(type.unitGraphQLType),
    args: {
        sendEmailToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "認証メールを送るのに必要なトークン"
        },
        displayName: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        image: {
            type: type.dataUrlGraphQLType,
            description:
                "画像。サイズは400x400まで。ソーシャルログインで使ったサービスのままならnull"
        },
        university: {
            type: g.GraphQLNonNull(type.universityGraphQLInputType),
            description: type.universityGraphQLInputType.description
        },
        email: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "メールアドレス"
        }
    },
    resolve: async (source, args): Promise<type.Unit> => {
        console.log("schemaのsendConformEmailのリゾルバが呼ばれた");
        const universityUnsafe = args.university;
        const logInAccountServiceId = verifySendEmailToken(args.sendEmailToken);
        // if (!args.email.match(/s(\d{7})@[a-zA-Z0-9]+\.tsukuba\.ac\.jp/)) {
        //     throw new Error("email address must be tsukuba.ac.jp domain");
        // }

        const userBeforeInputData = await database.getUserInUserBeforeInputData(
            logInAccountServiceId
        );
        console.log("前に入力したデータを受け取った");
        let imageUrl: URL;
        if (args.image !== null && args.image !== undefined) {
            imageUrl = await database.saveUserImage(
                args.image.data,
                args.image.mimeType
            );
            await database.deleteUserImage(userBeforeInputData.imageUrl);
        } else {
            imageUrl = userBeforeInputData.imageUrl;
        }

        console.log(`画像のURLを取得 ${imageUrl}`);
        const university = type.universityFromInternal(universityUnsafe);
        await database.addUserBeforeEmailVerificationAndSendEmail(
            logInAccountServiceId,
            args.displayName,
            imageUrl,
            args.email,
            university
        );
        console.log("okを返す");
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
    type: g.GraphQLNonNull(type.refreshTokenAndAccessTokenGraphQLType),
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
        image: Maybe<type.DataURL>;
    } & Pick<
        type.UserPrivateInternal,
        "displayName" | "introduction" | "university"
    >,
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
            type: g.GraphQLNonNull(type.universityGraphQLInputType),
            description: type.universityGraphQLInputType.description
        }
    },
    resolve: async (
        source,
        { accessToken, displayName, image, introduction, university }
    ) => {
        const { id } = database.verifyAccessToken(accessToken);
        const profileData = await database.setProfile(id, {
            displayName: displayName,
            image,
            introduction,
            university: type.universityFromInternal(university)
        });
        return {
            id: profileData.id
        };
    },
    description: "プロフィールの更新"
});

const sellProduct = makeQueryOrMutationField<
    {
        accessToken: string;
    } & Pick<
        type.ProductInternal,
        "name" | "price" | "description" | "condition" | "category"
    >,
    type.ProductInternal
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
        },
        description: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "説明文"
        },
        condition: {
            type: g.GraphQLNonNull(type.conditionGraphQLType),
            description: type.conditionDescription
        },
        category: {
            type: g.GraphQLNonNull(type.categoryGraphQLType),
            description: type.categoryDescription
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.sellProduct(id, {
            name: args.name,
            price: args.price,
            description: args.description,
            condition: args.condition,
            category: args.category
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

const addDraftProduct = makeQueryOrMutationField<
    { accessToken: string } & Pick<
        type.DraftProduct,
        "name" | "price" | "description" | "condition" | "category"
    >,
    type.DraftProduct
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
            type: g.GraphQLInt,
            description: "価格 まだ決めていない場合はnull"
        },
        description: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "説明文"
        },
        condition: {
            type: type.conditionGraphQLType,
            description:
                type.conditionDescription + "まだ決めていない場合はnull"
        },
        category: {
            type: type.categoryGraphQLType,
            description: type.categoryDescription + "まだ決めていない場合はnull"
        }
    },
    type: g.GraphQLNonNull(draftProductGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.addDraftProductData(id, {
            name: args.name,
            price: args.price,
            description: args.description,
            condition: args.condition,
            category: args.category
        });
    },
    description: "商品の下書きを登録する"
});

const updateDraftProduct = makeQueryOrMutationField<
    { accessToken: string } & Pick<
        type.DraftProduct,
        "draftId" | "name" | "price" | "description" | "condition" | "category"
    >,
    type.DraftProduct
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        draftId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "下書きの商品を識別するためのID"
        },
        name: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "商品名"
        },
        price: {
            type: g.GraphQLInt,
            description: "価格 まだ決めていない場合はnull"
        },
        description: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "説明文"
        },
        condition: {
            type: type.conditionGraphQLType,
            description:
                type.conditionDescription + "まだ決めていない場合はnull"
        },
        category: {
            type: type.categoryGraphQLType,
            description: type.categoryDescription + "まだ決めていない場合はnull"
        }
    },
    type: g.GraphQLNonNull(
        g.GraphQLList(g.GraphQLNonNull(draftProductGraphQLType))
    ),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.updateDraftProduct(id, {
            draftId: args.draftId,
            name: args.name,
            price: args.price,
            description: args.description,
            category: args.category,
            condition: args.condition
        });
    },
    description: "商品の下書きを編集する"
});

const deleteDraftProduct = makeQueryOrMutationField<
    { accessToken: string } & Pick<type.DraftProduct, "draftId">,
    Array<type.DraftProduct>
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        draftId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "下書きの商品を識別するためのID"
        }
    },
    type: g.GraphQLNonNull(
        g.GraphQLList(g.GraphQLNonNull(draftProductGraphQLType))
    ),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        await database.deleteDraftProduct(id, args.draftId);
        return database.getDraftProducts(id);
    },
    description: ""
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
            user,
            userAll,
            userPrivate,
            product,
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
            markProductInHistory,
            addDraftProduct,
            updateDraftProduct,
            deleteDraftProduct
        }
    })
});
