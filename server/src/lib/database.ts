import * as admin from "firebase-admin";
import { URL } from "url";
import * as storage from "@google-cloud/storage";
import * as stream from "stream";
import * as type from "./type";
import * as firebase from "firebase";
import * as key from "./key";
import * as jwt from "jsonwebtoken";
import * as utilUrl from "./util/url";
import { user } from "firebase-functions/lib/providers/auth";
import * as firestore from "@google-cloud/firestore";

const initializedAdmin = admin.initializeApp();

firebase.initializeApp({
    apiKey: key.apiKey,
    projectId: "tsukumart-f0971"
});

const dataBase = initializedAdmin.firestore();
const userBeforeInputDataCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "userBeforeInputData"
);
const userBeforeEmailVerificationCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "userBeforeEmailVerification"
);
const userCollectionRef: FirebaseFirestore.CollectionReference = dataBase.collection(
    "user"
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

type UserDocData = {
    logInAccountServiceId: string;
    displayName: string;
    imageUrl: string;
    schoolAndDepartment: type.SchoolAndDepartment | null;
    graduate: type.Graduate | null;
    introduction: string;
    lastRefreshId: string;
    createdAt: FirebaseFirestore.FieldValue;
};
/* ==========================================
            LOW データベースへのIO
   ==========================================
*/
/**
 * ユーザーを取得する
 * @param id
 */
const getUserDataFromId = async (id: string): Promise<UserDocData> => {
    const userData = (await (await userCollectionRef.doc(id)).get()).data();
    if (userData === undefined) {
        throw new Error("userId=" + id + "dose not exsits");
    }
    return userData as UserDocData;
};

/**
 * ユーザーを追加する
 * @param userData
 */
const addUserData = async (userData: UserDocData): Promise<string> => {
    return (await userCollectionRef.add({
        logInAccountServiceId: userData.logInAccountServiceId,
        displayName: userData.displayName,
        imageUrl: userData.imageUrl,
        schoolAndDepartment: userData.schoolAndDepartment,
        graduate: userData.graduate,
        introduction: userData.introduction,
        lastRefreshId: userData.lastRefreshId,
        createdAt: userData.createdAt
    })).id;
};

/**
 * すべてのユーザーに対して加工する
 * @param f 関数
 */
const mapAllUser = async <T>(
    f: (user: UserDocData) => T
): Promise<Array<T>> => {
    const allUserQuerySnapshot = await userCollectionRef.get();
    const allUserDocData = await querySnapshotPromise(allUserQuerySnapshot);
    return allUserDocData.map(user => f(user as UserDocData));
};

/**
 * ユーザーの条件を指定して検索する
 * @param filedName
 * @param operator
 * @param value
 */
const getUserListFrom = async <Filed extends keyof UserDocData>(
    filedName: Filed,
    operator: firestore.WhereFilterOp,
    value: UserDocData[Filed]
): Promise<firestore.QueryDocumentSnapshot[]> =>
    (await userCollectionRef.where(filedName, operator, value).get()).docs;

/**
 * ソーシャルログインで利用するサービス名とそのアカウントIDをセットにしたもの
 */
export type LogInAccountServiceId = {
    accountService: type.AccountService;
    accountServiceId: string;
};

export const logInAccountServiceIdToString = (
    logInAccountServiceId: LogInAccountServiceId
) =>
    logInAccountServiceId.accountService +
    "_" +
    logInAccountServiceId.accountServiceId;

export const logInAccountServiceIdFromString = (
    string: string
): LogInAccountServiceId => {
    const result = string.match(/^(.+?)_(.+)$/);
    if (result === null) {
        throw new Error("logInAccountServiceId is invalid");
    }
    const accountService = type.checkAccountServiceValues(result[1]);
    if (accountService === null) {
        throw new Error("logInAccount is invalid" + result[1]);
    }
    return {
        accountService: accountService,
        accountServiceId: result[2]
    };
};

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGoogleLogInState = async (): Promise<string> =>
    (await googleLogInStateCollection.add({})).id;

/**
 * 指定したStateがつくマート自身が発行したものかどうか調べ、あったらそのStateを削除する
 * @param state
 */
export const checkExistsLogInState = async (
    state: string,
    service: "google" | "gitHub" | "line"
): Promise<boolean> => {
    switch (service) {
        case "google": {
            const docRef: FirebaseFirestore.DocumentReference = googleLogInStateCollection.doc(
                state
            );
            const exists = (await docRef.get()).exists;
            if (exists) {
                console.log("googleのstateを削除");
                await docRef.delete();
            }
            return exists;
        }
        case "gitHub": {
            const docRef: FirebaseFirestore.DocumentReference = gitHubLogInStateCollection.doc(
                state
            );
            const exists = (await docRef.get()).exists;
            if (exists) {
                await docRef.delete();
            }
            return exists;
        }
        case "line": {
            const docRef: FirebaseFirestore.DocumentReference = lineLogInStateCollection.doc(
                state
            );
            const exists = (await docRef.get()).exists;
            if (exists) {
                await docRef.delete();
            }
            return exists;
        }
    }
};

/** 最後に保存したTokenSecretを取得する */
export const getTwitterLastTokenSecret = async (): Promise<string> => {
    const lastData:
        | FirebaseFirestore.DocumentData
        | undefined = (await twitterLogInTokenSecretDocumentRef.get()).data();
    if (lastData === undefined) {
        throw new Error("Twitterの最後に保存したtokenSecretがない");
    }
    return lastData.tokenSecret;
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
 * @returns ユーザー情報を入力する前のユーザーID
 */
export const addUserInUserBeforeInputData = async (
    accountService: type.AccountService,
    accountServiceId: string,
    name: string,
    imageUrl: URL
): Promise<LogInAccountServiceId> => {
    const documentId: LogInAccountServiceId = {
        accountService: accountService,
        accountServiceId: accountServiceId
    };
    await userBeforeInputDataCollection
        .doc(logInAccountServiceIdToString(documentId))
        .set({
            name: name,
            imageUrl: imageUrl.toString()
        });
    return documentId;
};

/**
 * ユーザー情報を入力する前のユーザー情報を取得し削除する
 * @param logInAccountServiceId サービス名_サービス内でのID
 */
export const getUserInUserBeforeInputData = async (
    logInAccountServiceId: LogInAccountServiceId
): Promise<{
    name: string;
    imageUrl: URL;
}> => {
    const docRef = await userBeforeInputDataCollection.doc(
        logInAccountServiceIdToString(logInAccountServiceId)
    );
    const doc = await docRef.get();
    const userBeforeInputData = doc.data();
    if (userBeforeInputData === undefined) {
        console.log("存在しない情報入力前のユーザーを指定された");
        throw new Error("存在しない情報入力前のユーザーを指定された");
    }
    docRef.delete();
    return {
        name: userBeforeInputData.name,
        imageUrl: new URL(userBeforeInputData.imageUrl)
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
        "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" +
            userImageFile.name
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
    initializedAdmin
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
    await initializedAdmin
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
    initializedAdmin
        .storage()
        .bucket()
        .file(folderName + "/" + fileName)
        .createReadStream();

export const addUserBeforeEmailVerificationAndSendEmail = async (
    logInAccountServiceId: LogInAccountServiceId,
    name: string,
    imageUrl: URL,
    email: string,
    university: type.University
): Promise<void> => {
    const flatUniversity = type.universityToFlat(university);
    const password: string = createRandomId();
    const userRecord = await initializedAdmin.auth().createUser({
        email: email,
        password: password
    });
    await userBeforeEmailVerificationCollection
        .doc(logInAccountServiceIdToString(logInAccountServiceId))
        .set({
            sendVerificationEmailUserId: userRecord.uid,
            name: name,
            imageUrl: imageUrl.toString(),
            schoolAndDepartment: flatUniversity.schoolAndDepartment,
            graduate: flatUniversity.graduate
        });
    const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
    if (userCredential.user === null) {
        throw new Error("userCredential.user is null");
    }
    await userCredential.user.sendEmailVerification();
};

export const getAccessTokenAndRefreshToken = async (
    logInAccountServiceId: LogInAccountServiceId
): Promise<{ refreshToken: string; accessToken: string }> => {
    const docList = await getUserListFrom(
        "logInAccountServiceId",
        "==",
        logInAccountServiceIdToString(logInAccountServiceId)
    );
    if (docList.length !== 0) {
        const refreshId = createRefreshId();
        const queryDocumentSnapshot = docList[0];
        queryDocumentSnapshot.ref.set({
            lastRefreshId: refreshId
        });
        const userData = queryDocumentSnapshot.data();
        return {
            accessToken: createAccessToken(userData.id, false),
            refreshToken: createRefreshToken(userData.id, refreshId)
        };
    }

    const userBeforeEmailVerification = (await userBeforeEmailVerificationCollection
        .doc(logInAccountServiceIdToString(logInAccountServiceId))
        .get()).data();
    if (userBeforeEmailVerification !== undefined) {
        if (
            (await initializedAdmin
                .auth()
                .getUser(
                    userBeforeEmailVerification.sendVerificationEmailUserId
                )).emailVerified
        ) {
            console.log("メールで認証済み", userBeforeEmailVerification);
            const imageUrl: string = userBeforeEmailVerification.imageUrl;
            const refreshId = createRefreshId();
            const newUserId = await addUserData({
                logInAccountServiceId: logInAccountServiceIdToString(
                    logInAccountServiceId
                ),
                displayName: userBeforeEmailVerification.name as string,
                imageUrl: imageUrl,
                schoolAndDepartment: userBeforeEmailVerification.schoolAndDepartment as type.SchoolAndDepartment | null,
                graduate: userBeforeEmailVerification.graduate as type.Graduate | null,
                introduction: "",
                lastRefreshId: refreshId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            await userBeforeEmailVerificationCollection
                .doc(logInAccountServiceIdToString(logInAccountServiceId))
                .delete();

            return {
                accessToken: createAccessToken(newUserId, false),
                refreshToken: createRefreshToken(newUserId, refreshId)
            };
        }
        console.log("メールで認証済みでない" + logInAccountServiceId);
        throw new Error("email not verified");
    }

    console.log("ユーザーが存在しなかった" + logInAccountServiceId);
    throw new Error("user dose not exists");
};

/**
 * アクセストークンを作成する
 * @param userId
 * @param byRefreshToken
 */
const createAccessToken = (userId: string, byRefreshToken: boolean): string => {
    const time = new Date();
    time.setUTCMinutes(time.getUTCMinutes() + 15); // 有効期限は15分後
    const payload = {
        sub: userId,
        ref: byRefreshToken, //リフレッシュトークンでログインしたか
        exp: Math.round(time.getTime() / 1000) // 有効期限
    };
    /** アクセストークン */
    return jwt.sign(payload, key.accessTokenSecretKey, { algorithm: "HS256" });
};

/**
 * リフレッシュトークンを作成する
 * @param userId
 * @param refreshId
 */
const createRefreshToken = (userId: string, refreshId: string): string => {
    /** リフレッシュトークン 有効期限はなし */
    const payload = {
        sub: userId,
        jti: refreshId
    };
    return jwt.sign(payload, key.refreshTokenSecretKey, { algorithm: "HS256" });
};

const createRefreshId = (): string => {
    let id = "";
    const charTable: string =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 15; i++) {
        id += charTable[(Math.random() * charTable.length) | 0];
    }
    return id;
};

/**
 * すべてのユーザーの情報を取得する
 */
export const getAllUser = async (): Promise<
    Array<{
        displayName: string;
        imageUrl: URL;
        university: type.University;
    }>
> =>
    mapAllUser(docData => ({
        displayName: docData.displayName,
        imageUrl: new URL(docData.imageUrl),
        university: type.universityUnsafeToUniversity({
            graduate: docData.graduate,
            schoolAndDepartment: docData.schoolAndDepartment
        }),
        introduction: docData.introduction
    }));

const querySnapshotPromise = (
    querySnapshot: FirebaseFirestore.QuerySnapshot
): Promise<Array<FirebaseFirestore.DocumentData>> =>
    new Promise((resolve, reject) => {
        const size = querySnapshot.size;
        const resultList: Array<FirebaseFirestore.DocumentData> = [];
        querySnapshot.forEach(result => {
            resultList.push(result.data());
            if (resultList.length === size - 1) {
                resolve(resultList);
            }
        });
    });
