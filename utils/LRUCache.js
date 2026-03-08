export default class LRUCache {
    constructor({ ttl = 0, limit = 100 } = {}) {
        this.ttl = ttl;
        this.limit = limit;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const data = this.cache.get(key);
        if (Date.now() > data.expiry) {
            this.cache.delete(key);
            return null;
        }



        this.cache.delete(key);
        this.cache.set(key, data);
        return data.value;
    }

    set(key, value) {
        const expiry = this.ttl > 0 ? Date.now() + this.ttl : Infinity;
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.limit) {
            const oldest = this.cache.keys().next().value;
            this.cache.delete(oldest);
        }
        this.cache.set(key, { value, expiry });
    }
}