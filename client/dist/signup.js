"use strict";
const emptyOption = ["", "-- 選択してください --"];
const optionDataToOptionElement = ([key, value]) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = value;
    return option;
};
const createGraduateSelect = () => {
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
    };
    const graduateSelect = document.createElement("select");
    graduateSelect.classList.add("select");
    graduateSelect.append(...[emptyOption, ...Object.entries(graduate)].map(optionDataToOptionElement));
    return graduateSelect;
};
const createSchoolSelect = () => {
    const school = {
        humcul: {
            label: "人文・文化学群",
            department: {
                humanity: "人文学類",
                culture: "比較文化学類",
                japanese: "日本語・日本文化学類"
            }
        },
        socint: {
            label: "社会・国際学群",
            department: {
                social: "社会学類",
                cis: "国際総合学類"
            }
        },
        human: {
            label: "人間学群",
            department: {
                education: "教育学類",
                psyche: "心理学類",
                disability: "障害科学類"
            }
        },
        life: {
            label: "生命環境学群",
            department: {
                biol: "生物学類",
                bres: "生物資源学類",
                earth: "地球学類"
            }
        },
        sse: {
            label: "理工学群",
            department: {
                math: "数学類",
                phys: "物理学類",
                chem: "化学類",
                coens: "応用理工学類",
                esys: "工学システム学類",
                pandps: "社会工学類"
            }
        },
        info: {
            label: "情報学群",
            department: {
                coins: "情報科学類",
                mast: "情報メディア創成学類",
                klis: "知識情報・図書館科学類"
            }
        },
        med: {
            label: "医学群",
            department: {
                med: "医学類",
                nurse: "看護学類",
                ms: "医療科学類"
            }
        },
        aandd: {
            label: "芸術専門学群"
        },
        sport: {
            label: "体育専門学群"
        }
    };
    const schoolSelect = document.createElement("select");
    schoolSelect.classList.add("select");
    schoolSelect.append(...[
        emptyOption,
        ...Object.entries(school).map(([k, v]) => [k, v.label])
    ].map(optionDataToOptionElement));
    let departmentSelect = document.createElement("select");
    schoolSelect.addEventListener("change", () => {
        const s = school[schoolSelect.value];
        if (departmentSelect !== undefined) {
            departmentSelect.remove();
        }
        if ("department" in s) {
            departmentSelect = document.createElement("select");
            departmentSelect.classList.add("select");
            departmentSelect.append(...[emptyOption, ...Object.entries(s.department)].map(optionDataToOptionElement));
            schoolSelect.after(departmentSelect);
            s.department;
        }
        else {
        }
    });
    return schoolSelect;
};
const createGraduateFromTsukubaOrNot = () => {
    const element = document.createElement("div");
    const label = document.createElement("label");
    label.innerText = "院進前の所属";
    label.classList.add("label");
    const radio = document.createElement("div");
    radio.classList.add("radio");
    const inputName = "graduateFromTsukubaOrNot";
    const inputTsukuba = document.createElement("input");
    inputTsukuba.type = "radio";
    const graduateFromTsukubaId = "graduateFromTsukuba";
    inputTsukuba.id = graduateFromTsukubaId;
    inputTsukuba.classList.add("radio-input");
    inputTsukuba.name = inputName;
    inputTsukuba.checked = true;
    const inputLabelFromTsukuba = document.createElement("label");
    inputLabelFromTsukuba.innerText = "筑波大学に所属していた";
    inputLabelFromTsukuba.htmlFor = graduateFromTsukubaId;
    inputLabelFromTsukuba.classList.add("radio-label", "radio-left");
    const inputNoTsukuba = document.createElement("input");
    inputNoTsukuba.type = "radio";
    const graduateFromNoTsukuba = "graduateFromNoTsukuba";
    inputNoTsukuba.id = graduateFromNoTsukuba;
    inputNoTsukuba.classList.add("radio-input");
    inputNoTsukuba.name = inputName;
    const inputLabelFromNoTsukuba = document.createElement("label");
    inputLabelFromNoTsukuba.innerText = "筑波大学に所属していなかった";
    inputLabelFromNoTsukuba.htmlFor = graduateFromNoTsukuba;
    inputLabelFromNoTsukuba.classList.add("radio-label", "radio-right");
    radio.append(inputTsukuba, inputLabelFromTsukuba, inputNoTsukuba, inputLabelFromNoTsukuba);
    element.append(label, radio);
    return element;
};
{
    const formElement = document.getElementById("form");
    if (!(formElement instanceof HTMLFormElement)) {
        throw new Error("formの要素がありません");
    }
    const graduateSelect = createGraduateSelect();
    const schoolSelect = createSchoolSelect();
    const graduateFromTsukubaOrNot = createGraduateFromTsukubaOrNot();
    const studentIdInputElement = document.getElementById("studentId");
    if (!(studentIdInputElement instanceof HTMLInputElement)) {
        throw new Error("学籍番号の入力欄がない");
    }
    const studentIdHintElement = document.getElementById("studentId-hint");
    if (!(studentIdHintElement instanceof HTMLDivElement)) {
        throw new Error("学籍番号のヒント表示欄がない");
    }
    const isAllDigit = (text) => {
        for (const char of text) {
            if (!"0123456789".includes(char)) {
                return false;
            }
        }
        return true;
    };
    studentIdInputElement.addEventListener("input", () => {
        const text = studentIdInputElement.value
            .trim()
            .replace("０", "0")
            .replace("１", "1")
            .replace("２", "2")
            .replace("３", "3")
            .replace("４", "4")
            .replace("５", "5")
            .replace("６", "6")
            .replace("７", "7")
            .replace("８", "8")
            .replace("９", "9");
        if (!isAllDigit(text)) {
            studentIdHintElement.innerText = "20から始まる9桁の数字";
        }
        if (text.startsWith("20")) {
            if (text.length === 9) {
                studentIdHintElement.innerText = text + " ✔";
                return;
            }
            studentIdHintElement.innerText = (text + "???????").slice(0, 9);
            return;
        }
        studentIdHintElement.innerText = "学籍番号は20から始まる";
    });
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
    console.log("firebase SDK Version", window.firebase.SDK_VERSION);
    const fragmentParameter = new URLSearchParams(location.hash.substring(1));
    const nameValue = fragmentParameter.get("name");
    const nameElement = document.getElementById("name");
    if (nameValue === null) {
        throw new Error("URLのフラグメントにnameが必要です");
    }
    if (!(nameElement instanceof HTMLInputElement)) {
        throw new Error("名前の入力欄が無いか、HTMLInputElementではないです");
    }
    nameElement.value = nameValue;
    const imageId = fragmentParameter.get("imageId");
    const imageElement = document.getElementById("image-view");
    if (imageId === null) {
        throw new Error("URLのフラグメントにimageIdが必要です");
    }
    if (!(imageElement instanceof HTMLImageElement)) {
        throw new Error("画像のプレビュー欄がありません");
    }
    imageElement.src =
        "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" +
            imageId;
    const imageInputElement = document.getElementById("image");
    if (!(imageInputElement instanceof HTMLInputElement)) {
        throw new Error("画像の入力要素がありません");
    }
    imageInputElement.addEventListener("input", async (e) => {
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
    if (!(schoolElement instanceof HTMLInputElement) ||
        !(graduateElement instanceof HTMLInputElement)) {
        throw new Error("学群生か院生かのラジオボタンがないか、HTMLInputElementでない");
    }
    const submitButtonElement = document.getElementById("submit-button");
    if (!(submitButtonElement instanceof HTMLButtonElement)) {
        throw new Error("送信ボタンがHTMLButtonElementでない");
    }
    schoolElement.addEventListener("input", e => {
        console.log("input school", e);
        formElement.insertBefore(schoolSelect, submitButtonElement);
        graduateFromTsukubaOrNot.remove();
        graduateSelect.remove();
    });
    graduateElement.addEventListener("input", e => {
        console.log("input graduate", e);
        formElement.insertBefore(graduateSelect, submitButtonElement);
        formElement.insertBefore(graduateFromTsukubaOrNot, submitButtonElement);
        formElement.insertBefore(schoolSelect, submitButtonElement);
    });
    submitButtonElement.addEventListener("click", e => {
        e.preventDefault();
        console.log("apiに登録内容の送信とfirebaseクライアントアプリを使ってメールの送信を行う", e);
    });
}
