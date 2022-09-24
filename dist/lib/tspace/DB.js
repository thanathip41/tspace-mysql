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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
var AbstractDB_1 = require("./AbstractDB");
var ProxyHandler_1 = require("./ProxyHandler");
var DB = /** @class */ (function (_super) {
    __extends(DB, _super);
    function DB(table) {
        var _this = _super.call(this) || this;
        _this._initialDB();
        if (table)
            _this.table(table);
        return new Proxy(_this, ProxyHandler_1.proxyHandler);
    }
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    DB.prototype.table = function (table) {
        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " *"));
        this.$db.set('TABLE_NAME', "`".concat(table, "`"));
        this.$db.set('FROM', "".concat(this.$constants('FROM')));
        return this;
    };
    /**
     * transaction query rollback & commit
     * @return {promise<any>}
     */
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
                                    if (query.id === '' || query.table === '' || query.id == null || query.table == null) {
                                        return [2 /*return*/, false];
                                    }
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
    DB.prototype._initialDB = function () {
        this.$db = this._setupDB();
        return this;
    };
    DB.prototype._setupDB = function () {
        var db = new Map(Object.entries(__assign({}, this.$constants('DB'))));
        return {
            get: function (key) {
                if (key == null)
                    return db;
                if (!db.has(key))
                    throw new Error("can't get this [".concat(key, "]"));
                return db.get(key);
            },
            set: function (key, value) {
                if (!db.has(key))
                    throw new Error("can't set this [".concat(key, "]"));
                db.set(key, value);
                return;
            }
        };
    };
    return DB;
}(AbstractDB_1.AbstractDB));
exports.DB = DB;
exports.default = DB;
