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
        console.log(dataUrls);
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
                console.warn(`id=${id}の要素が存在しません`);
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
                console.warn(`id=${id}の要素が存在しません`);
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
                console.warn(`id=${id}の要素が存在しません`);
                window.requestAnimationFrame(changeSelectedIndex);
                return;
            }
            element.selectedIndex = index;
        };
        window.requestAnimationFrame(changeSelectedIndex);
    });
    app.ports.addEventListenerForUserImage.subscribe(({ inputId, labelId }) => {
        const addEventListenerForUserImage = () => {
            const inputElement = document.getElementById(inputId);
            if (inputElement === null) {
                console.warn(`id=${inputId}の要素が存在しません`);
                window.requestAnimationFrame(addEventListenerForUserImage);
                return;
            }
            inputElement.addEventListener("input", async (e) => {
                if (inputElement.files === null) {
                    console.warn(`id=${inputId}のfilesがnullです`);
                    return;
                }
            });
            const labelElement = document.getElementById(labelId);
            if (labelElement === null) {
                console.warn(`id=${labelId}の要素が存在しません`);
                window.requestAnimationFrame(addEventListenerForUserImage);
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
        };
        window.requestAnimationFrame(addEventListenerForUserImage);
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
    navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
});
