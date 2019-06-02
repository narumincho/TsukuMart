import { initializedFirebaseAdmin } from "./firebaseInit";
import { URL } from "url";
import * as storage from "@google-cloud/storage";
import * as stream from "stream";
import * as type from "./type";

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
 * @param accountServiceId それぞれのアカウントのユーザーID
 * @param name 各サービスのアカウント名
 * @param imageUrl つくマートのサーバーにダウンロードしたアカウント画像のURL
 */
export const addUserInUserBeforeInputData = async (
    accountService: type.AccountService,
    accountServiceId: string,
    name: string,
    imageUrl: URL
): Promise<string> => {
    const documentId = accountService + "_" + accountServiceId;
    await userBeforeInputDataCollection.doc(documentId).set({
        name: name,
        imageUrl: imageUrl.toString()
    });
    return documentId;
};

/**
 * ユーザー情報を入力する前のユーザー情報を取得する
 * @param id
 */
export const getUserInUserBeforeInputData = async (
    id: string
): Promise<{
    accountService: type.AccountService;
    accountServiceId: string;
    name: string;
    imageUrl: URL;
}> => {
    const docRef = await (await userBeforeInputDataCollection.doc(id)).get();
    if (!docRef.exists) {
        console.log("存在しない情報入力前のユーザーを指定された");
        throw new Error("存在しない情報入力前のユーザーを指定された");
    }
    const data = docRef.data() as {
        accountService: type.AccountService;
        accountServiceId: string;
        name: string;
        imageUrl: string;
    };
    return {
        accountService: data.accountService,
        accountServiceId: data.accountServiceId,
        name: data.name,
        imageUrl: new URL(data.imageUrl)
    };
};

/**
 * ユーザーのプロフィール画像をCloud Storageに保存する。ごくまれにファイル名がかぶるかも。
 * @param arrayBuffer バイナリ
 * @param mimeType https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%82%BF%E3%82%A4%E3%83%97
 */
export const saveUserImage = async (
    arrayBuffer: ArrayBuffer,
    mimeType: string
): Promise<URL> => {
    const userImageFile: storage.File = await createStorageFile("user-image");
    await userImageFile.save(arrayBuffer, { contentType: mimeType });
    return new URL(
        "https://tsukumart-demo.firebaseapp.com/image/" + userImageFile.name
    );
};

/**
 * ユーザーのプロフィール画像をCloud Storageから削除する
 * @param fileName ファイル名
 */
export const deleteUserImage = async (fileName: string): Promise<void> => {
    await deleteStorageFile("user-image", fileName);
};
/**
 * Firebase Cloud Storageで新しくファイルを作成する
 * 被らないIDで保存したかったが、すでに存在しているかのチェックがうまくいかない
 * ごくまれにかぶるかも
 * @param folderName フォルダの名
 */
const createStorageFile = (folderName: string): storage.File =>
    initializedFirebaseAdmin
        .storage()
        .bucket()
        .file(folderName + "/" + createRandomId());

/**
 * ランダムなIDを生成する
 */
const createRandomId = (): string => {
    let id = "";
    const charTable: string =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 20; i++) {
        id += charTable[(Math.random() * charTable.length) | 0];
    }
    return id;
};

/**
 * Firebase Cloud Storageで保存したファイルを削除する
 * @param folderName フォルダ名
 * @param fileName ファイル名
 */
const deleteStorageFile = async (
    folderName: string,
    fileName: string
): Promise<void> => {
    await initializedFirebaseAdmin
        .storage()
        .bucket()
        .file(folderName + "/" + fileName)
        .delete();
};

/**
 * 画像ファイルのReadStreamを得る
 * @param folderName フォルダ名
 * @param fileName ファイル名
 */
export const getImageReadStream = (
    folderName: string,
    fileName: string
): stream.Readable =>
    initializedFirebaseAdmin
        .storage()
        .bucket()
        .file(folderName + "/" + fileName)
        .createReadStream();

export const addUser = async (
    logInAccountServiceId: string,
    name: string,
    imageUrl: URL,
    schoolAndDepartment: type.SchoolAndDepartment,
    graduate: type.graduate
): Promise<void> => {
    const docRef = await userCollection.add({
        logInAccountService: logInAccountServiceId,
        name: name,
        imageUrl: imageUrl.toString(),
        schoolAndDepartment: schoolAndDepartment,
        graduate: graduate
    });
};
