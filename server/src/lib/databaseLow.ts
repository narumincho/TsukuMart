import * as type from "./type";
import * as firebase from "firebase";
import * as firestore from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import * as stream from "stream";
import { URL } from "url";
import * as sharp from "sharp";
import { Storage } from "@google-cloud/storage";

firebase.initializeApp({
    apiKey: "AIzaSyDmKHgxpyKvnq-zxdj0tYSG6QIMotHKRBU",
    projectId: "tsukumart-f0971"
});

const initializedAdmin = admin.initializeApp();
const dataBase = initializedAdmin.firestore();
const storage = initializedAdmin.storage().bucket();

const userCollectionRef = dataBase.collection("user");
const userBeforeInputDataCollection = dataBase.collection(
    "userBeforeInputData"
);
const userBeforeEmailVerificationCollection = dataBase.collection(
    "userBeforeEmailVerification"
);
const googleLogInStateCollection = dataBase.collection("googleState");
const gitHubLogInStateCollection = dataBase.collection("gitHubState");
const twitterLogInTokenSecretDocumentRef: FirebaseFirestore.DocumentReference = dataBase
    .collection("twitterState")
    .doc("last");
const lineLogInStateCollection = dataBase.collection("lineState");
const productCollectionRef = dataBase.collection("product");
const tradeCollectionRef = dataBase.collection("trade");

/* ==========================================
                    User
   ==========================================
*/
type UserData = {
    logInAccountServiceId: string;
    displayName: string;
    imageId: string;
    schoolAndDepartment: type.SchoolAndDepartment | null;
    graduate: type.Graduate | null;
    introduction: string;
    lastRefreshId: string;
    createdAt: firestore.Timestamp;
    trading: Array<string>;
    traded: Array<string>;
    soldProducts: Array<string>;
    boughtProducts: Array<string>;
};
/**
 * ユーザーのデータを取得する
 * @param id
 * @throws {Error} userId ${id} dose not exists
 */
export const getUserData = async (id: string): Promise<UserData> => {
    const userData = (await (await userCollectionRef.doc(id)).get()).data();
    if (userData === undefined) {
        throw new Error(`userId ${id} dose not exists`);
    }
    return userData as UserData;
};

/**
 * ユーザーのデータを上書きする。すでにあるフィールドはそのまま残る
 * @param id
 * @param userData
 */
export const updateUserData = async (
    id: string,
    userData: Partial<UserData>
): Promise<void> => {
    await userCollectionRef.doc(id).set(userData, { merge: true });
};

type HistoryViewProductData = {
    createdAt: firestore.Timestamp;
};

/**
 * ユーザーの商品の閲覧記録に商品を登録する。
 * @param userId
 * @param productId
 */
export const addHistoryViewProductData = async (
    userId: string,
    productId: string,
    data: HistoryViewProductData
): Promise<void> => {
    await userCollectionRef
        .doc(userId)
        .collection("historyViewProduct")
        .doc(productId)
        .set(data);
};

/**
 * 最後に閲覧した順に閲覧履歴を取得する
 * @param userId
 */
export const getHistoryViewProductData = async (
    userId: string
): Promise<Array<{ id: string; data: HistoryViewProductData }>> =>
    (await querySnapshotToIdAndDataArray(
        await userCollectionRef
            .doc(userId)
            .collection("historyViewProduct")
            .orderBy("createdAt")
            .get()
    )) as Array<{ id: string; data: HistoryViewProductData }>;

type LikedProductData = {
    createdAt: firestore.Timestamp;
};

export const addLikedProductData = async (
    userId: string,
    productId: string,
    data: LikedProductData
): Promise<void> => {
    await userCollectionRef
        .doc(userId)
        .collection("likedProduct")
        .doc(productId)
        .set(data);
};

/**
 * 最後にいいねした順にいいねした商品を取得する
 * @param userId
 */
export const getAllLikedProductsData = async (
    userId: string
): Promise<Array<{ id: string; data: LikedProductData }>> =>
    (await querySnapshotToIdAndDataArray(
        await userCollectionRef
            .doc(userId)
            .collection("likedProduct")
            .orderBy("createdAt")
            .get()
    )) as Array<{ id: string; data: LikedProductData }>;

type DraftProductData = {
    name: string;
    description: string;
    price: number | null;
    condition: type.Condition | null;
    category: type.Category | null;
    thumbnailImageId: string;
    imageIds: Array<string>;
    createdAt: firestore.Timestamp;
    updateAt: firestore.Timestamp;
};

/**
 * 商品の下書きのデータをユーザーに追加する
 * @param userId
 * @param data
 */
export const addDraftProductData = async (
    userId: string,
    data: DraftProductData
): Promise<string> =>
    (await userCollectionRef
        .doc(userId)
        .collection("draftProduct")
        .add(data)).id;

