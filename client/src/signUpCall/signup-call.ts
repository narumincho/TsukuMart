/// <reference path="node_modules/firebase/index.d.ts" />

declare const Elm: {
    SignUp: { init: (arg: { flags: {}; node: HTMLElement }) => ElmApp };
};

type ElmApp = {
    ports: {
        load: {
            subscribe: (
                arg: (arg: {
                    imageInputElementId: string;
                    imageUrl: string;
                    nameElementId: string;
                    name: string;
                }) => void
            ) => void;
        };
        imageInput: {
            send: (arg: string) => void;
        };
        sendConfirmEmail: {
            subscribe: (arg: (token: string) => void) => void;
        };
        sentConfirmEmail: {
            send: (args: null) => void;
        };
        alert: {
            subscribe: (arg: (token: string) => void) => void;
        };
    };
};

const fragment = new URLSearchParams(location.hash.substring(1));
const app = Elm.SignUp.init({
    flags: {
        sendEmailToken: fragment.get("sendEmailToken"),
        name: fragment.get("name"),
        imageId: fragment.get("imageId")
    },
    node: document.getElementById("app") as HTMLElement
});
app.ports.load.subscribe(
    ({ imageInputElementId, imageUrl, nameElementId, name }) => {
        const userImageFileResizeAndConvertToDataUrl = (
            file: File
        ): Promise<string> =>
            new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    const sourceSize = Math.min(image.width, image.height);
                    const outputSize = Math.min(sourceSize, 400);
                    canvas.width = outputSize;
                    canvas.height = outputSize;
                    const context = canvas.getContext(
                        "2d"
                    ) as CanvasRenderingContext2D;
                    context.drawImage(
                        image,
                        (image.width - sourceSize) / 2,
                        (image.height - sourceSize) / 2,
                        sourceSize,
                        sourceSize,
                        0,
                        0,
                        outputSize,
                        outputSize
                    );
                    resolve(canvas.toDataURL("image/png"));
                };
                image.src = window.URL.createObjectURL(file);
            });

        requestAnimationFrame(() => {
            const imageInputElement = document.getElementById(
                imageInputElementId
            ) as HTMLInputElement;
            imageInputElement.addEventListener("input", async () => {
                const files = imageInputElement.files;
                if (files === null) {
                    throw new Error("入力したものがファイルじゃなかった");
                }
                const file = files.item(0);
                if (file === null) {
                    throw new Error("入力したファイルがnullだった");
                }
                app.ports.imageInput.send(
                    await userImageFileResizeAndConvertToDataUrl(file)
                );
            });

            (document.getElementById(
                nameElementId
            ) as HTMLInputElement).value = name;
        });
    }
);

app.ports.sendConfirmEmail.subscribe(async token => {
    firebase.initializeApp({
        apiKey: "AIzaSyCqdk8wwbQdoosZ34e8z_M4UASU0s1bDXs",
        authDomain: "tsukumart-f0971.firebaseapp.com",
        messagingSenderId: "244512762605",
        projectId: "tsukumart-f0971"
    });
    console.log("custom token", token);
    console.log("SDK VERSION", firebase.SDK_VERSION);
    const user = (await firebase.auth().signInWithCustomToken(token)).user;
    if (user === null) {
        throw new Error("userがnullだった");
    }
    await user.sendEmailVerification();
    app.ports.sentConfirmEmail.send(null);
});

app.ports.alert.subscribe(message => {
    window.alert(message);
});
