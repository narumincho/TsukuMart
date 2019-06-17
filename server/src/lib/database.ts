import * as firebase from "firebase";
import * as jwt from "jsonwebtoken";
import { URL } from "url";
import * as databaseLow from "./databaseLow";
import * as key from "./key";
import * as type from "./type";
import Maybe from "graphql/tsutils/Maybe";

firebase.initializeApp({
    apiKey: key.apiKey,
    projectId: "tsukumart-f0971"
});

/**
 * 指定したStateがつくマート自身が発行したものかどうか調べ、あったらそのStateを削除する
 * @param state state
 * @param service サービス
 */
export const checkExistsLogInState = async (
    state: string,
    service: "google" | "gitHub" | "line"
): Promise<boolean> => {
    switch (service) {
        case "google": {
            return databaseLow.getGoogleLogInStateAndDelete(state);
        }
        case "gitHub": {
            return databaseLow.getGitHubLogInStateAndDelete(state);
        }
        case "line": {
            return databaseLow.getLineLogInStateAndDelete(state);
        }
    }
};

/** 最後に保存したTokenSecretを取得する */
export const getTwitterLastTokenSecret = async (): Promise<string> =>
    await databaseLow.getTwitterLastTokenSecret();

/**
 * TwitterのTokenSecretを上書き保存する
 * @param tokenSecret
 */
export const writeTwitterLogInTokenSecret = async (
    tokenSecret: string
): Promise<void> => await databaseLow.writeTwitterLogInTokenSecret(tokenSecret);

/**
 * Googleへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGoogleLogInState = async (): Promise<string> =>
    await databaseLow.generateAndWriteGoogleLogInState();

/**
 * GitHubへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteGitHubLogInState = async (): Promise<string> =>
    await databaseLow.generateAndWriteGitHubLogInState();

/**
 * LINEへの OpenId ConnectのStateを生成して保存する
 * リプレイアタックを防いだり、他のサーバーがつくマートのクライアントIDを使って発行しても自分が発行したものと見比べて識別できるようにする
 */
export const generateAndWriteLineLogInState = async (): Promise<string> =>
    await databaseLow.generateAndWriteLineLogInState();

/**
 * ユーザー情報を入力する前のユーザーを保存する
 * @param accountService 使うアカウントのサービス
 * @param accountServiceId それぞれのアカウントのユーザーID
 * @param name 各サービスのアカウント名
 * @param imageUrl つくマートのサーバーにダウンロードしたアカウント画像のURL
 * @returns ユーザー情報を入力する前のユーザーID
 */
export const addUserInUserBeforeInputData = async (
    logInServiceAndId: type.LogInServiceAndId,
    name: string,
    imageUrl: URL
): Promise<void> => {
    await databaseLow.addUserBeforeInputData(logInServiceAndId, {
        name,
        imageUrl: imageUrl.toString()
    });
};

/**
 * ユーザー情報を入力する前のユーザー情報を取得し削除する
 * @param logInAccountServiceId サービス名_サービス内でのID
 */
export const getUserInUserBeforeInputData = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<{
    name: string;
    imageUrl: URL;
}> => {
    const data = await databaseLow.getAndDeleteUserBeforeInputData(
        logInAccountServiceId
    );
    return {
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
): Promise<URL> =>
    await databaseLow.saveStorageFile("user-image", arrayBuffer, mimeType);

/**
 * ユーザーのプロフィール画像をCloud Storageから削除する
 * @param fileName ファイル名
 */
export const deleteUserImage = async (fileName: string): Promise<void> => {
    await databaseLow.deleteStorageFile("user-image", fileName);
};

export const addUserBeforeEmailVerificationAndSendEmail = async (
    logInAccountServiceId: type.LogInServiceAndId,
    name: string,
    imageUrl: URL,
    email: string,
    university: type.University
): Promise<void> => {
    const authUser = await databaseLow.createFirebaseAuthUserByRandomPassword(
        email
    );
    const flatUniversity = type.universityToInternal(university);
    await databaseLow.addUserBeforeEmailVerification(logInAccountServiceId, {
        firebaseAuthUserId: authUser.id,
        name: name,
        imageUrl: imageUrl.toString(),
        schoolAndDepartment: flatUniversity.schoolAndDepartment,
        graduate: flatUniversity.graduate
    });
    const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, authUser.password);
    if (userCredential.user === null) {
        throw new Error("userCredential.user is null");
    }
    await userCredential.user.sendEmailVerification();
};

