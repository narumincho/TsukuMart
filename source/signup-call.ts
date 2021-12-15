<<<<<<< HEAD
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  sendEmailVerification,
  signInWithCustomToken,
} from "firebase/auth";
import { Elm } from "./elm/SignUp.elm";
=======
import { Elm } from "./elm/SignUp.elm";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
>>>>>>> 3ea584d (wip)

const fragment = new URLSearchParams(location.hash.substring(1));
const app = Elm.SignUp.init({
  flags: {
    sendEmailToken: fragment.get("sendEmailToken") as string,
    name: fragment.get("name") as string,
    imageId: fragment.get("imageId") as string,
  },
  node: document.getElementById("app") as HTMLElement,
});
app.ports.load.subscribe(({ imageInputElementId, nameElementId, name }) => {
  requestAnimationFrame(() => {
    const imageInputElement = document.getElementById(
      imageInputElementId
    ) as HTMLInputElement;
    imageInputElement.addEventListener("input", async () => {
      const { files } = imageInputElement;
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

    (document.getElementById(nameElementId) as HTMLInputElement).value = name;
  });
});

const userImageFileResizeAndConvertToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
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
    };
    image.src = window.URL.createObjectURL(file);
  });

const sendConfirmEmail = async (token: string): Promise<void> => {
  await sendConfirmEmailLoop(
    initializeApp({ projectId: "tsukumart-f0971" }),
    token
  );
};

const sendConfirmEmailLoop = async (
  firebaseApp: FirebaseApp,
  token: string
): Promise<void> => {
  try {
    console.log("custom token", token);
<<<<<<< HEAD
    const { user } = await signInWithCustomToken(getAuth(firebaseApp), token);
=======
    const { user } = (
      await getAuth(initializeApp({ projectId: "tsukumart-f0971" }))
    ).signInWithCustomToken(token);
>>>>>>> 3ea584d (wip)
    if (user === null) {
      throw new Error("userがnullだった");
    }
    console.log("ユーザー名", user.displayName);

    await sendEmailVerification(user, { url: "https://tsukumart.com/" });
    app.ports.sentConfirmEmail.send(null);
  } catch (e) {
    console.log("エラーが発生したので再送する", e);
    setTimeout(() => {
      sendConfirmEmail(token);
    }, 3000);
  }
};

app.ports.sendConfirmEmail.subscribe(sendConfirmEmail);

app.ports.alert.subscribe((message) => {
  // eslint-disable-next-line no-alert
  window.alert(message);
});
