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
exports.DBCache = void 0;
const __1 = require("..");
class DBCache {
    constructor() {
        this.cacheTable = '$cache';
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new __1.DB(this.cacheTable).get();
        });
    }
    set(key, value, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._checkTableCacheIsExists();
            const expiredAt = Date.now() + ms;
            return yield new __1.DB(this.cacheTable).create({
                key,
                value: JSON.stringify(value),
                expiredAt
            })
                .void()
                .save();
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._checkTableCacheIsExists();
            const cached = yield new __1.DB(this.cacheTable).where('key', key).first();
            if (!cached)
                return null;
            if (new Date() > new Date(+cached.expiredAt)) {
                yield new __1.DB(this.cacheTable).where('key', key).delete();
                return null;
            }
            return JSON.parse(cached.value);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new __1.DB(this.cacheTable).truncate({ force: true });
            return;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new __1.DB(this.cacheTable).where('key', key).delete();
            return;
        });
    }
    _checkTableCacheIsExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = this.cacheTable;
            const checkTables = yield new __1.DB().rawQuery(`SHOW TABLES LIKE '${table}'`);
            const existsTables = checkTables.map((c) => Object.values(c)[0])[0];
            if (existsTables != null)
                return;
            const schemaLogger = {
                id: new __1.Blueprint().int().notNull().primary().autoIncrement(),
                key: new __1.Blueprint().varchar(255).null(),
                value: new __1.Blueprint().longText().null(),
                expiredAt: new __1.Blueprint().varchar(100).null(),
                createdAt: new __1.Blueprint().timestamp().null(),
                updatedAt: new __1.Blueprint().timestamp().null()
            };
            const sql = new __1.Schema().createTable(`\`${table}\``, schemaLogger);
            yield new __1.DB().rawQuery(sql);
            return;
        });
    }
}
exports.DBCache = DBCache;
exports.default = DBCache;
//# sourceMappingURL=DBCache.js.map