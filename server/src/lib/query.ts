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
                }
            }
        ];
    },
    description: "すべてのユーザーを取得する"
});

export const query = new g.GraphQLObjectType({
    name: "Query",
    description:
        "データを取得できる。データを取得したときに影響は他に及ばさない",
    fields: {
        hello,
        userAll
    }
});