/**
 * 商品の下書きのデータをユーザーから最後に更新した順に取得する
 * @param userId
 */
export const getAllDraftProductData = async (
    userId: string
): Promise<Array<{ id: string; data: DraftProductData }>> =>
    (await querySnapshotToIdAndDataArray(
        await userCollectionRef
            .doc(userId)
            .collection("draftProduct")
            .orderBy("updateAt")
            .get()
    )) as Array<{ id: string; data: DraftProductData }>;

export const getDraftProductData = async (
    userId: string,
    draftId: string
): Promise<DraftProductData> => {
    const data = (await await userCollectionRef
        .doc(userId)
        .collection("draftProduct")
        .doc(draftId)
        .get()).data();
    if (data === undefined) {
        throw new Error(
            `trade id=${draftId} at userId=${userId} dose not exists`
        );
    }
    return data as DraftProductData;
};

export const updateDraftProduct = async (
    userId: string,
    draftId: string,
    data: Partial<DraftProductData>
): Promise<void> => {
    await userCollectionRef
        .doc(userId)
        .collection("draftProduct")
        .doc(draftId)
        .set(data, { merge: true });
};

export const deleteDraftProduct = async (
    userId: string,
    draftId: string
): Promise<void> => {
    await userCollectionRef
        .doc(userId)
        .collection("draftProduct")
        .doc(draftId)
        .delete();
};
/**
 * ユーザーのデータを追加する
 * @param userData
 */
export const addUserData = async (
    data: UserData & { email: string }
): Promise<string> => {
    return (await userCollectionRef.add(data)).id;
};

/**
 * すべてのユーザーのデータを取得する
 */
export const getAllUserData = async (): Promise<
    Array<{ id: string; data: UserData }>
> => {
    return (await querySnapshotToIdAndDataArray(
        await userCollectionRef.get()
    )) as Array<{
        id: string;
        data: UserData;
    }>;
};

export const getUserByLogInServiceAndId = async (
    logInServiceAndId: type.LogInServiceAndId
): Promise<{ ref: firestore.DocumentReference; id: string } | null> => {
    const queryDocumentSnapshot = await getUserListFromCondition(
        "logInAccountServiceId",
        "==",
        type.logInServiceAndIdToString(logInServiceAndId)
    );
    if (0 < queryDocumentSnapshot.length) {
        const snapshot = queryDocumentSnapshot[0];
        return { ref: snapshot.ref, id: snapshot.id };
    }
    return null;
};

export const updateRefreshId = async (
    refreshId: string,
    userDocumentRef: firestore.DocumentReference
): Promise<void> => {
    await userDocumentRef.set({ lastRefreshId: refreshId }, { merge: true });
};
/**
 * ユーザーの条件を指定して検索する
 * @param fieldName field
 * @param operator
 * @param value
 */
const getUserListFromCondition = async <Field extends keyof UserData>(
    fieldName: Field,
    operator: firestore.WhereFilterOp,
    value: UserData[Field]
): Promise<firestore.QueryDocumentSnapshot[]> =>
    (await userCollectionRef.where(fieldName, operator, value).get()).docs;

export const deleteUser = async () => {
    //サブコレクションを手動で削除しなければならない。履歴、下書きなど
};
/* ==========================================
            User Before Input Data
   ==========================================
*/
type UserBeforeInputDataData = {
    name: string;
    imageId: string;
};

export const addUserBeforeInputData = async (
    logInServiceAndId: type.LogInServiceAndId,
    data: UserBeforeInputDataData
): Promise<void> => {
    await userBeforeInputDataCollection
        .doc(type.logInServiceAndIdToString(logInServiceAndId))
        .set(data);
};

export const getAndDeleteUserBeforeInputData = async (
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
    return userBeforeInputData as UserBeforeInputDataData;
};
/* ==========================================
         User Before Email Verification
   ==========================================
*/
type UserBeforeEmailVerificationData = {
    firebaseAuthUserId: string;
    name: string;
    imageId: string;
    schoolAndDepartment: type.SchoolAndDepartment | null;
    graduate: type.Graduate | null;
    email: string;
};

