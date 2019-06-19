interface Window {
    Elm: {
        Main: {
            init: (args: { flags: { refreshToken: string | null } }) => ElmApp;
        };
    };
}

type ElmApp = {
    ports: {
        receiveImageFileListAsDataUrlList: {
            send: (arg: Array<string>) => void;
        };
        requestReceiveImageList: {
            subscribe: (arg: (id: string) => void) => void;
        };
        addEventListenerDrop: {
            subscribe: (arg: (id: string) => void) => void;
        };
        toWideScreenMode: {
            send: (arg: null) => void;
        };
        toNarrowScreenMode: {
            send: (arg: null) => void;
        };
        saveRefreshTokenToLocalStorage: {
            subscribe: (arg: (refreshToken: string) => void) => void;
        };
        deleteRefreshTokenAndAllFromLocalStorage: {
            subscribe: (arg: () => void) => void;
        };
        elementScrollIntoView: {
            subscribe: (arg: (id: string) => void) => void;
        };
        replaceText: {
            subscribe: (
                arg: (arg: { id: string; text: string }) => void
            ) => void;
        };
        changeSelectedIndex: {
            subscribe: (
                arg: (arg: { id: string; index: number }) => void
            ) => void;
        };
    };
};

requestAnimationFrame(() => {
    /** FileListをDataURLのArrayに変換する */
    const fileListToDataUrlList = (
        fileList: FileList
    ): Promise<Array<string>> => {
        const encodeList: Array<Promise<string>> = [];
        for (let i = 0; i < fileList.length; i++) {
            encodeList.push(fileToDataUrl(fileList.item(i) as File));
        }
        return Promise.all(encodeList);
    };

    /** ファイルをDataURLに変換する */
    const fileToDataUrl = async (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener(
                "load",
                () => {
                    resolve(fileReader.result as string);
                },
                { once: true }
            );
            fileReader.readAsDataURL(file);
        });

    /* Elmを起動!! */
    const app = window.Elm.Main.init({
        flags: {
            refreshToken: localStorage.getItem("refreshToken")
        }
    });
    const windowResizeListener = () => {
        if (1000 < innerWidth) {
            app.ports.toWideScreenMode.send(null);
        } else {
            app.ports.toNarrowScreenMode.send(null);
        }
    };
    /* ウィンドウサイズのリサイズ情報をElmに送信 */
    addEventListener("resize", windowResizeListener);
    windowResizeListener();
    /* リフレッシュトークンを保存する */
    app.ports.saveRefreshTokenToLocalStorage.subscribe(refreshToken => {
        localStorage.setItem("refreshToken", refreshToken);
    });
    /* リフレッシュトークンとその他すべてを削除する */
    app.ports.deleteRefreshTokenAndAllFromLocalStorage.subscribe(() => {
        localStorage.clear();
    });

    /* 指定されたidの要素のテキストの内容を変える */
    app.ports.replaceText.subscribe(({ id, text }) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id) as
                | HTMLInputElement
                | HTMLTextAreaElement;
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.value = text;
        });
    });
    /* 指定されたidの要素が表示されるようにスクロールさせる */
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
    /* 指定されたidの要素のselectedIndexを変更する */
    app.ports.changeSelectedIndex.subscribe(({ id, index }) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(id) as HTMLSelectElement;
            if (element === null) {
                console.warn(`id=${id}の要素が存在しません`);
                return;
            }
            element.selectedIndex = index;
        });
    });
    /* 指定されたidの<input type="file">からファイルの情報を受け取りData URLに変換してElmに送信 */
    app.ports.requestReceiveImageList.subscribe(async id => {
        const fileInputElement = document.getElementById(
            id
        ) as HTMLInputElement;
        if (fileInputElement === null) {
            console.warn(`id=${id}の要素が存在しません`);
            return;
        }
        if (fileInputElement.files === null) {
            console.warn(`id=${id}のfilesがnullです`);
            return;
        }
        app.ports.receiveImageFileListAsDataUrlList.send(
            await fileListToDataUrlList(fileInputElement.files)
        );
    });

    /* HTML要素にドロップのイベントを設定する */
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
            element.addEventListener("drop", async e => {
                e.preventDefault();
                app.ports.receiveImageFileListAsDataUrlList.send(
                    await fileListToDataUrlList(
                        (e.dataTransfer as DataTransfer).files
                    )
                );
            });
        });
    });
    navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
});