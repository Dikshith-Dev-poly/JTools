/*
calculate how many guesses hacker need to do before cracking.
Entropy (bits) = password_length × log₂(pool_size)
bits-yes/no question-1 bit =>2 possibility
total=2^bits
pool size=Total number of options(char/number/symbol) we used.

strength
< 28 bits = Very weak
28–51 bits = Weak / Fair
52–67 bits = Strong
68+ bits = Very strong


crack_time = (2^bits / 2) / guesses_per_second    ->in sec
guesses_per_second->varies but we take 10 billion in this case.
*/
"use strict";

let passwordLength = 0;
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "!@#$%^&*()";
let pool = "";
let password = "";
const options = { "upper": false, lower: false, number: false, symbol: false };
let entropy = 0;

function progressHandler(e) {
    const ele = e.target;
    const min = ele.min || 4;
    const max = ele.max || 64;
    const val = ele.value;
    const percent = ((val - min) / (max - min)) * 100;
    ele.style.background = `linear-gradient(
        to right,
        var(--green) ${percent}%,
        var(--surface2) ${percent}%
    )`;
    document.querySelector(".length-text").textContent = val;
    passwordLength = val;
    createPool();
    createPassword();
    document.querySelector(".result").textContent = password;
    entropy = calculateEntropy();
    document.querySelector(".entropy span").textContent = entropy;
    document.querySelector(".length-detail span").textContent = val;
    const strengthStatus = strengthLevel();
    document.querySelector(".strength-text").textContent = strengthStatus.text;
    setLevelProgress(strengthStatus.level);
    const timeText = crackTime();
    document.querySelector(".crack-time p").textContent = `crack time (10B/s): ${timeText}`;

}

document.querySelector("#len").addEventListener("input", progressHandler);

const upperBtn = document.querySelector(".upper");
const lowerBtn = document.querySelector(".lower");
const numberBtn = document.querySelector(".num");
const symbolBtn = document.querySelector(".symb");


function setBtn() {
    if (options["upper"]) {
        const blue = getComputedStyle(document.body).getPropertyValue("--blue");
        document.querySelector(".uclick").style.backgroundColor = blue;
        document.querySelector(".uclick").style.setProperty("--ur", "0");
    } else {
        const surface = getComputedStyle(document.body).getPropertyValue("--surface2");
        document.querySelector(".uclick").style.backgroundColor = surface;
        document.querySelector(".uclick").style.setProperty("--ur", "auto");
    }
    if (options["lower"]) {
        const green = getComputedStyle(document.body).getPropertyValue("--green");
        document.querySelector(".lclick").style.backgroundColor = green;
        document.querySelector(".lclick").style.setProperty("--ul", "0");
    } else {
        const surface = getComputedStyle(document.body).getPropertyValue("--surface2");
        document.querySelector(".lclick").style.backgroundColor = surface;
        document.querySelector(".lclick").style.setProperty("--ul", "auto");
    }
    if (options["number"]) {
        const org = getComputedStyle(document.body).getPropertyValue("--orange");
        document.querySelector(".numclick").style.backgroundColor = org;
        document.querySelector(".numclick").style.setProperty("--un", "0");
    } else {
        const surface = getComputedStyle(document.body).getPropertyValue("--surface2");
        document.querySelector(".numclick").style.backgroundColor = surface;
        document.querySelector(".numclick").style.setProperty("--un", "auto");
    }
    if (options["symbol"]) {
        const blue = getComputedStyle(document.body).getPropertyValue("--blue");
        document.querySelector(".symbclick").style.backgroundColor = blue;
        document.querySelector(".symbclick").style.setProperty("--us", "0");
    } else {
        const surface = getComputedStyle(document.body).getPropertyValue("--surface2");
        document.querySelector(".symbclick").style.backgroundColor = surface;
        document.querySelector(".symbclick").style.setProperty("--us", "auto");
    }
}


upperBtn.addEventListener("click", () => {
    options["upper"] = !options["upper"];
    optionButtonHandler()
})
lowerBtn.addEventListener("click", () => {
    options["lower"] = !options["lower"];
    optionButtonHandler()
})
numberBtn.addEventListener("click", () => {
    options["number"] = !options["number"];
    optionButtonHandler()
})
symbolBtn.addEventListener("click", () => {
    options["symbol"] = !options["symbol"];
    optionButtonHandler()
})

