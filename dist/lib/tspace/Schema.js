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
exports.Blueprint = exports.Schema = void 0;
var Database_1 = __importDefault(require("./Database"));
var Schema = /** @class */ (function (_super) {
    __extends(Schema, _super);
    function Schema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.table = function (table, schemas) { return __awaiter(_this, void 0, void 0, function () {
            var columns, key, data, type, attrbuites, sql, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        columns = [];
                        for (key in schemas) {
                            data = schemas[key];
                            type = data.type, attrbuites = data.attrbuites;
                            columns = __spreadArray(__spreadArray([], __read(columns), false), ["".concat(key, " ").concat(type, " ").concat(attrbuites === null || attrbuites === void 0 ? void 0 : attrbuites.join(' '))], false);
                        }
                        sql = "CREATE TABLE ".concat(table, " (").concat(columns === null || columns === void 0 ? void 0 : columns.join(','), ") ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8");
                        return [4 /*yield*/, this.rawQuery(sql)];
                    case 1:
                        _b.sent();
                        console.log("Migrats : '".concat(table, "' created successfully"));
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        console.log((_a = err_1.message) === null || _a === void 0 ? void 0 : _a.replace("ER_TABLE_EXISTS_ERROR: ", ""));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return Schema;
}(Database_1.default));
exports.Schema = Schema;
var Blueprint = /** @class */ (function () {
    function Blueprint() {
        this.attrbuites = [];
    }
    Blueprint.prototype._addType = function (type) {
        if (this.type != null || this.type)
            return this;
        this.type = type;
        return this;
    };
    Blueprint.prototype._addAttrbuite = function (attrbuite) {
        this.attrbuites = __spreadArray(__spreadArray([], __read(this.attrbuites), false), [attrbuite], false);
        return this;
    };
    /**
     *
     * @Types
     *
    */
    Blueprint.prototype.int = function () {
        this._addType('INT');
        return this;
    };
    Blueprint.prototype.tinyInt = function (n) {
        if (n === void 0) { n = 1; }
        this._addType("TINYINT(".concat(n, ")"));
        return this;
    };
    Blueprint.prototype.bigInt = function (n) {
        if (n === void 0) { n = 10; }
        this._addType("BIGINT(".concat(n, ")"));
        return this;
    };
    Blueprint.prototype.double = function () {
        this._addType("DOUBLE");
        return this;
    };
    Blueprint.prototype.float = function () {
        this._addType("FLOAT");
        return this;
    };
    Blueprint.prototype.varchar = function (n) {
        if (n === void 0) { n = 100; }
        if (n > 255)
            n = 255;
        this._addType("VARCHAR(".concat(n, ")"));
        return this;
    };
    Blueprint.prototype.char = function (n) {
        if (n === void 0) { n = 1; }
        this._addType("CHAR(".concat(n, ")"));
        return this;
    };
    Blueprint.prototype.longText = function () {
        this._addType("LONGTEXT");
        return this;
    };
    Blueprint.prototype.mediumText = function () {
        this._addType("MEDIUMTEXT");
        return this;
    };
    Blueprint.prototype.tinyText = function () {
        this._addType("TINYTEXT");
        return this;
    };
    Blueprint.prototype.text = function () {
        this._addType("TEXT");
        return this;
    };
    Blueprint.prototype.enum = function () {
        var n = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            n[_i] = arguments[_i];
        }
        this._addType("ENUM('".concat(n, "')"));
        return this;
    };
    Blueprint.prototype.date = function () {
        this._addType("DATE");
        return this;
    };
    Blueprint.prototype.dateTime = function () {
        this._addType("DATETIME");
        return this;
    };
    Blueprint.prototype.timestamp = function () {
        this._addType("TIMESTAMP");
        return this;
    };
    /**
     *
     * @Attrbuites
     *
    */
    Blueprint.prototype.unsigned = function () {
        this._addAttrbuite("UNSIGNED");
        return this;
    };
    Blueprint.prototype.unique = function () {
        this._addAttrbuite("UNIQUE");
        return this;
    };
    Blueprint.prototype.null = function () {
        this._addAttrbuite("NULL");
        return this;
    };
    Blueprint.prototype.notNull = function () {
        this._addAttrbuite("NOT NULL");
        return this;
    };
    Blueprint.prototype.primary = function () {
        this._addAttrbuite("PRIMARY KEY");
        return this;
    };
    Blueprint.prototype.default = function (n) {
        this._addAttrbuite("DEFAULT '".concat(n, "'"));
        return this;
    };
    Blueprint.prototype.defaultTimestamp = function () {
        this._addAttrbuite("DEFAULT CURRENT_TIMESTAMP");
        return this;
    };
    Blueprint.prototype.autoIncrement = function () {
        this._addAttrbuite("AUTO_INCREMENT");
        return this;
    };
    return Blueprint;
}());
exports.Blueprint = Blueprint;
