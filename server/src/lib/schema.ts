import * as g from "graphql";

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
}): GraphQLFieldConfigWithArgs<Type, NeedReturn, Key> => ({
    type: args.type,
    args: args.args,
    resolve: args.resolve as any
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
                source.name = ""
                return "";
            }
        }),
        name: makeField({
            type: g.GraphQLString,
            args: {},
            resolve: source => {
                return "";
            }
        }),
        number: makeField({
            type: g.GraphQLFloat,
            args: {},
            resolve: source => {
                return 65;
            }
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
                        id: "53",
                    };
                }
            })
        }
    })
});
