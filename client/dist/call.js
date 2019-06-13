"use strict";
requestAnimationFrame(() => {
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
    app.ports.requestReceiveImageList.subscribe(async (id) => {
        const fileInputElement = document.getElementById(id);
        if (fileInputElement !== null) {
            app.ports.receiveImageDataUrlList.send(await fileListToDataUrlList(fileInputElement.files));
            return;
        }
        console.warn(`id=${id}の要素が存在しません`);
    });
    const fileListToDataUrlList = (fileList) => {
        const encodeList = [];
        for (let i = 0; i < fileList.length; i++) {
            encodeList.push(fileToDataUrl(fileList.item(i)));
        }
        return Promise.all(encodeList);
    };
    const fileToDataUrl = async (file) => new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            resolve(fileReader.result);
        }, { once: true });
        fileReader.readAsDataURL(file);
    });
    app.ports.inputOrTextAreaReplaceText.subscribe(({ id, text }) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.value = text;
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
    app.ports.addEventListenerDrop.subscribe(id => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.addEventListener("dragover", e => {
                e.preventDefault();
            });
            element.addEventListener("drop", async (e) => {
                e.preventDefault();
                app.ports.receiveImageFileAndBlobUrl.send(await fileListToDataUrlList(e.dataTransfer.files));
            });
        });
    });
    navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
});
