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
    source.thumbnailImageId = data.thumbnailImageId;
    source.imageIds = data.imageIds;
    source.likedCount = data.likedCount;
    source.viewedCount = data.viewedCount;
    source.status = data.status;
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
                type: g.GraphQLNonNull(g.GraphQLID),
                description: "商品を識別するためのID。String"
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
            thumbnailImageId: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.thumbnailImageId === undefined) {
                        return (await setProductData(source)).thumbnailImageId;
                    }
                    return source.thumbnailImageId;
                },
                description: "一覧で表示すべきサムネイル画像のURL"
            }),
            imageIds: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(g.GraphQLString))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.imageIds === undefined) {
                        return (await setProductData(source)).imageIds;
                    }
                    return source.imageIds;
                },
                description: "商品画像のURL"
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
                description: "コメント"
            }),
            status: makeObjectField({
                type: g.GraphQLNonNull(type.productStatusGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.status === undefined) {
                        return (await setProductData(source)).status;
                    }
                    return source.status;
                },
                description: "取引の状態"
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
                type: g.GraphQLNonNull(g.GraphQLID),
                description:
                    "商品のコメントを識別するためのID。商品内で閉じたID。String"
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
                type: g.GraphQLNonNull(g.GraphQLID),
                description:
                    "下書きの商品を識別するためのID。ユーザー内で閉じたID。String"
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
            thumbnailImageId: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "サムネイル画像"
            },
            imageIds: {
                type: g.GraphQLNonNull(g.GraphQLString),
                description: "画像"
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
    source.imageId = userData.imageId;
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
                type: g.GraphQLNonNull(g.GraphQLID),
                description: "ユーザーを識別するためのID。String"
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
            imageId: makeObjectField({
                type: g.GraphQLNonNull(type.urlGraphQLType),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.imageId === undefined) {
                        return (await setUserData(source)).imageId;
                    }
                    return source.imageId;
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
                    if (source.soldProductAll === undefined) {
                        return (await setUserData(source)).soldProductAll;
                    }
                    return source.soldProductAll;
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
    source.imageId = userData.imageId;
    source.introduction = userData.introduction;
    source.university = type.universityToInternal(userData.university);
    source.createdAt = userData.createdAt;
    source.tradingAll = userData.tradingAll;
    source.tradedAll = userData.tradedAll;
    source.soldProductAll = userData.soldProductAll;
    source.boughtProductAll = userData.boughtProductAll;
    return userData;
};

const userPrivateGraphQLType = new g.GraphQLObjectType({
    name: "UserPrivate",
    fields: () =>
        makeObjectFieldMap<type.UserPrivateInternal>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLID),
                description: "ユーザーを識別するためのID。String"
            },
            displayName: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.displayName === undefined) {
                        return (await setUserPrivateData(source)).displayName;
                    }
                    return source.displayName;
                },
                description: "表示名"
            }),
            imageId: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.imageId === undefined) {
                        return (await setUserPrivateData(source)).imageId;
                    }
                    return source.imageId;
                },
                description:
                    "プロフィール画像ID https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/{imageID}"
            }),
            introduction: makeObjectField({
                type: g.GraphQLNonNull(g.GraphQLString),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.introduction === undefined) {
                        return (await setUserPrivateData(source)).introduction;
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
                            (await setUserPrivateData(source)).university
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
                        return (await setUserPrivateData(source)).createdAt;
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
                    if (source.soldProductAll === undefined) {
                        return (await setUserPrivateData(source))
                            .soldProductAll;
                    }
                    return source.soldProductAll;
                },
                description: "出品した商品すべて"
            }),
            boughtProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.boughtProductAll === undefined) {
                        return (await setUserPrivateData(source))
                            .boughtProductAll;
                    }
                    return source.boughtProductAll;
                },
                description: "購入した商品すべて"
            }),
            likedProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.likedProductAll === undefined) {
                        const likedProducts = await database.getLikedProductData(
                            source.id
                        );
                        source.likedProductAll = likedProducts;
                        return likedProducts;
                    }
                    return source.likedProductAll;
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
            commentedProductAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(productGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.commentedProductAll === undefined) {
                        const data = await database.getCommentedProducts(
                            source.id
                        );
                        source.commentedProductAll = data;
                        return data;
                    }
                    return source.commentedProductAll;
                },
                description: "コメントした商品"
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
            tradingAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(tradeGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.tradingAll === undefined) {
                        return (await setUserPrivateData(source)).tradingAll;
                    }
                    return source.tradingAll;
                },
                description: "取引中の取引データ"
            }),
            tradedAll: makeObjectField({
                type: g.GraphQLNonNull(
                    g.GraphQLList(g.GraphQLNonNull(tradeGraphQLType))
                ),
                args: {},
                resolve: async (source, args, context, info) => {
                    if (source.tradedAll === undefined) {
                        return (await setUserPrivateData(source)).tradedAll;
                    }
                    return source.tradedAll;
                },
                description: "取引した取引データ"
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
    source.createdAt = data.createdAt;
    source.updateAt = data.updateAt;
    return data;
};

const tradeGraphQLType = new g.GraphQLObjectType({
    name: "Trade",
    fields: () =>
        makeObjectFieldMap<type.Trade>({
            id: {
                type: g.GraphQLNonNull(g.GraphQLID),
                description: "取引データを識別するためのID。String"
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
                        const comments = await database.getTradeComments(
                            source.id
                        );
                        source.comment = comments;
                        return comments;
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
            }),
            state: makeObjectField({
                type: g.GraphQLNonNull(type.TradeStateGraphQLType),
                args: {},
                description: type.tradeStateDescription,
                resolve: async (source, args, context, info) => {
                    if (source.state === undefined) {
                        return (await setTradeData(source)).state;
                    }
                    return source.state;
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
                type: g.GraphQLNonNull(g.GraphQLID),
                description:
                    "取引のコメントを識別するためのID。取引内で閉じたID。String"
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
        return "Hello World! I'm Tsuku Bird. 🐦";
    },
    description: "世界に挨拶する"
});

const user = makeQueryOrMutationField<{ userId: string }, type.UserInternal>({
    type: g.GraphQLNonNull(userGraphQLType),
    args: {
        userId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: "ユーザーを識別するためのID"
        }
    },
    resolve: async (source, args) => {
        const userData = await database.getUserData(args.userId);
        return {
            id: args.userId,
            displayName: userData.displayName,
            imageId: userData.imageId,
            introduction: userData.introduction,
            university: type.universityToInternal(userData.university),
            createdAt: userData.createdAt,
            soldProductAll: userData.soldProductAll
        };
    },
    description: "ユーザーの情報を取得する"
});

const userAll = makeQueryOrMutationField<{}, Array<type.UserInternal>>({
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(userGraphQLType))),
    args: {},
    resolve: async () => {
        return (await database.getAllUser()).map(userData => ({
            id: userData.id,
            displayName: userData.displayName,
            imageId: userData.imageId,
            introduction: userData.introduction,
            university: type.universityToInternal(userData.university),
            createdAt: userData.createdAt,
            soldProductAll: userData.soldProductAll
        }));
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
        return await database.getUserData(accessTokenData.id);
    },
    description: "個人的な情報を含んだユーザーの情報を取得する"
});

const product = makeQueryOrMutationField<
    { productId: string },
    type.ProductInternal
>({
    args: {
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args, context, info) =>
        await database.getProduct(args.productId),
    description: "商品の情報を取得する"
});

const productAll = makeQueryOrMutationField<{}, Array<type.ProductInternal>>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(productGraphQLType))),
    resolve: async (source, args, context, info) =>
        await database.getAllProducts(),
    description: "すべての商品(売れたものも含まれる)を取得する"
});

