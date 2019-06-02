import * as g from "graphql";
import Maybe from "graphql/tsutils/Maybe";
import * as type from "./type";
import { URL } from "url";

const noExtendTypeObjectKeys = <O>(object: O): Array<keyof O> =>
    Object.keys(object) as Array<keyof O>;

noExtendTypeObjectKeys({ a: 43 });

export const makeGraphQLFieldConfig = <
    O extends OutputType,
    Args extends {
        [key in string]: { type: InputType; description: Maybe<string> }
    }
>(arg: {
    type: O;
    args: Args;
    resolve: (
        args: { [K in keyof Args]: InputTypeToGraphQLType<Args[K]["type"]> }
    ) => Promise<OutTypeValueToGraphQLType<O>>;
    description: string;
}): g.GraphQLFieldConfig<void, void, any> => {
    return {
        type: outputTypeToGraphQLType(arg.type),
        args: noExtendTypeObjectKeys(arg.args).reduce(
            (result, key) => {
                result[key] = {
                    type: inputTypeToGraphQLType(arg.args[key].type),
                    description: arg.args[key].description
                };
                return result;
            },
            {} as { [k in keyof Args]: g.GraphQLArgumentConfig }
        ),
        resolve: (
            source: void,
            args,
            context: void,
            info: g.GraphQLResolveInfo
        ) => arg.resolve(args),
        description: arg.description
    };
};

/** ==============================
 *          Input Type
 * ===============================
 */

export enum InputType {
    AccountService
}

type InputTypeToGraphQLType<
    O extends InputType
> = O extends InputType.AccountService ? type.AccountService : never;

const inputTypeToGraphQLType = (inputType: InputType) => {
    switch (inputType) {
        case InputType.AccountService:
            return g.GraphQLNonNull(type.accountServiceType);
    }
};
/** ==============================
 *          Output Type
 * ===============================
 */
export enum OutputType {
    String,
    Unit,
    URL
}

type OutTypeValueToGraphQLType<
    O extends OutputType
> = O extends OutputType.String
    ? string
    : O extends OutputType.Unit
    ? type.Unit
    : O extends OutputType.URL
    ? URL
    : never;

const outputTypeToGraphQLType = (outType: OutputType): g.GraphQLOutputType => {
    switch (outType) {
        case OutputType.String:
            return g.GraphQLNonNull(g.GraphQLString);
        case OutputType.Unit:
            return g.GraphQLNonNull(type.unit);
        case OutputType.URL:
            return g.GraphQLNonNull(type.urlType);
    }
};

makeGraphQLFieldConfig({
    type: OutputType.String,
    args: {
        sorena: {
            type: InputType.AccountService,
            description: "sorena"
        }
    },
    resolve: async args => {
        args.sorena;
        return "";
    },
    description: ""
});
