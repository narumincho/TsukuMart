import * as g from "graphql";
import { URL } from "url";
import Maybe from "graphql/tsutils/Maybe";

/** ===================================
 *              URL
 * ====================================
 */
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

const urlGraphQLType = new g.GraphQLScalarType(urlTypeScalarTypeConfig);

/** ===================================
 *           Data URL
 * ====================================
 */
export type DataURLInternal = { mimeType: string; data: Buffer };

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

const dataUrlGraphQLType = new g.GraphQLScalarType(dataUrlTypeConfig);

/** ===================================
 *           AccountService
 * ====================================
 */
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

const accountServiceGraphQLType = new g.GraphQLEnumType({
    name: "AccountService",
    values: accountServiceValues,
    description: "ソーシャルログインを提供するサービス"
});

export const checkAccountServiceValues = (
    string: string
): AccountService | null => {
    switch (string) {
        case "google":
        case "gitHub":
        case "twitter":
        case "line":
            return string;
    }
    return null;
};
/** ===================================
 *               Unit
 * ====================================
 */

const unitValues = {
    ok: {
        description: "成功した"
    }
};
export type Unit = keyof (typeof unitValues);

const unitGraphQLType = new g.GraphQLEnumType({
    name: "Unit",
    values: unitValues,
    description: "Mutationで無事処理が成功したことを表現する型"
});
/** ===================================
 *            University
 * ====================================
 */

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

const schoolAndDepartmentGraphQLType = new g.GraphQLEnumType({
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

const graduateGraphQLType = new g.GraphQLEnumType({
    name: "graduate",
    values: graduateValues,
    description: "研究科ID"
});

export type UniversityUnsafe = {
    schoolAndDepartment: Maybe<SchoolAndDepartment>;
    graduate: Maybe<Graduate>;
};

export type University =
    | {
          c: UniversityC.GraduateTsukuba;
          schoolAndDepartment: SchoolAndDepartment;
          graduate: Graduate;
      }
    | { c: UniversityC.GraduateNotTsukuba; graduate: Graduate }
    | { c: UniversityC.NotGraduate; schoolAndDepartment: SchoolAndDepartment };

const enum UniversityC {
    GraduateTsukuba,
    GraduateNotTsukuba,
    NotGraduate
}

/**
 *
 * @param universityUnsafe
 * @throws "University need (graduate) or (schoolAndDepartment) or (graduate and schoolAndDepartment)"
 */
export const universityUnsafeToUniversity = (
    universityUnsafe: UniversityUnsafe
): University => {
    if (
        typeof universityUnsafe.graduate === "string" &&
        typeof universityUnsafe.schoolAndDepartment === "string"
    ) {
        return {
            c: UniversityC.GraduateTsukuba,
            graduate: universityUnsafe.graduate,
            schoolAndDepartment: universityUnsafe.schoolAndDepartment
        };
    }
    if (typeof universityUnsafe.graduate === "string") {
        return {
            c: UniversityC.GraduateNotTsukuba,
            graduate: universityUnsafe.graduate
        };
    }
    if (typeof universityUnsafe.schoolAndDepartment === "string") {
        return {
            c: UniversityC.NotGraduate,
            schoolAndDepartment: universityUnsafe.schoolAndDepartment
        };
    }
    throw new Error(
        "University need (graduate) or (schoolAndDepartment) or (graduate and schoolAndDepartment)"
    );
};

export const universityToFlat = (
    university: University
): {
    schoolAndDepartment: SchoolAndDepartment | null;
    graduate: Graduate | null;
} => {
    switch (university.c) {
        case UniversityC.GraduateTsukuba:
            return {
                schoolAndDepartment: university.schoolAndDepartment,
                graduate: university.graduate
            };
        case UniversityC.GraduateNotTsukuba:
            return {
                schoolAndDepartment: null,
                graduate: university.graduate
            };
        case UniversityC.NotGraduate:
            return {
                schoolAndDepartment: university.schoolAndDepartment,
                graduate: null
            };
    }
};

const universityField = {
    schoolAndDepartment: {
        type: schoolAndDepartmentGraphQLType,
        description: "学群学類ID 筑波大学以外からの編入ならnull"
    },
    graduate: {
        type: graduateGraphQLType,
        description: "研究科ID 大学生の場合はnull"
    }
};

const universityGraphQLInputType = new g.GraphQLInputObjectType({
    name: "UniversityInput",
    fields: universityField,
    description: "大学での所属"
});

const universityGraphQLObjectType = new g.GraphQLObjectType({
    name: "University",
    fields: universityField,
    description: "大学での所属"
});

/** ===================================
 *    Refresh Token And Access Token
 * ====================================
 */
const refreshTokenAndAccessTokenGraphQLType = new g.GraphQLObjectType({
    name: "refreshTokenAndAccessToken",
    fields: {
        refreshToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "アクセストークンを更新するためのトークン"
        },
        accessToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description:
                "各種リソースにアクセスするのに必要なトークン。署名つき証明書"
        }
    }
});

