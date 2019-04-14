import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as firebase from "firebase";
import * as jwt from "jsonwebtoken";
import * as result from "./data/result";
import * as univ from "./data/university"

admin.initializeApp();
firebase.initializeApp({
    apiKey: functions.config().api.key,
    projectId: "tsukumart-demo"
});

const dataBase = admin.firestore();
const dataBaseUsersCollection = dataBase.collection("users");
const refreshSecretKey = functions.config().jwt.refresh_secret_key;
const accessSecretKey = functions.config().jwt.access_secret_key;

console.log("run index.js 2019-04-14-09-20");

/**
 *      /api/sign-up
 */
export const signUp = functions.https.onRequest((request: functions.https.Request, response: functions.Response) => {
    const requestBody: unknown = request.body;
    if (typeof requestBody !== "object" || requestBody === null) {
        response.status(400).send("request body must be application/json and root is object")
        return;
    }
    const passwordResult: result.Result<string, Array<PasswordError>> = getValidPassword(requestBody);
    const displayNameResult: result.Result<string, DisplayNameError> = getValidDisplayName(requestBody);
    const emailAndStudentIdImageResult: result.Result<EmailAndStudentIdImage, EmailAndStudentIdImageError> = getValidEmailAndStudentIdImage(requestBody);
    const universityResult: result.Result<univ.University, univ.Error> = univ.getValidUniversity(requestBody);

    result.match(passwordResult,
        password => {
            result.match(displayNameResult,
                displayName => {
                    result.match(emailAndStudentIdImageResult,
                        emailAndStudentIdImage => {
                            result.match(universityResult,
                                university => {
                                    sendConfirmEmailBody(password, displayName, emailAndStudentIdImage, university, response);
                                },
                                err => {
                                    sendConfirmEmailSendError(passwordResult, displayNameResult, emailAndStudentIdImageResult, universityResult, response);
                                }
                            )
                        },
                        err => {
                            sendConfirmEmailSendError(passwordResult, displayNameResult, emailAndStudentIdImageResult, universityResult, response);
                        }
                    )
                },
                err => {
                    sendConfirmEmailSendError(passwordResult, displayNameResult, emailAndStudentIdImageResult, universityResult, response);
                }
            )
        },
        err => {
            sendConfirmEmailSendError(passwordResult, displayNameResult, emailAndStudentIdImageResult, universityResult, response);
        }
    )
});

const sendConfirmEmailSendError = (passwordResult: result.Result<string, Array<PasswordError>>, displayNameResult: result.Result<string, DisplayNameError>, emailAndStudentIdImageResult: result.Result<EmailAndStudentIdImage, EmailAndStudentIdImageError>, universityResult: result.Result<univ.University, univ.Error>, response: functions.Response) => {
    response.status(400).send(
        result.match(passwordResult,
            ok => [],
            err => err.map(e => ({ c: ErrorC.Password, error: e })) as Array<Error>
        ).concat(result.match(displayNameResult,
            ok => [],
            err => [{ c: ErrorC.DisplayName, error: err }]
        )).concat(result.match(emailAndStudentIdImageResult,
            ok => [],
            err => [{ c: ErrorC.EmailAndStudentId, error: err }]
        )).concat(result.match(universityResult,
            ok => [],
            err => [{ c: ErrorC.University, error: err }]
        )).map(errorToString)
    );
}