const productRecentAll = makeQueryOrMutationField<
    {},
    Array<type.ProductInternal>
>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(productGraphQLType))),
    resolve: async (source, args, context, info) =>
        database.getRecentProducts(),
    description: "すべての商品(売れたものを含む)を新着順に取得する"
});

const productRecommendAll = makeQueryOrMutationField<
    {},
    Array<type.ProductInternal>
>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(productGraphQLType))),
    resolve: async (source, args, context, info) =>
        database.getRecommendProducts(),
    description: "すべての商品(売れたものを含む)をいいねが多い順に取得する"
});

const productFreeAll = makeQueryOrMutationField<
    {},
    Array<type.ProductInternal>
>({
    args: {},
    type: g.GraphQLNonNull(g.GraphQLList(g.GraphQLNonNull(productGraphQLType))),
    resolve: async (source, args, context, info) => database.getFreeProducts(),
    description: "すべての0円の商品(売れたものも含まれる)を取得する"
});

const trade = makeQueryOrMutationField<
    { accessToken: string; tradeId: string },
    type.Trade
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        tradeId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: tradeGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(tradeGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        const userData = await database.getUserData(id);
        if (
            includeTradeData(args.tradeId, userData.tradingAll) ||
            includeTradeData(args.tradeId, userData.tradedAll)
        ) {
            return database.getTrade(args.tradeId);
        }
        throw new Error("取引していない取引データにアクセスした");
    },
    description: "取引データを取得する"
});

