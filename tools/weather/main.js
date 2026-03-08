import LRUCache from "../../utils/LRUCache.js"

const cityCache = new LRUCache({
    limit: 200
})

const dataCache = new LRUCache({
    ttl: 15 * 60 * 1000,
    limit: 500
})


async function getLAL(city) {
    const key = city.toLowerCase().trim();
    const cached = cityCache.get(key);
    if (cached) {
        return cached;
    }

    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${key}`);
    if (!res.ok) throw new Error("Failed to fetch LAL")

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" not found`);
    }
    const { latitude: lat, longitude: long } = data?.results?.[0];

    const cache = { lat, long };
    cityCache.set(key, cache);
    return cache;
}

async function weatherData(lat, long) {
    const key = `${lat},${long}`;
    const cached = dataCache.get(key);
    if (cached) {
        return cached;
    }
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min`)
    if (!res.ok) throw new Error("Failed to fetch Weather data")

    const data = await res.json();
    dataCache.set(key, data);
    return data;
}


export async function FetchWeatherData(city) {
    try {
        const { lat, long } = await getLAL(city);
        const result = await weatherData(lat, long);
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

