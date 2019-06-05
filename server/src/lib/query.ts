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
                name: "表示名",
                university: {
                    graduate: "education",
                    schoolAndDepartment: "mast"
                },
                exhibitionProductAll: []
            }
        ];
    },
    description: "すべてのユーザーを取得する"
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
                    name: "出品者",
                    introduction: "紹介文",
                    university: {
                        graduate: null,
                        schoolAndDepartment: "cis"
                    },
                    exhibitionProductAll: []
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
        productAll
    }
});
