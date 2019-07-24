import * as jwt from "jsonwebtoken";
import * as databaseLow from "./databaseLow";
import * as key from "./key";
import * as type from "./type";
import Maybe from "graphql/tsutils/Maybe";

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
 * @param logInServiceAndId 使うアカウントのサービスとそれぞれのアカウントのユーザーID
 * @param name 各サービスのアカウント名
 * @param imageId つくマートのサーバーにダウンロードしたアカウント画像の画像ID
 */
export const addUserInUserBeforeInputData = async (
    logInServiceAndId: type.LogInServiceAndId,
    name: string,
    imageId: string
): Promise<void> => {
    await databaseLow.addUserBeforeInputData(logInServiceAndId, {
        name,
        imageId: imageId
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
    imageId: string;
}> => {
    const data = await databaseLow.getAndDeleteUserBeforeInputData(
        logInAccountServiceId
    );
    return {
        name: data.name,
        imageId: data.imageId
    };
};

export const addUserBeforeEmailVerification = async (
    logInAccountServiceId: type.LogInServiceAndId,
    name: string,
    imageId: string,
    email: string,
    university: type.University
): Promise<string> => {
    const authUser = await databaseLow.createFirebaseAuthUserByRandomPassword(
        email
    );
    const flatUniversity = type.universityToInternal(university);
    await databaseLow.addUserBeforeEmailVerification(logInAccountServiceId, {
        firebaseAuthUserId: authUser.id,
        name: name,
        imageId: imageId,
        schoolAndDepartment: flatUniversity.schoolAndDepartment,
        graduate: flatUniversity.graduate,
        email: email
    });
    return await databaseLow.createCustomToken(authUser.id);
};

/**
 * ソーシャルログインのアカウントIDからアクセストークンをリフレッシュトークンを得る
 * @param logInAccountServiceId
 */
export const getAccessTokenAndRefreshToken = async (
    logInAccountServiceId: type.LogInServiceAndId
): Promise<{ refreshToken: string; accessToken: string }> => {
    const userDataMaybe = await databaseLow.getUserByLogInServiceAndId(
        logInAccountServiceId
    );
    // ユーザーが存在するなら
    if (userDataMaybe !== null) {
        const refreshId = createRefreshId();
        await databaseLow.updateRefreshId(refreshId, userDataMaybe.ref);
        return {
            accessToken: createAccessToken(userDataMaybe.id, false),
            refreshToken: createRefreshToken(userDataMaybe.id, refreshId)
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
                displayName: userBeforeEmailVerification.name,
                imageId: userBeforeEmailVerification.imageId,
                schoolAndDepartment:
                    userBeforeEmailVerification.schoolAndDepartment,
                graduate: userBeforeEmailVerification.graduate,
                introduction: "",
                lastRefreshId: refreshId,
                createdAt: databaseLow.getNowTimestamp(),
                email: userBeforeEmailVerification.email,
                traded: [],
                trading: [],
                soldProducts: [],
                boughtProducts: []
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
type UserReturnLowConst = Pick<
    type.UserPrivate,
    | "id"
    | "displayName"
    | "imageId"
    | "introduction"
    | "university"
    | "createdAt"
> & {
    soldProductAll: Array<{ id: string }>;
    boughtProductAll: Array<{ id: string }>;
    tradingAll: Array<{ id: string }>;
    tradedAll: Array<{ id: string }>;
};

/**
 * 指定したユーザーの情報を取得する
 * @param id ユーザーID
 */
export const getUserData = async (id: string): Promise<UserReturnLowConst> =>
    databaseLowUserDataToUserDataLowCost({
        id: id,
        data: await databaseLow.getUserData(id)
    });

const databaseLowUserDataToUserDataLowCost = ({
    id,
    data
}: {
    id: string;
    data: databaseLow.UserData;
}): UserReturnLowConst => ({
    id: id,
    displayName: data.displayName,
    imageId: data.imageId,
    introduction: data.introduction,
    university: type.universityFromInternal({
        graduate: data.graduate,
        schoolAndDepartment: data.schoolAndDepartment
    }),
    createdAt: databaseLow.timestampToDate(data.createdAt),
    soldProductAll: data.soldProducts.map(id => ({ id: id })),
    boughtProductAll: data.boughtProducts.map(id => ({ id: id })),
    tradingAll: data.trading.map(id => ({ id })),
    tradedAll: data.traded.map(id => ({ id }))
});

export const getLikedProductData = async (
    userId: string
): Promise<Array<{ id: string }>> =>
    databaseLow.getAllLikedProductsData(userId);

/**
 * すべてのユーザーの情報を取得する
 */
export const getAllUser = async (): Promise<Array<UserReturnLowConst>> =>
    (await databaseLow.getAllUserData()).map(
        databaseLowUserDataToUserDataLowCost
    );

export const markProductInHistory = async (
    userId: string,
    productId: string
): Promise<ProductReturnLowCost> => {
    await databaseLow.addHistoryViewProductData(userId, productId, {
        createdAt: databaseLow.getNowTimestamp()
    });
    await databaseLow.updateProductData(productId, {
        viewedCount: (await databaseLow.getProduct(productId)).viewedCount + 1
    });
    return productReturnLowCostFromDatabaseLow({
        id: productId,
        data: await databaseLow.getProduct(productId)
    });
};

export const getHistoryViewProduct = async (
    userId: string
): Promise<Array<{ id: string }>> =>
    (await databaseLow.getHistoryViewProductData(userId)).map(value => ({
        id: value.id
    }));

export const addCommentProduct = async (
    userId: string,
    productId: string,
    data: Pick<type.ProductComment, "body">
): Promise<ProductReturnLowCost> => {
    const now = databaseLow.getNowTimestamp();
    const userData = await databaseLow.getUserData(userId);
    await databaseLow.addCommentedProductData(userId, productId, {
        createdAt: now
    });
    await databaseLow.addProductComment(productId, {
        body: data.body,
        createdAt: now,
        speakerId: userId,
        speakerDisplayName: userData.displayName,
        speakerImageId: userData.imageId
    });
    return productReturnLowCostFromDatabaseLow({
        id: productId,
        data: await databaseLow.getProduct(productId)
    });
};

export const getCommentedProducts = async (
    userId: string
): Promise<Array<{ id: string }>> =>
    (await databaseLow.getCommentedProductData(userId)).map(value => ({
        id: value.id
    }));

export const addDraftProductData = async (
    userId: string,
    data: Pick<
        type.DraftProduct,
        "name" | "price" | "description" | "condition" | "category"
    > & { images: Array<type.DataURL> }
): Promise<type.DraftProduct> => {
    const nowTime = databaseLow.getNowTimestamp();
    const nowTimeAsDate = databaseLow.timestampToDate(nowTime);
    const thumbnailImageId = await databaseLow.saveThumbnailImageToCloudStorage(
        data.images[0].data,
        data.images[0].mimeType
    );
    const imageIds = await Promise.all(
        data.images.map(({ data, mimeType }) =>
            databaseLow.saveFileToCloudStorage(data, mimeType)
        )
    );

    return {
        draftId: await databaseLow.addDraftProductData(userId, {
            name: data.name,
            description: data.description,
            price: data.price,
            condition: data.condition,
            category: data.category,
            thumbnailImageId: thumbnailImageId,
            imageIds: imageIds,
            createdAt: nowTime,
            updateAt: nowTime
        }),
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        thumbnailImageId: thumbnailImageId,
        imageIds: imageIds,
        createdAt: nowTimeAsDate,
        updateAt: nowTimeAsDate
    };
};

export const getDraftProducts = async (
    userId: string
): Promise<Array<type.DraftProduct>> =>
    (await databaseLow.getAllDraftProductData(userId)).map(({ id, data }) => ({
        draftId: id,
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        thumbnailImageId: data.thumbnailImageId,
        imageIds: data.imageIds,
        createdAt: databaseLow.timestampToDate(data.createdAt),
        updateAt: databaseLow.timestampToDate(data.createdAt)
    }));
export const updateDraftProduct = async (
    userId: string,
    data: Pick<
        type.DraftProduct,
        "draftId" | "name" | "price" | "description" | "category" | "condition"
    > & { deleteImagesAt: Array<number>; addImages: Array<type.DataURL> }
): Promise<type.DraftProduct> => {
    const nowTime = databaseLow.getNowTimestamp();
    const beforeData = await databaseLow.getDraftProductData(
        userId,
        data.draftId
    );

    const newImageIds: Array<string> = [];
    let restFirstImage: boolean = true;
    let deleteAtIndex = 0;
    for (let i = 0; i < beforeData.imageIds.length; i++) {
        if (i === data.deleteImagesAt[deleteAtIndex]) {
            if (i === 0) {
                restFirstImage = false;
            }
            deleteAtIndex += 1;
        } else {
            newImageIds.push(beforeData.imageIds[i]);
        }
    }
    for (let i = 0; i < data.addImages.length; i++) {
        newImageIds.push(
            await databaseLow.saveThumbnailImageToCloudStorage(
                data.addImages[i].data,
                data.addImages[i].mimeType
            )
        );
    }
    if (newImageIds.length <= 0) {
        throw new Error("商品画像がなくなってしまった");
    }
    let thumbnailImageId = beforeData.thumbnailImageId;
    if (!restFirstImage) {
        thumbnailImageId = await databaseLow.saveThumbnailImageFromCloudStorageToCloudStorage(
            newImageIds[0]
        );
    }
    await databaseLow.updateDraftProduct(userId, data.draftId, {
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        condition: data.condition,
        updateAt: nowTime
    });
    return {
        draftId: data.draftId,
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        condition: data.condition,
        createdAt: databaseLow.timestampToDate(beforeData.createdAt),
        updateAt: databaseLow.timestampToDate(nowTime),
        thumbnailImageId: thumbnailImageId,
        imageIds: newImageIds
    };
};

export const deleteDraftProduct = async (
    userId: string,
    draftId: string
): Promise<void> => {
    await databaseLow.deleteDraftProduct(userId, draftId);
};

/**
 * プロフィールを設定する
 * @param id ユーザーID
 */
export const setProfile = async (
    id: string,
    data: { image: Maybe<type.DataURL> } & Pick<
        type.UserPrivate,
        "displayName" | "introduction" | "university"
    >
): Promise<
    Pick<
        type.UserPrivate,
        "id" | "displayName" | "imageId" | "introduction" | "university"
    >
> => {
    let imageId: string;
    const universityInternal = type.universityToInternal(data.university);
    if (data.image === null || data.image === undefined) {
        databaseLow.updateUserData(id, {
            displayName: data.displayName,
            introduction: data.introduction,
            graduate: universityInternal.graduate,
            schoolAndDepartment: universityInternal.schoolAndDepartment
        });
        imageId = (await databaseLow.getUserData(id)).imageId;
    } else {
        imageId = await databaseLow.saveFileToCloudStorage(
            data.image.data,
            data.image.mimeType
        );
        databaseLow.updateUserData(id, {
            displayName: data.displayName,
            imageId: imageId,
            introduction: data.introduction,
            graduate: universityInternal.graduate,
            schoolAndDepartment: universityInternal.schoolAndDepartment
        });
    }
    return {
        id: id,
        displayName: data.displayName,
        imageId: imageId,
        introduction: data.introduction,
        university: data.university
    };
};

export const saveImage = async (
    data: Buffer,
    mimeType: string
): Promise<string> => await databaseLow.saveFileToCloudStorage(data, mimeType);

export const deleteImage = async (imageId: string): Promise<void> => {
    await databaseLow.deleteStorageFile(imageId);
};

/* ==========================================
                    Product
   ==========================================
*/
type ProductReturnLowCost = Pick<
    type.Product,
    | "id"
    | "name"
    | "price"
    | "description"
    | "condition"
    | "category"
    | "thumbnailImageId"
    | "imageIds"
    | "likedCount"
    | "viewedCount"
    | "status"
    | "createdAt"
    | "updateAt"
> & {
    seller: Pick<type.User, "id" | "displayName" | "imageId">;
};

const productReturnLowCostFromDatabaseLow = ({
    id,
    data
}: {
    id: string;
    data: databaseLow.ProductData;
}): ProductReturnLowCost => ({
    id: id,
    name: data.name,
    price: data.price,
    description: data.description,
    condition: data.condition,
    category: data.category,
    thumbnailImageId: data.thumbnailImageId,
    imageIds: data.imageIds,
    likedCount: data.likedCount,
    viewedCount: data.viewedCount,
    status: data.status,
    createdAt: databaseLow.timestampToDate(data.createdAt),
    updateAt: databaseLow.timestampToDate(data.updateAt),
    seller: {
        id: data.sellerId,
        displayName: data.sellerDisplayName,
        imageId: data.sellerImageId
    }
});

export const getAllProducts = async (): Promise<Array<ProductReturnLowCost>> =>
    (await databaseLow.getAllProductData()).map(
        productReturnLowCostFromDatabaseLow
    );

export const getRecentProducts = async (): Promise<
    Array<ProductReturnLowCost>
> =>
    (await databaseLow.getRecentProductData())
        .map(productReturnLowCostFromDatabaseLow)
        .filter(isNotTradingProducts);

export const getRecommendProducts = async (): Promise<
    Array<ProductReturnLowCost>
> =>
    (await databaseLow.getRecommendProductData())
        .map(productReturnLowCostFromDatabaseLow)
        .filter(isNotTradingProducts);

export const getFreeProducts = async (): Promise<Array<ProductReturnLowCost>> =>
    (await databaseLow.getFreeProductData())
        .map(productReturnLowCostFromDatabaseLow)
        .filter(isNotTradingProducts);

const isNotTradingProducts = (product: ProductReturnLowCost): boolean => {
    return product.status !== "trading";
};

/**
 * 商品のデータを取得する
 * @param id
 */
export const getProduct = async (id: string): Promise<ProductReturnLowCost> =>
    productReturnLowCostFromDatabaseLow({
        id: id,
        data: await databaseLow.getProduct(id)
    });

/**
 * 商品を出品する
 */
export const sellProduct = async (
    userId: string,
    data: Pick<
        type.Product,
        "name" | "price" | "description" | "condition" | "category"
    > & { images: Array<type.DataURL> }
): Promise<
    Pick<
        type.Product,
        | "id"
        | "name"
        | "price"
        | "description"
        | "condition"
        | "category"
        | "thumbnailImageId"
        | "imageIds"
        | "createdAt"
        | "updateAt"
    >
> => {
    const userData = await databaseLow.getUserData(userId);

    const thumbnailImageId = await databaseLow.saveThumbnailImageToCloudStorage(
        data.images[0].data,
        data.images[0].mimeType
    );
    const imagesIds = await Promise.all(
        data.images.map(({ data, mimeType }) =>
            databaseLow.saveFileToCloudStorage(data, mimeType)
        )
    );
    const nowTimestamp = databaseLow.getNowTimestamp();
    const productId = await databaseLow.addProductData({
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        thumbnailImageId: thumbnailImageId,
        imageIds: imagesIds,
        likedCount: 0,
        viewedCount: 0,
        status: "selling",
        sellerId: userId,
        sellerDisplayName: userData.displayName,
        sellerImageId: userData.imageId,
        createdAt: nowTimestamp,
        updateAt: nowTimestamp
    });
    await databaseLow.updateUserData(userId, {
        soldProducts: userData.soldProducts.concat(productId)
    });
    return {
        id: productId,
        name: data.name,
        price: data.price,
        description: data.description,
        condition: data.condition,
        category: data.category,
        thumbnailImageId: thumbnailImageId,
        imageIds: imagesIds,
        createdAt: databaseLow.timestampToDate(nowTimestamp),
        updateAt: databaseLow.timestampToDate(nowTimestamp)
    };
};

export const getProductComments = async (
    productId: string
): Promise<
    Array<
        Pick<type.ProductComment, "body" | "commentId" | "createdAt"> & {
            speaker: Pick<type.User, "id" | "displayName" | "imageId">;
        }
    >
> =>
    (await databaseLow.getProductComments(productId)).map(({ id, data }) => ({
        commentId: id,
        body: data.body,
        createdAt: databaseLow.timestampToDate(data.createdAt),
        speaker: {
            id: data.speakerId,
            displayName: data.speakerDisplayName,
            imageId: data.speakerImageId
        }
    }));

export const createProductComment = async (
    userId: string,
    productId: string,
    data: Pick<type.ProductComment, "body">
): Promise<
    Array<
        Pick<type.ProductComment, "body" | "commentId" | "createdAt"> & {
            speaker: Pick<type.User, "id" | "displayName" | "imageId">;
        }
    >
> => {
    const userData = await databaseLow.getUserData(userId);
    const nowTimestamp = databaseLow.getNowTimestamp();
    await databaseLow.addProductComment(productId, {
        body: data.body,
        createdAt: nowTimestamp,
        speakerId: userData.displayName,
        speakerDisplayName: userData.displayName,
        speakerImageId: userData.imageId
    });
    await databaseLow.updateProductData(productId, { updateAt: nowTimestamp });
    return (await databaseLow.getProductComments(productId)).map(
        ({ id, data }) => ({
            commentId: id,
            body: data.body,
            createdAt: databaseLow.timestampToDate(data.createdAt),
            speaker: {
                id: data.speakerId,
                displayName: data.speakerDisplayName,
                imageId: data.speakerImageId
            }
        })
    );
};

export const likeProduct = async (
    userId: string,
    productId: string
): Promise<ProductReturnLowCost> => {
    const likedProducts = await databaseLow.getAllLikedProductsData(userId);
    const productData = await databaseLow.getProduct(productId);
    if (isIncludeProductId(likedProducts, productId)) {
        return productReturnLowCostFromDatabaseLow({
            id: productId,
            data: productData
        });
    }
    await databaseLow.updateProductData(productId, {
        likedCount: productData.likedCount + 1
    });
    await databaseLow.addLikedProductData(userId, productId, {
        createdAt: databaseLow.getNowTimestamp()
    });
    console.log(`いいねproductId=${productId}, userId=${userId}`);
    return productReturnLowCostFromDatabaseLow({
        id: productId,
        data: { ...productData, likedCount: productData.likedCount + 1 }
    });
};

export const unlikeProduct = async (
    userId: string,
    productId: string
): Promise<ProductReturnLowCost> => {
    const likedProducts = await databaseLow.getAllLikedProductsData(userId);
    const productData = await databaseLow.getProduct(productId);
    if (!isIncludeProductId(likedProducts, productId)) {
        return productReturnLowCostFromDatabaseLow({
            id: productId,
            data: productData
        });
    }
    await databaseLow.updateProductData(productId, {
        likedCount: productData.likedCount - 1
    });
    await databaseLow.deleteLikedProductData(userId, productId);
    return productReturnLowCostFromDatabaseLow({
        id: productId,
        data: { ...productData, likedCount: productData.likedCount - 1 }
    });
};

const isIncludeProductId = (
    productsList: Array<{ id: string }>,
    productId: string
) => {
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id === productId) {
            console.log("ユーザー情報に良いねしていると記録している");
            return true;
        }
    }
    console.log("ユーザー情報にいいねされていない");
    return false;
};
/* ==========================================
                    Trade
   ==========================================
*/
type TradeLowCost = Pick<
    type.Trade,
    "id" | "createdAt" | "updateAt" | "status"
> & {
    product: { id: string };
    buyer: { id: string };
};

export const getTrade = async (id: string): Promise<TradeLowCost> => {
    const data = await databaseLow.getTradeData(id);
    return {
        id: id,
        product: {
            id: data.productId
        },
        buyer: {
            id: data.buyerUserId
        },
        createdAt: databaseLow.timestampToDate(data.createdAt),
        updateAt: databaseLow.timestampToDate(data.updateAt),
        status: data.status
    };
};

export const getTradeComments = async (
    id: string
): Promise<Array<type.TradeComment>> =>
    (await databaseLow.getTradeComments(id)).map(({ id, data }) => ({
        commentId: id,
        body: data.body,
        speaker: data.speaker,
        createdAt: databaseLow.timestampToDate(data.createdAt)
    }));

const tradeReturnLowCostFromDatabaseLow = ({
    id,
    data
}: {
    id: string;
    data: databaseLow.Trade;
}): TradeLowCost => {
    return {
        id: id,
        product: {
            id: data.productId
        },
        buyer: {
            id: data.buyerUserId
        },
        createdAt: databaseLow.timestampToDate(data.createdAt),
        updateAt: databaseLow.timestampToDate(data.updateAt),
        status: data.status
    };
};

export const addTradeComment = async (
    userId: string,
    tradeId: string,
    body: string
): Promise<TradeLowCost> => {
    const nowTime = databaseLow.getNowTimestamp();
    const tradeData = await databaseLow.getTradeData(tradeId);
    if (tradeData.buyerUserId === userId) {
        await databaseLow.addTradeComment(tradeId, {
            body: body,
            createdAt: nowTime,
            speaker: "buyer"
        });
        await databaseLow.updateTradeData(tradeId, {
            updateAt: nowTime
        });
        return tradeReturnLowCostFromDatabaseLow({
            id: tradeId,
            data: tradeData
        });
    }
    const productData = await databaseLow.getProduct(tradeData.productId);
    if (productData.sellerId === userId) {
        await databaseLow.addTradeComment(tradeId, {
            body: body,
            createdAt: nowTime,
            speaker: "seller"
        });
        await databaseLow.updateTradeData(tradeId, {
            updateAt: nowTime
        });
        return tradeReturnLowCostFromDatabaseLow({
            id: tradeId,
            data: tradeData
        });
    }
    throw new Error("取引に出品者でも、購入者でもない人がコメントしようとした");
};

export const startTrade = async (
    buyerUserId: string,
    productId: string
): Promise<TradeLowCost> => {
    const nowTime = databaseLow.getNowTimestamp();
    const tradeId = await databaseLow.startTrade({
        buyerUserId: buyerUserId,
        productId: productId,
        status: "inProgress",
        createdAt: nowTime,
        updateAt: nowTime
    });
    await databaseLow.updateUserData(buyerUserId, {
        trading: (await databaseLow.getUserData(buyerUserId)).trading.concat([
            tradeId
        ])
    });
    const sellerId = (await databaseLow.getProduct(productId)).sellerId;
    await databaseLow.updateUserData(sellerId, {
        trading: (await databaseLow.getUserData(sellerId)).trading.concat([
            tradeId
        ])
    });
    await databaseLow.updateProductData(productId, {
        status: "trading"
    });
    return {
        id: tradeId,
        buyer: {
            id: buyerUserId
        },
        product: {
            id: productId
        },
        status: "inProgress",
        createdAt: databaseLow.timestampToDate(nowTime),
        updateAt: databaseLow.timestampToDate(nowTime)
    };
};

export const cancelTrade = async (
    userId: string,
    tradeId: string
): Promise<TradeLowCost> => {
    const nowTime = databaseLow.getNowTimestamp();
    const tradeData = await databaseLow.getTradeData(tradeId);
    let status: type.TradeStatus | undefined = undefined;
    const productData = await databaseLow.getProduct(tradeData.productId);
    if (tradeData.buyerUserId === userId) {
        status = "cancelByBuyer";
    }
    if (productData.sellerId === userId) {
        status = "cancelBySeller";
    }
    if (status === undefined) {
        throw new Error(
            "取引に出品者でも、購入者でもない人が取引をキャンセルしようとした"
        );
    }
    await databaseLow.updateTradeData(tradeId, {
        updateAt: nowTime,
        status: status
    });
    const buyerData = await databaseLow.getUserData(tradeData.buyerUserId);
    await databaseLow.updateUserData(tradeData.buyerUserId, {
        trading: buyerData.trading.filter(e => e !== tradeId),
        traded: buyerData.traded.concat([tradeId])
    });
    const sellerData = await await databaseLow.getUserData(
        productData.sellerId
    );
    await databaseLow.updateUserData(productData.sellerId, {
        trading: sellerData.trading.filter(e => e !== tradeId),
        traded: sellerData.traded.concat([tradeId])
    });
    await databaseLow.updateProductData(tradeData.productId, {
        status: "selling"
    });
    return tradeReturnLowCostFromDatabaseLow({
        id: tradeId,
        data: { ...tradeData, updateAt: nowTime, status: status }
    });
};

export const finishTrade = async (userId: string, tradeId: string) => {
    const nowTime = databaseLow.getNowTimestamp();
    const tradeData = await databaseLow.getTradeData(tradeId);
    const productData = await databaseLow.getProduct(tradeData.productId);
    if (productData.sellerId === userId) {
        if (tradeData.status === "inProgress") {
            await databaseLow.updateTradeData(tradeId, {
                updateAt: nowTime,
                status: "waitBuyerFinish"
            });
            return tradeReturnLowCostFromDatabaseLow({
                id: tradeId,
                data: {
                    ...tradeData,
                    updateAt: nowTime,
                    status: "waitBuyerFinish"
                }
            });
        }
        if (tradeData.status === "waitSellerFinish") {
            await databaseLow.updateTradeData(tradeId, {
                updateAt: nowTime,
                status: "finish"
            });
            const buyerData = await databaseLow.getUserData(
                tradeData.buyerUserId
            );
            await databaseLow.updateUserData(tradeData.buyerUserId, {
                trading: buyerData.trading.filter(e => e !== tradeId),
                traded: buyerData.traded.concat([tradeId])
            });
            const sellerData = await databaseLow.getUserData(
                productData.sellerId
            );
            await databaseLow.updateUserData(productData.sellerId, {
                trading: sellerData.trading.filter(e => e !== tradeId),
                traded: sellerData.traded.concat([tradeId])
            });
            await databaseLow.updateProductData(tradeData.productId, {
                status: "soldOut"
            });
            return tradeReturnLowCostFromDatabaseLow({
                id: tradeId,
                data: { ...tradeData, updateAt: nowTime, status: "finish" }
            });
        }
        return tradeReturnLowCostFromDatabaseLow({
            id: tradeId,
            data: tradeData
        });
    }
    if (tradeData.buyerUserId === userId) {
        if (tradeData.status === "inProgress") {
            await databaseLow.updateTradeData(tradeId, {
                updateAt: nowTime,
                status: "waitSellerFinish"
            });
            return tradeReturnLowCostFromDatabaseLow({
                id: tradeId,
                data: {
                    ...tradeData,
                    updateAt: nowTime,
                    status: "waitSellerFinish"
                }
            });
        }
        if (tradeData.status === "waitBuyerFinish") {
            await databaseLow.updateTradeData(tradeId, {
                updateAt: nowTime,
                status: "finish"
            });
            const buyerData = await databaseLow.getUserData(
                tradeData.buyerUserId
            );
            await databaseLow.updateUserData(tradeData.buyerUserId, {
                trading: buyerData.trading.filter(e => e !== tradeId),
                traded: buyerData.traded.concat([tradeId])
            });
            const sellerData = await databaseLow.getUserData(
                productData.sellerId
            );
            await databaseLow.updateUserData(productData.sellerId, {
                trading: sellerData.trading.filter(e => e !== tradeId),
                traded: sellerData.traded.concat([tradeId])
            });
            await databaseLow.updateProductData(tradeData.productId, {
                status: "soldOut"
            });
            return tradeReturnLowCostFromDatabaseLow({
                id: tradeId,
                data: { ...tradeData, updateAt: nowTime, status: "finish" }
            });
        }
        return tradeReturnLowCostFromDatabaseLow({
            id: tradeId,
            data: tradeData
        });
    }
    throw new Error("購入者じゃない人が、取引を完了させようとした");
};
