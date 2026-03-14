"use strict";

import { cropImage, customCrop } from "./features/crop.js"
import { rotateL } from "./features/rotateL.js";
import { rotateR } from "./features/rotateR.js";
import { flipH } from "./features/flipH.js";
import { flipV } from "./features/flipV.js";
import { brightnessM, brightness } from "./features/brightness.js";
import { contrastM, contrast } from "./features/contrast.js";
import { saturationM, saturation } from "./features/saturation.js";
import { emboss } from "./features/emboss.js";
import { boxBlur, GaussianBlur } from "./features/blur.js";
import { gray, grayM } from "./features/gray.js";
import { invertColor } from "./features/invertColor.js";
import { edgeDetection } from "./features/edgeDetection.js";

const upload = document.querySelector("input[type='file']");
let crop;
let rotateAngle = 0;


document.querySelector("#upload-btn").addEventListener("click", () => {
    upload.click();
})
document.querySelector("#drop").addEventListener("click", () => {
    upload.click();
})


document.querySelector("#crop_resize_expand").addEventListener("click", () => {
    document.querySelector("#crop-resize-option").classList.toggle("show");
    document.querySelector("#crop_resize_expand svg").classList.toggle("rotate");
})
document.querySelector("#transform-expand").addEventListener("click", () => {
    document.querySelector("#transform-option").classList.toggle("show");
    document.querySelector("#transform-expand svg").classList.toggle("rotate")

})

//canvas 

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let imgRef;

canvas.width = 300;
canvas.height = 150;


function drawDefaultCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}


drawDefaultCanvas();

function drawImageToCanvas(file) {
    document.querySelector("#upload-btn").style.pointerEvents = "none";
    document.querySelector("#dropzone").style.display = "none";
    displayFileDetail(file);

    //main part
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imgRef = img;
            reset();
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0);
            document.querySelector("#upload-btn").style.pointerEvents = "";
            document.querySelectorAll(".active-right-option").forEach((active) => active.classList.remove("active-right-option"));
        }
        img.onerror = () => {
            console.error("Failed to load image");
            document.querySelector("#upload-btn").style.pointerEvents = "";
            document.querySelectorAll(".active-right-option").forEach((active) => active.classList.remove("active-right-option"));

        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}



document.querySelector("input[type='file']").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        console.error("Upload image");
        return;
    }
    drawImageToCanvas(e.target.files[0]);
})




function displayFileDetail(file) {
    if (document.querySelector("#display-file-detail")) {
        document.querySelector("#display-file-detail").remove();
    }
    const div = document.createElement("div");
    div.id = "display-file-detail";
    const h1 = document.createElement("h1");
    h1.textContent = `Name: ${file.name}`;
    const p1 = document.createElement("p");
    p1.textContent = `Type: ${file.type}`;
    const p2 = document.createElement("p");
    p2.textContent = `Size: ${(file.size / 1024).toFixed(1)}KB`;

    div.appendChild(h1);
    div.appendChild(p1);
    div.appendChild(p2);
    document.querySelectorAll("#left-header p")[1].innerHTML = "";
    document.querySelector("#left-header").insertAdjacentElement("afterend", div);
}





//drag and drop
const dragzone = document.querySelector("#drop");
dragzone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragzone.classList.add("active");
})
dragzone.addEventListener("dragleave", (e) => {
    if (!dragzone.contains(e.relatedTarget)) {
        dragzone.classList.remove("active");
    }
})
dragzone.addEventListener("dragover", (e) => {
    e.preventDefault();
})
dragzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dragzone.classList.remove("active");
    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith("image/")) {
        console.error("Upload image");
    }
    drawImageToCanvas(file);
})



//crop option
document.querySelectorAll("#aspect-ratio ul li").forEach((li) => {
    li.addEventListener("click", () => {
        document.querySelectorAll("#aspect-ratio ul li").forEach((li) => li.classList.remove("active-crop"))
        li.classList.add("active-crop")
        crop = cropImage(ctx, imgRef, li.dataset.ratio);
    })
})

function resetCrop() {
    crop = {};
    document.querySelectorAll("#aspect-ratio ul li").forEach((li) => {
        li.classList.remove("active-crop")
    })
    const firstLi = document.querySelectorAll("#aspect-ratio ul li")[0];
    firstLi.classList.add("active-crop");
    crop = cropImage(ctx, imgRef, firstLi.dataset.ratio);
}


