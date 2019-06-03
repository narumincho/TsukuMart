import * as g from "graphql";
import { URL } from "url";
import Maybe from "graphql/tsutils/Maybe";

const urlTypeScalarTypeConfig: g.GraphQLScalarTypeConfig<URL, string> = {
    name: "URL",
    description: "URL",
    serialize: (url: URL): string => url.toString(),
    parseValue: (value: string): URL => new URL(value),
    parseLiteral: (ast): URL | null => {
        if (ast.kind !== "StringValue") {
            return null;
        }
        try {
            return new URL(ast.value);
        } catch {
            return null;
        }
    }
};

export type DataURLInternal = { mimeType: string; data: Buffer };

const dataUrlParser = (value: string): DataURLInternal => {
    const imageDataUrlMimeType = value.match(/^data:(.+);base64,(.+)$/);
    if (imageDataUrlMimeType === null) {
        throw new Error("invalid DataURL");
    }
    return {
        mimeType: imageDataUrlMimeType[1],
        data: Buffer.from(imageDataUrlMimeType[2], "base64")
    };
};

const dataUrlTypeConfig: g.GraphQLScalarTypeConfig<DataURLInternal, string> = {
    name: "DataURL",
    description: "DataURL base64エンコードのみサポート",
    serialize: (value: DataURLInternal): string =>
        "data:" + value.mimeType + ";base64," + value.data.toString(),
    parseValue: dataUrlParser,
    parseLiteral: ast => {
        if (ast.kind !== "StringValue") {
            return null;
        }
        try {
            return dataUrlParser(ast.value);
        } catch {
            return null;
        }
    }
};

const urlType = new g.GraphQLScalarType(urlTypeScalarTypeConfig);
const dataUrlType = new g.GraphQLScalarType(dataUrlTypeConfig);

const accountServiceValues = {
    google: {
        description:
            "Google https://developers.google.com/identity/sign-in/web/"
    },
    gitHub: {
        description:
            "GitHub https://developer.github.com/v3/guides/basics-of-authentication/"
    },
    twitter: {
        description:
            "Twitter https://developer.twitter.com/en/docs/twitter-for-websites/log-in-with-twitter/login-in-with-twitter.html"
    },
    line: {
        description: "LINE https://developers.line.biz/ja/docs/line-login/"
    }
};
export type AccountService = keyof (typeof accountServiceValues);

const accountServiceType = new g.GraphQLEnumType({
    name: "AccountService",
    values: accountServiceValues,
    description: "ソーシャルログインを提供するサービス"
});

const unitValues = {
    ok: {
        description: "成功した"
    }
};
export type Unit = keyof (typeof unitValues);

const unitType = new g.GraphQLEnumType({
    name: "Unit",
    values: unitValues,
    description: "Mutationで無事処理が成功したことを表現する型"
});

const schoolAndDepartmentValues = {
    humanity: { description: "人文・文化学群 / 人文学類" },
    culture: { description: "人文・文化学群 / 比較文化学類" },
    japanese: {
        description: "人文・文化学群 / 日本語・日本文化学類"
    },
    social: { description: "社会・国際学群 / 社会学類" },
    cis: { description: "社会・国際学群 / 国際総合学類" },
    education: { description: "人間学群 / 教育学類" },
    psyche: { description: "人間学群 / 心理学類" },
    disability: { description: "人間学群 / 障害科学類" },
    biol: { description: "生命環境学群 / 生物学類" },
    bres: { description: "生命環境学群 / 生物資源学類" },
    earth: { description: "生命環境学群 / 地球学類" },
    math: { description: "理工学群 / 数学類" },
    phys: { description: "理工学群 / 物理学類" },
    chem: { description: "理工学群 / 化学類" },
    coens: { description: "理工学群 / 応用理工学類" },
    esys: { description: "理工学群 / 工学システム学類" },
    pandps: { description: "理工学群 / 社会工学類" },
    coins: { description: "情報学群 / 情報科学類" },
    mast: { description: "情報学群 / 情報メディア創成学類" },
    klis: { description: "情報学群 / 知識情報・図書館科学類" },
    med: { description: "医学群 / 医学類" },
    nurse: { description: "医学群 / 看護学類" },
    ms: { description: "医学群 / 医療科学類" },
    aandd: { description: "芸術専門学群" },
    sport: { description: "体育専門学群" }
};

export type SchoolAndDepartment = keyof (typeof schoolAndDepartmentValues);

export const schoolAndDepartmentType = new g.GraphQLEnumType({
    name: "schoolAndDepartment",
    values: schoolAndDepartmentValues,
    description: "学群学類ID"
});

const graduateValues = {
    education: { description: "教育研究科" },
    hass: { description: "人文社会科学研究科" },
    gabs: { description: "ビジネス科学研究科" },
    pas: { description: "数理物質科学研究科" },
    sie: { description: " システム情報工学研究科" },
    life: { description: " 生命環境科学研究科" },
    chs: { description: "人間総合科学研究科" },
    slis: { description: "図書館情報メディア研究科" },
    global: { description: "グローバル研究院" }
};
export type Graduate = keyof (typeof graduateValues);

export const graduateType = new g.GraphQLEnumType({
    name: "graduate",
    values: graduateValues,
    description: "研究科ID"
});

