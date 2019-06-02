import * as g from "graphql";
import Maybe from "graphql/tsutils/Maybe";
import * as type from "./type";

export const makeGraphQLFieldConfig = <O extends OutType, A>(arg: {
    type: O;
    args: {
        [key: string]: {
            type: g.GraphQLInputType;
            defaultValue?: any;
            description: Maybe<string>;
        };
    };
    resolve: (args: A) => Promise<OutTypeValueToGraphQLType<O>>;
    description: string;
}): g.GraphQLFieldConfig<void, void, any> => ({
    type: outTypeToGraphQLType(arg.type),
    args: arg.args,
    resolve: (
        source: void,
        args: A,
        context: void,
        info: g.GraphQLResolveInfo
    ) => arg.resolve(args),
    description: arg.description
});

export enum OutType {
    String,
    Unit
}

type OutTypeValueToGraphQLType<O> = O extends OutType.String
    ? string
    : O extends OutType.Unit
    ? type.Unit
    : never;

const outTypeToGraphQLType = (outType: OutType): g.GraphQLOutputType => {
    switch (outType) {
        case OutType.String:
            return g.GraphQLNonNull(g.GraphQLString);
        case OutType.Unit:
            return g.GraphQLNonNull(type.unit);
    }
};

makeGraphQLFieldConfig({
    type: OutType.String,
    args: {},
    resolve: async args => {
        return "";
    },
    description: ""
});
