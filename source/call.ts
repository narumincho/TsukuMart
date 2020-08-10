import "firebase/firestore";
import * as firebase from "firebase/app";
import { Elm } from "./elm/Main.elm";

const userImageFileResizeAndConvertToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", (e) => {
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
  if (Math.max(width, height) > 1024) {
    if (height < width) {
      return {
        width: 1024,
        height: (1024 * height) / width,
      };
    }
    return {
      width: (1024 * width) / height,
      height: 1024,
    };
  }
  return {
    width,
    height,
  };
};

const productImageFilesResizeAndConvertToDataUrl = (
  fileList: FileList
): Promise<Array<string>> => {
  const result: Array<Promise<string>> = [];
  for (let i = 0; i < Math.min(5, fileList.length); i += 1) {
    const file = fileList.item(i);
    if (file !== null) {
      result.push(productImageResizeAndConvertToDataUrl(file));
    }
  }
  return Promise.all(result);
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
const app = Elm.Main.init({
  flags: {
    accessToken: localStorage.getItem("accessToken"),
  },
});
const windowResizeListener = () => {
  if (window.innerWidth > 1000) {
    app.ports.toWideScreenMode.send(null);
  } else {
    app.ports.toNarrowScreenMode.send(null);
  }
};
/* ウィンドウサイズのリサイズ情報をElmに送信 */
addEventListener("resize", windowResizeListener);
windowResizeListener();
/* リフレッシュトークンを保存する */
app.ports.saveAccessTokenToLocalStorage.subscribe((accessToken) => {
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
    const element = document.getElementById("mainView");
    if (element !== null) {
      element.scroll(0, 0);
    }
  });
});
/* 指定されたidの要素が表示されるようにスクロールさせる */
app.ports.elementScrollIntoView.subscribe((id) => {
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
    labelElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    labelElement.addEventListener("drop", async (e) => {
      e.preventDefault();
      if (e.dataTransfer === null) {
        return;
      }
      app.ports.receiveProductImages.send(
        await productImageFilesResizeAndConvertToDataUrl(e.dataTransfer.files)
      );
    });
  };
  window.requestAnimationFrame(addEventListenerForProductImages);
});

(async () => {
  await navigator.serviceWorker.register("./sw.ts", {
    scope: "/",
  });
})();

(() => {
  firebase.initializeApp({ projectId: "tsukumart-f0971" });
  console.log("firestore run");
  const firestore = firebase.firestore();
  const productCollection = firestore.collection("product");
  console.log("firestore request");
  app.ports.startListenRecommendProducts.subscribe(() => {
    productCollection.onSnapshot((productsQuerySnapshot) => {
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
    updateAt: (data.updateAt as firebase.firestore.Timestamp).toMillis(),
  };
};
