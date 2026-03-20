"use strict"
let worker = new Worker("worker.js")


let fileRef;
let dataIndex = [];
let targetX = 0; let targetY = 0; let currentX = 0; let currentY = 0; let prevX = 0; let prevY = 0; let velocityX = 0; let velocityY = 0;
let requestAnimationFrameId;
let data;
let totalPage = 0;
let theader;

function parseLine(line) {
    //"hello ""world"""   -> hello "world"
    //"last,ls",sl-> ["last,ls","sl"]
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === `"`) {
            if (inQuotes && line[i + 1] === `"`) {
                current += `"`;
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else {
            if (char === "," && !inQuotes) {
                result.push(current);
                current = "";
            } else {
                current += char;
            }
        }
    }
    result.push(current);
    return result;

}



//pagination
let currentPage = 1;
let prev = currentPage - 1;
let next = currentPage + 1;
let pageSize = 100;//100 rows per page
async function getData(page = 1) {
    if (page < 1 | page > totalPage) return;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, dataIndex.length);
    if (startIndex >= dataIndex.length) return;

    const sliceStartIndex = dataIndex[startIndex].start;
    const sliceEndIndex = dataIndex[endIndex - 1].end;

    const text = await fileRef.slice(sliceStartIndex, sliceEndIndex).text();

    const lines = text.split(/\r\n|\r|\n/);
    const rows = lines.filter(line => line.trim() != "").map(line => parseLine(line));

    if (page === 1) {
        theader = rows.shift();
    }
    return rows;
}


//event handler
function handleDropzoneClick() {
    const upload = document.getElementById("upload");
    upload.click();
}

function handleFileChange(e) {
    const file = e.target.files[0];
    mainHandler(file);
}

function handleDragEnter(e) {
    const dropZone = document.getElementById("dropzone");
    e.preventDefault();
    dropZone.classList.add("active");
}

function handleDragLeave(e) {
    const dropZone = document.getElementById("dropzone");
    e.preventDefault();
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove("active");
    }
}

function handleDragover(e) {
    e.preventDefault();
}


function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    mainHandler(file);
}


function handleMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
}


//main logic

function validateInputFile(file) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Upload a csv file!");
        return false;
    };
    return true;
}
function indexRow(file) {
    return new Promise((resolve) => {
        const messageHandler = (e) => {
            if (e.data.type === "final") {
                worker.removeEventListener("message", messageHandler);
                worker.terminate();
                worker = null;
                resolve(e.data.data);
            }

        }
        worker.addEventListener("message", messageHandler);
        const chunkSize = 1024 * 1024; //1MB
        let offset = 0;
        function send() {
            if (offset >= file.size) {
                worker.postMessage({ done: true });
                return;
            }

            const chunk = file.slice(offset, offset + chunkSize);
            worker.postMessage({ done: false, chunk });
            offset += chunkSize;
            setTimeout(send, 0);
        }
        send();
    })
}


async function mainHandler(file) {
    let result = validateInputFile(file);
    if (!result) return;
    fileRef = file;
    dataIndex = await indexRow(file);
    totalPage = Math.ceil((dataIndex.length - 1) / pageSize);
    viewInit();
}


function homeInit() {
    const main = document.querySelector("main.home");

    const html = `<main class="home">
        <div id="decorate"></div>
        <div id="dropzone">
            <h1>CSV VIEWER</h1>
            <p>Drop your .csv file here <br> or click to browse</p>
        </div>
    </main>`

    if (!main) {
        document.querySelector("body").insertAdjacentHTML("afterbegin", html);
    }
    const upload = document.getElementById("upload");
    const dropZone = document.getElementById("dropzone");

    dropZone.addEventListener('click', handleDropzoneClick)

    upload.addEventListener("change", handleFileChange)

    //drag and drop
    dropZone.addEventListener("dragenter", handleDragEnter)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("dragover", handleDragover)
    dropZone.addEventListener("drop", handleDrop)





    //Mouse effect
    const follow = document.getElementById("decorate");

    window.addEventListener("mousemove", handleMouseMove)

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
        requestAnimationFrameId = requestAnimationFrame(updateMousePosition);
    }
    updateMousePosition();
}