document.querySelector("#apply-crop-btn").addEventListener("click", () => {
    const width = Number(document.querySelector("#left-width-option input").value);
    const height = Number(document.querySelector("#left-height-option input").value);
    crop = customCrop(ctx, imgRef, width, height);
});


//transform
document.querySelector("#transform-option ul").addEventListener("click", (e) => {
    if (e.target.matches("#rl")) {
        rotateAngle = rotateL(ctx, imgRef, rotateAngle, crop);
    } else if (e.target.matches("#rr")) {
        rotateAngle = rotateR(ctx, imgRef, rotateAngle, crop);
    } else if (e.target.matches("#fh")) {
        e.target.dataset.fliped = e.target.dataset.fliped === "true" ? "false" : "true";
        flipH(ctx, imgRef, e.target.dataset.fliped, crop);
    } else if (e.target.matches("#fv")) {
        e.target.dataset.fliped = e.target.dataset.fliped === "true" ? "false" : "true";
        flipV(ctx, imgRef, e.target.dataset.fliped, crop);
    }
})





function reset() {
    resetCrop();
    rotateAngle = 0;
    document.querySelector("#fh").dataset.fliped = "false";
    document.querySelector("#fv").dataset.fliped = "false";
}



//right sidebar options
document.querySelectorAll("#right-option-container ul li").forEach((li) => {
    li.addEventListener("click", () => {
        li.classList.toggle("active-right-option");
    })
})


document.querySelector("#right-option-container ul").addEventListener("click", (e) => {
    if (e.target.matches(".rob")) {
        if (e.target.classList[1] === "active-right-option") {
            brightnessM(ctx);
        } else {
            // brightnessM(ctx, -50);
            brightness(ctx, imgRef, crop);
        }
    } else if (e.target.matches(".roc")) {
        if (e.target.classList[1] === "active-right-option") {
            contrastM(ctx);
        } else {
            contrast(ctx, imgRef, crop);
        }
    } else if (e.target.matches(".ros")) {
        if (e.target.classList[1] === "active-right-option") {
            saturationM(ctx);
        } else {
            saturation(ctx, imgRef, crop);
        }
    }
    else if (e.target.matches(".roem")) {
        if (e.target.classList[1] === "active-right-option") {
            emboss(ctx);
        } else {
            ctx.drawImage(imgRef, 0, 0);
        }
    } else if (e.target.matches(".robl")) {
        if (e.target.classList[1] === "active-right-option") {
            for (let i = 0; i < 10; i++) {
                boxBlur(ctx);
                // GaussianBlur(ctx);
            }
        } else {
            ctx.drawImage(imgRef, 0, 0);
        }
    } else if (e.target.matches(".rog")) {
        if (e.target.classList[1] === "active-right-option") {
            grayM(ctx);
        } else {
            gray(ctx, imgRef, crop);
        }
    } else if (e.target.matches(".roi")) {
        if (e.target.classList[1] === "active-right-option") {
            invertColor(ctx);
        } else {
            ctx.drawImage(imgRef, 0, 0);
        }
    } else if (e.target.matches(".roe")) {
        if (e.target.classList[1] === "active-right-option") {
            edgeDetection(ctx);
        } else {
            ctx.drawImage(imgRef, 0, 0);
        }
    }
})


//export
document.querySelector("#export-btn").addEventListener("click", (e) => {
    document.querySelector("#popup-container").style.display = "flex";
})
document.querySelector("#popup-container").addEventListener("click", (e) => {
    if (e.target.matches("#popup-container")) {
        document.querySelector("#popup-container").style.display = "none";
    }
})


function exportImage(canvas, format = "png", quality = 1) {
    const mimeTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp"
    };
    const type = mimeTypes[format];
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `image.${format}`;
        link.click();
        URL.revokeObjectURL(url);
    }, type, quality);
}

document.querySelectorAll(".cont1 ul li").forEach((li) => {
    li.addEventListener("click", () => {
        document.querySelectorAll(".cont1 ul li").forEach((li) => li.classList.remove("exp-active"));
        li.classList.add("exp-active");
    })
})

document.querySelector(".exp-btn").addEventListener("click", () => {
    const format = document.querySelector(".exp-active").innerText;
    const quality = document.querySelector(".exp-active").value;
    exportImage(canvas, format, quality);
})