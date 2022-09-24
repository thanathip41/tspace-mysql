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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
var AbstractDatabase_1 = __importDefault(require("./AbstractDatabase"));
var connection_1 = require("../connection");
var utils_1 = __importDefault(require("../utils"));
var constants_1 = __importDefault(require("../constants"));
var fs_1 = __importDefault(require("fs"));
var sql_formatter_1 = require("sql-formatter");
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database() {
        var _this = _super.call(this) || this;
        _this._initialConnection();
        return _this;
    }
    /**
     *
     * @param {string} column
     * @return {this}
     */
    Database.prototype.pluck = function (column) {
        this.$db.set('PLUCK', column);
        return this;
    };
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    Database.prototype.except = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        this.$db.set('EXCEPT', columns.length ? columns : ['id']);
        return this;
    };
    /**
     *
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    Database.prototype.only = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        this.$db.set('ONLY', columns);
        return this;
    };
    /**
     *
     * @param {string=} column [column=id]
     * @return {this} this
     */
    Database.prototype.distinct = function (column) {
        if (column === void 0) { column = 'id'; }
        this.$db.set('SELECT', [
            "".concat(this.$constants('SELECT')),
            "".concat(this.$constants('DISTINCT')),
            "".concat(column)
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string[]} ...columns
     * @return {this} this
     */
    Database.prototype.select = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        var select = '*';
        if (columns === null || columns === void 0 ? void 0 : columns.length)
            select = columns.join(',');
        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(select));
        return this;
    };
    /**
     *
     * @param {number} chunk
     * @return {this} this
     */
    Database.prototype.chunk = function (chunk) {
        this.$db.set('CHUNK', chunk);
        return this;
    };
    /**
     *
     * @param {string | number | undefined | null | Boolean} condition when condition true will be callback
     * @return {this} this
     */
    Database.prototype.when = function (condition, callback) {
        if (condition)
            callback(this);
        return this;
    };
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.where = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (operator.toUpperCase() === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(operator, " '").concat(value, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(operator, " '").concat(value, "'")
        ].join(' '));
        return this;
    };
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.orWhere = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        if (operator === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$db.get('WHERE')),
                "".concat(this.$constants('OR')),
                "".concat(column, " ").concat(operator, " '").concat(value, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$constants('WHERE')),
            "".concat(column, " ").concat(operator, " '").concat(value, "'")
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} query where column with raw sql
     * @return {this} this
     */
    Database.prototype.whereRaw = function (sql) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(sql)
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(sql)
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {number} id
     * @param {string?} column custom it *if column is not id
     * @return {this} this
     */
    Database.prototype.whereId = function (id, column) {
        if (column === void 0) { column = 'id'; }
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " = '").concat(id, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " = '").concat(id, "'")
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} email where using email
     * @return {this}
     */
    Database.prototype.whereEmail = function (email) {
        var column = 'email';
        email = this.$utils.escape(email);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " = '").concat(email, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " = '").concat(email, "'")
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {number} id
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    Database.prototype.whereUser = function (id, column) {
        if (column === void 0) { column = 'user_id'; }
        id = this.$utils.escape(id);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " = '").concat(id, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " = '").concat(id, "'")
        ].join(' '));
        return this;
    };
    /**
     * using array value where in value in array
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    Database.prototype.whereIn = function (column, array) {
        if (!Array.isArray(array))
            throw new Error("[".concat(array, "] is't array"));
        if (!array.length)
            array = ['0'];
        var values = "".concat(array.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IN'), " (").concat(values, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('IN'), " (").concat(values, ")")
        ].join(' '));
        return this;
    };
    /**
     * or where in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    Database.prototype.orWhereIn = function (column, array) {
        var sql = this.$db.get('WHERE');
        if (!Array.isArray(array))
            throw new Error("[".concat(array, "] is't array"));
        if (!array.length)
            array = ['0'];
        var values = "".concat(array.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!sql.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IN'), " (").concat(values, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('OR')),
            "".concat(column, " ").concat(this.$constants('IN'), " (").concat(values, ")")
        ].join(' '));
        return this;
    };
    /**
     * where not in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    Database.prototype.whereNotIn = function (column, array) {
        var sql = this.$db.get('WHERE');
        if (!Array.isArray(array))
            throw new Error("[".concat(array, "] is't array"));
        if (!array.length)
            array = ['0'];
        var values = "".concat(array.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!sql.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('NOT_IN'), " (").concat(values, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('NOT_IN'), " (").concat(values, ")")
        ].join(' '));
        return this;
    };
    /**
     * where sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    Database.prototype.whereSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IN'), " (").concat(subQuery, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('IN'), " (").concat(subQuery, ")")
        ].join(' '));
        return this;
    };
    /**
     * where not sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    Database.prototype.whereNotSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IN'), " (").concat(subQuery, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('NOT_IN'), " (").concat(subQuery, ")")
        ].join(' '));
        return this;
    };
    /**
     * or where not sub query using query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    Database.prototype.orWhereSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IN'), " (").concat(subQuery, ")")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('OR')),
            "".concat(column, " ").concat(this.$constants('IN'), " (").concat(subQuery, ")")
        ].join(' '));
        return this;
    };
    /**
     * where between using [value1, value2]
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    Database.prototype.whereBetween = function (column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length)
            array = ['0', '0'];
        var _a = __read(array, 2), value1 = _a[0], value2 = _a[1];
        value1 = this.$utils.escape(value1);
        value2 = this.$utils.escape(value2);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('BETWEEN')),
                "'".concat(value1, "' ").concat(this.$constants('AND'), " '").concat(value2, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('BETWEEN')),
            "'".concat(value1, "' ").concat(this.$constants('AND'), " '").concat(value2, "'")
        ].join(' '));
        return this;
    };
    /**
     * where null using NULL
     * @param {string} column
     * @return {this}
     */
    Database.prototype.whereNull = function (column) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IS_NULL'))
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('IS_NULL'))
        ].join(' '));
        return this;
    };
    /**
     * where not null using NULL
     * @param {string} column
     * @return {this}
     */
    Database.prototype.whereNotNull = function (column) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(this.$constants('IS_NOT_NULL'))
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " ").concat(this.$constants('IS_NOT_NULL'))
        ].join(' '));
        return this;
    };
    /**
     * where sensitive (uppercase, lowercase)
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.whereSensitive = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "BINARY ".concat(column, " ").concat(operator, " '").concat(value, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "BINARY ".concat(column, " ").concat(operator, " '").concat(value, "'")
        ].join(' '));
        return this;
    };
    /**
     * where grouping of start statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.whereGroupStart = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "(".concat(column, " ").concat(operator, " '").concat(value, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "(".concat(column, " ").concat(operator, " '").concat(value, "'")
        ].join(' '));
        return this;
    };
    /**
     * or where grouping of start statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.orWhereGroupStart = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "(".concat(column, " ").concat(operator, " '").concat(value, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "(".concat(column, " ").concat(operator, " '").concat(value, "'")
        ].join(' '));
        return this;
    };
    /**
     * where grouping of end statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.whereGroupEnd = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(operator, " '").concat(value, "')")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('OR')),
            "".concat(column, " ").concat(operator, " '").concat(value, "')")
        ].join(' '));
        return this;
    };
    /**
     * where grouping of end statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    Database.prototype.orWhereGroupEnd = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " ").concat(operator, " '").concat(value, "')")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('OR')),
            "".concat(column, " ").concat(operator, " '").concat(value, "')")
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    Database.prototype.having = function (condition) {
        this.$db.set('HAVING', condition);
        return this;
    };
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    Database.prototype.join = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                "".concat(this.$db.get('JOIN')),
                "".concat(this.$constants('INNER_JOIN')),
                "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            "".concat(this.$constants('INNER_JOIN')),
            "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    Database.prototype.rightJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                "".concat(this.$db.get('JOIN')),
                "".concat(this.$constants('RIGHT_JOIN')),
                "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            "".concat(this.$constants('RIGHT_JOIN')),
            "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
        ].join(''));
        return this;
    };
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    Database.prototype.leftJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                "".concat(this.$db.get('JOIN')),
                "".concat(this.$constants('LEFT_JOIN')),
                "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            "".concat(this.$constants('LEFT_JOIN')),
            "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    Database.prototype.crossJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                "".concat(this.$db.get('JOIN')),
                "".concat(this.$constants('CROSS_JOIN')),
                "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            "".concat(this.$constants('CROSS_JOIN')),
            "".concat(table, " ").concat(this.$constants('ON'), " ").concat(pk, " = ").concat(fk)
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string} column
     * @param {string=} order [order=asc] asc, desc
     * @return {this}
     */
    Database.prototype.orderBy = function (column, order) {
        if (order === void 0) { order = this.$constants('ASC'); }
        this.$db.set('ORDER_BY', [
            "".concat(this.$constants('ORDER_BY')),
            "".concat(column, " ").concat(order.toUpperCase())
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    Database.prototype.latest = function (column) {
        if (column === void 0) { column = 'id'; }
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', [
                "".concat(this.$db.get('ORDER_BY')),
                ",".concat(column, " ").concat(this.$constants('DESC'))
            ].join(' '));
            return this;
        }
        this.$db.set('ORDER_BY', [
            "".concat(this.$constants('ORDER_BY')),
            "".concat(column, " ").concat(this.$constants('DESC'))
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    Database.prototype.oldest = function (column) {
        if (column === void 0) { column = 'id'; }
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', [
                "".concat(this.$db.get('ORDER_BY')),
                ",".concat(column, " ").concat(this.$constants('ASC'))
            ].join(' '));
            return this;
        }
        this.$db.set('ORDER_BY', [
            "".concat(this.$constants('ORDER_BY')),
            "".concat(column, " ").concat(this.$constants('ASC'))
        ].join(' '));
        return this;
    };
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    Database.prototype.groupBy = function (column) {
        if (column === void 0) { column = 'id'; }
        this.$db.set('GROUP_BY', "".concat(this.$constants('GROUP_BY'), " ").concat(column));
        return this;
    };
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    Database.prototype.limit = function (number) {
        if (number === void 0) { number = 1; }
        this.$db.set('LIMIT', "".concat(this.$constants('LIMIT'), " ").concat(number));
        return this;
    };
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    Database.prototype.offset = function (number) {
        if (number === void 0) { number = 1; }
        this.$db.set('OFFSET', "".concat(this.$constants('OFFSET'), " ").concat(number));
        return this;
    };
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    Database.prototype.hidden = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        this.$db.set('HIDDEN', columns);
        return this;
    };
    /**
     *
     * update data in the database
     * @param {object} data
     * @return {this} this
     */
    Database.prototype.update = function (data) {
        var query = this._queryUpdate(data);
        this.$db.set('UPDATE', [
            "".concat(this.$constants('UPDATE')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE');
        return this;
    };
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    Database.prototype.insert = function (data) {
        var query = this._queryInsert(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    Database.prototype.create = function (data) {
        var query = this._queryInsert(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    Database.prototype.createMultiple = function (data) {
        var query = this._queryInsertMultiple(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    /**
     *
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    Database.prototype.insertMultiple = function (data) {
        var query = this._queryInsertMultiple(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    /**
     *
     * @return {string} return sql query
     */
    Database.prototype.toString = function () {
        return this._queryGenrate();
    };
    /**
     *
     * @return {string} return sql query
     */
    Database.prototype.toSQL = function () {
        return this._queryGenrate();
    };
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    Database.prototype.debug = function (debug) {
        if (debug === void 0) { debug = true; }
        this.$db.set('DEBUG', debug);
        return this;
    };
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    Database.prototype.dd = function (debug) {
        if (debug === void 0) { debug = true; }
        this.$db.set('DEBUG', debug);
        return this;
    };
    /**
     *
     * @param {object} data create not exists data
     * @return {this} this this
     */
    Database.prototype.createNotExists = function (data) {
        var query = this._queryInsert(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_NOT_EXISTS');
        return this;
    };
    /**
     *
     * @param {object} data insert not exists data
     * @return {this} this this
     */
    Database.prototype.insertNotExists = function (data) {
        this.createNotExists(data);
        return this;
    };
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    Database.prototype.updateOrCreate = function (data) {
        var queryUpdate = this._queryUpdate(data);
        var queryInsert = this._queryInsert(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(queryInsert)
        ].join(' '));
        this.$db.set('UPDATE', [
            "".concat(this.$constants('UPDATE')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(queryUpdate)
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    };
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    Database.prototype.updateOrInsert = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    Database.prototype.insertOrUpdate = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data create or update data
     * @return {this} this this
     */
    Database.prototype.createOrUpdate = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
     *
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.user
     * @param {string} option.password
     * @return {this} this
     */
    Database.prototype.connection = function (options) {
        var host = options.host, port = options.port, database = options.database, user = options.username, password = options.password, others = __rest(options, ["host", "port", "database", "username", "password"]);
        var pool = new connection_1.PoolConnection(__assign({ host: host, port: port, database: database, user: user, password: password }, others));
        this.$pool.set(pool.connection());
        return this;
    };
    /**
     * execute sql statements with raw sql query
     * @param {string} sql sql execute return data
     * @return {promise<any>}
     */
    Database.prototype.rawQuery = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._queryStatement(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    Database.prototype.increment = function (column, value) {
        if (column === void 0) { column = 'id'; }
        if (value === void 0) { value = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "".concat(this.$constants('SET'), " ").concat(column, " = ").concat(column, " + ").concat(value);
                        this.$db.set('UPDATE', [
                            "".concat(this.$constants('UPDATE')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(query)
                        ].join(' '));
                        return [4 /*yield*/, this._update(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * minus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    Database.prototype.decrement = function (column, value) {
        if (column === void 0) { column = 'id'; }
        if (value === void 0) { value = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "".concat(this.$constants('SET'), " ").concat(column, " = ").concat(column, " - ").concat(value);
                        this.$db.set('UPDATE', [
                            "".concat(this.$constants('UPDATE')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(query)
                        ].join(' '));
                        return [4 /*yield*/, this._update(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * execute data without condition
     * @return {promise<any>}
     */
    Database.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._queryStatement([
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME'))
                        ].join(' '))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * execute data with where by id
     * @param {number} id
     * @return {promise<any>}
     */
    Database.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._queryStatement([
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id = ").concat(id)
                        ].join(' '))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.shift()) || null];
                }
            });
        });
    };
    /**
     *
     * execute data page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    Database.prototype.pagination = function (paginationOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var limit, page, currentPage, nextPage, prevPage, offset, sql, result, count, total, lastPage, totalPage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        limit = 15;
                        page = 1;
                        if (paginationOptions != null) {
                            limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                            page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
                        }
                        currentPage = page;
                        nextPage = currentPage + 1;
                        prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
                        offset = (page - 1) * limit;
                        sql = this._queryGenrate();
                        if (!sql.includes(this.$constants('LIMIT'))) {
                            sql = [
                                "".concat(sql),
                                "".concat(this.$constants('LIMIT')),
                                "".concat(limit),
                                "".concat(this.$constants('OFFSET'), " ").concat(offset)
                            ].join(' ');
                        }
                        else {
                            sql = sql.replace(this.$db.get('LIMIT'), "".concat(limit, " ").concat(this.$constants('OFFSET'), " ").concat(offset));
                        }
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _c.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        if (!result.length)
                            return [2 /*return*/, {
                                    meta: {
                                        total: 0,
                                        limit: limit,
                                        total_page: 0,
                                        current_page: currentPage,
                                        last_page: 0,
                                        next_page: 0,
                                        prev_page: 0
                                    },
                                    data: []
                                }];
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('COUNT'), "(*)"),
                            "".concat(this.$constants('AS'), " total")
                        ].join(' '));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        count = _c.sent();
                        total = count.shift().total || 0;
                        lastPage = Math.ceil(total / limit) || 0;
                        lastPage = lastPage > 1 ? lastPage : 1;
                        totalPage = (_b = result === null || result === void 0 ? void 0 : result.length) !== null && _b !== void 0 ? _b : 0;
                        return [2 /*return*/, {
                                meta: {
                                    total_page: totalPage,
                                    total: total,
                                    limit: limit,
                                    current_page: currentPage,
                                    last_page: lastPage,
                                    next_page: nextPage,
                                    prev_page: prevPage
                                },
                                data: result !== null && result !== void 0 ? result : []
                            }];
                }
            });
        });
    };
    /**
     *
     * execute data useing page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    Database.prototype.paginate = function (paginationOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = 15;
                        page = 1;
                        if (paginationOptions != null) {
                            limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                            page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
                        }
                        return [4 /*yield*/, this.pagination({ limit: limit, page: page })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    Database.prototype.first = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, pluck, newData, checkProperty;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._queryGenrate();
                        if (!sql.includes(this.$constants('LIMIT')))
                            sql = "".concat(sql, " ").concat(this.$constants('LIMIT'), " 1");
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), "".concat(this.$constants('LIMIT'), " 1"));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        if (this.$db.get('PLUCK')) {
                            pluck = this.$db.get('PLUCK');
                            newData = result.shift();
                            checkProperty = newData.hasOwnProperty(pluck);
                            if (!checkProperty)
                                throw new Error("can't find property '".concat(pluck, "' of result"));
                            return [2 /*return*/, newData[pluck] || null];
                        }
                        return [2 /*return*/, result.shift() || null];
                }
            });
        });
    };
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    Database.prototype.findOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.first()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    Database.prototype.get = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, data, pluck_1, newData;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        if (this.$db.get('CHUNK')) {
                            data = result.reduce(function (resultArray, item, index) {
                                var chunkIndex = Math.floor(index / _this.$db.get('CHUNK'));
                                if (!resultArray[chunkIndex])
                                    resultArray[chunkIndex] = [];
                                resultArray[chunkIndex].push(item);
                                return resultArray;
                            }, []);
                            return [2 /*return*/, data || []];
                        }
                        if (this.$db.get('PLUCK')) {
                            pluck_1 = this.$db.get('PLUCK');
                            newData = result.map(function (d) { return d[pluck_1]; });
                            if (newData.every(function (d) { return d == null; })) {
                                throw new Error("can't find property '".concat(pluck_1, "' of result"));
                            }
                            return [2 /*return*/, newData || []];
                        }
                        return [2 /*return*/, result || []];
                }
            });
        });
    };
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    Database.prototype.findMany = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * execute data return json of result
     * @return {promise<string>}
     */
    Database.prototype.toJSON = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        return [2 /*return*/, JSON.stringify(result)];
                }
            });
        });
    };
    /**
     *
     * execute data return array of results
     * @param {string=} column [column=id]
     * @return {promise<Array>}
     */
    Database.prototype.toArray = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, toArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(column));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        toArray = result.map(function (data) { return data[column]; });
                        return [2 /*return*/, toArray];
                }
            });
        });
    };
    /**
     *
     * execute data return number of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    Database.prototype.count = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('COUNT'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " total")
                        ].join(' '));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.total) || 0];
                }
            });
        });
    };
    /**
     *
     * execute data return result is exists
     * @return {promise<boolean>}
     */
    Database.prototype.exists = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._queryStatement([
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('EXISTS'), "(").concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE')),
                            "".concat(this.$constants('LIMIT'), " 1) as 'exists'")
                        ].join(' '))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, !!((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.exists) || false];
                }
            });
        });
    };
    /**
     *
     * execute data return average of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    Database.prototype.avg = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('AVG'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " avg")
                        ].join(' '));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.avg) || 0];
                }
            });
        });
    };
    /**
     *
     * execute data return summary of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    Database.prototype.sum = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(this.$constants('SUM'), "(").concat(column, ") ").concat(this.$constants('AS'), " sum"));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.sum) || 0];
                }
            });
        });
    };
    /**
     *
     * execute data return maximum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    Database.prototype.max = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(this.$constants('MAX'), "(").concat(column, ") ").concat(this.$constants('AS'), " max"));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.max) || 0];
                }
            });
        });
    };
    /**
     *
     * execute data return minimum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    Database.prototype.min = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(this.$constants('MIN'), "(").concat(column, ") ").concat(this.$constants('AS'), " min"));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.min) || 0];
                }
            });
        });
    };
    /**
     *
     * delete data from database
     * @return {promise<boolean>}
     */
    Database.prototype.delete = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.$db.get('WHERE')) {
                            throw new Error("can't delete without where condition");
                        }
                        this.$db.set('DELETE', [
                            "".concat(this.$constants('DELETE')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE'))
                        ].join(' '));
                        return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('DELETE') })];
                    case 1:
                        result = _b.sent();
                        if (result)
                            return [2 /*return*/, (_a = !!result) !== null && _a !== void 0 ? _a : false];
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     *
     * delete data from database ignore where condition
     * @return {promise<boolean>}
     */
    Database.prototype.forceDelete = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('DELETE', [
                            "".concat(this.$constants('DELETE')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE'))
                        ].join(' '));
                        return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('DELETE') })];
                    case 1:
                        result = _b.sent();
                        if (result)
                            return [2 /*return*/, (_a = !!result) !== null && _a !== void 0 ? _a : false];
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     *
     * execute data return Array *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    Database.prototype.getGroupBy = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results, data, sqlGroups, groups, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('GROUP_BY', "".concat(this.$constants('GROUP_BY'), " ").concat(column));
                        this.$db.set('SELECT', [
                            "".concat(this.$db.get('SELECT')),
                            ", ".concat(this.$constants('GROUP_CONCAT'), "(id)"),
                            "".concat(this.$constants('AS'), " data")
                        ].join(' '));
                        sql = this._queryGenrate();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        results = _a.sent();
                        data = [];
                        results.forEach(function (result) {
                            var _a, _b;
                            var splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                            splits.forEach(function (split) { return data = __spreadArray(__spreadArray([], __read(data), false), [split], false); });
                        });
                        sqlGroups = [
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id ").concat(this.$constants('IN')),
                            "(".concat(data.map(function (a) { return "'".concat(a, "'"); }).join(',') || ['0'], ")")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sqlGroups)];
                    case 2:
                        groups = _a.sent();
                        resultData = results.map(function (result) {
                            var _a;
                            var id = result[column];
                            var newData = groups.filter(function (data) { return data[column] === id; });
                            return (_a = {},
                                _a[column] = id,
                                _a.data = newData,
                                _a);
                        });
                        return [2 /*return*/, resultData];
                }
            });
        });
    };
    /**
     *
     * execute data return grouping results by index
     * @param {string} column
     * @return {promise<Array>}
     */
    Database.prototype.findManyGroupBy = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupBy(column)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * execute data when save *action [insert , update]
     * @param {object} transaction | DB.beginTransaction()
     * @return {Promise<any>}
     */
    Database.prototype.save = function (transaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var attributes, query_1, query, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (transaction != null)
                            this.$db.set('TRANSACTION', transaction);
                        attributes = this.$attributes;
                        if ((_a = Object.keys(attributes)) === null || _a === void 0 ? void 0 : _a.length) {
                            while (true) {
                                if (this.$db.get('WHERE')) {
                                    query_1 = this._queryUpdate(attributes);
                                    this.$db.set('UPDATE', [
                                        "".concat(this.$constants('UPDATE')),
                                        "".concat(this.$db.get('TABLE_NAME')),
                                        "".concat(query_1)
                                    ].join(' '));
                                    this.$db.set('SAVE', 'UPDATE');
                                    break;
                                }
                                query = this._queryInsert(attributes);
                                this.$db.set('INSERT', [
                                    "".concat(this.$constants('INSERT')),
                                    "".concat(this.$db.get('TABLE_NAME')),
                                    "".concat(query)
                                ].join(' '));
                                this.$db.set('SAVE', 'INSERT');
                                break;
                            }
                        }
                        _b = this.$db.get('SAVE');
                        switch (_b) {
                            case 'INSERT_MULTIPLE': return [3 /*break*/, 1];
                            case 'INSERT': return [3 /*break*/, 3];
                            case 'UPDATE': return [3 /*break*/, 5];
                            case 'INSERT_NOT_EXISTS': return [3 /*break*/, 7];
                            case 'UPDATE_OR_INSERT': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this._createMultiple()];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [4 /*yield*/, this._create()];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [4 /*yield*/, this._update()];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this._insertNotExists()];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [4 /*yield*/, this._updateOrInsert()];
                    case 10: return [2 /*return*/, _c.sent()];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * show columns in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    Database.prototype.showColumns = function (table) {
        if (table === void 0) { table = this.$db.get('TABLE_NAME'); }
        return __awaiter(this, void 0, void 0, function () {
            var sql, rawColumns, columns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SHOW')),
                            "".concat(this.$constants('COLUMNS')),
                            "".concat(this.$constants('FROM')),
                            "`".concat(table.replace(/\`/g, ''), "`")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        rawColumns = _a.sent();
                        columns = rawColumns.map(function (column) { return column.Field; });
                        return [2 /*return*/, columns];
                }
            });
        });
    };
    /**
     *
     * show schemas in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    Database.prototype.showSchemas = function (table) {
        if (table === void 0) { table = this.$db.get('TABLE_NAME'); }
        return __awaiter(this, void 0, void 0, function () {
            var sql, raw, schemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SHOW')),
                            "".concat(this.$constants('COLUMNS')),
                            "".concat(this.$constants('FROM')),
                            "`".concat(table.replace(/\`/g, ''), "`")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        raw = _a.sent();
                        schemas = raw.map(function (r) {
                            var schema = [];
                            schema.push("".concat(r.Field));
                            schema.push("".concat(r.Type));
                            if (r.Null === 'YES') {
                                schema.push("NULL");
                            }
                            if (r.Null === 'NO') {
                                schema.push("NOT NULL");
                            }
                            if (r.Key === 'PRI') {
                                schema.push("PRIMARY KEY");
                            }
                            if (r.Key === 'UNI') {
                                schema.push("UNIQUE");
                            }
                            if (r.Default) {
                                schema.push("DEFAULT '".concat(r.Default, "'"));
                            }
                            if (r.Extra) {
                                schema.push("".concat(r.Extra.toUpperCase()));
                            }
                            return schema.join(' ');
                        });
                        return [2 /*return*/, schemas];
                }
            });
        });
    };
    /**
     *
     * show values in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    Database.prototype.showValues = function (table) {
        if (table === void 0) { table = this.$db.get('TABLE_NAME'); }
        return __awaiter(this, void 0, void 0, function () {
            var sql, raw, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            '*',
                            "".concat(this.$constants('FROM')),
                            "`".concat(table.replace(/\`/g, ''), "`")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        raw = _a.sent();
                        values = raw.map(function (value) {
                            return "(".concat(Object.values(value).map(function (v) {
                                return v == null ? 'NULL' : "'".concat(v, "'");
                            }).join(','), ")");
                        });
                        return [2 /*return*/, values];
                }
            });
        });
    };
    /**
     *
     * backup database intro new database same server or to another server
     * @param {Object} backupOptions
     * @param {string} backup.database
     * @param {object?} backup.connection
     * @param {string} backup.connection.host
     * @param {number} backup.connection.port
     * @param {string} backup.connection.database
     * @param {string} backup.connection.username
     * @param {string} backup.connection.password

     * @return {Promise<boolean>}
     */
    Database.prototype.backup = function (_a) {
        var database = _a.database, connection = _a.connection;
        return __awaiter(this, void 0, void 0, function () {
            var tables, backup, tables_1, tables_1_1, t, table, schemas, createTableSQL, values, valueSQL, columns, e_1_1, backup_1, backup_1_1, b, e_2_1;
            var e_1, _b, e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._queryStatement('SHOW TABLES')];
                    case 1:
                        tables = _d.sent();
                        backup = [];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 10, 11, 12]);
                        tables_1 = __values(tables), tables_1_1 = tables_1.next();
                        _d.label = 3;
                    case 3:
                        if (!!tables_1_1.done) return [3 /*break*/, 9];
                        t = tables_1_1.value;
                        table = String(Object.values(t).shift());
                        return [4 /*yield*/, this.showSchemas(table)];
                    case 4:
                        schemas = _d.sent();
                        createTableSQL = [
                            "".concat(this.$constants('CREATE_TABLE_NOT_EXISTS')),
                            "`".concat(database, ".").concat(table, "`"),
                            "(".concat(schemas.join(','), ")"),
                            "".concat(this.$constants('ENGINE')),
                        ];
                        return [4 /*yield*/, this.showValues(table)];
                    case 5:
                        values = _d.sent();
                        valueSQL = [];
                        if (!values.length) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.showColumns(table)];
                    case 6:
                        columns = _d.sent();
                        valueSQL = [
                            "".concat(this.$constants('INSERT')),
                            "`".concat(database, ".").concat(table, "`"),
                            "(".concat(columns.map(function (column) { return "`".concat(column, "`"); }).join(','), ")"),
                            "".concat(this.$constants('VALUES'), " ").concat(values.join(','))
                        ];
                        _d.label = 7;
                    case 7:
                        backup = __spreadArray(__spreadArray([], __read(backup), false), [
                            {
                                table: createTableSQL.join(' '),
                                values: valueSQL.join(' '),
                            }
                        ], false);
                        _d.label = 8;
                    case 8:
                        tables_1_1 = tables_1.next();
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (tables_1_1 && !tables_1_1.done && (_b = tables_1.return)) _b.call(tables_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        if (connection != null && Object.keys(connection).length)
                            this.connection(connection);
                        return [4 /*yield*/, this._queryStatement("".concat(this.$constants('CREATE_DATABASE_NOT_EXISTS'), " `").concat(database, "`"))];
                    case 13:
                        _d.sent();
                        _d.label = 14;
                    case 14:
                        _d.trys.push([14, 20, 21, 22]);
                        backup_1 = __values(backup), backup_1_1 = backup_1.next();
                        _d.label = 15;
                    case 15:
                        if (!!backup_1_1.done) return [3 /*break*/, 19];
                        b = backup_1_1.value;
                        return [4 /*yield*/, this._queryStatement(b.table)];
                    case 16:
                        _d.sent();
                        if (!b.values) return [3 /*break*/, 18];
                        return [4 /*yield*/, this._queryStatement(b.values)];
                    case 17:
                        _d.sent();
                        _d.label = 18;
                    case 18:
                        backup_1_1 = backup_1.next();
                        return [3 /*break*/, 15];
                    case 19: return [3 /*break*/, 22];
                    case 20:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 22];
                    case 21:
                        try {
                            if (backup_1_1 && !backup_1_1.done && (_c = backup_1.return)) _c.call(backup_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/, true];
                }
            });
        });
    };
    Database.prototype.backupToFile = function (_a) {
        var filePath = _a.filePath, database = _a.database, connection = _a.connection;
        return __awaiter(this, void 0, void 0, function () {
            var tables, backup, tables_2, tables_2_1, t, table, schemas, createTableSQL, values, valueSQL, columns, e_3_1, sql, backup_2, backup_2_1, b;
            var e_3, _b, e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._queryStatement('SHOW TABLES')];
                    case 1:
                        tables = _d.sent();
                        backup = [];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 10, 11, 12]);
                        tables_2 = __values(tables), tables_2_1 = tables_2.next();
                        _d.label = 3;
                    case 3:
                        if (!!tables_2_1.done) return [3 /*break*/, 9];
                        t = tables_2_1.value;
                        table = String(Object.values(t).shift());
                        return [4 /*yield*/, this.showSchemas(table)];
                    case 4:
                        schemas = _d.sent();
                        createTableSQL = [
                            "".concat(this.$constants('CREATE_TABLE_NOT_EXISTS')),
                            "`".concat(table, "`"),
                            "(".concat(schemas.join(','), ")"),
                            "".concat(this.$constants('ENGINE'), ";"),
                        ];
                        return [4 /*yield*/, this.showValues(table)];
                    case 5:
                        values = _d.sent();
                        valueSQL = [];
                        if (!values.length) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.showColumns(table)];
                    case 6:
                        columns = _d.sent();
                        valueSQL = [
                            "".concat(this.$constants('INSERT')),
                            "`".concat(table, "`"),
                            "(".concat(columns.map(function (column) { return "`".concat(column, "`"); }).join(','), ")"),
                            "".concat(this.$constants('VALUES'), " ").concat(values.join(','), ";")
                        ];
                        _d.label = 7;
                    case 7:
                        backup = __spreadArray(__spreadArray([], __read(backup), false), [
                            {
                                table: createTableSQL.join(' '),
                                values: valueSQL.join(' '),
                            }
                        ], false);
                        _d.label = 8;
                    case 8:
                        tables_2_1 = tables_2.next();
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (tables_2_1 && !tables_2_1.done && (_b = tables_2.return)) _b.call(tables_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        if (connection != null && Object.keys(connection).length)
                            this.connection(connection);
                        sql = [
                            "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";",
                            "START TRANSACTION;",
                            "SET time_zone = \"+00:00\";",
                            "".concat(this.$constants('CREATE_DATABASE_NOT_EXISTS'), " `").concat(database, "`;"),
                            "USE `".concat(database, "`;")
                        ];
                        try {
                            for (backup_2 = __values(backup), backup_2_1 = backup_2.next(); !backup_2_1.done; backup_2_1 = backup_2.next()) {
                                b = backup_2_1.value;
                                sql = __spreadArray(__spreadArray([], __read(sql), false), [b.table], false);
                                if (b.values) {
                                    sql = __spreadArray(__spreadArray([], __read(sql), false), [b.values], false);
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (backup_2_1 && !backup_2_1.done && (_c = backup_2.return)) _c.call(backup_2);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        fs_1.default.writeFileSync(filePath, (0, sql_formatter_1.format)(__spreadArray(__spreadArray([], __read(sql), false), ['COMMIT;'], false).join('\n'), {
                            language: 'spark',
                            tabWidth: 2,
                            keywordCase: 'upper',
                            linesBetweenQueries: 1,
                        }));
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any}
     */
    Database.prototype.faker = function (rows) {
        if (rows === void 0) { rows = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var data, row, sql, fields, columnAndValue, fields_1, fields_1_1, _a, field, type, query;
            var e_5, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data = [];
                        row = 0;
                        _d.label = 1;
                    case 1:
                        if (!(row < rows)) return [3 /*break*/, 4];
                        if (this.$db.get('TABLE_NAME') === '' || this.$db.get('TABLE_NAME') == null)
                            throw new Error("unknow table");
                        sql = [
                            "".concat(this.$constants('SHOW')),
                            "".concat(this.$constants('FIELDS')),
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME'))
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        fields = _d.sent();
                        columnAndValue = {};
                        try {
                            for (fields_1 = (e_5 = void 0, __values(fields)), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                _a = fields_1_1.value, field = _a.Field, type = _a.Type;
                                if (field.toLowerCase() === 'id' || field.toLowerCase() === '_id')
                                    continue;
                                if (field.toLowerCase() === 'uuid')
                                    continue;
                                columnAndValue = __assign(__assign({}, columnAndValue), (_c = {}, _c[field] = this.$utils.faker(type), _c));
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        data = __spreadArray(__spreadArray([], __read(data), false), [columnAndValue], false);
                        _d.label = 3;
                    case 3:
                        row++;
                        return [3 /*break*/, 1];
                    case 4:
                        query = this._queryInsertMultiple(data);
                        this.$db.set('INSERT', "".concat(this.$constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
                        this.$db.set('SAVE', 'INSERT_MULTIPLE');
                        return [2 /*return*/, this.save()];
                }
            });
        });
    };
    /**
     *
     * truncate of table
     * @return {promise<boolean>}
     */
    Database.prototype.truncate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "".concat(this.$constants('TRUNCATE_TABLE'), " ").concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     *
     * drop of table
     * @return {promise<boolean>}
     */
    Database.prototype.drop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "".concat(this.$constants('DROP_TABLE'), " ").concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Database.prototype._queryWhereIsExists = function () {
        return this.$db.get('WHERE').includes(this.$constants('WHERE'));
    };
    Database.prototype._insertNotExists = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, check, _b, result, _c, _d, result_1, id, sql_1, data;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't insert not exists without where condition");
                        sql = '';
                        check = false;
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('EXISTS'), "(").concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE')),
                            "".concat(this.$constants('LIMIT'), " 1)"),
                            "".concat(this.$constants('AS'), " 'exists'")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _b = __read.apply(void 0, [_e.sent(), 1]), result = _b[0].exists;
                        check = !!parseInt(result);
                        _c = check;
                        switch (_c) {
                            case false: return [3 /*break*/, 2];
                            case true: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 2: return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 3:
                        _d = __read.apply(void 0, [_e.sent(), 2]), result_1 = _d[0], id = _d[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_1) return [3 /*break*/, 5];
                        sql_1 = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$constants('WHERE'), " id = ").concat(id);
                        return [4 /*yield*/, this._queryStatement(sql_1)];
                    case 4:
                        data = _e.sent();
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.shift()) || null];
                    case 5: return [2 /*return*/, null];
                    case 6:
                        {
                            return [2 /*return*/, null];
                        }
                        _e.label = 7;
                    case 7:
                        {
                            return [2 /*return*/, null];
                        }
                        _e.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype._setupPool = function () {
        var _this = this;
        var pool = connection_1.Pool;
        return {
            get: function (sql) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.query(sql)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            set: function (newConnection) {
                pool = newConnection;
                return;
            }
        };
    };
    Database.prototype._queryStatement = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.$db.get('DEBUG'))
                            this.$utils.consoleDebug(sql);
                        return [4 /*yield*/, this.$pool.get(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype._actionStatement = function (_a) {
        var _b = _a === void 0 ? {} : _a, sql = _b.sql, _c = _b.returnId, returnId = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var result_2, result, err_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        if (this.$db.get('DEBUG'))
                            this.$utils.consoleDebug(sql);
                        if (!returnId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$pool.get(sql)];
                    case 1:
                        result_2 = _d.sent();
                        return [2 /*return*/, [result_2.affectedRows, result_2.insertId]];
                    case 2: return [4 /*yield*/, this.$pool.get(sql)];
                    case 3:
                        result = (_d.sent()).affectedRows;
                        return [2 /*return*/, result];
                    case 4:
                        err_2 = _d.sent();
                        throw new Error(err_2.message);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype._create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, id, sql, data, result_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), result = _a[0], id = _a[1];
                        if (this.$db.get('TRANSACTION')) {
                            this.$db.get('TRANSACTION').query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result) return [3 /*break*/, 3];
                        sql = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$constants('WHERE'), " id = ").concat(id);
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        data = _b.sent();
                        result_3 = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', result_3);
                        return [2 /*return*/, result_3];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    Database.prototype._createMultiple = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, id, arrayId, arrayId_1, arrayId_1_1, id_1, sql, data, resultData;
            var e_6, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 2]), result = _a[0], id = _a[1];
                        if (!result) return [3 /*break*/, 3];
                        arrayId = __spreadArray([], __read(Array(result)), false).map(function (_, i) { return i + id; });
                        try {
                            for (arrayId_1 = __values(arrayId), arrayId_1_1 = arrayId_1.next(); !arrayId_1_1.done; arrayId_1_1 = arrayId_1.next()) {
                                id_1 = arrayId_1_1.value;
                                if (this.$db.get('TRANSACTION')) {
                                    this.$db.get('TRANSACTION').query.push({
                                        table: this.$db.get('TABLE_NAME'),
                                        id: id_1
                                    });
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (arrayId_1_1 && !arrayId_1_1.done && (_b = arrayId_1.return)) _b.call(arrayId_1);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        sql = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$constants('WHERE'), " id ").concat(this.$constants('IN'), " (").concat(arrayId, ")");
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        data = _c.sent();
                        resultData = data || null;
                        this.$db.set('RESULT', resultData);
                        return [2 /*return*/, resultData];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    Database.prototype._updateOrInsert = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, check, _a, result, _b, _c, result_4, id, sql_2, data, resultData, result_5, data, data_1, data_1_1, val;
            var e_7, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't update or insert without where condition");
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('EXISTS'), "(").concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE')),
                            "".concat(this.$constants('LIMIT'), " 1)"),
                            "".concat(this.$constants('AS'), " 'exists'")
                        ].join(' ');
                        check = false;
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _a = __read.apply(void 0, [_e.sent(), 1]), result = _a[0].exists;
                        check = !!parseInt(result);
                        _b = check;
                        switch (_b) {
                            case false: return [3 /*break*/, 2];
                            case true: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this._actionStatement({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 3:
                        _c = __read.apply(void 0, [_e.sent(), 2]), result_4 = _c[0], id = _c[1];
                        if (this.$db.get('TRANSACTION')) {
                            this.$db.get('TRANSACTION').query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_4) return [3 /*break*/, 5];
                        sql_2 = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id = ").concat(id)
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql_2)];
                    case 4:
                        data = _e.sent();
                        resultData = __assign(__assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$db.set('RESULT', resultData);
                        return [2 /*return*/, resultData];
                    case 5: return [2 /*return*/, null];
                    case 6: return [4 /*yield*/, this._actionStatement({ sql: "".concat(this.$db.get('UPDATE'), " ").concat(this.$db.get('WHERE')) })];
                    case 7:
                        result_5 = _e.sent();
                        if (!result_5) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._queryStatement([
                                "".concat(this.$db.get('SELECT')),
                                "".concat(this.$db.get('FROM')),
                                "".concat(this.$db.get('TABLE_NAME')),
                                "".concat(this.$db.get('WHERE'))
                            ].join(' '))];
                    case 8:
                        data = _e.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                            try {
                                for (data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                                    val = data_1_1.value;
                                    val.action_status = 'update';
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (data_1_1 && !data_1_1.done && (_d = data_1.return)) _d.call(data_1);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            return [2 /*return*/, data || []];
                        }
                        return [2 /*return*/, __assign(__assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'update' }) || null];
                    case 9: return [2 /*return*/, null];
                    case 10:
                        {
                            return [2 /*return*/, null];
                        }
                        _e.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype._update = function (ignoreWhere) {
        if (ignoreWhere === void 0) { ignoreWhere = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result, sql, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.$db.get('WHERE') && !ignoreWhere)
                            throw new Error("Can't update without where condition");
                        return [4 /*yield*/, this._actionStatement({ sql: "".concat(this.$db.get('UPDATE'), " ").concat(this.$db.get('WHERE')) })];
                    case 1:
                        result = _a.sent();
                        if (!result)
                            return [2 /*return*/, null];
                        sql = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE'))
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        data = _a.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                            return [2 /*return*/, data || []];
                        res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', res);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Database.prototype._hiddenColumn = function (data) {
        var _a;
        var hidden = this.$db.get('HIDDEN');
        if ((_a = Object.keys(data)) === null || _a === void 0 ? void 0 : _a.length) {
            hidden.forEach(function (column) {
                data.forEach(function (objColumn) {
                    delete objColumn[column];
                });
            });
        }
        return data;
    };
    Database.prototype._queryUpdate = function (data) {
        var _this = this;
        var keyValue = Object.entries(data).map(function (_a) {
            var _b = __read(_a, 2), column = _b[0], value = _b[1];
            return "".concat(column, " = ").concat(value == null || value === 'NULL'
                ? 'NULL'
                : "'".concat(_this.$utils.covertBooleanToNumber(value), "'"));
        });
        return "".concat(this.$constants('SET'), " ").concat(keyValue);
    };
    Database.prototype._queryInsert = function (data) {
        var _this = this;
        var columns = Object.keys(data).map(function (column) { return "".concat(column); });
        var values = Object.values(data).map(function (value) {
            return "".concat(value == null || value === 'NULL'
                ? 'NULL'
                : "'".concat(_this.$utils.covertBooleanToNumber(value), "'"));
        });
        return "(".concat(columns, ") ").concat(this.$constants('VALUES'), " (").concat(values, ")");
    };
    Database.prototype._queryInsertMultiple = function (data) {
        var e_8, _a;
        var _this = this;
        var _b;
        var values = [];
        try {
            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                var objects = data_2_1.value;
                var vals = Object.values(objects).map(function (value) {
                    return "".concat(value == null || value === 'NULL'
                        ? 'NULL'
                        : "'".concat(_this.$utils.covertBooleanToNumber(value), "'"));
                });
                values.push("(".concat(vals.join(','), ")"));
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var columns = Object.keys((_b = data[0]) !== null && _b !== void 0 ? _b : []).map(function (column) { return "".concat(column); });
        return "(".concat(columns, ") ").concat(this.$constants('VALUES'), " ").concat(values.join(','));
    };
    Database.prototype._valueAndOperator = function (value, operator, useDefault) {
        if (useDefault === void 0) { useDefault = false; }
        if (useDefault)
            return [operator, '='];
        if (operator == null)
            throw new Error('bad arguments');
        if (operator.toUpperCase() === this.$constants('LIKE'))
            operator = operator.toUpperCase();
        return [value, operator];
    };
    Database.prototype._valueTrueFalse = function (value) {
        if (value === true)
            return 1;
        if (value === false)
            return 0;
        return value;
    };
    Database.prototype._queryGenrate = function () {
        var arraySql = [];
        while (true) {
            if (this.$db.get('INSERT')) {
                arraySql = [
                    this.$db.get('INSERT'),
                ];
                break;
            }
            if (this.$db.get('UPDATE')) {
                arraySql = [
                    this.$db.get('UPDATE'),
                    this.$db.get('WHERE'),
                ];
                break;
            }
            if (this.$db.get('DELETE')) {
                arraySql = [
                    this.$db.get('DELETE')
                ];
                break;
            }
            arraySql = [
                this.$db.get('SELECT'),
                this.$db.get('FROM'),
                this.$db.get('TABLE_NAME'),
                this.$db.get('JOIN'),
                this.$db.get('WHERE'),
                this.$db.get('GROUP_BY'),
                this.$db.get('HAVING'),
                this.$db.get('ORDER_BY'),
                this.$db.get('LIMIT'),
                this.$db.get('OFFSET')
            ];
            break;
        }
        var filterSql = arraySql.filter(function (data) { return data !== '' || data != null; });
        var sql = filterSql.join(' ');
        return sql;
    };
    Database.prototype._setupLogger = function () {
        var logger = [];
        return {
            get: function () { return logger; },
            set: function (data) {
                logger = __spreadArray(__spreadArray([], __read(logger), false), [data], false);
                return;
            },
            check: function (data) { return logger.indexOf(data) != -1; }
        };
    };
    Database.prototype._initialConnection = function () {
        this.$pool = this._setupPool();
        this.$logger = this._setupLogger();
        this.$utils = utils_1.default;
        this.$constants = function (name) {
            var e_9, _a;
            if (!name)
                return constants_1.default;
            try {
                for (var _b = __values(Object === null || Object === void 0 ? void 0 : Object.entries(constants_1.default)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), index = _d[0], constant = _d[1];
                    if (index === name)
                        return constant;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
        };
    };
    return Database;
}(AbstractDatabase_1.default));
exports.Database = Database;
exports.default = Database;