const sendConfirmEmailBody = (password: string, displayName: string, emailAndStudentIdImage: EmailAndStudentIdImage, university: univ.University, response: functions.Response) => {
    // 認証メールを送るためにFirebase Authenticationで一時的なユーザーの作成は必要
    const email: string = emailAndStudentIdImage.email;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(msg => {
        console.log("ユーザー作成成功 user=", msg.user);
        const user = msg.user as firebase.User;
        switch (emailAndStudentIdImage.c) {
            case EmailAndStudentIdImageC.NotSAddressWithImage:
                console.log("ファイル名", studentIdCardImageFileName(user.uid, emailAndStudentIdImage.mimeType));
                console.log("ファイルのTypeArray", emailAndStudentIdImage.typedArray);
                const file = admin.storage().bucket().file(studentIdCardImageFileName(user.uid, emailAndStudentIdImage.mimeType));
                const stream = file.createWriteStream({ metadata: { contentType: emailAndStudentIdImage.mimeType } });
                stream.write(emailAndStudentIdImage.typedArray);
                stream.end(() => {
                    console.log("データベースに学生証の写真を載せた");
                    dataBaseUsersCollection.doc(user.uid).set(
                        {
                            displayName: displayName,
                            university: univ.toSimpleObject(university),
                            confirmTsukubaStudent: false
                        }
                    ).then(() => {
                        user.sendEmailVerification({ url: "https://tsukumart-demo.firebaseapp.com/" }).then(() => {
                            response.status(200).send();
                        })
                    });
                });
                return;
            case EmailAndStudentIdImageC.SAddress:
                dataBaseUsersCollection.doc(user.uid).set(
                    {
                        displayName: displayName,
                        university: univ.toSimpleObject(university),
                        confirmTsukubaStudent: true
                    }
                ).then(() => {
                    user.sendEmailVerification({ url: "https://tsukumart-demo.firebaseapp.com/" }).then(() => {
                        response.status(200).send();
                    })
                });
                return;
        }
    }).catch(error => {
        const errorCode = error.code;
        switch (error) {
            case "auth/email-already-in-use":
                console.error(`すでに${email}のメールアドレスでユーザーが登録されています`);
                admin.auth().getUserByEmail(email).then(user => {
                    if (user.emailVerified) {
                        console.log(`${email}のメールアドレスで登録しているユーザーは認証済みです`);
                        response.status(400).send(`${email}のメールアドレスで登録しているユーザーは認証済みです`);
                        return;
                    }
                    admin.auth().deleteUser(user.uid).then(() => {
                        console.log("ユーザーの削除成功");
                        sendConfirmEmailBody(password, displayName, emailAndStudentIdImage, university, response);
                    }).catch(() => {
                        console.log("ユーザーの削除失敗")
                        console.log(`${email}のメールアドレスで登録しているユーザーは認証済みではないので削除しようとしたが失敗した`);
                    })
                }).catch(() => {
                    console.log(`${email}のユーザーの情報取得に失敗`);
                    response.send("このメールは使えません");
                })
                return;
            case "auth/invalid-email":
                response.status(400).send([emailAndStudentIdImageErrorToString({
                    c: EmailAndStudentIdImageErrorC.InvalidEmail
                })]);
                return;
            case "auth/operation-not-allowed":
                console.error("Firrebaseの設定でメールアドレスとパスワードによる認証機能がOFFになっている");
                response.status(400).send("Firrebaseの設定でメールアドレスとパスワードによる認証機能がOFFになっている");
                return;
            case "auth/weak-password":
                response.send([passwordErrorToString({ c: PasswordErrorC.WeekPassword })]);
                return;
        }
        console.error("謎の理由でユーザーの作成失敗", error);
        response.status(400).send("謎の理由でユーザーの作成失敗");
        return;
    });
};

const studentIdCardImageFileName = (uid: string, mimeType: "image/png" | "image/jpeg"): string => {
    switch (mimeType) {
        case "image/jpeg":
            return `studentIdCardImage_${uid}.jpg`;
        case "image/png":
            return `studentIdCardImage_${uid}.png`
    }
}

const getTokenFromEmailAndPassword = functions.https.onRequest((request, response) => {
    const requestBody:
        { email: string, password: string }
        = request.body;
    const email = requestBody.email;
    const password = requestBody.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(e => {
        const user = e.user as firebase.User;
        const refreshId = (Math.random() * 99999) | 0;
        dataBaseUsersCollection.doc(user.uid).update(
            { newestRefreshId: refreshId }
        ).then(() => {
            /** リフレッシュトークン */
            const refreshToken = jwt.sign({
                sub: user.uid, // ユーザーID
                ref: false, //リフレッシュトークンでログインしたか
                cut: refreshId // リフレッシュトークンを識別するもの
            },
                refreshSecretKey,
                { algorithm: "HS256" }
            );
            const time = new Date();
            time.setUTCMinutes(time.getUTCMinutes() + 15);
            const accessToken = jwt.sign({
                sub: user.uid,
                exp: Math.round(time.getTime() / 1000)
            }, accessSecretKey,
                { algorithm: "HS256" }
            );
            response.send(
                {
                    refresh: refreshToken,
                    access: accessToken
                }
            );
        }).catch((e) => {
            console.error("newestRefreshIdの書き込みに失敗", e);
        });
    }).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
            case "auth/invalid-email":
                response.send("不正なメールで登録しようとした");
        }
    })
})

