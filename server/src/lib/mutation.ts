import * as g from "graphql";
import { URLSearchParams, URL } from "url";
import * as key from "./key";
import * as database from "./database";
import * as logInWithTwitter from "./twitterLogIn";
import * as type from "./type";
import Maybe from "graphql/tsutils/Maybe";

const getGoogleLogInUrl: GraphQLFieldConfigTypeSafe<{}, URL> = {
    type: type.urlType,
    resolve: async (source, args, context, info) => {
        const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        url.searchParams.append("response_type", "code");
        url.searchParams.append("client_id", key.googleLogInClientId);
        url.searchParams.append("redirect_uri", key.googleLogInRedirectUri);
        url.searchParams.append("scope", "profile openid");
        url.searchParams.append(
            "state",
            await database.generateAndWriteGoogleLogInState()
        );
        return url;
    },
    description:
        "Googleで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Googleの認証画面へ"
};

const getGitHubLogInUrl: GraphQLFieldConfigTypeSafe<{}, string> = {
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (source, args, context, info) =>
        "https://github.com/login/oauth/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: key.gitHubLogInClientId,
            redirect_uri: key.gitHubLogInRedirectUri,
            scope: "read:user",
            state: await database.generateAndWriteGitHubLogInState()
        }).toString(),
    description:
        "GitHubで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、GitHubの認証画面へ"
};

const getTwitterLogInUrl: GraphQLFieldConfigTypeSafe<{}, string> = {
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (source, args, context, info) => {
        const { tokenSecret, url } = await logInWithTwitter.getLoginUrl(
            key.twitterLogInClientId,
            key.twitterLogInSecret,
            key.twitterLogInRedirectUri
        );
        await database.saveTwitterLogInTokenSecret(tokenSecret);
        return url.toString();
    },
    description:
        "Twitterで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Twitterの認証画面へ"
};

const getLineLogInUrl: GraphQLFieldConfigTypeSafe<{}, string> = {
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (source, args, context, info) =>
        "https://access.line.me/oauth2/v2.1/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: key.lineLogInClientId,
            redirect_uri: key.lineLogInRedirectUri,
            scope: "profile openid",
            state: await database.generateAndWriteLineLogInState()
        }).toString(),
    description:
        "LINEで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、LINEの認証画面へ"
};

const sendConformEmail: GraphQLFieldConfigTypeSafe<
    {
        sendEmailToken: string;
        name: string;
        image: type.DataURLInternal | null;
        schoolAndDepartment: type.SchoolAndDepartment;
        graduate: type.graduate;
    },
    "unit"
> = {
    type: g.GraphQLNonNull(
        new g.GraphQLEnumType({
            name: "unit",
            values: { unit: {} }
        })
    ),
    resolve: async (source, args, context, info): Promise<"unit"> => {
        const image = args.image;
        const sendEmailToken = args.sendEmailToken;

        if (image !== null) {
            if (
                image.mimeType !== "image/png" &&
                image.mimeType !== "image/jpeg"
            ) {
                throw new Error("invalid DataURL support image/png image/jpeg");
            }
            const newImageUrl = await database.saveUserImage(
                image.data,
                image.mimeType
            );
            return "unit";
        }
        return "unit";
    },
    args: {
        sendEmailToken: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "認証メールを送るのに必要なトークン"
        },
        name: {
            type: g.GraphQLNonNull(g.GraphQLString),
            description: "表示名"
        },
        image: {
            type: type.dataUrlType,
            description:
                "画像(DataURL) ソーシャルログインで使ったサービスのままならnull"
        },
        schoolAndDepartment: {
            type: g.GraphQLNonNull(type.schoolAndDepartment),
            description: type.schoolAndDepartment.description
        },
        graduate: {
            type: g.GraphQLNonNull(type.graduateType),
            description: type.graduateType.description
        }
    },
    description: "ユーザー情報を登録して認証メールを送信する"
};

export const mutation: g.GraphQLObjectType<
    void,
    void,
    any
> = new g.GraphQLObjectType({
    name: "Mutation",
    description: "データを作成、更新ができる",
    fields: {
        getGoogleLogInUrl,
        getGitHubLogInUrl,
        getTwitterLogInUrl,
        getLineLogInUrl,
        sendConformEmail
    }
});

/**
 * getterで上手くできそう { get field(){return expr}}
 */

new g.GraphQLScalarType({
    name: "unit",
    serialize: value => value
});

/**
 * GraphQLFieldConfigの厳しいバージョン。resolveの引数と戻りの型がチェックされる
 */
interface GraphQLFieldConfigTypeSafe<TArgs, TOutput> {
    type: g.GraphQLOutputType;
    args?: {
        [key: string]: {
            type: g.GraphQLInputType;
            defaultValue?: any;
            description: Maybe<string>;
        };
    };
    resolve: (
        source: void,
        args: TArgs,
        context: void,
        info: g.GraphQLResolveInfo
    ) => Promise<TOutput>;
    description: string;
}
