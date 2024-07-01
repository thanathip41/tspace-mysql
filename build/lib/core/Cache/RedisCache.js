"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const redis_1 = require("redis");
class RedisCache {
    constructor(url) {
        this.client = (0, redis_1.createClient)({
            url
        });
        this.client.on("error", (err) => {
            if (err)
                this.client.quit();
        });
        this.client.connect();
    }
    set(key, value, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const expiredAt = Date.now() + ms;
            yield this.client.setEx(key, expiredAt, JSON.stringify(value));
            return;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = yield this.client.get(key);
            if (cached == null)
                return null;
            return JSON.parse(cached);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.flushAll();
            return;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.del(key);
            return;
        });
    }
}
exports.RedisCache = RedisCache;
exports.default = RedisCache;
//# sourceMappingURL=RedisCache.js.map