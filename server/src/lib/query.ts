import * as g from "graphql";
import * as type from "./type";

const hello = type.makeGraphQLFieldConfig({
    args: {},
    type: type.stringOutputType,
    resolve: async () => {
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
            description: "アクセストークン。署名付きユーザーID"
        }
    },
    type: type.userPrivateOutputType,
    resolve: async ({ accessToken }) => {
        return {
            id: "id",
            displayName: "表示名",
            introduction: "紹介文",
            university: {
                graduate: null,
                schoolAndDepartment: "mast"
            },
            selledProductAll: [],
            buyedProductAll: [],
            likedProductAll: []
        }
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
    fields: {
        hello,
        userAll,
        userPrivate,
        productAll
    }
});
