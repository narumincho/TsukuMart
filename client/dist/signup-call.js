"use strict";
async () => {
    const user = (await firebase.auth().signInWithCustomToken("token")).user;
    if (user === null) {
        throw new Error("userがnullだった");
    }
    user.sendEmailVerification({ url: "https://tsukumart.com" });
};
const fragment = new URLSearchParams(location.hash.substring(1));
console.log("fragment", fragment);
const app = Elm.SignUp.init({
    flags: {
        sendEmailToken: fragment.get("sendEmailToken"),
        name: fragment.get("name"),
        imageId: fragment.get("imageId")
    },
    node: document.getElementById("app")
});
app.ports.load.subscribe(({ imageInputElementId, imageUrl, nameElementId, name }) => {
    const userImageFileResizeAndConvertToDataUrl = (file) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const sourceSize = Math.min(image.width, image.height);
            const outputSize = Math.min(sourceSize, 400);
            canvas.width = outputSize;
            canvas.height = outputSize;
            const context = canvas.getContext("2d");
            context.drawImage(image, (image.width - sourceSize) / 2, (image.height - sourceSize) / 2, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
            resolve(canvas.toDataURL("image/png"));
        };
        image.src = window.URL.createObjectURL(file);
    });
    requestAnimationFrame(() => {
        const imageInputElement = document.getElementById(imageInputElementId);
        imageInputElement.addEventListener("input", async () => {
            const files = imageInputElement.files;
            if (files === null) {
                throw new Error("入力したものがファイルじゃなかった");
            }
            const file = files.item(0);
            if (file === null) {
                throw new Error("入力したファイルがnullだった");
            }
            app.ports.imageInput.send(await userImageFileResizeAndConvertToDataUrl(file));
        });
        document.getElementById(nameElementId).value = name;
    });
});
app.ports.sendConfirmEmail.subscribe(token => {
    console.log("SDK VERSION", firebase.SDK_VERSION);
});
app.ports.alert.subscribe(message => {
    window.alert(message);
});
