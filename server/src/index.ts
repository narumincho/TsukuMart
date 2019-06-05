import * as functions from "firebase-functions";
import * as graphqlExpress from "express-graphql";
import * as graphql from "graphql";
import * as database from "./lib/database";
import * as query from "./lib/query";
import * as mutation from "./lib/mutation";
import * as signUpCallback from "./lib/signUpCallback";

console.log("run index.js 2019-05-27");

const schema = new graphql.GraphQLSchema({
    query: query.query,
    mutation: mutation.mutation
});

/** よく使うAPI */
export const api = functions.https.onRequest(
    graphqlExpress({ schema: schema, graphiql: true })
);

/** Googleでログインをしたあとのリダイレクト先 */
export const googleLogInReceiver = functions.https.onRequest(
    signUpCallback.googleLogInReceiver
);

/** GitHubでログインをしたあとのリダイレクト先 */
export const gitHubLogInReceiver = functions.https.onRequest(
    signUpCallback.gitHubLogInReceiver
);

/** Twitterでログインしたあとのリダイレクト先 */
export const twitterLogInReceiver = functions.https.onRequest(
    signUpCallback.twitterLogInReceiver
);

/** LINEでログインしたあとのリダイレクト先 */
export const lineLogInReceiver = functions.https.onRequest(
    signUpCallback.lineLogInReceiver
);

/* =====================================================================
 *                       ユーザーの画像などを返す
 * =====================================================================
 */
export const image = functions.https.onRequest(async (request, response) => {
    const pathSplited: Array<string> = request.path.split("/");
    const folderName: string | undefined = pathSplited[2];
    const fileName: string | undefined = pathSplited[3];
    if (folderName === undefined || fileName == undefined) {
        response.send("invalid image path");
        return;
    }
    try {
        response.setHeader("Cache-Control", "public max-age=3600");
        database.getImageReadStream(folderName, fileName).pipe(response);
    } catch (e) {
        console.log("指定した、ファイルがない", folderName + "/" + fileName);
        response.status(404).send("not found");
    }
});
