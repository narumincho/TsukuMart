import { initializedFirebaseAdmin } from "./firebaseInit";

const dataBase = initializedFirebaseAdmin.firestore();
const userCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "users"
);
const userBeforeInputDataCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "userBeforeInputData"
);
const googleLogInStateCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "googleState"
);
const gitHubLogInStateCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "gitHubState"
);
const twitterLogInTokenSecretDocumentRef: FirebaseFirestore.DocumentReference = dataBase
    .collection("twitterState")
    .doc("last");
const lineLogInStateCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "lineState"
);

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGoogleLogInState = async (): Promise<string> =>
    (await googleLogInStateCollection.add({})).id;

/**
 * 指定したStateがつくマート自身が発行したものかどうか調べる
 * @param state
 */
export const checkExistsGoogleLogInState = async (
    state: string
): Promise<boolean> => {
    const docRef: FirebaseFirestore.DocumentReference = googleLogInStateCollection.doc(
        state
    );
    const result = (await docRef.get()).exists;
    await docRef.delete();
    return result;
};

/**
 * GitHubへの stateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGitHubLogInState = async (): Promise<string> =>
    (await gitHubLogInStateCollection.add({})).id;

/**
 * TwitterのTokenSecretを上書き保存する
 * @param tokenSecret
 */
export const saveTwitterLogInTokenSecret = async (
    tokenSecret: string
): Promise<void> => {
    await twitterLogInTokenSecretDocumentRef.set({
        tokenSecret: tokenSecret
    });
};

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteLineLogInState = async (): Promise<string> =>
    (await lineLogInStateCollection.add({})).id;

/**
 * ユーザー情報を入力する前のユーザーを保存する
 * @param accountService 使うアカウントのサービス
 * @param id それぞれのアカウントのユーザーID
 * @param name 各サービスのアカウント名
 * @param imageUrl つくマートのサーバーにダウンロードしたアカウント画像のURL
 */
export const addUserInUserBeforeInputData = async (
    accountService: AccountService,
    id: string,
    name: string,
    imageUrl: URL
): Promise<string> => {
    const documentId = accountService + "_" + id;
    await userBeforeInputDataCollection.doc(documentId).set({
        name: name,
        imageUrl: imageUrl.toString()
    });
    return documentId;
};

export type AccountService = "google" | "github" | "twitter" | "line";