export type University = {
    schoolAndDepartment: SchoolAndDepartment | null;
    graduate: Graduate | null;
};

export const universityType = new g.GraphQLInputObjectType({
    name: "university",
    fields: {
        schoolAndDepartment: {
            type: schoolAndDepartmentType
        },
        graduate: {
            type: graduateType
        }
    },
    description: "大学での所属"
});

const noExtendTypeObjectKeys = <O>(object: O): Array<keyof O> =>
    Object.keys(object) as Array<keyof O>;

export const makeGraphQLFieldConfig = <
    O extends OutputType,
    Args extends {
        [key in string]: { type: InputType<any>; description: Maybe<string> }
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
type InputType<I extends InputTypeInternal> =
    | NonNullInputType<I>
    | NullableInputType<I>;

enum InputTypeInternal {
    String,
    AccountService,
    DataUrl,
    University
}

interface NullableInputType<I extends InputTypeInternal> {
    type: I;
    nullableOrNonNull: NullableOrNonNull.Nullable;
}

interface NonNullInputType<I extends InputTypeInternal> {
    type: I;
    nullableOrNonNull: NullableOrNonNull.NonNull;
}

enum NullableOrNonNull {
    Nullable,
    NonNull
}

export const nullableInputType = <O extends InputTypeInternal>(
    nonNullInputType: NonNullInputType<O>
): NullableInputType<O> => ({
    type: nonNullInputType.type,
    nullableOrNonNull: NullableOrNonNull.Nullable
});

/**
 * 文字列の入力。nullにはならない
 */
export const stringInputType = {
    type: InputTypeInternal.String,
    nullableOrNonNull: NullableOrNonNull.NonNull
} as const;

/**
 * ソーシャルログインで使うアカウントを提供するサービス。nullにはならない
 */
export const accountServiceInputType = {
    type: InputTypeInternal.AccountService,
    nullableOrNonNull: NullableOrNonNull.NonNull
} as const;

/**
 * DataURL。nullにはならない
 */
export const dataUrlInputType = {
    type: InputTypeInternal.DataUrl,
    nullableOrNonNull: NullableOrNonNull.NonNull
} as const;

/**
 * 大学での所属。nullにはならない
 */
export const universityInputType = {
    type: InputTypeInternal.University,
    nullableOrNonNull: NullableOrNonNull.NonNull
} as const;

type InputTypeToGraphQLType<
    O extends InputType<any>
> = O["nullableOrNonNull"] extends NullableOrNonNull.NonNull
    ? InputTypeInternalToGraphQLType<O["type"]>
    : Maybe<InputTypeInternalToGraphQLType<O["type"]>>;

type InputTypeInternalToGraphQLType<
    O extends InputTypeInternal
> = O extends InputTypeInternal.String
    ? string
    : O extends InputTypeInternal.AccountService
    ? AccountService
    : O extends InputTypeInternal.DataUrl
    ? DataURLInternal
    : O extends InputTypeInternal.University
    ? University
    : never;

const inputTypeToGraphQLType = (
    inputType: InputType<any>
): g.GraphQLInputType => {
    switch (inputType.nullableOrNonNull) {
        case NullableOrNonNull.NonNull:
            return g.GraphQLNonNull(
                inputTypeInternalToGraphQLType(inputType.type)
            );
        case NullableOrNonNull.Nullable:
            return inputTypeInternalToGraphQLType(inputType.type);
    }
};

const inputTypeInternalToGraphQLType = (
    inputType: InputTypeInternal
): g.GraphQLNullableType & g.GraphQLInputType => {
    switch (inputType) {
        case InputTypeInternal.String:
            return g.GraphQLString;
        case InputTypeInternal.AccountService:
            return accountServiceType;
        case InputTypeInternal.DataUrl:
            return dataUrlType;
        case InputTypeInternal.University:
            return universityType;
    }
};

export const inputTypeDescription = (
    inputType: InputType<any>
): Maybe<string> => {
    switch (inputType.type) {
        case InputTypeInternal.String:
            return g.GraphQLString.description;
        case InputTypeInternal.AccountService:
            return accountServiceType.description;
        case InputTypeInternal.DataUrl:
            return dataUrlType.description;
        case InputTypeInternal.University:
            return universityType.description;
    }
};
/** ==============================
 *          Output Type
 * ===============================
 */
export enum OutputType {
    String,
    Unit,
    Url
}

type OutTypeValueToGraphQLType<
    O extends OutputType
> = O extends OutputType.String
    ? string
    : O extends OutputType.Unit
    ? Unit
    : O extends OutputType.Url
    ? URL
    : never;

const outputTypeToGraphQLType = (outType: OutputType): g.GraphQLOutputType => {
    switch (outType) {
        case OutputType.String:
            return g.GraphQLNonNull(g.GraphQLString);
        case OutputType.Unit:
            return g.GraphQLNonNull(unitType);
        case OutputType.Url:
            return g.GraphQLNonNull(urlType);
    }
};

export const outputTypeDescription = (
    outputType: OutputType
): Maybe<string> => {
    switch (outputType) {
        case OutputType.String:
            return g.GraphQLString.description;
        case OutputType.Unit:
            return unitType.description;
        case OutputType.Url:
            return urlType.description;
    }
};