function optionButtonHandler() {
    setBtn();
    createPool();
    createPassword();
    document.querySelector(".result").textContent = password;
    entropy = calculateEntropy();
    document.querySelector(".entropy span").textContent = entropy;
    const strengthStatus = strengthLevel();
    document.querySelector(".strength-text").textContent = strengthStatus.text;
    setLevelProgress(strengthStatus.level);
    const timeText = crackTime();
    document.querySelector(".crack-time p").textContent = `crack time (10B/s): ${timeText}`;
}
setBtn();


function createPool() {
    pool = "";
    if (options["upper"]) pool += upper;
    if (options["lower"]) pool += lower;
    if (options["number"]) pool += number;
    if (options["symbol"]) pool += symbol;
    document.querySelector(".poll-size span").textContent = pool.length;
}

function randomNum(max) {
    const arr = new Uint8Array(1);
    const rand = crypto.getRandomValues(arr);
    return rand[0] % max;
}

function randFrom(str) {
    return str[randomNum(str.length)]
}

function suffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomNum(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


function createPassword() {
    if (!pool.length) {
        return;
    }
    const result = [];
    if (options["upper"]) result.push(randFrom(upper));
    if (options["lower"]) result.push(randFrom(lower));
    if (options["number"]) result.push(randFrom(number));
    if (options["symbol"]) result.push(randFrom(symbol));
    while (result.length < passwordLength) {
        result.push(randFrom(pool));
    }
    suffle(result);
    password = result.join("");
}

document.querySelector(".generate").addEventListener("click", () => {
    createPool();
    createPassword();
    document.querySelector(".result").textContent = password;
    entropy = calculateEntropy();
    document.querySelector(".entropy span").textContent = entropy;
    const strengthStatus = strengthLevel();
    document.querySelector(".strength-text").textContent = strengthStatus.text;
})



function calculateEntropy() {
    if (!pool.length) return 0;
    return Math.round(passwordLength * Math.log2(pool.length))
}


function strengthLevel() {
    if (entropy < 28) {
        return { level: 1, text: "VERY WEAK" }
    } else if (entropy >= 28 && entropy < 51) {
        return { level: 2, text: "WEAK" }
    } else if (entropy >= 52 && entropy < 67) {
        return { level: 3, text: "STRONG" }
    }
    return { level: 4, text: "VERY STRONG" }
}


function setLevelProgress(level) {
    if (level === 1) {
        document.querySelectorAll(".l").forEach((o) => o.classList.remove("greenbg"));
        document.querySelector(".l1").classList.add("greenbg");
    } else if (level === 2) {
        document.querySelectorAll(".l").forEach((o) => o.classList.remove("greenbg"));
        document.querySelector(".l1").classList.add("greenbg");
        document.querySelector(".l2").classList.add("greenbg");
    }
    else if (level === 3) {
        document.querySelectorAll(".l").forEach((o) => o.classList.remove("greenbg"));
        document.querySelector(".l1").classList.add("greenbg");
        document.querySelector(".l2").classList.add("greenbg");
        document.querySelector(".l3").classList.add("greenbg");
    } else {
        document.querySelectorAll(".l").forEach((o) => o.classList.add("greenbg"));
    }
}


function crackTime() {
    const sec = (Math.pow(2, entropy) / 2) / 1e10;
    if (sec < 1) return 'instantly';
    if (sec < 60) return Math.round(sec) + ' seconds';
    if (sec < 3600) return Math.round(sec / 60) + ' minutes';
    if (sec < 86400) return Math.round(sec / 3600) + ' hours';
    if (sec < 2592000) return Math.round(sec / 86400) + ' days';
    if (sec < 31536000) return Math.round(sec / 2592000) + ' months';

    const years = sec / 31536000;
    if (years < 1e3) return Math.round(years) + ' years';
    if (years < 1e6) return Math.round(years / 1e3) + ' thousand years';
    if (years < 1e9) return Math.round(years / 1e6) + ' million years';
    if (years < 1e12) return Math.round(years / 1e9) + ' billion years';
    return 'longer than the universe';
}


document.querySelector(".result").addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "") return;
    navigator.clipboard.writeText(e.target.textContent).then(() => {
        alert("Copied");
    })
})