/**
 * ソーシャルログインのアカウントIDからアクセストークンをリフレッシュトークンを得る
 * @param logInAccountServiceId
 */
export const getAccessTokenAndRefreshToken = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<{ refreshToken: string; accessToken: string }> => {
    const docList = await databaseLow.getUserListFromCondition(
        "logInAccountServiceId",
        "==",
        type.logInServiceAndIdToString(logInAccountServiceId)
    );
    // ユーザーが存在するなら
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

    // ユーザーが存在するなら (メール認証から初回)
    const userBeforeEmailVerification = await databaseLow.getUserBeforeEmailVerification(
        logInAccountServiceId
    );
    if (userBeforeEmailVerification !== undefined) {
        if (
            await databaseLow.getFirebaseAuthUserEmailVerified(
                userBeforeEmailVerification.firebaseAuthUserId
            )
        ) {
            console.log("メールで認証済み", userBeforeEmailVerification);
            const refreshId = createRefreshId();
            const newUserId = await databaseLow.addUserData({
                logInAccountServiceId: type.logInServiceAndIdToString(
                    logInAccountServiceId
                ),
                displayName: userBeforeEmailVerification.name as string,
                imageUrl: userBeforeEmailVerification.imageUrl.toString(),
                schoolAndDepartment: userBeforeEmailVerification.schoolAndDepartment as type.SchoolAndDepartment | null,
                graduate: userBeforeEmailVerification.graduate as type.Graduate | null,
                introduction: "",
                lastRefreshId: refreshId,
                createdAt: databaseLow.getNowTimeStamp()
            });
            await databaseLow.deleteUserBeforeEmailVerification(
                logInAccountServiceId
            );

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

export const getAccessTokenAndUpdateRefreshToken = async (
    refreshToken: string
): Promise<type.RefreshTokenAndAccessToken> => {
    const decoded = jwt.verify(refreshToken, key.refreshTokenSecretKey, {
        algorithms: ["HS256"]
    }) as { sub: unknown; jti: unknown };
    const sub = decoded.sub;
    const jti = decoded.jti;
    if (typeof sub !== "string" || typeof jti !== "string") {
        console.log("subかjtiがない!");
        throw new Error("invalid refresh token");
    }

    const userData = await databaseLow.getUserData(sub);
    console.log(
        "データベースで保存されていたリフレッシュトークンID",
        userData.lastRefreshId
    );
    console.log("JWTに入っていたリフレッシュトークンID", jti);
    if (userData.lastRefreshId === jti) {
        const refreshId: string = createRefreshId();
        await databaseLow.updateUserData(sub, { lastRefreshId: refreshId });
        return {
            refreshToken: createRefreshToken(sub, refreshId),
            accessToken: createAccessToken(sub, true)
        };
    } else {
        throw new Error("古いリフレッシュトークンを受け取った");
    }
};

/**
 * アクセストークンの正当性チェックとidの取得
 * @param accessToken
 * @throws {Error} invalid access token
 */
export const verifyAccessToken = (
    accessToken: string
): { id: string; isLogInByRefreshToken: boolean } => {
    const decoded = jwt.verify(accessToken, key.accessTokenSecretKey, {
        algorithms: ["HS256"]
    }) as { sub: unknown; ref: unknown };
    if (typeof decoded.sub !== "string" || typeof decoded.ref !== "boolean") {
        throw new Error("invalid access token");
    }
    return {
        id: decoded.sub,
        isLogInByRefreshToken: decoded.ref
    };
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

/* ==========================================
                    User
   ==========================================
*/

/**
 * 指定したユーザーの情報を取得する
 * @param id ユーザーID
 */
export const getUserData = async (
    id: string
): Promise<
    Pick<type.User, "displayName" | "imageUrl" | "introduction" | "university">
> => {
    const userData = await databaseLow.getUserData(id);
    return {
        displayName: userData.displayName,
        imageUrl: new URL(userData.imageUrl),
        introduction: userData.introduction,
        university: type.universityFromInternal({
            graduate: userData.graduate,
            schoolAndDepartment: userData.schoolAndDepartment
        })
    };
};

/**
 * すべてのユーザーの情報を取得する
 */
export const getAllUser = async (): Promise<
    Array<
        Pick<
            type.User,
            "id" | "displayName" | "imageUrl" | "university" | "introduction"
        >
    >
> =>
    (await databaseLow.getAllUserData()).map(({ id, data }) => ({
        id: id,
        displayName: data.displayName,
        imageUrl: new URL(data.imageUrl),
        university: type.universityFromInternal({
            graduate: data.graduate,
            schoolAndDepartment: data.schoolAndDepartment
        }),
        introduction: data.introduction
    }));

/**
 * プロフィールを設定する
 * @param id ユーザーID
 */
export const setProfile = async (
    id: string,
    displayName: string,
    image: Maybe<type.DataURL>,
    introduction: string,
    university: type.University
): Promise<type.UserPrivate> => {
    let imageUrl: URL;
    const universityInternal = type.universityToInternal(university);
    if (image === null || image === undefined) {
        databaseLow.updateUserData(id, {
            displayName,
            introduction,
            graduate: universityInternal.graduate,
            schoolAndDepartment: universityInternal.schoolAndDepartment
        });
        imageUrl = new URL((await databaseLow.getUserData(id)).imageUrl);
    } else {
        imageUrl = await saveUserImage(image.data, image.mimeType);
        databaseLow.updateUserData(id, {
            displayName,
            imageUrl: imageUrl.toString(),
            introduction,
            graduate: universityInternal.graduate,
            schoolAndDepartment: universityInternal.schoolAndDepartment
        });
    }
    return {
        id: id,
        displayName: displayName,
        imageUrl: imageUrl,
        introduction: introduction,
        university: university,
        buyedProductAll: [],
        likedProductAll: [],
        selledProductAll: [],
        historyViewProductAll: []
    };
};

/* ==========================================
                    Product
   ==========================================
*/
/**
 * 商品のデータを取得する
 * @param id
 */
export const getProduct = async (
    id: string
): Promise<
    Pick<
        type.Product,
        | "name"
        | "price"
        | "description"
        | "condition"
        | "category"
        | "likedCount"
        | "viewedCount"
    > & {
        seller: Pick<type.User, "id" | "displayName" | "imageUrl">;
    }
> => {
    const data = await databaseLow.getProduct(id);
    return {
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        likedCount: data.likedCount,
        viewedCount: data.viewedCount,
        seller: {
            id: data.sellerId,
            displayName: data.sellerDisplayName,
            imageUrl: new URL(data.sellerImageUrl)
        }
    };
};

/**
 * 商品を出品する
 */
export const sellProduct = async (
    userId: string,
    data: Pick<
        type.Product,
        "name" | "price" | "description" | "condition" | "category"
    >
): Promise<Pick<type.Product, "id" | "name" | "price">> => {
    const userData = await databaseLow.getUserData(userId);
    const productId = await databaseLow.addProductData({
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        likedCount: 0,
        viewedCount: 0,
        sellerId: userId,
        sellerDisplayName: userData.displayName,
        sellerImageUrl: userData.imageUrl
    });
    return {
        id: productId,
        name: data.name,
        price: data.price
    };
};

export const markProductInHistory = async (
    userId: string,
    productId: string
): Promise<void> => {
    await databaseLow.addHistoryViewProductData(userId, productId, {
        createdAt: databaseLow.getNowTimeStamp()
    });
    await databaseLow.updateProductData(productId, {
        viewedCount: (await databaseLow.getProduct(productId)).viewedCount + 1
    });
};

export const getHistoryViewProduct = async (
    userId: string
): Promise<Array<{ id: string }>> => {
    const data = await databaseLow.getHistoryViewProductData(userId);
    return data.map(value => ({ id: value.id }));
};