export type RefreshTokenAndAccessToken = {
    refreshToken: string;
    accessToken: string;
};
/** ==============================
 *            User
 * ===============================
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
            description: "表示"
        },
        introduction: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "紹介文"
        },
        university: {
            type: g.GraphQLNonNull(universityGraphQLObjectType),
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

type UserInternal = {
    id: string;
    displayName: string;
    introduction: string;
    university: UniversityUnsafe;
    selledProductAll: Array<ProductInternal>;
};
/** ==============================
 *         User Private
 * ===============================
 */
const userPrivateGraphQLType = new g.GraphQLObjectType({
    name: "UserPrivate",
    fields: () => ({
        id: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "ユーザーを識別するためのID"
        },
        displayName: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示"
        },
        introduction: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "紹介文"
        },
        university: {
            type: g.GraphQLNonNull(universityGraphQLObjectType),
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

type UserPrivateInternal = {
    id: string;
    displayName: string;
    introduction: string;
    university: UniversityUnsafe;
    selledProductAll: Array<ProductInternal>;
    buyedProductAll: Array<ProductInternal>;
    likedProductAll: Array<ProductInternal>;
};
/** ==============================
 *           Product
 * ===============================
 */
const productGraphQLType: g.GraphQLObjectType<
    void,
    void,
    {}
> = new g.GraphQLObjectType({
    name: "Item",
    fields: () => ({
        id: {
            type: g.GraphQLNonNull(g.GraphQLString)
        },
        name: {
            type: g.GraphQLNonNull(g.GraphQLString)
        },
        price: {
            type: g.GraphQLNonNull(g.GraphQLInt)
        },
        seller: {
            type: g.GraphQLNonNull(userGraphQLType)
        }
    })
});

type ProductInternal = {
    id: string;
    name: string;
    price: number;
    seller: UserInternal;
};
/** ==============================
 *          Input Type
 * ===============================
 */
type InputType<Internal extends InputTypeInternal, Nullable extends boolean> = {
    type: Internal;
    nullable: Nullable;
};

const enum InputTypeInternal {
    String,
    AccountService,
    DataUrl,
    University
}

export const nullableInputType = <O extends InputTypeInternal>(
    nonNullInputType: InputType<O, false>
): InputType<O, true> => ({
    type: nonNullInputType.type,
    nullable: true
});

/**
 * 文字列の入力。nullにはならない
 */
export const stringInputType = {
    type: InputTypeInternal.String,
    nullable: false
} as const;

/**
 * ソーシャルログインで使うアカウントを提供するサービス。nullにはならない
 */
export const accountServiceInputType = {
    type: InputTypeInternal.AccountService,
    nullable: false
} as const;

/**
 * DataURL。nullにはならない
 */
export const dataUrlInputType = {
    type: InputTypeInternal.DataUrl,
    nullable: false
} as const;

/**
 * 大学での所属。nullにはならない
 */
export const universityInputType = {
    type: InputTypeInternal.University,
    nullable: false
} as const;

type InputTypeToGraphQLType<
    O extends InputType<InputTypeInternal, boolean>
> = O extends InputType<infer Internal, true>
    ? Maybe<InputTypeInternalToGraphQLType<Internal>>
    : O extends InputType<infer Internal, false>
    ? InputTypeInternalToGraphQLType<Internal>
    : never;

type InputTypeInternalToGraphQLType<
    O extends InputTypeInternal
> = O extends InputTypeInternal.String
    ? string
    : O extends InputTypeInternal.AccountService
    ? AccountService
    : O extends InputTypeInternal.DataUrl
    ? DataURLInternal
    : O extends InputTypeInternal.University
    ? UniversityUnsafe
    : never;

const inputTypeToGraphQLType = (
    inputType: InputType<InputTypeInternal, boolean>
): g.GraphQLInputType => {
    if (inputType.nullable) {
        return inputTypeInternalToGraphQLType(inputType.type);
    } else {
        return g.GraphQLNonNull(inputTypeInternalToGraphQLType(inputType.type));
    }
};

const inputTypeInternalToGraphQLType = (
    inputType: InputTypeInternal
): g.GraphQLNullableType & g.GraphQLInputType => {
    switch (inputType) {
        case InputTypeInternal.String:
            return g.GraphQLString;
        case InputTypeInternal.AccountService:
            return accountServiceGraphQLType;
        case InputTypeInternal.DataUrl:
            return dataUrlGraphQLType;
        case InputTypeInternal.University:
            return universityGraphQLInputType;
    }
};

export const inputTypeDescription = (
    inputType: InputType<InputTypeInternal, boolean>
): Maybe<string> => {
    switch (inputType.type) {
        case InputTypeInternal.String:
            return g.GraphQLString.description;
        case InputTypeInternal.AccountService:
            return accountServiceGraphQLType.description;
        case InputTypeInternal.DataUrl:
            return dataUrlGraphQLType.description;
        case InputTypeInternal.University:
            return universityGraphQLInputType.description;
    }
};
/** ==============================
 *          Output Type
 * ===============================
 */
export type OutputType<O extends OutputTypeInternal, IsList extends boolean> = {
    internal: O;
    isList: IsList;
};

const enum OutputTypeInternal {
    String,
    Unit,
    Url,
    RefreshTokenAndAccessToken,
    User,
    UserPrivate,
    Product
}

export const stringOutputType: OutputType<OutputTypeInternal.String, false> = {
    internal: OutputTypeInternal.String,
    isList: false
};

export const unitOutputType: OutputType<OutputTypeInternal.Unit, false> = {
    internal: OutputTypeInternal.Unit,
    isList: false
};

export const urlOutputType: OutputType<OutputTypeInternal.Url, false> = {
    internal: OutputTypeInternal.Url,
    isList: false
};

export const refreshTokenAndAccessTokenOutputType: OutputType<
    OutputTypeInternal.RefreshTokenAndAccessToken,
    false
> = {
    internal: OutputTypeInternal.RefreshTokenAndAccessToken,
    isList: false
};

export const userOutputType: OutputType<OutputTypeInternal.User, false> = {
    internal: OutputTypeInternal.User,
    isList: false
};

export const userPrivateOutputType: OutputType<
    OutputTypeInternal.UserPrivate,
    false
> = {
    internal: OutputTypeInternal.UserPrivate,
    isList: false
};

export const productOutputType: OutputType<
    OutputTypeInternal.Product,
    false
> = {
    internal: OutputTypeInternal.Product,
    isList: false
};

export const listOutputType = <Internal extends OutputTypeInternal>(
    outputType: OutputType<Internal, false>
): OutputType<Internal, true> => ({
    internal: outputType.internal,
    isList: true
});

type OutputTypeToGraphQLType<
    O extends OutputType<OutputTypeInternal, boolean>
> = O extends OutputType<infer Internal, true>
    ? Array<OutputTypeInternalToGraphQLType<Internal>>
    : O extends OutputType<infer Internal, false>
    ? OutputTypeInternalToGraphQLType<Internal>
    : never;

type OutputTypeInternalToGraphQLType<
    Internal extends OutputTypeInternal
> = Internal extends OutputTypeInternal.String
    ? string
    : Internal extends OutputTypeInternal.Unit
    ? Unit
    : Internal extends OutputTypeInternal.Url
    ? URL
    : Internal extends OutputTypeInternal.RefreshTokenAndAccessToken
    ? RefreshTokenAndAccessToken
    : Internal extends OutputTypeInternal.User
    ? UserInternal
    : Internal extends OutputTypeInternal.UserPrivate
    ? UserPrivateInternal
    : Internal extends OutputTypeInternal.Product
    ? ProductInternal
    : never;

const outputTypeToGraphQLType = (
    outType: OutputType<OutputTypeInternal, boolean>
): g.GraphQLOutputType => {
    if (outType.isList) {
        return g.GraphQLNonNull(
            g.GraphQLList(outputTypeInternalToGraphQLType(outType.internal))
        );
    }
    return outputTypeInternalToGraphQLType(outType.internal);
};

const outputTypeInternalToGraphQLType = (
    internal: OutputTypeInternal
): g.GraphQLOutputType => {
    switch (internal) {
        case OutputTypeInternal.String:
            return g.GraphQLNonNull(g.GraphQLString);
        case OutputTypeInternal.Unit:
            return g.GraphQLNonNull(unitGraphQLType);
        case OutputTypeInternal.Url:
            return g.GraphQLNonNull(urlGraphQLType);
        case OutputTypeInternal.RefreshTokenAndAccessToken:
            return g.GraphQLNonNull(refreshTokenAndAccessTokenGraphQLType);
        case OutputTypeInternal.User:
            return g.GraphQLNonNull(userGraphQLType);
        case OutputTypeInternal.UserPrivate:
            return g.GraphQLNonNull(userPrivateGraphQLType);
        case OutputTypeInternal.Product:
            return g.GraphQLNonNull(productGraphQLType);
    }
};

export const outputTypeDescription = (
    outputType: OutputType<OutputTypeInternal, boolean>
): Maybe<string> => {
    switch (outputType.internal) {
        case OutputTypeInternal.String:
            return g.GraphQLString.description;
        case OutputTypeInternal.Unit:
            return unitGraphQLType.description;
        case OutputTypeInternal.Url:
            return urlGraphQLType.description;
        case OutputTypeInternal.RefreshTokenAndAccessToken:
            return refreshTokenAndAccessTokenGraphQLType.description;
        case OutputTypeInternal.User:
            return userGraphQLType.description;
        case OutputTypeInternal.UserPrivate:
            return userPrivateGraphQLType.description;
        case OutputTypeInternal.Product:
            return productGraphQLType.description;
    }
};

/*============================================
==============================================
*/

/**
 * 型安全にGraphQLFieldConfigをつくる
 */
export const makeGraphQLFieldConfig = <
    O extends OutputType<OutputTypeInternal, boolean>,
    Args extends {
        [key in string]: {
            type: InputType<InputTypeInternal, boolean>;
            description: Maybe<string>;
        }
    }
>(arg: {
    args: Args;
    type: O;
    resolve: (
        args: { [K in keyof Args]: InputTypeToGraphQLType<Args[K]["type"]> }
    ) => Promise<OutputTypeToGraphQLType<O>>;
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

const noExtendTypeObjectKeys = <O>(object: O): Array<keyof O> =>
    Object.keys(object) as Array<keyof O>;
