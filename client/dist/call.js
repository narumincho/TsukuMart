"use strict";
const userImageFileResizeAndConvertToDataUrl = (file) => new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", e => {
        const canvas = document.createElement("canvas");
        const sourceSize = Math.min(image.width, image.height);
        const outputSize = Math.min(sourceSize, 400);
        canvas.width = outputSize;
        canvas.height = outputSize;
        const context = canvas.getContext("2d");
        context.drawImage(image, (image.width - sourceSize) / 2, (image.height - sourceSize) / 2, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
        resolve(canvas.toDataURL("image/png"));
    });
    image.src = window.URL.createObjectURL(file);
});
const insideSize = (width, height) => {
    if (1024 < Math.max(width, height)) {
        if (height < width) {
            return {
                width: 1024,
                height: (1024 * height) / width
            };
        }
        return {
            width: (1024 * width) / height,
            height: 1024
        };
    }
    return {
        width: width,
        height: height
    };
};
const prodcutImageFilesResizeAndConvertToDataUrl = async (fileList) => {
    return await Promise.all(new Array(Math.min(fileList.length, 10)).fill(0).map((_, index) => {
        return new Promise((resolve, reject) => {
            const file = fileList.item(index);
            const image = new Image();
            image.addEventListener("load", () => {
                const canvas = document.createElement("canvas");
                const size = insideSize(image.width, image.height);
                canvas.width = size.width;
                canvas.height = size.height;
                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
                resolve(canvas.toDataURL("image/jpeg"));
            });
            image.src = window.URL.createObjectURL(file);
        });
    }));
};
const checkFileInput = (id) => async () => {
    const inputElement = document.getElementById(id);
    if (inputElement === null) {
        return;
    }
    if (inputElement.files === null || inputElement.files.length <= 0) {
        window.requestAnimationFrame(checkFileInput(id));
        return;
    }
    const dataUrls = await prodcutImageFilesResizeAndConvertToDataUrl(inputElement.files);
    app.ports.receiveProductImages.send(dataUrls);
    inputElement.value = "";
    window.requestAnimationFrame(checkFileInput(id));
};
const app = window.Elm.Main.init({
    flags: {
        refreshToken: localStorage.getItem("refreshToken")
    }
});
const windowResizeListener = () => {
    if (1000 < window.innerWidth) {
        app.ports.toWideScreenMode.send(null);
    }
    else {
        app.ports.toNarrowScreenMode.send(null);
    }
};
addEventListener("resize", windowResizeListener);
windowResizeListener();
app.ports.saveRefreshTokenToLocalStorage.subscribe(refreshToken => {
    localStorage.setItem("refreshToken", refreshToken);
});
app.ports.deleteRefreshTokenAndAllFromLocalStorage.subscribe(() => {
    localStorage.clear();
});
app.ports.replaceText.subscribe(({ id, text }) => {
    const replaceText = () => {
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(replaceText);
            return;
        }
        element.value = text;
    };
    window.requestAnimationFrame(replaceText);
});
app.ports.elementScrollIntoView.subscribe(id => {
    const scrollIntoView = () => {
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(scrollIntoView);
            return;
        }
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    window.requestAnimationFrame(scrollIntoView);
});
app.ports.changeSelectedIndex.subscribe(({ id, index }) => {
    const changeSelectedIndex = () => {
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(changeSelectedIndex);
            return;
        }
        element.selectedIndex = index;
    };
    window.requestAnimationFrame(changeSelectedIndex);
});
app.ports.addEventListenerForProductImages.subscribe(({ inputId, labelId }) => {
    const addEventListenerForProductImages = async () => {
        (await checkFileInput(inputId))();
        const labelElement = document.getElementById(labelId);
        if (labelElement === null) {
            window.requestAnimationFrame(addEventListenerForProductImages);
            return;
        }
        labelElement.addEventListener("dragover", e => {
            e.preventDefault();
        });
        labelElement.addEventListener("drop", async (e) => {
            e.preventDefault();
            if (e.dataTransfer === null) {
                return;
            }
            app.ports.receiveProductImages.send(await prodcutImageFilesResizeAndConvertToDataUrl(e.dataTransfer.files));
        });
    };
    window.requestAnimationFrame(addEventListenerForProductImages);
});
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
(async () => {
    const getSubscription = async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription !== null) {
            return subscription;
        }
        return await registration.pushManager.subscribe({
            applicationServerKey: urlBase64ToUint8Array("BMo4G5KJhOggWuUwFxZasez9zXlk-oeCAyVYOy-WiqfuVCx1G6uyAdLTww_2bNBx3fW8-C_a726ddCax7XaoW6Q"),
            userVisibleOnly: true
        });
    };
    const registration = await navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
    const subscription = await getSubscription(registration);
    console.log(subscription);
})();