const readData = functions.https.onRequest((request, response) => {
    try {
        const result = jwt.verify(
            request.body,
            refreshSecretKey,
            { algorithms: ["HS256"] }
        ) as { sub: string, ref: boolean, cut: number };

        dataBaseUsersCollection.doc(result.sub).get().then(e => {
            const data = e.data() as { newestRefreshId: number }
            console.log("データベースで保存されていたリフレッシュトークンID", data.newestRefreshId);
            console.log("JWTに入っていたリフレッシュトークンID", result.cut);
            if (typeof data.newestRefreshId === "string" || typeof result.cut === "string") {
                response.send("型が合いません");
                return;
            }
            if (data.newestRefreshId === result.cut) {
                response.send("最新のトークン!");
            } else {
                response.send("最新のトークンではない");
            }
        })
    } catch (e) {
        response.send("正当なJWTではなかった");
    }
})

type Error = ErrorPassword | ErrorEmailAndStudentIdImageError | ErrorDisplayName | ErrorUniversity;

const enum ErrorC {
    Password,
    EmailAndStudentId,
    DisplayName,
    University
}

interface ErrorPassword {
    c: ErrorC.Password,
    error: PasswordError
}

interface ErrorEmailAndStudentIdImageError {
    c: ErrorC.EmailAndStudentId,
    error: EmailAndStudentIdImageError
}

interface ErrorDisplayName {
    c: ErrorC.DisplayName,
    error: DisplayNameError
}

interface ErrorUniversity {
    c: ErrorC.University,
    error: univ.Error
}

const errorToString = (error: Error): string => {
    switch (error.c) {
        case ErrorC.EmailAndStudentId:
            return emailAndStudentIdImageErrorToString(error.error);
        case ErrorC.Password:
            return passwordErrorToString(error.error);
        case ErrorC.DisplayName:
            return displayNameErrorToString(error.error);
        case ErrorC.University:
            return univ.errorToString(error.error);
    }
};

const emailAndStudentIdImageErrorToString = (error: EmailAndStudentIdImageError): string => {
    switch (error.c) {
        case EmailAndStudentIdImageErrorC.NeedEmailField:
            return "need email field";
        case EmailAndStudentIdImageErrorC.EmailFieldMustBeString:
            return `email field must be string but request type is ${error.typeName}`;
        case EmailAndStudentIdImageErrorC.InvalidEmail:
            return "invalid email address";
        case EmailAndStudentIdImageErrorC.NotSAddressNeedImageField:
            return "need image field when email is not S Address";
        case EmailAndStudentIdImageErrorC.NotSAddressImageFieldMustBeString:
            return `image field must be string but request type is ${error.typeName}`
        case EmailAndStudentIdImageErrorC.NotSAddressImageNotBase64DataUrlPngOrJpeg:
            return "image format only support DataURL base64 image/png image/jpeg";
    }
}

const passwordErrorToString = (error: PasswordError): string => {
    switch (error.c) {
        case PasswordErrorC.NeedFieldPassword:
            return "need password field";
        case PasswordErrorC.FieldMustBeString:
            return `password must be string but request type is ${error.typeName}`;
        case PasswordErrorC.Length:
            return `password must be 9 <= (password legth) <= 50 but request password length = ${error.length}`;
        case PasswordErrorC.InvalidChar:
            return `password only use visible non space ASCII char (U+0021-U+007E) but request password use = [${[...error.invalidCharList].join(",")}]`;
        case PasswordErrorC.WeekPassword:
            return `password is week`;
    }
}

const displayNameErrorToString = (error: DisplayNameError): string => {
    switch (error.c) {
        case DisplayNameErrorC.NeedDisplayNameField:
            return "need displayName field"
        case DisplayNameErrorC.DisplayNameFieldMustBeString:
            return `displayName must be string but request type is ${error.typeName}`
        case DisplayNameErrorC.Length:
            return `displayName must be 1 <= (displayName length) <= 50 but request displayName length = ${error.length}`;
    }
}

/**
 * sアドか、sアド以外のメールアドレスと学生証の写真
 */
type EmailAndStudentIdImage = SAddress | NotSAddressWithImage

const enum EmailAndStudentIdImageC {
    SAddress,
    NotSAddressWithImage
}

interface SAddress {
    c: EmailAndStudentIdImageC.SAddress,
    email: string
}

interface NotSAddressWithImage {
    c: EmailAndStudentIdImageC.NotSAddressWithImage,
    email: string,
    typedArray: Uint8Array,
    mimeType: "image/png" | "image/jpeg"
}