const includeTradeData = (
    id: string,
    trades: Array<{ id: string }>
): boolean => {
    for (let i = 0; i < trades.length; i++) {
        if (trades[i].id === id) {
            return true;
        }
    }
    return false;
};
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
        let imageId: string;
        if (args.image !== null && args.image !== undefined) {
            imageId = await database.saveImage(
                args.image.data,
                args.image.mimeType
            );
            await database.deleteImage(userBeforeInputData.imageId);
        } else {
            imageId = userBeforeInputData.imageId;
        }

        console.log(`画像のURLを取得 ${imageId}`);
        const university = type.universityFromInternal(universityUnsafe);
        await database.addUserBeforeEmailVerificationAndSendEmail(
            logInAccountServiceId,
            args.displayName,
            imageId,
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
    type: g.GraphQLNonNull(userPrivateGraphQLType),
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
            id: profileData.id,
            displayName: profileData.displayName,
            introduction: profileData.introduction,
            university: type.universityToInternal(profileData.university),
            imageId: profileData.imageId
        };
    },
    description: "プロフィールの更新"
});

const sellProduct = makeQueryOrMutationField<
    {
        accessToken: string;
        images: Array<type.DataURL>;
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
        images: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(type.dataUrlGraphQLType))
            ),
            description: "商品画像"
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
            category: args.category,
            images: args.images
        });
    },
    description: "商品の出品する"
});

const markProductInHistory = makeQueryOrMutationField<
    { accessToken: string; productId: string },
    type.ProductInternal
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.markProductInHistory(id, args.productId);
    },
    description: "商品を閲覧したと記録する"
});

const likeProduct = makeQueryOrMutationField<
    { accessToken: string; productId: string },
    type.ProductInternal
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "アクセストークン"
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.likeProduct(id, args.productId);
    },
    description: "商品にいいねをする"
});

const unlikeProduct = makeQueryOrMutationField<
    { accessToken: string; productId: string },
    type.ProductInternal
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "アクセストークン"
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.unlikeProduct(id, args.productId);
    },
    description: "商品からいいねを外す"
});

const addProductComment = makeQueryOrMutationField<
    { accessToken: string; productId: string } & Pick<
        type.ProductCommentInternal,
        "body"
    >,
    type.ProductInternal
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        },
        body: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "本文"
        }
    },
    type: g.GraphQLNonNull(productGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.addCommentProduct(id, args.productId, {
            body: args.body
        });
    },
    description: "商品にコメントを追加する"
});

const addDraftProduct = makeQueryOrMutationField<
    { accessToken: string; images: Array<type.DataURL> } & Pick<
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
        },
        images: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(type.dataUrlGraphQLType))
            ),
            description: "画像"
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
            category: args.category,
            images: args.images
        });
    },
    description: "商品の下書きを登録する"
});

const updateDraftProduct = makeQueryOrMutationField<
    {
        accessToken: string;
        deleteImagesAt: Array<number>;
        addImages: Array<type.DataURL>;
    } & Pick<
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
        },
        deleteImagesAt: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(g.GraphQLInt))
            ),
            description:
                "削除する画像のインデックス。必ず昇順。例:[0,3] 0番目と3番目を削除"
        },
        addImages: {
            type: g.GraphQLNonNull(
                g.GraphQLList(g.GraphQLNonNull(type.dataUrlGraphQLType))
            ),
            description: "末尾に追加する画像"
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
            condition: args.condition,
            deleteImagesAt: args.deleteImagesAt,
            addImages: args.addImages
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
    description: "商品の下書きを削除する"
});

const startTrade = makeQueryOrMutationField<
    { accessToken: string; productId: string },
    type.Trade
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        productId: {
            type: g.GraphQLNonNull(g.GraphQLID),
            description: productGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(tradeGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.startTrade(id, args.productId);
    },
    description: "取引を開始する"
});

const addTradeComment = makeQueryOrMutationField<
    { accessToken: string; tradeId: string } & Pick<type.TradeComment, "body">,
    type.Trade
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        tradeId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: tradeGraphQLType.getFields().id.description
        },
        body: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "本文"
        }
    },
    type: g.GraphQLNonNull(tradeGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.addTradeComment(id, args.tradeId, args.body);
    },
    description: "取引にコメントを追加する"
});

const cancelTrade = makeQueryOrMutationField<
    { accessToken: string; tradeId: string },
    type.Trade
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        tradeId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: tradeGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(tradeGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.cancelTrade(id, args.tradeId);
    },
    description: "取引をキャンセルする"
});

const tradeFinish = makeQueryOrMutationField<
    { accessToken: string; tradeId: string },
    type.Trade
>({
    args: {
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: type.accessTokenDescription
        },
        tradeId: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: tradeGraphQLType.getFields().id.description
        }
    },
    type: g.GraphQLNonNull(tradeGraphQLType),
    resolve: async (source, args, context, info) => {
        const { id } = database.verifyAccessToken(args.accessToken);
        return await database.finishTrade(id, args.tradeId);
    },
    description: "取引を完了する"
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
            productRecentAll,
            productRecommendAll,
            productFreeAll,
            productAll,
            trade
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
            likeProduct,
            unlikeProduct,
            addProductComment,
            addDraftProduct,
            updateDraftProduct,
            deleteDraftProduct,
            startTrade,
            addTradeComment,
            cancelTrade,
            tradeFinish
        }
    })
});
