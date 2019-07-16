interface Window {
    firebase: any;
}
(() => {
    const graduate = {
        education: "教育研究科",
        hass: "人文社会科学研究科",
        gabs: "ビジネス科学研究科",
        pas: "数理物質科学研究科",
        sie: "システム情報工学研究科",
        life: "生命環境科学研究科",
        chs: "人間総合科学研究科",
        slis: "図書館情報メディア研究科",
        global: "グローバル研究院"
    } as const;

    const school = {
        humcul: "人文・文化学群",
        socint: "社会・国際学群",
        human: "人間学群",
        life: "生命環境学群",
        sse: "理工学群",
        info: "情報学群",
        med: "医学群",
        aandd: "芸術専門学群",
        sport: "体育専門学群"
    };

    const formElement = document.getElementById("form");
    if (!(formElement instanceof HTMLFormElement)) {
        console.error("formの要素がありません");
        return;
    }
    const emptyOption: [string, string] = ["", "-- 選択してください --"];
    const optionDataToOptionElement = ([key, value]: [
        string,
        string
    ]): HTMLOptionElement => {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = value;
        return option;
    };

    const graduateSelect = document.createElement("select");
    graduateSelect.classList.add("select");
    graduateSelect.append(
        ...[emptyOption, ...Object.entries(graduate)].map(
            optionDataToOptionElement
        )
    );
    const graduateFormTsukubaOrNot = document.createElement("div");
    const graduateFormTsukubaOrNotLabel = document.createElement("label");
    graduateFormTsukubaOrNotLabel.innerText = "院進前の所属";
    graduateFormTsukubaOrNot.append();

    const schoolSelect = document.createElement("select");
    schoolSelect.classList.add("select");
    schoolSelect.append(
        ...[emptyOption, ...Object.entries(school)].map(
            optionDataToOptionElement
        )
    );

    const userImageFileResizeAndConvertToDataUrl = (
        file: File
    ): Promise<string> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", e => {
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
            });
            image.src = window.URL.createObjectURL(file);
        });

    console.log("firebase SDK Version", window.firebase.SDK_VERSION);
    const fragmentParameter = new URLSearchParams(location.hash.substring(1));
    const nameValue = fragmentParameter.get("name");
    const nameElement = document.getElementById("name");
    if (nameValue === null) {
        console.error("URLのフラグメントにnameが必要です");
        return;
    }
    if (!(nameElement instanceof HTMLInputElement)) {
        console.error("名前の入力欄が無いか、HTMLInputElementではないです");
        return;
    }
    nameElement.value = nameValue;
    const imageId = fragmentParameter.get("imageId");
    const imageElement = document.getElementById("image-view");
    if (imageId === null) {
        console.error("URLのフラグメントにimageIdが必要です");
        return;
    }
    if (!(imageElement instanceof HTMLImageElement)) {
        console.error("画像のプレビュー欄がありません");
        return;
    }
    imageElement.src =
        "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" +
        imageId;

    const imageInputElement = document.getElementById("image");
    if (!(imageInputElement instanceof HTMLInputElement)) {
        console.error("画像の入力要素がありません");
        return;
    }
    imageInputElement.addEventListener("input", async e => {
        const files = imageInputElement.files;
        if (files === null) {
            return;
        }
        const file = files.item(0);
        if (file === null) {
            return;
        }
        imageElement.src = await userImageFileResizeAndConvertToDataUrl(file);
    });

    const schoolElement = document.getElementById("school");
    const graduateElement = document.getElementById("graduate");
    if (
        !(schoolElement instanceof HTMLInputElement) ||
        !(graduateElement instanceof HTMLInputElement)
    ) {
        console.error(
            "学群生か院生かのラジオボタンがないか、HTMLInputElementでない"
        );
        return;
    }
    const submitButtonElement = document.getElementById("submit-button");
    if (!(submitButtonElement instanceof HTMLButtonElement)) {
        console.error("送信ボタンがHTMLButtonElementでない");
        return;
    }

    schoolElement.addEventListener("input", e => {
        console.log("input school", e);
        formElement.insertBefore(schoolSelect, submitButtonElement);
        graduateSelect.remove();
    });
    graduateElement.addEventListener("input", e => {
        console.log("input graduate", e);
        formElement.insertBefore(graduateSelect, submitButtonElement);
        formElement.insertBefore(schoolSelect, submitButtonElement);
    });

    submitButtonElement.addEventListener("submit", e => {
        console.log(e);
    });
})();