export const addUserBeforeEmailVerification = async (
    logInAccountServiceId: type.LogInServiceAndId,
    data: UserBeforeEmailVerificationData
): Promise<void> => {
    await userBeforeEmailVerificationCollection
        .doc(type.logInServiceAndIdToString(logInAccountServiceId))
        .set(data);
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
export type ProductData = {
    name: string;
    price: number;
    description: string;
    condition: type.Condition;
    category: type.Category;
    thumbnailImageId: string;
    imageIds: Array<string>;
    likedCount: number;
    viewedCount: number;
    status: type.ProductStatus;
    sellerId: string;
    sellerDisplayName: string;
    sellerImageId: string;
    createdAt: firestore.Timestamp;
    updateAt: firestore.Timestamp;
};

/**
 * 指定したIDの商品があるかどうか調べる
 * @param id
 */
export const existsProduct = async (id: string): Promise<boolean> =>
    (await productCollectionRef.doc(id).get()).exists;

/**
 * 商品のデータを取得する
 * @param id
 * @throws {Error} productId ${id} dose not exists
 */
export const getProduct = async (id: string): Promise<ProductData> => {
    const data = (await productCollectionRef.doc(id).get()).data();
    if (data === undefined) {
        throw new Error(`productId ${id} dose not exists`);
    }
    return data as ProductData;
};

/**
 * 商品のデータを上書きする
 * @param id
 * @param data
 */
export const updateProductData = async (
    id: string,
    data: Partial<ProductData>
): Promise<void> => {
    await productCollectionRef.doc(id).set(data, {
        merge: true
    });
};

/**
 * 商品のデータを追加する
 * @param userData
 */
export const addProductData = async (data: ProductData): Promise<string> => {
    return (await productCollectionRef.add(data)).id;
};

/**
 * すべての商品のデータを取得する
 */
export const getAllProductData = async (): Promise<
    Array<{ id: string; data: ProductData }>
> =>
    (await querySnapshotToIdAndDataArray(
        await productCollectionRef.get()
    )) as Array<{
        id: string;
        data: ProductData;
    }>;

/**
 *  商品を新着順で取得する
 */
export const getRecentProductData = async (): Promise<
    Array<{ id: string; data: ProductData }>
> =>
    (await querySnapshotToIdAndDataArray(
        await getProductsOrderBy("createdAt", "desc")
    )) as Array<{
        id: string;
        data: ProductData;
    }>;

/**
 * 商品をいいねが多い順に取得する
 */
export const getRecommendProductData = async (): Promise<
    Array<{ id: string; data: ProductData }>
> =>
    (await querySnapshotToIdAndDataArray(
        await getProductsOrderBy("likedCount", "desc")
    )) as Array<{ id: string; data: ProductData }>;

/**
 * 0円の商品を取得する
 */
export const getFreeProductData = async (): Promise<
    Array<{ id: string; data: ProductData }>
> =>
    (await querySnapshotToIdAndDataArray(
        await getProductsFromCondition("price", "==", 0, "createdAt", "desc")
    )) as Array<{ id: string; data: ProductData }>;
/**
 * 商品の条件を指定して、指定した順番で取得する
 * @param fieldName
 * @param operator
 * @param value
 */
const getProductsFromCondition = async <
    WhereField extends keyof ProductData,
    OrderByField extends keyof ProductData
>(
    fieldName: WhereField,
    operator: firestore.WhereFilterOp,
    value: ProductData[WhereField],
    orderByField: OrderByField,
    directionStr: firestore.OrderByDirection
): Promise<firestore.QuerySnapshot> =>
    await productCollectionRef
        .where(fieldName, operator, value)
        .orderBy(orderByField, directionStr)
        .get();

/**
 * すべての商品を指定した順番で取得する
 */
const getProductsOrderBy = async <Field extends keyof ProductData>(
    field: Field,
    directionStr: firestore.OrderByDirection
): Promise<firestore.QuerySnapshot> =>
    await productCollectionRef.orderBy(field, directionStr).get();

type ProductComment = {
    body: string;
    speakerId: string;
    speakerDisplayName: string;
    speakerImageId: string;
    createdAt: firestore.Timestamp;
};

export const getProductComments = async (
    id: string
): Promise<Array<{ id: string; data: ProductComment }>> =>
    (await querySnapshotToIdAndDataArray(
        await productCollectionRef
            .doc(id)
            .collection("comment")
            .get()
    )) as Array<{ id: string; data: ProductComment }>;

export const createProductComment = async (
    id: string,
    data: ProductComment
): Promise<void> => {
    await productCollectionRef
        .doc(id)
        .collection("comment")
        .add(data);
};
/* ==========================================
                    Trade
   ==========================================
*/
export type Trade = {
    productId: string;
    buyerUserId: string;
    createdAt: firestore.Timestamp;
    updateAt: firestore.Timestamp;
};

export const getAllTradeData = async (
    userId: string
): Promise<Array<{ id: string; data: Trade }>> =>
    (await querySnapshotToIdAndDataArray(
        await tradeCollectionRef.get()
    )) as Array<{ id: string; data: Trade }>;

export const getTradeData = async (id: string): Promise<Trade> => {
    const data = (await tradeCollectionRef.doc(id).get()).data();
    if (data === undefined) {
        throw new Error(`trade id=${id} dose not exists`);
    }
    return data as Trade;
};

type TradeComment = {
    body: string;
    speaker: type.SellerOrBuyer;
    createdAt: firestore.Timestamp;
};

export const getTradeComments = async (
    id: string
): Promise<Array<{ id: string; data: TradeComment }>> =>
    (await querySnapshotToIdAndDataArray(
        await tradeCollectionRef
            .doc(id)
            .collection("comment")
            .get()
    )) as Array<{ id: string; data: TradeComment }>;

export const createTradeComment = async (id: string, data: TradeComment) => {
    await tradeCollectionRef
        .doc(id)
        .collection("comment")
        .add(data);
};
/* ==========================================
   ==========================================
*/

/**
 * クエリの解析結果を配列に変換する
 * @param querySnapshot
 */
const querySnapshotToIdAndDataArray = (
    querySnapshot: FirebaseFirestore.QuerySnapshot
): Array<{ id: string; data: FirebaseFirestore.DocumentData }> =>
    querySnapshot.docs.map(result => ({ id: result.id, data: result.data() }));
/* ==========================================
                Time Stamp
   ==========================================
*/
export const getNowTimestamp = (): firestore.Timestamp =>
    admin.firestore.Timestamp.now();

export const timestampToDate = (timeStamp: firestore.Timestamp): Date =>
    new Date(timeStamp.toMillis());
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
    const password: string = createRandomPassword();
    const userRecord = await initializedAdmin.auth().createUser({
        email: email,
        password: password
    });
    return {
        id: userRecord.uid,
        password: password
    };
};

