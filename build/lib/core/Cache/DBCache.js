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
exports.DBCache = void 0;
const __1 = require("..");
const utils_1 = __importDefault(require("../../utils"));
class DBCache {
    constructor() {
        this._cacheTable = '$cache';
        this._maxAddress = 10;
        this._maxLength = 50;
        this._c0x0 = 'c0x0';
    }
    set(key, value, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._checkTableCacheIsExists();
            const expiredAt = Date.now() + ms;
            if (utils_1.default.typeOf(value) === 'array') {
                const avg = value.length / this._maxAddress;
                const chunked = utils_1.default.chunkArray(value, avg > this._maxLength ? avg : this._maxLength);
                const cache = {};
                for (const [index, value] of chunked.entries()) {
                    cache[`${this._c0x0}${index}`] = JSON.stringify(value);
                }
                yield new __1.DB(this._cacheTable).create(Object.assign(Object.assign({ key }, cache), { expiredAt, createdAt: utils_1.default.timestamp(), updatedAt: utils_1.default.timestamp() }))
                    .void()
                    .save();
                return;
            }
            yield new __1.DB(this._cacheTable).create({
                key,
                [`${this._c0x0}0`]: JSON.stringify(value),
                expiredAt,
                createdAt: utils_1.default.timestamp(),
                updatedAt: utils_1.default.timestamp()
            })
                .void()
                .save();
            return;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._checkTableCacheIsExists();
            const cached = yield new __1.DB(this._cacheTable).where('key', key).first();
            if (!cached)
                return null;
            if (Number.isNaN(+cached.expiredAt) || (new Date() > new Date(+cached.expiredAt))) {
                yield new __1.DB(this._cacheTable).where('key', key).delete();
                return null;
            }
            const value = JSON.parse(cached[`${this._c0x0}0`]);
            if (utils_1.default.typeOf(value) !== 'array')
                return value;
            const values = [];
            for (let i = 0; i <= 9; i++) {
                const find = cached[`${this._c0x0}${i}`];
                if (find == null || find === '')
                    break;
                const maybeArray = JSON.parse(find);
                if (Array.isArray(maybeArray)) {
                    values.push(...JSON.parse(find));
                    continue;
                }
                values.push(JSON.parse(find));
            }
            return values;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new __1.DB(this._cacheTable).truncate({ force: true });
            return;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new __1.DB(this._cacheTable).where('key', key).delete();
            return;
        });
    }
    _checkTableCacheIsExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = this._cacheTable;
            const checkTables = yield new __1.DB().rawQuery(`SHOW TABLES LIKE '${table}'`);
            const existsTables = checkTables.map((c) => Object.values(c)[0])[0];
            if (existsTables != null)
                return;
            const schemaLogger = {
                id: new __1.Blueprint().int().notNull().primary().autoIncrement(),
                key: new __1.Blueprint().longText().notNull(),
                [`${this._c0x0}0`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}1`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}2`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}3`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}4`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}5`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}6`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}7`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}8`]: new __1.Blueprint().longText().null(),
                [`${this._c0x0}9`]: new __1.Blueprint().longText().null(),
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