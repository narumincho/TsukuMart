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

export const urlGraphQLType = new g.GraphQLScalarType(urlTypeScalarTypeConfig);

/** ===================================
 *           Data URL
 * ====================================
 */
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

export const dataUrlTypeConfig: g.GraphQLScalarTypeConfig<
    DataURLInternal,
    string
> = {
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

export const dataUrlGraphQLType = new g.GraphQLScalarType(dataUrlTypeConfig);

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

export const accountServiceGraphQLType = new g.GraphQLEnumType({
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

export const unitGraphQLType = new g.GraphQLEnumType({
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

export type UniversityInternal = {
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
 * @throws {Error} "University need (graduate) or (schoolAndDepartment) or (graduate and schoolAndDepartment)"
 */
export const universityFromInternal = (
    universityUnsafe: UniversityInternal
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

export const universityToInternal = (
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

export const universityGraphQLInputType = new g.GraphQLInputObjectType({
    name: "UniversityInput",
    fields: universityField,
    description: "大学での所属"
});

export const universityGraphQLObjectType = new g.GraphQLObjectType({
    name: "University",
    fields: universityField,
    description: "大学での所属"
});

/** ===================================
 *    Refresh Token And Access Token
 * ====================================
 */
export const refreshTokenAndAccessTokenGraphQLType = new g.GraphQLObjectType({
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

export type UserInternal = {
    id: string;
    displayName: string;
    imageUrl: URL;
    introduction: string;
    university: UniversityInternal;
    selledProductAll: Array<ProductInternal>;
};

export type User = {
    id: string;
    displayName: string;
    imageUrl: URL;
    introduction: string;
    university: University;
    selledProductAll: Array<Product>;
};

export const userToInternal = (user: User): UserInternal => ({
    id: user.id,
    displayName: user.displayName,
    imageUrl: user.imageUrl,
    introduction: user.introduction,
    university: universityToInternal(user.university),
    selledProductAll: user.selledProductAll.map(productToInternal)
});
/** ==============================
 *         User Private
 * ===============================
 */
export type UserPrivateInternal = {
    id: string;
    displayName: string;
    imageUrl: URL;
    introduction: string;
    university: UniversityInternal;
    selledProductAll: Array<ProductInternal>;
    buyedProductAll: Array<ProductInternal>;
    likedProductAll: Array<ProductInternal>;
};

export type UserPrivate = {
    id: string;
    displayName: string;
    imageUrl: URL;
    introduction: string;
    university: University;
    selledProductAll: Array<Product>;
    buyedProductAll: Array<Product>;
    likedProductAll: Array<Product>;
};

export const userPrivateToInternal = (
    userPrivate: UserPrivate
): UserPrivateInternal => ({
    id: userPrivate.id,
    displayName: userPrivate.displayName,
    imageUrl: userPrivate.imageUrl,
    introduction: userPrivate.introduction,
    university: universityToInternal(userPrivate.university),
    selledProductAll: userPrivate.selledProductAll.map(productToInternal),
    buyedProductAll: userPrivate.buyedProductAll.map(productToInternal),
    likedProductAll: userPrivate.likedProductAll.map(productToInternal)
});

/** ==============================
 *           Product
 * ===============================
 */
export type ProductInternal = {
    id: string;
    name: string;
    price: number;
    seller: UserInternal;
};

export type ProductInternalNeedReturn = "id";

export type Product = {
    id: string;
    name: string;
    price: number;
    seller: User;
};

export const productToInternal = (product: Product): ProductInternal => ({
    id: product.id,
    name: product.name,
    price: product.price,
    seller: userToInternal(product.seller)
});
/* ===============================
 *      LogInService And Id
 * ===============================
 */
/**
 * ソーシャルログインで利用するサービス名とそのアカウントIDをセットにしたもの
 */
export type LogInServiceAndId = {
    service: AccountService;
    serviceId: string;
};

export const logInServiceAndIdToString = (
    logInAccountServiceId: LogInServiceAndId
) => logInAccountServiceId.service + "_" + logInAccountServiceId.serviceId;

export const logInServiceAndIdFromString = (
    string: string
): LogInServiceAndId => {
    const result = string.match(/^(.+?)_(.+)$/);
    if (result === null) {
        throw new Error("logInAccountServiceId is invalid");
    }
    const service = checkAccountServiceValues(result[1]);
    if (service === null) {
        throw new Error("logInAccount is invalid" + result[1]);
    }
    return {
        service: service,
        serviceId: result[2]
    };
};

/**
 * アクセストークンの説明
 */
export const accessTokenDescription = "アクセストークン。署名付きユーザーID";