/**
 * (sアドか、sアド以外のメールアドレスと学生証の写真)のエラー
 */
type EmailAndStudentIdImageError =
    EmailAndStudentIdImageErrorNeedEmailField |
    EmailAndStudentIdImageErrorEmailFieldMustBeString |
    EmailAndStudentIdImageErrorInvalidEmail |
    EmailAndStudentIdImageErrorNotSAddressNeedImageField |
    EmailAndStudentIdImageErrorNotSAddressImageFieldMustBeString |
    EmailAndStudentIdImageErrorNotSAddressImageNotBase64DataUrlPngOrJpeg;

const enum EmailAndStudentIdImageErrorC {
    NeedEmailField,
    EmailFieldMustBeString,
    InvalidEmail,
    NotSAddressNeedImageField,
    NotSAddressImageFieldMustBeString,
    NotSAddressImageNotBase64DataUrlPngOrJpeg,
}

interface EmailAndStudentIdImageErrorNeedEmailField {
    c: EmailAndStudentIdImageErrorC.NeedEmailField
}

interface EmailAndStudentIdImageErrorEmailFieldMustBeString {
    c: EmailAndStudentIdImageErrorC.EmailFieldMustBeString,
    typeName: TypeString
}

interface EmailAndStudentIdImageErrorInvalidEmail {
    c: EmailAndStudentIdImageErrorC.InvalidEmail
}

interface EmailAndStudentIdImageErrorNotSAddressNeedImageField {
    c: EmailAndStudentIdImageErrorC.NotSAddressNeedImageField
}

interface EmailAndStudentIdImageErrorNotSAddressImageFieldMustBeString {
    c: EmailAndStudentIdImageErrorC.NotSAddressImageFieldMustBeString,
    typeName: TypeString
}

interface EmailAndStudentIdImageErrorNotSAddressImageNotBase64DataUrlPngOrJpeg {
    c: EmailAndStudentIdImageErrorC.NotSAddressImageNotBase64DataUrlPngOrJpeg
}


const getValidEmailAndStudentIdImage = (o: object): result.Result<EmailAndStudentIdImage, EmailAndStudentIdImageError> => {
    if (!o.hasOwnProperty("email")) {
        return result.err({ c: EmailAndStudentIdImageErrorC.NeedEmailField });
    }
    const email = (o as { email: unknown }).email;
    if (typeof email !== "string") {
        return result.err({ c: EmailAndStudentIdImageErrorC.EmailFieldMustBeString, typeName: unknownToTypeString(email) });
    }
    const emailAnalysisResult: EmailAnalysisResult = emailAnalysis(email);
    switch (emailAnalysisResult) {
        case EmailAnalysisResult.SAddress:
            return result.ok({
                c: EmailAndStudentIdImageC.SAddress,
                email: email
            })
        case EmailAnalysisResult.AddressOrError:
            return getValidNotSAddressImageAndStudentIdCardImage(email, o);
    }
}

const getValidNotSAddressImageAndStudentIdCardImage = (email: string, o: object): result.Result<EmailAndStudentIdImage, EmailAndStudentIdImageError> => {
    if (!o.hasOwnProperty("image")) {
        return result.err({ c: EmailAndStudentIdImageErrorC.NotSAddressNeedImageField });
    }
    const studentIdCardImage = (o as { image: unknown }).image
    if (typeof studentIdCardImage !== "string") {
        return result.err({
            c: EmailAndStudentIdImageErrorC.NotSAddressImageFieldMustBeString,
            typeName: unknownToTypeString(studentIdCardImage)
        });
    }
    const studentIdCardImageMaybe: { typedArray: Uint8Array, mimeType: "image/png" | "image/jpeg" } | null = dataUrlToBlob(studentIdCardImage);
    if (studentIdCardImageMaybe === null) {
        return result.err({
            c: EmailAndStudentIdImageErrorC.NotSAddressImageNotBase64DataUrlPngOrJpeg
        });
    }
    return result.ok({
        c: EmailAndStudentIdImageC.NotSAddressWithImage,
        email: email,
        typedArray: studentIdCardImageMaybe.typedArray,
        mimeType: studentIdCardImageMaybe.mimeType
    });
}

const enum EmailAnalysisResult {
    SAddress,
    AddressOrError
}

