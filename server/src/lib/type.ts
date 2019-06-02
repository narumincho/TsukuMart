import * as g from "graphql";
import { URL } from "url";

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

export const urlType = new g.GraphQLScalarType(urlTypeScalarTypeConfig);
export const dataUrlType = new g.GraphQLScalarType(dataUrlTypeConfig);

const accountServiceValue = {
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
export type AccountService = keyof (typeof accountServiceValue);

export const accountService = new g.GraphQLEnumType({
    name: "accountService",
    values: accountServiceValue,
    description: "ソーシャルログインを提供するサービス"
});

const schoolAndDepartmentValue = {
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

export type SchoolAndDepartment = keyof (typeof schoolAndDepartmentValue);

export const schoolAndDepartment = new g.GraphQLEnumType({
    name: "schoolAndDepartment",
    values: schoolAndDepartmentValue,
    description: "学群学類ID"
});

const graduateValue = {
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
export type graduate = keyof (typeof graduateValue);

export const graduateType = new g.GraphQLEnumType({
    name: "graduate",
    values: graduateValue,
    description: "研究科ID"
});
