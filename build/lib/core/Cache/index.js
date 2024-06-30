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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const MemoryCache_1 = require("./MemoryCache");
const DBCache_1 = require("./DBCache");
const options_1 = __importDefault(require("../../options"));
class Cache {
    constructor() {
        this._driver = new MemoryCache_1.MemoryCache();
        if (options_1.default.CACHE === 'memory' || options_1.default.CACHE == null)
            this._driver = new MemoryCache_1.MemoryCache();
        if (options_1.default.CACHE === 'db')
            this._driver = new DBCache_1.DBCache();
    }
    driver(driver) {
        this._driver = driver === 'db' ? new DBCache_1.DBCache() : new MemoryCache_1.MemoryCache();
        return this;
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.all();
        });
    }
    set(key, value, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.set(key, value, ms);
            return;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield this._driver.get(key);
            if (cache == null)
                return null;
            return cache;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.clear();
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.delete(key);
            return;
        });
    }
}
exports.Cache = Cache;
exports.default = Cache;
//# sourceMappingURL=index.js.map