function clearHome() {
    const home = document.querySelector("main.home");
    if (!home) return;
    const upload = document.getElementById("upload");
    const dropZone = document.getElementById("dropzone");
    upload.value = "";
    dropZone.removeEventListener('click', handleDropzoneClick)
    upload.removeEventListener("change", handleFileChange)
    dropZone.removeEventListener("dragenter", handleDragEnter)
    dropZone.removeEventListener("dragleave", handleDragLeave)
    dropZone.removeEventListener("dragover", handleDragover)
    dropZone.removeEventListener("drop", handleDrop)
    const follow = document.getElementById("decorate");

    window.removeEventListener("mousemove", handleMouseMove)
    targetX = 0; targetY = 0; currentX = 0; currentY = 0; prevX = 0; prevY = 0; velocityX = 0; velocityY = 0;
    follow.style.setProperty("--x", `0px`);
    follow.style.setProperty("--y", `0px`);
    follow.style.setProperty("--fwidth", `0px`);
    follow.style.setProperty("--fheight", `0px`);
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = undefined;
    home.remove();
}


async function handleNext() {
    prev = currentPage;
    currentPage++;
    next = currentPage + 1;
    if (currentPage - 1 === totalPage) {
        document.querySelector(".next").textContent = "next";
        document.querySelector(".next").style.pointerEvents = "none";
        return;
    }
    data = await getData(currentPage);
    document.querySelector(".next").style.pointerEvents = "";
    document.querySelector(".prev").style.pointerEvents = "";
    document.querySelector(".current").textContent = `${currentPage} / ${totalPage}`;
    document.querySelector(".next").textContent = next;
    document.querySelector(".prev").textContent = prev;
    displayTable();
}

async function handlePrev() {
    currentPage--;
    prev = currentPage - 1;
    next = currentPage + 1;
    if (currentPage <= 1) {
        document.querySelector(".prev").textContent = "prev";
        document.querySelector(".prev").style.pointerEvents = "none";
    } else {
        document.querySelector(".prev").style.pointerEvents = "";
        document.querySelector(".prev").textContent = prev;
    }
    data = await getData(currentPage);
    document.querySelector(".current").textContent = `${currentPage} / ${totalPage}`;
    document.querySelector(".next").textContent = next;
    displayTable();
}


function displayTable() {
    if (!theader || !data) return;

    const table = document.getElementById("table");
    table.innerHTML = "";
    const mainContainer = document.createDocumentFragment();
    const thead = document.createElement("div");
    thead.id = "thead";
    const headerDivs = theader.map((text) => {
        const hcell = document.createElement("div");
        hcell.className = "hcell";
        hcell.textContent = text;
        return hcell;
    });
    thead.append(...headerDivs);
    mainContainer.append(thead);
    const tbody = document.createElement("div");
    tbody.id = "tbody";
    data.forEach((d) => {
        const tbodycont = document.createElement("div");
        tbodycont.className = "tbody-cont";
        const bodyCell = d.map((text) => {
            if (text.trim() === "" || text.trim() === "null") {
                const cell = document.createElement("div");
                cell.className = "cell null";
                cell.textContent = "null";
                return cell;
            } else {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = text;
                return cell;
            }
        });
        tbodycont.append(...bodyCell);
        tbody.append(tbodycont);
    })

    mainContainer.append(tbody);
    table.append(mainContainer);
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });

}

async function viewInit() {
    clearHome();
    data = await getData();


    const html = `<main class="view">
        <header>
            <div id="file-name">${fileRef.name}</div>
            <button id="close">
                X close
            </button>
        </header>
        <div id="table"></div>
        <div class="navigate">
            <div class="prev nav">${prev}</div>
            <div class="current">${currentPage} / ${totalPage}</div>
            <div class="next nav">${next}</div>
        </div>
    </main>`
    document.querySelector("body").insertAdjacentHTML("afterbegin", html);

    document.querySelector(".next.nav").addEventListener("click", handleNext);
    document.querySelector(".prev").textContent = "prev";
    document.querySelector(".prev").style.pointerEvents = "none";
    document.querySelector(".prev.nav").addEventListener("click", handlePrev);

    const closeBtn = document.getElementById("close");

    if (closeBtn) {
        closeBtn.addEventListener("click", clearView);
    }
    displayTable();
}

function clearView() {
    const view = document.querySelector("main.view");
    if (!view) return;
    fileRef = undefined;
    dataIndex = [];
    currentPage = 1;
    prev = currentPage - 1;
    next = currentPage + 1;
    totalPage = 0;
    theader = undefined;
    worker = new Worker("worker.js");
    document.querySelector(".next.nav").removeEventListener("click", handleNext);
    document.querySelector(".prev.nav").removeEventListener("click", handlePrev);

    view.remove();
    homeInit();
}

homeInit();