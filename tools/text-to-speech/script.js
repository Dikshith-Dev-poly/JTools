const $ = id => document.getElementById(id);
const $$ = selector => document.querySelector(selector);

const inp = $("inp");
const char = $("char");
const speakBtn = $("speak");
const pause = $("pause");
const resume = $("resume");
const stopBtn = $("stop");
const pitch = $("pitch");
const speed = $("speed");
const volume = $("volume");
const pitchOutput = $$(".pitch span");
const speedOutput = $$(".speed span");
const volumeOutput = $$(".volume span");
const statusSpan = $$(".status span");
const select = $("lang");


const synth = window.speechSynthesis;
let voice = [];
let voiceIndex = 0;
let pitchValue = 1;
let volumeValue = 1;
let speedValue = 1.1;
let u;




function convertRange(input, output, inpValue) {
    const [x1, y1] = input;
    const [x2, y2] = output;
    const inputRange = y1 - x1;
    const outputRange = y2 - x2;
    return x2 + (inpValue - x1) * (outputRange / inputRange);
}

function voices() {
    const v = synth.getVoices();
    voice = v;
    const frag = document.createDocumentFragment();
    voice.forEach((ele, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${ele.name} (${ele.lang})`;
        frag.append(option);
    })
    select.append(frag);
}


function speak(text) {
    if (!voice.length || text.trim() === "") return;
    synth.cancel();
    u = new SpeechSynthesisUtterance(text);
    u.voice = voice[voiceIndex];
    u.lang = voice[voiceIndex].lang;
    u.rate = speedValue;
    u.pitch = pitchValue;
    u.volume = volumeValue;
    u.onstart = (e) => {
        speakBtn.setAttribute("disabled", true)
        pause.removeAttribute("disabled");
        resume.setAttribute("disabled", true);
        stopBtn.removeAttribute("disabled");
        statusSpan.textContent = "Playing";
    }
    u.onend = (e) => {
        speakBtn.removeAttribute("disabled");
        pause.setAttribute("disabled", true)
        resume.setAttribute("disabled", true)
        stopBtn.setAttribute("disabled", true)
        statusSpan.textContent = "Play";
    }
    u.onpause = (e) => {
        speakBtn.setAttribute("disabled", true)
        pause.setAttribute("disabled", true);
        resume.removeAttribute("disabled");
        stopBtn.removeAttribute("disabled");
        statusSpan.textContent = "Paused";
    }
    u.onresume = (e) => {
        speakBtn.setAttribute("disabled", true)
        pause.removeAttribute("disabled");
        resume.setAttribute("disabled", true)
        stopBtn.removeAttribute("disabled");
        statusSpan.textContent = "Playing";
    }
    u.onerror = (e) => {
        speakBtn.removeAttribute("disabled");
        pause.setAttribute("disabled", true)
        resume.setAttribute("disabled", true)
        stopBtn.setAttribute("disabled", true)
        statusSpan.textContent = "Play";
    }
    synth.speak(u);
}


function pauseFunc() {
    synth.pause();
}

function resumeFunc() {
    synth.resume();
}
function stopFunc() {
    synth.cancel();
}
function main() {
    synth.onvoiceschanged = voices;
    inp.value = "";
    char.textContent = "0 char"
    speakBtn.removeAttribute("disabled");
    pause.setAttribute("disabled", true)
    resume.setAttribute("disabled", true);
    stopBtn.setAttribute("disabled", true)
    pitch.value = 1;
    pitchOutput.textContent = pitch.value;
    speed.value = 1.1;
    speedOutput.textContent = convertRange([0.1, 10], [0, 2], speed.value).toFixed(1);
    volume.value = 1;
    volumeOutput.textContent = `${volume.value * 100}%`;


    pitch.addEventListener("input", () => {
        pitchOutput.textContent = pitch.value;
        pitchValue = pitch.value;
    })
    speed.addEventListener("input", () => {
        speedOutput.textContent = convertRange([0.1, 10], [0, 2], speed.value).toFixed(1);
        speedValue = speed.value;
    })
    volume.addEventListener("input", () => {
        volumeOutput.textContent = `${volume.value * 100}%`;
        volumeValue = volume.value;
    })
    statusSpan.textContent = "Play";
    select.addEventListener("change", () => {
        voiceIndex = parseInt(select.value);
    })

    inp.addEventListener("input", () => {
        char.textContent = `${inp.value.length} chars`
    })

    speakBtn.addEventListener("click", () => {
        speak(inp.value);
    })

    pause.addEventListener("click", pauseFunc);
    resume.addEventListener("click", resumeFunc);
    stopBtn.addEventListener("click", stopFunc);
}
function init() {
    if ("speechSynthesis" in window) {
        main();
    }
    else {
        alert("Not supported");
    }
}
init();