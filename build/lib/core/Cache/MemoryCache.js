"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = void 0;
class MemoryCache {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ms) {
        const expiredAt = Date.now() + ms;
        this.cache.set(key, { value, expiredAt });
        return;
    }
    get(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiredAt) {
            this.cache.delete(key);
            return null;
        }
        return cached.value;
    }
    clear() {
        this.cache.clear();
        return;
    }
    delete(key) {
        this.cache.delete(key);
        return;
    }
}
exports.MemoryCache = MemoryCache;
exports.default = MemoryCache;
//# sourceMappingURL=MemoryCache.js.map