const emailAnalysis = (email: string): EmailAnalysisResult => {
    if (/^s(\d{7})@[a-zA-Z0-9]+\.tsukuba\.ac\.jp$/.test(email)) {
        return EmailAnalysisResult.SAddress;
    }
    return EmailAnalysisResult.AddressOrError;
}

type PasswordError = NeedFieldPassword | PasswordErrorFieldMustBeString | PasswordLengthError | PasswordInvalidChar | WeekPassword

const enum PasswordErrorC {
    NeedFieldPassword,
    FieldMustBeString,
    Length,
    InvalidChar,
    WeekPassword
}

interface NeedFieldPassword {
    c: PasswordErrorC.NeedFieldPassword
}

interface PasswordErrorFieldMustBeString {
    c: PasswordErrorC.FieldMustBeString,
    typeName: TypeString
}

interface PasswordLengthError {
    c: PasswordErrorC.Length,
    length: number
}

interface PasswordInvalidChar {
    c: PasswordErrorC.InvalidChar,
    invalidCharList: string
}

interface WeekPassword {
    c: PasswordErrorC.WeekPassword
}

const getValidPassword = (o: object): result.Result<string, Array<PasswordError>> => {
    if (!o.hasOwnProperty("password")) {
        return result.err([{
            c: PasswordErrorC.NeedFieldPassword
        }]);
    }
    const password: unknown = (o as { password: unknown }).password;
    if (!(typeof password === "string")) {
        return result.err([{
            c: PasswordErrorC.FieldMustBeString,
            typeName: unknownToTypeString(password)
        }]);
    }
    const errorList: Array<PasswordError> = [];
    const passwordLength: number = password.length;
    if (passwordLength < 9 || 50 < passwordLength) {
        errorList.push({
            c: PasswordErrorC.Length,
            length: passwordLength
        });
    }
    let invalidCharList: string = "";
    for (const char of password) {
        if (!"!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".includes(char)) {
            invalidCharList += char;
        }
    }
    if (invalidCharList.length !== 0) {
        errorList.push({
            c: PasswordErrorC.InvalidChar,
            invalidCharList: invalidCharList
        });
    }
    if (errorList.length !== 0) {
        return result.err(errorList);
    }
    return result.ok(password);
}

type DisplayNameError =
    DisplayNameErrorNeedDisplayNameField |
    DisplayNameErrorDisplayNameFieldMustBeString |
    DisplayNameErrorLength

const enum DisplayNameErrorC {
    NeedDisplayNameField,
    DisplayNameFieldMustBeString,
    Length
}

interface DisplayNameErrorNeedDisplayNameField {
    c: DisplayNameErrorC.NeedDisplayNameField
}

interface DisplayNameErrorDisplayNameFieldMustBeString {
    c: DisplayNameErrorC.DisplayNameFieldMustBeString,
    typeName: TypeString
}

interface DisplayNameErrorLength {
    c: DisplayNameErrorC.Length,
    length: number
}

const getValidDisplayName = (o: object): result.Result<string, DisplayNameError> => {
    if (!o.hasOwnProperty("displayName")) {
        return result.err({ c: DisplayNameErrorC.NeedDisplayNameField });
    }
    const displayName: unknown = (o as { displayName: unknown }).displayName;
    if (typeof displayName !== "string") {
        return result.err({ c: DisplayNameErrorC.DisplayNameFieldMustBeString, typeName: unknownToTypeString(displayName) });
    }
    const length: number = displayName.length;
    if (length < 1 || 50 < length) {
        return result.err({ c: DisplayNameErrorC.Length, length: length });
    }
    return result.ok(displayName);
};



/**
 * データURL(image/png image/jpegのみ)をBlobに変換する
 * @param dataUrl データURL
 */
const dataUrlToBlob = (dataUrl: string): { typedArray: Uint8Array, mimeType: "image/png" | "image/jpeg" } | null => {

    // MIME typeは"image/png"|"image/jpeg"のもサポート。
    const imageDataUrlMimeType = dataUrl.match(/^data:(image\/png|image\/jpeg);base64,(.+)$/);
    if (imageDataUrlMimeType === null) {
        return null;
    }
    new Buffer("")
    return {
        typedArray: new Uint8Array(Buffer.from(imageDataUrlMimeType[2], "base64")),
        mimeType: imageDataUrlMimeType[1] as ("image/png" | "image/jpeg")
    };
}

const unknownToTypeString = (value: unknown): TypeString => {
    if (value === null) {
        return "null"
    }
    return typeof value;
}

type TypeString = "null" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"