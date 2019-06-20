"use strict";
requestAnimationFrame(() => {
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
    const resize = (width, height) => {
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
    const prodcutImageFilesResizeAndConvertToDataUrl = async (fileList) => await Promise.all(new Array(Math.min(fileList.length, 4)).fill(0).map((_, index) => new Promise((resolve, reject) => {
        const file = fileList.item(index);
        const image = new Image();
        image.addEventListener("load", () => {
            const canvas = document.createElement("canvas");
            const size = resize(image.width, image.height);
            canvas.width = size.width;
            canvas.height = size.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
            resolve(canvas.toDataURL("image/jpeg"));
        });
        image.src = window.URL.createObjectURL(file);
    })));
    const app = window.Elm.Main.init({
        flags: {
            refreshToken: localStorage.getItem("refreshToken")
        }
    });
    const windowResizeListener = () => {
        if (1000 < innerWidth) {
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
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.value = text;
        });
    });
    app.ports.elementScrollIntoView.subscribe(id => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
    app.ports.changeSelectedIndex.subscribe(({ id, index }) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.selectedIndex = index;
        });
    });
    app.ports.addEventListenerForUserImage.subscribe(({ inputId, labelId }) => {
        requestAnimationFrame(() => {
            const inputElement = document.getElementById(inputId);
            if (inputElement === null) {
                console.warn(`id=${inputId}の要素が存在しません`);
                return;
            }
            inputElement.addEventListener("input", async (e) => {
                if (inputElement.files === null) {
                    console.warn(`id=${inputId}のfilesがnullです`);
                    return;
                }
                app.ports.receiveUserImage.send(await userImageFileResizeAndConvertToDataUrl(inputElement.files[0]));
            });
            const labelElement = document.getElementById(labelId);
            if (labelElement === null) {
                console.warn(`id=${labelId}の要素が存在しません`);
                return;
            }
            labelElement.addEventListener("dragover", e => {
                e.preventDefault();
            });
            labelElement.addEventListener("drop", async (e) => {
                e.preventDefault();
                if (e.dataTransfer === null) {
                    console.warn("drop event dataTransfer is null");
                    return;
                }
                const file = e.dataTransfer.files.item(0);
                if (file === null) {
                    console.warn("drop file is empty");
                    return;
                }
                app.ports.receiveUserImage.send(await userImageFileResizeAndConvertToDataUrl(file));
            });
        });
    });
    app.ports.addEventListenerForProductImages.subscribe(({ inputId, labelId }) => {
        requestAnimationFrame(() => {
            const inputElement = document.getElementById(inputId);
            if (inputElement === null) {
                console.warn(`id=${inputId}の要素が存在しません`);
                return;
            }
            inputElement.addEventListener("input", async (e) => {
                if (inputElement.files === null) {
                    console.warn(`id=${inputId}のfilesがnullです`);
                    return;
                }
                app.ports.receiveProductImages.send(await prodcutImageFilesResizeAndConvertToDataUrl(inputElement.files));
            });
            const labelElement = document.getElementById(labelId);
            if (labelElement === null) {
                console.warn(`id=${labelId}の要素が存在しません`);
                return;
            }
            labelElement.addEventListener("dragover", e => {
                e.preventDefault();
            });
            labelElement.addEventListener("drop", async (e) => {
                e.preventDefault();
                if (e.dataTransfer === null) {
                    console.warn("ドロップしたものを読み込めませんでした");
                    return;
                }
                app.ports.receiveProductImages.send(await prodcutImageFilesResizeAndConvertToDataUrl(e.dataTransfer.files));
            });
        });
    });
    navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
});
