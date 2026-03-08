import { FetchWeatherData } from "./main.js"
import debounce from "../../utils/debounce.js"


const inp = document.querySelector("#inp-search");
const dashboard = document.querySelector(".dashboard");


function sanitize(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}


const weatherCode = {
    0: { label: "Clear Sky" },
    1: { label: "Mainly Clear" },
    2: { label: "Partly Cloudy" },
    3: { label: "Overcast" },
    45: { label: "Fog" },
    48: { label: "Icy Fog" },
    51: { label: "Light Drizzle" },
    53: { label: "Moderate Drizzle" },
    55: { label: "Dense Drizzle" },
    56: { label: "Light Freezing Drizzle" },
    57: { label: "Heavy Freezing Drizzle" },
    61: { label: "Slight Rain" },
    63: { label: "Moderate Rain" },
    65: { label: "Heavy Rain" },
    66: { label: "Light Freezing Rain" },
    67: { label: "Heavy Freezing Rain" },
    71: { label: "Slight Snowfall" },
    73: { label: "Moderate Snowfall" },
    75: { label: "Heavy Snowfall" },
    77: { label: "Snow Grains" },
    80: { label: "Slight Rain Showers" },
    81: { label: "Moderate Rain Showers" },
    82: { label: "Violent Rain Showers" },
    85: { label: "Slight Snow Showers" },
    86: { label: "Heavy Snow Showers" },
    95: { label: "Thunderstorm" },
    96: { label: "Thunderstorm + Hail" },
    99: { label: "Thunderstorm + Heavy Hail" },
};




function createView(input, data) {
    const dateData = dateString();
    document.querySelector(".dashboard").innerHTML = `
    <div class="info">
                <div class="nameinfo">
                    <h1 id="name">${input.toUpperCase()}</h1>
                    <p id="lal">${data?.latitude ?? ""}°N ${data?.longitude ?? ""}°E</p >
                </div >
        <div class="timeinfo">
            <div class="date">${dateData.date ?? ""}</div>
            <div class="time">${dateData.time ?? ""}</div>
        </div>
            </div >
        <div class="content">
            <div class="cont1">
                <div class="tempinfo">
                    <h3>Current Temperature</h3>
                    <p>${data?.current?.temperature_2m ?? "-"} <span>${data?.current_units?.temperature_2m ?? "-"}</span></p>
                    <div class="temp-info-more">
                        <div class="feels-like">
                            <h3>${data?.current?.apparent_temperature ?? "-"}°</h3>
                            <p>Feels like</p>
                        </div>
                        <div class="max">
                            <h3>${data?.daily?.temperature_2m_max?.length > 0 ? Math.max(...data?.daily?.temperature_2m_max) : "-"}°</h3>
                            <p>Max</p>
                        </div>
                        <div class="min">
                            <h3>${data?.daily?.temperature_2m_min?.length > 0 ? Math.min(...data?.daily?.temperature_2m_min) : "-"}°</h3>
                            <p>Min</p>
                        </div>
                    </div>
                    <div class="cond">
                        <div class="anm">.</div>
                        <p>${weatherCode[data?.current?.weather_code]?.label ?? "-"}</p>
                    </div>
                </div>
                <div class="windinfo">
                    <h3>Wind Conditions</h3>
                    <div class="compass-container">
                        <div class="compass">
                            <div class="needle" style="rotate:${data?.current?.wind_direction_10m - 90 ?? "0"}deg;"></div>
                        </div>
                        <p class="compass-mark markn">N</p>
                        <p class="compass-mark markw">W</p>
                        <p class="compass-mark marks">S</p>
                        <p class="compass-mark marke">E</p>
                    </div>
                    <div class="wind-info-container">
                        <div class="wind-speed">
                            <h2>${data?.current?.wind_speed_10m ?? "-"}</h2>
                            <p>${data?.current_units?.wind_speed_10m ?? "-"} speed</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cont2">
                <div class="hum cont2-info">
                    <div class="cont2-img">💧</div>
                    <div class="cont2-value">
                        <h2>${data?.current?.relative_humidity_2m ?? "-"} <span>${data?.current_units?.relative_humidity_2m ?? ""}</span></h2>
                    </div>
                    <p>Humidity</p>
                    <div class="perc">
                        <div class="p-value1" style="width: ${data?.current?.relative_humidity_2m ?? 0}%;"></div>
                    </div>
                </div>

                <div class="uvind cont2-info">
                    <div class="cont2-img">🌞</div>
                    <div class="cont2-value">
                        <h2>${data?.current?.uv_index ?? "-"}</h2>
                    </div>
                    <p>UV Index</p>
                    <div class="perc">
                        <div class="p-value2" style="width:${Math.min((data?.current?.uv_index / 11) * 100, 100).toFixed(1) ?? 0}%;"></div>
                    </div>
                </div>
                <div class="pre cont2-info">
                    <div class="cont2-img">🔵</div>
                    <div class="cont2-value">
                        <h2>${data?.current?.surface_pressure ?? "-"} <span>${data?.current_units?.surface_pressure ?? ""}</span></h2>
                    </div>
                    <p>PRESSURE</p>
                    <div class="perc">
                        <div class="p-value3" style="width:${Math.min(Math.max(((data?.current?.surface_pressure ?? 0) - 950) / (1050 - 950) * 100, 0), 100) ?? 0
        }%; "></div>
                    </div >
                </div >
    <div class="vis cont2-info">
        <div class="cont2-img">👁️</div>
        <div class="cont2-value">
            <h2>${data?.current?.visibility ?? "-"} <span>${data?.current_units?.visibility ?? "-"}</span></h2>
        </div>
        <p>VISIBILITY</p>
        <div class="perc">
            <div class="p-value4" style="width:${Math.min((((data?.current?.visibility ?? 0) / 1000) / 24) * 100, 100) ?? 0}%;"></div>
        </div>
    </div>
            </div >
        </div >
    `
}





const inpEvent = debounce(show, 500)


inp.addEventListener("input", inpEvent)


async function show(e) {
    const input = sanitize(e.target.value.trim());
    if (!input) return;
    dashboard.innerHTML = "Loading.....";
    const data = await FetchWeatherData(input);
    if (data) {
        createView(input, data);
    } else {
        dashboard.innerHTML = `Not found`;
    }
}


function dateString() {
    const date = new Date();

    const day = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const dd = String(date.getDate()).padStart(2, '0');
    const mon = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    return { date: `${day} · ${dd} ${mon} ${year} `, time };
}



document.querySelector("#btn-search").addEventListener("click", () => {
    show({ target: { value: inp.value } })
})