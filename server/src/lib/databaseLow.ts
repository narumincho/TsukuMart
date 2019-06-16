import * as type from "./type";
import * as firestore from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import * as stream from "stream";
import { URL } from "url";

const initializedAdmin = admin.initializeApp();
const dataBase = initializedAdmin.firestore();
const storage = initializedAdmin.storage().bucket();

const userCollectionRef: FirebaseFirestore.CollectionReference = dataBase.collection(
    "user"
);

const userBeforeInputDataCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "userBeforeInputData"
);
const userBeforeEmailVerificationCollection: FirebaseFirestore.CollectionReference = dataBase.collection(
    "userBeforeEmailVerification"
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
const productCollectionRef: FirebaseFirestore.CollectionReference = dataBase.collection(
    "product"
);

/* ==========================================
                    ユーザー
   ==========================================
*/
type UserData = {
    logInAccountServiceId: string;
    displayName: string;
    imageUrl: string;
    schoolAndDepartment: type.SchoolAndDepartment | null;
    graduate: type.Graduate | null;
    introduction: string;
    lastRefreshId: string;
    createdAt: FirebaseFirestore.FieldValue;
};
/**
 * ユーザーを取得する
 * @param id
 * @throws {Error} userId ${id} dose not exists
 */
export const getUserDataFromId = async (id: string): Promise<UserData> => {
    const userData = (await (await userCollectionRef.doc(id)).get()).data();
    if (userData === undefined) {
        throw new Error(`userId ${id} dose not exists`);
    }
    return userData as UserData;
};

/**
 * ユーザーの情報を上書きする。すでにあるフィールドはそのまま残る
 * @param id
 * @param userData
 */
export const updateUserData = async (
    id: string,
    userData: Partial<UserData>
): Promise<void> => {
    await (await userCollectionRef.doc(id)).set(userData, { merge: true });
};

/**
 * ユーザーを追加する
 * @param userData
 */
export const addUserData = async (data: UserData): Promise<string> => {
    return (await userCollectionRef.add(data)).id;
};

/**
 * すべてのユーザーのデータを取得する
 */
export const getAllUserData = async (): Promise<
    Array<{ id: string; data: UserData }>
> => {
    const allUserQuerySnapshot = await userCollectionRef.get();
    return (await querySnapshotPromise(allUserQuerySnapshot)) as Array<{ id: string; data: UserData }>;
};

/**
 * ユーザーの条件を指定して検索する
 * @param filedName
 * @param operator
 * @param value
 */
export const getUserListFrom = async <Filed extends keyof UserData>(
    filedName: Filed,
    operator: firestore.WhereFilterOp,
    value: UserData[Filed]
): Promise<firestore.QueryDocumentSnapshot[]> =>
    (await userCollectionRef.where(filedName, operator, value).get()).docs;

/**
 * クエリの解析結果をPromiseに変換する
 * @param querySnapshot
 */
const querySnapshotPromise = (
    querySnapshot: FirebaseFirestore.QuerySnapshot
): Promise<Array<{ id: string; data: FirebaseFirestore.DocumentData }>> =>
    new Promise((resolve, reject) => {
        const size = querySnapshot.size;
        const resultList: Array<{
            id: string;
            data: FirebaseFirestore.DocumentData;
        }> = [];
        querySnapshot.forEach(result => {
            resultList.push({ id: result.id, data: result.data() });
            if (resultList.length === size) {
                resolve(resultList);
            }
        });
    });

/* ==========================================
            User Before Input Data
   ==========================================
*/
type UserBeforeInputDataData = {
    name: string;
    imageUrl: URL;
};

export const addUserBeforeInputData = async (
    logInServiceAndId: type.LogInServiceAndId,
    data: UserBeforeInputDataData
): Promise<void> => {
    await userBeforeInputDataCollection
        .doc(type.logInServiceAndIdToString(logInServiceAndId))
        .set({
            name: data.name,
            imageUrl: data.imageUrl.toString()
        });
};

export const getUserBeforeInputData = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<UserBeforeInputDataData> => {
    const docRef = await userBeforeInputDataCollection.doc(
        type.logInServiceAndIdToString(logInAccountServiceId)
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
/* ==========================================
         User Before Email Verification
   ==========================================
*/
type UserBeforeEmailVerificationData = {
    firebaseAuthUserId: string;
    name: string;
    imageUrl: URL;
    schoolAndDepartment: type.SchoolAndDepartment | null;
    graduate: type.Graduate | null;
};

export const addUserBeforeEmailVerification = async (
    logInAccountServiceId: type.LogInServiceAndId,
    data: UserBeforeEmailVerificationData
): Promise<void> => {
    await userBeforeEmailVerificationCollection
        .doc(type.logInServiceAndIdToString(logInAccountServiceId))
        .set({
            firebaseAuthUserId: data.firebaseAuthUserId,
            name: data.name,
            imageUrl: data.imageUrl.toString(),
            schoolAndDepartment: data.schoolAndDepartment,
            graduate: data.graduate
        });
};

export const getUserBeforeEmailVerification = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<UserBeforeEmailVerificationData | undefined> =>
    (await userBeforeEmailVerificationCollection
        .doc(type.logInServiceAndIdToString(logInAccountServiceId))
        .get()).data() as UserBeforeEmailVerificationData | undefined;

export const deleteUserBeforeEmailVerification = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<void> => {
    await userBeforeEmailVerificationCollection
        .doc(type.logInServiceAndIdToString(logInAccountServiceId))
        .delete();
};
/* ==========================================
                    Product
   ==========================================
*/
type Product = {
    name: string;
    price: number;
    sellerId: string;
    sellerName: string;
    sellerImageUrl: string;
};
/**
 * 商品の情報を取得する
 * @param id
 * @throws {Error} productId ${id} dose not exists
 */
export const getProduct = async (id: string): Promise<Product> => {
    const data = (await productCollectionRef.doc(id).get()).data();
    if (data === undefined) {
        throw new Error(`productId ${id} dose not exists`);
    }
    return data as Product;
};
/* ==========================================
                Time Stamp
   ==========================================
*/
export const getNowTimeStamp = (): firestore.FieldValue =>
    admin.firestore.FieldValue.serverTimestamp();

/* ==========================================
            Firebase Authentication 
   ==========================================
*/
/**
 * Firebase Authenticationのユーザーをランダムなパスワードで作成する
 */
export const createFirebaseAuthUserByRandomPassword = async (
    email: string
): Promise<{ id: string; password: string }> => {
    const password: string = createRandomId();
    const userRecord = await initializedAdmin.auth().createUser({
        email: email,
        password: password
    });
    return {
        id: userRecord.uid,
        password: password
    };
};

export const getFirebaseAuthUserEmailVerified = async (
    id: string
): Promise<boolean> =>
    (await initializedAdmin.auth().getUser(id)).emailVerified;
/* ==========================================
            Firebase Cloud Storage
   ==========================================
*/
/**
 * Firebase Cloud Storageで新しくファイルを作成する
 * 被らないIDで保存したかったが、すでに存在しているかのチェックがうまくいかない
 * ごくまれにかぶるかも
 * @param folderName フォルダの名
 */
export const saveStorageFile = async (
    folderName: string,
    data: ArrayBuffer,
    mimeType: string
): Promise<URL> => {
    const id = createRandomId();
    const file = storage.file(folderName + "/" + id);
    await file.save(data, { contentType: mimeType });
    return new URL(
        "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" +
            file.name
    );
};
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
 * Firebase Cloud Storageにあるファイルを削除する
 * @param folderName フォルダ名
 * @param fileName ファイル名
 */
export const deleteStorageFile = async (
    folderName: string,
    fileName: string
): Promise<void> => {
    await storage.file(folderName + "/" + fileName).delete();
};

/**
 * Firebase Cloud StorageにあるファイルのReadStreamを得る
 * @param folderName フォルダ名
 * @param fileName ファイル名
 */
export const getImageReadStream = (
    folderName: string,
    fileName: string
): stream.Readable =>
    storage.file(folderName + "/" + fileName).createReadStream();

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGoogleLogInState = async (): Promise<string> =>
    (await googleLogInStateCollection.add({})).id;

/**
 * GitHubへの stateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGitHubLogInState = async (): Promise<string> =>
    (await gitHubLogInStateCollection.add({})).id;

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteLineLogInState = async (): Promise<string> =>
    (await lineLogInStateCollection.add({})).id;

/**
 * TwitterのTokenSecretを上書き保存する
 */
export const writeTwitterLogInTokenSecret = async (
    tokenSecret: string
): Promise<void> => {
    await twitterLogInTokenSecretDocumentRef.set({
        tokenSecret: tokenSecret
    });
};

/**
 * Googleへのstateが存在することを確認し、存在するなら削除する
 */
export const getGoogleLogInStateAndDelete = async (
    state: string
): Promise<boolean> => {
    const docRef: FirebaseFirestore.DocumentReference = googleLogInStateCollection.doc(
        state
    );
    const exists = (await docRef.get()).exists;
    if (exists) {
        await docRef.delete();
    }
    return exists;
};

/**
 * GitHubへのstateが存在することを確認し、存在するなら削除する
 */
export const getGitHubLogInStateAndDelete = async (
    state: string
): Promise<boolean> => {
    const docRef: FirebaseFirestore.DocumentReference = gitHubLogInStateCollection.doc(
        state
    );
    const exists = (await docRef.get()).exists;
    if (exists) {
        await docRef.delete();
    }
    return exists;
};

/**
 * LINEへのstateが存在することを確認し、存在するなら削除する
 */
export const getLineLogInStateAndDelete = async (
    state: string
): Promise<boolean> => {
    const docRef: FirebaseFirestore.DocumentReference = lineLogInStateCollection.doc(
        state
    );
    const exists = (await docRef.get()).exists;
    if (exists) {
        await docRef.delete();
    }
    return exists;
};

export const getTwitterLastTokenSecret = async (): Promise<string> => {
    const lastData:
        | FirebaseFirestore.DocumentData
        | undefined = (await twitterLogInTokenSecretDocumentRef.get()).data();
    if (lastData === undefined) {
        throw new Error("Twitterの最後に保存したtokenSecretがない");
    }
    return lastData.tokenSecret;
};
