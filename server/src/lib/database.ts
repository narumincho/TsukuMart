import * as firebase from "firebase";
import * as jwt from "jsonwebtoken";
import { URL } from "url";
import * as databaseLow from "./databaseLow";
import * as key from "./key";
import * as type from "./type";
import { userInfo } from "os";

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
        imageUrl
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
}> => await databaseLow.getUserBeforeInputData(logInAccountServiceId);
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
    const flatUniversity = type.universityToFlat(university);
    await databaseLow.addUserBeforeEmailVerification(logInAccountServiceId, {
        firebaseAuthUserId: authUser.id,
        name: name,
        imageUrl: imageUrl,
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

export const getAccessTokenAndRefreshToken = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<{ refreshToken: string; accessToken: string }> => {
    const docList = await databaseLow.getUserListFrom(
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
): Promise<{ refreshToken: string; accessToken: string }> => {
    const decoded = jwt.verify(refreshToken, key.refreshTokenSecretKey, {
        algorithms: ["HS256"]
    }) as { sub: unknown; jti: unknown };
    const sub = decoded.sub;
    const jti = decoded.jti;
    if (typeof sub !== "string" || typeof jti !== "string") {
        console.log("subかjtiがない!");
        throw new Error("invalid refresh token");
    }

    const userData = await databaseLow.getUserDataFromId(sub);
    console.log(
        "データベースで保存されていたリフレッシュトークンID",
        userData.lastRefreshId
    );
    console.log("JWTに入っていたリフレッシュトークンID", jti);
    if (userData.lastRefreshId === jti) {
        const refreshId: string = createRefreshId();
        await databaseLow.updateUerData(sub, { lastRefreshId: refreshId });
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

/**
 * 指定したユーザーの情報を取得する
 * @param id ユーザーID
 */
export const getUserData = async (
    id: string
): Promise<{
    displayName: string;
    imageUrl: URL;
    introduction: string;
    university: type.University;
}> => {
    const userData = await databaseLow.getUserDataFromId(id);
    return {
        displayName: userData.displayName,
        imageUrl: new URL(userData.imageUrl),
        introduction: userData.introduction,
        university: type.universityUnsafeToUniversity({
            graduate: userData.graduate,
            schoolAndDepartment: userData.schoolAndDepartment
        })
    };
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
    (await databaseLow.getAllUserData()).map(docData => ({
        displayName: docData.displayName,
        imageUrl: new URL(docData.imageUrl),
        university: type.universityUnsafeToUniversity({
            graduate: docData.graduate,
            schoolAndDepartment: docData.schoolAndDepartment
        }),
        introduction: docData.introduction
    }));
