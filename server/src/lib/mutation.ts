import * as g from "graphql";
import { URLSearchParams } from "url";
import * as key from "./key";
import * as database from "./database";
import * as logInWithTwitter from "./twitterLogIn";
import * as type from "./type";

const getGoogleLogInUrl: g.GraphQLFieldConfig<void, void, {}> = {
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (source, args, context, info) =>
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            response_type: "code",
            client_id: key.googleLogInClientId,
            redirect_uri: key.googleLogInRedirectUri,
            scope: "profile openid",
            state: await database.generateAndWriteGoogleLogInState()
        }).toString(),

    description:
        "Googleで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Googleの認証画面へ"
};

const getGitHubLogInUrl: g.GraphQLFieldConfig<void, void, {}> = {
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

const getTwitterLogInUrl: g.GraphQLFieldConfig<void, void, {}> = {
    type: g.GraphQLNonNull(g.GraphQLString),
    resolve: async (source, args, context, info) => {
        const { tokenSecret, url } = await logInWithTwitter.getLoginUrl(
            key.twitterLogInClientId,
            key.twitterLogInSecret,
            key.twitterLogInRedirectUri
        );
        await database.saveTwitterLogInTokenSecret(tokenSecret);
        return url;
    },
    description:
        "Twitterで新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、Twitterの認証画面へ"
};

const getLineLogInUrl: g.GraphQLFieldConfig<void, void, {}> = {
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

const sendConformEmail: g.GraphQLFieldConfig<
    void,
    void,
    {
        sendEmailToken: string;
        name: string;
        image: string | null;
        schoolAndDepartment: type.SchoolAndDepartment;
        graduate: type.graduate;
    }
> = {
    type: g.GraphQLNonNull(
        new g.GraphQLEnumType({
            name: "",
            values: { ok: { description: "成功した" } }
        })
    ),
    resolve: async (source, args, context, info) => {
        const image = args.image;
        const sendEmailToken = args.sendEmailToken;

        if (image !== null) {
            const imageDataUrlMimeType = image.match(
                /^data:(image\/png|image\/jpeg);base64,(.+)$/
            );
            if (imageDataUrlMimeType === null) {
                throw new Error("invalid DataURL support image/png image/jpeg");
            }
            const newImageUrl = await database.saveUserImage(
                Buffer.from(imageDataUrlMimeType[2], "base64"),
                imageDataUrlMimeType[1]
            );
            return "o";
        }
        return "o";
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
            type: g.GraphQLString,
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
