import * as g from "graphql";
import { URLSearchParams, URL } from "url";
import * as key from "./key";
import * as database from "./database";
import * as logInWithTwitter from "./twitterLogIn";
import * as type from "./type";
import Maybe from "graphql/tsutils/Maybe";

const getLogInUrlMutationField: MutationField<
    { service: type.AccountService },
    URL
> = {
    type: type.urlType,
    resolve: async (source, args, context, info) => {
        const accountService = args.service;
        switch (accountService) {
            case "google": {
                const url = new URL(
                    "https://accounts.google.com/o/oauth2/v2/auth"
                );
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.googleLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.googleLogInRedirectUri
                );
                url.searchParams.append("scope", "profile openid");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteGoogleLogInState()
                );
                return url;
            }
            case "gitHub": {
                const url = new URL("https://github.com/login/oauth/authorize");
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.gitHubLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.gitHubLogInRedirectUri
                );
                url.searchParams.append("scope", "read:user");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteGitHubLogInState()
                );
                return url;
            }
            case "twitter": {
                const { tokenSecret, url } = await logInWithTwitter.getLoginUrl(
                    key.twitterLogInClientId,
                    key.twitterLogInSecret,
                    key.twitterLogInRedirectUri
                );
                await database.saveTwitterLogInTokenSecret(tokenSecret);
                return url;
            }
            case "line": {
                const url = new URL(
                    "https://access.line.me/oauth2/v2.1/authorize"
                );
                url.searchParams.append("response_type", "code");
                url.searchParams.append("client_id", key.lineLogInClientId);
                url.searchParams.append(
                    "redirect_uri",
                    key.lineLogInRedirectUri
                );
                url.searchParams.append("scope", "profile openid");
                url.searchParams.append(
                    "state",
                    await database.generateAndWriteLineLogInState()
                );
                return url;
            }
        }
    },
    args: {
        service: {
            type: type.accountService,
            description: type.accountService.description
        }
    },
    description:
        "新規登録かログインするためのURLを得る。受け取ったURLをlocation.hrefに代入するとかして、各サービスの認証画面へ"
};

const sendConformEmailMutationField: MutationField<
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

const getLogInUrl: g.GraphQLFieldConfig<
    void,
    void,
    any
> = getLogInUrlMutationField;

const sendConformEmail: g.GraphQLFieldConfig<
    void,
    void,
    any
> = sendConformEmailMutationField;
export const mutation: g.GraphQLObjectType<
    void,
    void,
    any
> = new g.GraphQLObjectType({
    name: "Mutation",
    description: "データを作成、更新ができる",
    fields: {
        getLogInUrl,
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
interface MutationField<TArgs, TOutput> {
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
