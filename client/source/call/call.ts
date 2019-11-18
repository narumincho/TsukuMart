/// <reference path="node_modules/firebase/index.d.ts" />

interface Window {
    Elm: {
        Main: {
            init: (args: { flags: { accessToken: string | null } }) => ElmApp;
        };
    };
}

type ElmApp = {
    ports: {
        addEventListenerForUserImage: {
            subscribe: (
                arg: (arg: { labelId: string; inputId: string }) => void
            ) => void;
        };
        receiveUserImage: {
            send: (arg: string) => void;
        };
        addEventListenerForProductImages: {
            subscribe: (
                arg: (arg: { labelId: string; inputId: string }) => void
            ) => void;
        };
        receiveProductImages: {
            send: (arg: Array<string>) => void;
        };
        toWideScreenMode: {
            send: (arg: null) => void;
        };
        toNarrowScreenMode: {
            send: (arg: null) => void;
        };
        saveAccessTokenToLocalStorage: {
            subscribe: (arg: (accessToken: string) => void) => void;
        };
        deleteAllFromLocalStorage: {
            subscribe: (arg: () => void) => void;
        };
        mainViewScrollToTop: {
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
        startListenRecommendProducts: {
            subscribe: (arg: (arg: null) => void) => void;
        };
        receiveAllProducts: {
            send: (
                arg: Array<{
                    id: string;
                    category: string;
                    condition: string;
                    createdAt: number;
                    description: string;
                    imageIds: Array<string>;
                    likedCount: number;
                    name: Array<string>;
                    price: number;
                    sellerDisplayName: string;
                    sellerId: string;
                    sellerImageId: string;
                    status: string;
                    thumbnailImageId: string;
                    updateAt: number;
                }>
            ) => void;
        };
    };
};

const userImageFileResizeAndConvertToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", e => {
            const canvas = document.createElement("canvas");
            const sourceSize = Math.min(image.width, image.height);
            const outputSize = Math.min(sourceSize, 400);
            canvas.width = outputSize;
            canvas.height = outputSize;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
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
        });
        image.src = window.URL.createObjectURL(file);
    });

const insideSize = (
    width: number,
    height: number
): { width: number; height: number } => {
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

const productImageFilesResizeAndConvertToDataUrl = async (
    fileList: FileList
): Promise<Array<string>> => {
    const result: Array<string> = [];
    for (let i = 0; i < Math.min(5, fileList.length); i++) {
        const file = fileList.item(i);
        if (file === null) {
            continue;
        }
        result.push(await productImageResizeAndConvertToDataUrl(file));
    }
    return result;
};

const productImageResizeAndConvertToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => {
            const canvas = document.createElement("canvas");
            const size = insideSize(image.width, image.height);
            canvas.width = size.width;
            canvas.height = size.height;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            context.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                size.width,
                size.height
            );
            resolve(canvas.toDataURL("image/jpeg"));
        });
        image.src = window.URL.createObjectURL(file);
    });

const checkFileInput = (id: string) => async () => {
    const inputElement = document.getElementById(id) as HTMLInputElement | null;
    if (inputElement === null) {
        return;
    }
    if (inputElement.files === null || inputElement.files.length <= 0) {
        window.requestAnimationFrame(checkFileInput(id));
        return;
    }
    const dataUrls = await productImageFilesResizeAndConvertToDataUrl(
        inputElement.files
    );
    app.ports.receiveProductImages.send(dataUrls);
    inputElement.value = "";
    window.requestAnimationFrame(checkFileInput(id));
};

/* Elmを起動!! */
const app = window.Elm.Main.init({
    flags: {
        accessToken: localStorage.getItem("accessToken")
    }
});
const windowResizeListener = () => {
    if (1000 < window.innerWidth) {
        app.ports.toWideScreenMode.send(null);
    } else {
        app.ports.toNarrowScreenMode.send(null);
    }
};
/* ウィンドウサイズのリサイズ情報をElmに送信 */
addEventListener("resize", windowResizeListener);
windowResizeListener();
/* リフレッシュトークンを保存する */
app.ports.saveAccessTokenToLocalStorage.subscribe(accessToken => {
    localStorage.setItem("accessToken", accessToken);
});
/* リフレッシュトークンとその他すべてを削除する */
app.ports.deleteAllFromLocalStorage.subscribe(() => {
    localStorage.clear();
});

/* 指定されたidのHTML要素のテキストを変える */
app.ports.replaceText.subscribe(({ id, text }) => {
    const replaceText = () => {
        const element = document.getElementById(id) as
            | HTMLInputElement
            | HTMLTextAreaElement;
        if (element === null) {
            window.requestAnimationFrame(replaceText);
            return;
        }
        element.value = text;
    };
    window.requestAnimationFrame(replaceText);
});
/* 指定されたidの要素のスクロール位置を(0,0)にする */
app.ports.mainViewScrollToTop.subscribe(() => {
    window.requestAnimationFrame(() => {
        document.getElementById("mainView")?.scroll(0, 0);
    });
});
/* 指定されたidの要素が表示されるようにスクロールさせる */
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
/* 指定されたidの要素のselectedIndexを変更する */
app.ports.changeSelectedIndex.subscribe(({ id, index }) => {
    const changeSelectedIndex = () => {
        const element = document.getElementById(id) as HTMLSelectElement;
        if (element === null) {
            window.requestAnimationFrame(changeSelectedIndex);
            return;
        }
        element.selectedIndex = index;
    };
    window.requestAnimationFrame(changeSelectedIndex);
});

/* 商品画像の入力イベントを設定する */
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
        labelElement.addEventListener("drop", async e => {
            e.preventDefault();
            if (e.dataTransfer === null) {
                return;
            }
            app.ports.receiveProductImages.send(
                await productImageFilesResizeAndConvertToDataUrl(
                    e.dataTransfer.files
                )
            );
        });
    };
    window.requestAnimationFrame(addEventListenerForProductImages);
});

const urlBase64ToUint8Array = (base64String: string) => {
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
    await navigator.serviceWorker.register("/serviceworker.js", { scope: "/" });
})();

(async () => {
    console.log("firestore run");
    const firestore = firebase.firestore();
    const productCollection = firestore.collection("product");
    console.log("firestore request");
    app.ports.startListenRecommendProducts.subscribe(async () => {
        productCollection.onSnapshot(productsQuerySnapshot => {
            console.log("firestore get response");
            app.ports.receiveAllProducts.send(
                productsQuerySnapshot.docs.map(documentDataToProduct)
            );
        });
    });
})();

const documentDataToProduct = (
    documentSnapshot: firebase.firestore.QueryDocumentSnapshot
) => {
    const data = documentSnapshot.data();
    return {
        id: documentSnapshot.id,
        category: data.category,
        condition: data.condition,
        createdAt: (data.createdAt as firebase.firestore.Timestamp).toMillis(),
        description: data.description,
        imageIds: data.imageIds,
        likedCount: data.likedCount,
        name: data.name,
        price: data.price,
        sellerDisplayName: data.sellerDisplayName,
        sellerId: data.sellerId,
        sellerImageId: data.sellerImageId,
        status: data.status,
        thumbnailImageId: data.thumbnailImageId,
        updateAt: (data.updateAt as firebase.firestore.Timestamp).toMillis()
    };
};
