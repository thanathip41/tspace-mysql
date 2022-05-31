"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDB_1 = __importDefault(require("./AbstractDB"));
var ProxyHandler_1 = __importDefault(require("./ProxyHandler"));
var DB = /** @class */ (function (_super) {
    __extends(DB, _super);
    function DB() {
        var _this = _super.call(this) || this;
        _this._initDB();
        return new Proxy(_this, ProxyHandler_1.default);
    }
    DB.prototype.table = function (table) {
        this.$db.set('SELECT', this.$utils().constants('SELECT') + " *");
        this.$db.set('TABLE_NAME', table);
        this.$db.set('FROM', "" + this.$utils().constants('FROM'));
        return this;
    };
    DB.prototype.raw = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.rawQuery(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DB.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction;
            var _this = this;
            return __generator(this, function (_a) {
                transaction = {
                    rollback: function () { return __awaiter(_this, void 0, void 0, function () {
                        var transaction, _a, _b, query, e_1_1;
                        var e_1, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    transaction = this.$db.get('TRANSACTION');
                                    if (!(transaction === null || transaction === void 0 ? void 0 : transaction.query.length))
                                        return [2 /*return*/, false];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 6, 7, 8]);
                                    _a = __values(transaction.query), _b = _a.next();
                                    _d.label = 2;
                                case 2:
                                    if (!!_b.done) return [3 /*break*/, 5];
                                    query = _b.value;
                                    if (query.id === '' || query.table === '' || query.id == null || query.table == null)
                                        return [2 /*return*/, false];
                                    return [4 /*yield*/, new DB()
                                            .table(query.table)
                                            .where('id', query.id)
                                            .delete()];
                                case 3:
                                    _d.sent();
                                    _d.label = 4;
                                case 4:
                                    _b = _a.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/, true];
                            }
                        });
                    }); },
                    query: []
                };
                this.$db.set('TRANSACTION', transaction);
                return [2 /*return*/, transaction];
            });
        });
    };
    DB.prototype._initDB = function () {
        this.$db = this._setupDB();
        this.$logger = this._setupLogger();
        return this;
    };
    DB.prototype._setupLogger = function () {
        var logger = [];
        return {
            get: function () { return logger; },
            set: function (value) {
                logger = __spreadArray(__spreadArray([], __read(logger), false), [value], false);
                return;
            },
            check: function (value) { return logger.indexOf(value) != -1; }
        };
    };
    DB.prototype._setupDB = function () {
        var db = {
            TRANSACTION: {
                query: [{
                        table: '',
                        id: ''
                    }]
            },
            RESULT: null,
            REGISTRY: {},
            PLUCK: '',
            SAVE: '',
            DELETE: '',
            UPDATE: '',
            INSERT: '',
            SELECT: '',
            ONLY: [],
            EXCEPT: [''],
            COUNT: '',
            FROM: '',
            JOIN: '',
            WHERE: '',
            GROUP_BY: '',
            ORDER_BY: '',
            LIMIT: '',
            OFFSET: '',
            HAVING: '',
            TABLE_NAME: '',
            HIDDEN: [],
            DEBUG: false
        };
        return {
            get: function (key) {
                if (key)
                    return db[key];
                return db;
            },
            set: function (key, value) {
                if (!db.hasOwnProperty(key))
                    throw new Error("can't set this [" + key + "]");
                db[key] = value;
                return;
            }
        };
    };
    return DB;
}(AbstractDB_1.default));
exports.default = DB;
