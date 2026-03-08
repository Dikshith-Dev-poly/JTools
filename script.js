"use strict"

const filterBtn = document.getElementById("filterbtn");
const searchInp = document.getElementById("searchinp");
let filteredData = {};
let data;

async function fetchData() {
    const res = await fetch("tools.json");
    data = await res.json();
}


function createElement(tools) {
    const rend = document.createDocumentFragment();
    tools.forEach(t => {
        const tool = document.createElement("div");
        tool.dataset.locate = t.location.replace("/index.html", "");
        tool.className = "tool";

        // Image Container
        const imgContainer = document.createElement("div");
        imgContainer.className = "imgContainer";

        const img = document.createElement("img");
        img.src = t.image;
        img.alt = t.name;

        imgContainer.appendChild(img);

        // Info Section
        const info = document.createElement("div");
        info.className = "info";

        const title = document.createElement("h3");
        title.textContent = t.name;

        const description = document.createElement("p");
        description.textContent = t.description;

        info.appendChild(title);
        info.appendChild(description);

        // Tags Section
        const tags = document.createElement("div");
        tags.className = "tags";

        const ul = document.createElement("ul");
        const liFrag = document.createDocumentFragment();

        t.tags.forEach((ta) => {
            const tag = document.createElement("li");
            tag.textContent = ta;
            liFrag.append(tag)
        })

        ul.appendChild(liFrag);
        tags.appendChild(ul);

        // Assemble Everything
        tool.appendChild(imgContainer);
        tool.appendChild(info);
        tool.appendChild(tags);

        // Add to page

        rend.appendChild(tool);
    });

    rend.querySelectorAll(".tool").forEach((t) => {
        t.removeEventListener("click", addLink);
        t.addEventListener("click", addLink);
    })


    return rend;
}


function addLink(t) {
    window.location.href = `${t.target.closest(".tool").dataset.locate}/index.html`;
}

function StartLoader() {
    document.querySelector("#tools").innerHTML = `
    <div class="loader">
        <div class="justify-content-center jimu-primary-loading"></div>
    </div> `
}
function endLoader() {
    document.querySelector("#tools").innerHTML = "";
}

async function render() {
    StartLoader();
    if (!data) {
        await fetchData();
    }
    const content = createElement(data);
    endLoader();
    document.querySelector("#tools").append(content);
}


function filter() {
    StartLoader();

    if (Object.keys(filteredData).length === 0) {
        data.forEach((d) => {
            if (!filteredData[d.category]) {
                filteredData[d.category] = [];
            }
            filteredData[d.category].push(d);
        })
    }


    if (filterBtn.dataset.filter === "false") {
        filterBtn.dataset.filter = "true";
        filterBtn.style.backgroundColor = "#8494FF";
        document.querySelector(".input").disabled = true;
        endLoader();
        filterByCategory();
    } else if (filterBtn.dataset.filter === "true") {
        filterBtn.dataset.filter = "false";
        filterBtn.style.backgroundColor = "#FFDBFD";
        document.querySelector(".input").disabled = false;
        endLoader();
        document.querySelector("#tools").style.display = "flex";
        render();
    }
}


function filterByCategory() {
    const content = document.createDocumentFragment();
    for (let key in filteredData) {
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        h1.textContent = key;
        h1.style.color = "white";
        div.appendChild(h1);
        const div2 = document.createElement("div");
        const tempContent = createElement(filteredData[key]);
        div2.appendChild(tempContent);
        div2.className = "filterClass"
        div.appendChild(div2);
        content.appendChild(div);
    }
    document.querySelector("#tools").style.display = "block";
    document.querySelector("#tools").append(content);
}



filterBtn.addEventListener("click", filter);




function search(query) {
    if (filterBtn.dataset.filter === "true") return;
    StartLoader();
    const q = query.trim().toLowerCase();

    const filtered = data.filter((d) => {
        const searchable = `${d.name} ${d.category} ${d.description} ${d.tags.join(" ")}`.toLowerCase();
        return searchable.includes(q);
    })

    const content = createElement(filtered);
    endLoader();
    document.querySelector("#tools").append(content);
}

function debounce(fn, delay) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const searchDebounce = debounce(search, 500);

searchInp.addEventListener("input", () => {
    searchDebounce(searchInp.value);
})

render()