const createRandomPassword = (): string => {
    let id = "";
    const charTable: string =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 32; i++) {
        id += charTable[(Math.random() * charTable.length) | 0];
    }
    return id;
};

export const getFirebaseAuthUserEmailVerified = async (
    id: string
): Promise<boolean> =>
    (await initializedAdmin.auth().getUser(id)).emailVerified;
/* ==========================================
            Firebase Client Auth 
   ==========================================
*/
export const sendEmailVerification = async (
    email: string,
    password: string
) => {
    console.log(
        `email=${email} password=${password}でクライアントアプリでログイン`
    );
    try {
        const a = firebase.auth();
        console.log("get firebase client auth is ok");
        const userCredential = await a.signInWithEmailAndPassword(
            email,
            password
        );
        console.log("get user credential is ok");

        if (userCredential.user === null) {
            throw new Error("userCredential.user is null");
        }
        console.log("認証メールを送信する");
        await userCredential.user.sendEmailVerification();
    } catch (e) {
        console.log(e.stack);
        throw e;
    }
};
/* ==========================================
            Firebase Cloud Storage
   ==========================================
*/
const userImageFolderName = "";
/**
 * Firebase Cloud Storageで新しくファイルを作成する
 * 被らないIDで保存したかったが、すでに存在しているかのチェックがうまくいかない
 * ごくまれにかぶるかも
 * @param folderName フォルダの名
 */
export const saveFileToCloudStorage = async (
    data: ArrayBuffer,
    mimeType: string
): Promise<string> => {
    const id = createRandomFileName();
    const file = storage.file(id);
    await file.save(data, { contentType: mimeType });
    return id;
};

export const saveThumbnailImageToCloudStorage = async (
    data: Buffer,
    mimeType: string
): Promise<string> =>
    new Promise((resolve, reject) => {
        const id = createRandomFileName();
        const file = storage.file(id);
        const writeStream: stream.Writable = file.createWriteStream({
            contentType: mimeType
        });
        const readStream = sharp()
            .resize(300, 300, { fit: "inside" })
            .composite([{ input: data }])
            .jpeg();
        readStream.pipe(writeStream);
        readStream.addListener("end", () => resolve(id));
    });

export const saveThumbnailImageFromCloudStorageToCloudStorage = async (
    fileId: string
): Promise<string> =>
    new Promise((resolve, reject) => {
        const thumbnailFileId = createRandomFileName();
        const writeStream = storage.file(thumbnailFileId).createWriteStream();
        const readStream = storage.file(fileId).createReadStream();
        readStream.addListener("end", () => {
            resolve(thumbnailFileId);
        });
        readStream.pipe(writeStream);
    });
/**
 * ランダムなファイル名を生成する
 */
const createRandomFileName = (): string => {
    let id = "";
    const charTable = "0123456789abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 22; i++) {
        id += charTable[(Math.random() * charTable.length) | 0];
    }
    return id;
};

/**
 * Firebase Cloud Storageにあるファイルを削除する
 * @param fileId ファイルID
 */
export const deleteStorageFile = async (fileId: string): Promise<void> => {
    await storage.file(fileId).delete();
};

/**
 * Firebase Cloud StorageにあるファイルのReadStreamを得る
 * @param folderName フォルダ名
 * @param fileName ファイル名
 */
export const getImageReadStream = (fileId: string): stream.Readable =>
    storage.file(fileId).createReadStream();

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
