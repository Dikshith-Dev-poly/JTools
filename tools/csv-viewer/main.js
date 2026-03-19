"use strict"

const upload = document.getElementById("upload");
const dropZone = document.getElementById("dropzone");


function validateInputFile(file) {
    if (!file.type.endsWith("/csv")) {
        alert("Upload a csv file!");
    };
}

dropZone.addEventListener('click', () => {
    upload.click();
})

upload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    validateInputFile(file);
})

//drag and drop
dropZone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dropZone.classList.add("active");
})
dropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove("active");
    }
})
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
})
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateInputFile(file);

})


//Mouse effect
const follow = document.getElementById("decorate");
let targetX = 0; let targetY = 0; let currentX = 0; let currentY = 0; let prevX = 0; let prevY = 0; let velocityX = 0; let velocityY = 0;

window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
})

function updateMousePosition() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    velocityX = currentX - prevX;
    velocityY = currentY - prevY;
    prevX = currentX;
    prevY = currentY;

    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    let width = 100;
    let height = 100;
    width += speed * 2;
    height -= speed * 0.5;

    follow.style.setProperty("--x", `${currentX}px`);
    follow.style.setProperty("--y", `${currentY}px`);
    follow.style.setProperty("--fwidth", `${width}px`);
    follow.style.setProperty("--fheight", `${height}px`);
    requestAnimationFrame(updateMousePosition);
}
updateMousePosition();