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
var AbstractDatabase_1 = __importDefault(require("./AbstractDatabase"));
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Database.prototype.except = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.$db.set('EXCEPT', params.length ? params : ['id']);
        return this;
    };
    Database.prototype.only = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.$db.set('ONLY', params);
        return this;
    };
    Database.prototype.distinct = function (column) {
        if (column === void 0) { column = 'id'; }
        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('DISTINCT'), " ").concat(column));
        return this;
    };
    Database.prototype.select = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var select = '*';
        if (params === null || params === void 0 ? void 0 : params.length)
            select = params.join(',');
        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(select));
        return this;
    };
    Database.prototype.where = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        return this;
    };
    Database.prototype.whereId = function (id) {
        var column = 'id';
        var operator = '=';
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(id, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(operator, " '").concat(id, "'"));
        return this;
    };
    Database.prototype.whereEmail = function (email) {
        var column = 'email';
        var operator = '=';
        email = this.$utils().escape(email);
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(email, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(operator, " '").concat(email, "'"));
        return this;
    };
    Database.prototype.whereUser = function (id) {
        var column = 'user_id';
        var operator = '=';
        id = this.$utils().escape(id);
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(id, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(operator, " '").concat(id, "'"));
        return this;
    };
    Database.prototype.orWhere = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('OR'), " ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        return this;
    };
    Database.prototype.whereIn = function (column, arrayValues) {
        var sql = this.$db.get('WHERE');
        if (!Array.isArray(arrayValues))
            throw new Error("[".concat(arrayValues, "] is't array"));
        if (!arrayValues.length)
            arrayValues = ['0'];
        var values = "".concat(arrayValues.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!sql.includes(this.$utils().constants('WHERE'))) {
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(values, ")"));
            return this;
        }
        this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(values, ")"));
        return this;
    };
    Database.prototype.orWhereIn = function (column, arrayValues) {
        var sql = this.$db.get('WHERE');
        if (!Array.isArray(arrayValues))
            throw new Error("[".concat(arrayValues, "] is't array"));
        if (!arrayValues.length)
            arrayValues = ['0'];
        var values = "".concat(arrayValues.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!sql.includes(this.$utils().constants('WHERE'))) {
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(values, ")"));
            return this;
        }
        this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('OR'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(values, ")"));
        return this;
    };
    Database.prototype.whereNotIn = function (column, arrayValues) {
        var sql = this.$db.get('WHERE');
        if (!Array.isArray(arrayValues))
            throw new Error("[".concat(arrayValues, "] is't array"));
        if (!arrayValues.length)
            arrayValues = ['0'];
        var values = "".concat(arrayValues.map(function (value) { return "'".concat(value, "'"); }).join(','));
        if (!sql.includes(this.$utils().constants('WHERE'))) {
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('NOT_IN'), " (").concat(values, ")"));
            return this;
        }
        this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('NOT_IN'), " (").concat(values, ")"));
        return this;
    };
    Database.prototype.whereSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils().escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(subQuery, ")"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(subQuery, ")"));
        return this;
    };
    Database.prototype.whereNotInSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils().escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(subQuery, ")"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('NOT_IN'), " (").concat(subQuery, ")"));
        return this;
    };
    Database.prototype.orWhereSubQuery = function (column, subQuery) {
        var whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils().escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(subQuery, ")"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('OR'), " ").concat(column, " ").concat(this.$utils().constants('IN'), " (").concat(subQuery, ")"));
        return this;
    };
    Database.prototype.whereBetween = function (column, arrayValue) {
        if (!Array.isArray(arrayValue))
            throw new Error("Value is't array");
        if (!arrayValue.length)
            arrayValue = ['0', '0'];
        var _a = __read(arrayValue, 2), value1 = _a[0], value2 = _a[1];
        value1 = this.$utils().escape(value1);
        value2 = this.$utils().escape(value2);
        var sql = this.$db.get('WHERE');
        if (!sql.includes(this.$utils().constants('WHERE'))) {
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('BETWEEN'), " '").concat(value1, "' ").concat(this.$utils().constants('AND'), " '").concat(value2, "'"));
            return this;
        }
        this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('BETWEEN'), " '").concat(value1, "' ").concat(this.$utils().constants('AND'), " '").concat(value2, "'"));
        return this;
    };
    Database.prototype.whereNull = function (column) {
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IS_NULL')));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('IS_NULL')));
        return this;
    };
    Database.prototype.whereNotNull = function (column) {
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(this.$utils().constants('IS_NOT_NULL')));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " ").concat(column, " ").concat(this.$utils().constants('IS_NOT_NULL')));
        return this;
    };
    Database.prototype.whereSensitive = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " BINARY ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " BINARY ").concat(column, " ").concat(operator, " '").concat(value, "'"));
        return this;
    };
    Database.prototype.whereGroupStart = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " (").concat(column, " ").concat(operator, " '").concat(value, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " (").concat(column, " ").concat(operator, " '").concat(value, "'"));
        return this;
    };
    Database.prototype.orWhereGroupStart = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " (").concat(column, " ").concat(operator, " '").concat(value, "'"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('AND'), " (").concat(column, " ").concat(operator, " '").concat(value, "'"));
        return this;
    };
    Database.prototype.whereGroupEnd = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(value, "')"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('OR'), " ").concat(column, " ").concat(operator, " '").concat(value, "')"));
        return this;
    };
    Database.prototype.orWhereGroupEnd = function (column, operator, value) {
        var _a;
        _a = __read(this._valueAndOperator(value, operator, arguments.length === 2), 2), value = _a[0], operator = _a[1];
        value = this.$utils().escape(value);
        value = this._valueTrueFalse(value);
        if (operator === this.$utils().constants('LIKE'))
            value = "%".concat(value, "%");
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE')))
            this.$db.set('WHERE', "".concat(this.$utils().constants('WHERE'), " ").concat(column, " ").concat(operator, " '").concat(value, "')"));
        else
            this.$db.set('WHERE', "".concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('OR'), " ").concat(column, " ").concat(operator, " '").concat(value, "')"));
        return this;
    };
    Database.prototype.having = function (condition) {
        this.$db.set('HAVING', condition);
        return this;
    };
    Database.prototype.join = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN'))
            this.$db.set('JOIN', "".concat(this.$db.get('JOIN'), " ").concat(this.$utils().constants('INNER_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        else
            this.$db.set('JOIN', "".concat(this.$utils().constants('INNER_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        return this;
    };
    Database.prototype.rightJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN'))
            this.$db.set('JOIN', "".concat(this.$db.get('JOIN'), " ").concat(this.$utils().constants('RIGHT_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        else
            this.$db.set('JOIN', "".concat(this.$utils().constants('RIGHT_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        return this;
    };
    Database.prototype.leftJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN'))
            this.$db.set('JOIN', "".concat(this.$db.get('JOIN'), " ").concat(this.$utils().constants('LEFT_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        else
            this.$db.set('JOIN', "".concat(this.$utils().constants('LEFT_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        return this;
    };
    Database.prototype.crossJoin = function (pk, fk) {
        var _a;
        var table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$db.get('JOIN'))
            this.$db.set('JOIN', "".concat(this.$db.get('JOIN'), " ").concat(this.$utils().constants('CROSS_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        else
            this.$db.set('JOIN', "".concat(this.$utils().constants('CROSS_JOIN'), " ").concat(table, " ").concat(this.$utils().constants('ON'), " ").concat(pk, " = ").concat(fk));
        return this;
    };
    Database.prototype.orderBy = function (column, order) {
        if (order === void 0) { order = this.$utils().constants('ASC'); }
        this.$db.set('ORDER_BY', "".concat(this.$utils().constants('ORDER_BY'), " ").concat(column, " ").concat(order.toUpperCase()));
        return this;
    };
    Database.prototype.latest = function (column) {
        if (column === void 0) { column = 'id'; }
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', "".concat(this.$db.get('ORDER_BY'), " ,").concat(column, " ").concat(this.$utils().constants('DESC')));
            return this;
        }
        this.$db.set('ORDER_BY', "".concat(this.$utils().constants('ORDER_BY'), " ").concat(column, " ").concat(this.$utils().constants('DESC')));
        return this;
    };
    Database.prototype.oldest = function (column) {
        if (column === void 0) { column = 'id'; }
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', "".concat(this.$db.get('ORDER_BY'), " ,").concat(column, " ").concat(this.$utils().constants('ASC')));
            return this;
        }
        this.$db.set('ORDER_BY', "".concat(this.$utils().constants('ORDER_BY'), " ").concat(column, " ").concat(this.$utils().constants('ASC')));
        return this;
    };
    Database.prototype.groupBy = function (column) {
        this.$db.set('GROUP_BY', "".concat(this.$utils().constants('GROUP_BY'), " ").concat(column));
        return this;
    };
    Database.prototype.limit = function (number) {
        if (number === void 0) { number = 1; }
        this.$db.set('LIMIT', "".concat(this.$utils().constants('LIMIT'), " ").concat(number));
        return this;
    };
    Database.prototype.offset = function (number) {
        if (number === void 0) { number = 1; }
        this.$db.set('OFFSET', "".concat(this.$utils().constants('OFFSET'), " ").concat(number));
        return this;
    };
    Database.prototype.hidden = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        this.$db.set('HIDDEN', columns);
        return this;
    };
    Database.prototype.update = function (objects) {
        var query = this._queryUpdate(objects);
        this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'UPDATE');
        return this;
    };
    Database.prototype.insert = function (objects) {
        var query = this._queryInsert(objects);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    Database.prototype.create = function (objects) {
        var query = this._queryInsert(objects);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    Database.prototype.createMultiple = function (data) {
        var query = this._queryInsertMultiple(data);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    Database.prototype.insertMultiple = function (data) {
        var query = this._queryInsertMultiple(data);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    Database.prototype.toString = function () {
        return this._getSQL();
    };
    Database.prototype.toSQL = function () {
        return this._getSQL();
    };
    Database.prototype.debug = function (debug) {
        if (debug === void 0) { debug = true; }
        this.$db.set('DEBUG', debug);
        return this;
    };
    Database.prototype.dump = function (debug) {
        if (debug === void 0) { debug = true; }
        this.$db.set('DEBUG', debug);
        return this;
    };
    Database.prototype.dd = function (debug) {
        if (debug === void 0) { debug = true; }
        this.$db.set('DEBUG', debug);
        return this;
    };
    Database.prototype.createNotExists = function (objects) {
        var query = this._queryInsert(objects);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
        this.$db.set('SAVE', 'INSERT_NOT_EXISTS');
        return this;
    };
    Database.prototype.insertNotExists = function (objects) {
        this.createNotExists(objects);
        return this;
    };
    Database.prototype.upsert = function (objects) {
        var queryUpdate = this._queryUpdate(objects);
        var queryInsert = this._queryInsert(objects);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(queryInsert));
        this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(queryUpdate));
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    };
    Database.prototype.updateOrCreate = function (objects) {
        var queryUpdate = this._queryUpdate(objects);
        var queryInsert = this._queryInsert(objects);
        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(queryInsert));
        this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(queryUpdate));
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    };
    Database.prototype.updateOrInsert = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
    Database.prototype.insertOrUpdate = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
    Database.prototype.createOrUpdate = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
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
    Database.prototype.increment = function (column, value) {
        if (column === void 0) { column = 'id'; }
        if (value === void 0) { value = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "".concat(this.$utils().constants('SET'), " ").concat(column, " = ").concat(column, " + ").concat(value);
                        this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
                        return [4 /*yield*/, this._update(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.decrement = function (column, value) {
        if (column === void 0) { column = 'id'; }
        if (value === void 0) { value = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "".concat(this.$utils().constants('SET'), " ").concat(column, " = ").concat(column, " - ").concat(value);
                        this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
                        return [4 /*yield*/, this._update(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "".concat(this.$utils().constants('SELECT'), " * ").concat(this.$utils().constants('FROM'), " ").concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "".concat(this.$utils().constants('SELECT'), " * ").concat(this.$utils().constants('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id = ").concat(id);
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.shift()) || null];
                }
            });
        });
    };
    Database.prototype.pagination = function (_a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.limit, limit = _d === void 0 ? 15 : _d, _e = _c.page, page = _e === void 0 ? 1 : _e;
        return __awaiter(this, void 0, void 0, function () {
            var currentPage, nextPage, prevPage, offset, sql, result, count, total, lastPage;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        currentPage = page;
                        nextPage = currentPage + 1;
                        prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
                        offset = (page - 1) * limit;
                        sql = this._getSQL();
                        if (!sql.includes(this.$utils().constants('LIMIT'))) {
                            sql = "".concat(sql, " ").concat(this.$utils().constants('LIMIT'), " ").concat(limit, " ").concat(this.$utils().constants('OFFSET'), " ").concat(offset);
                        }
                        else {
                            sql = sql.replace(this.$db.get('LIMIT'), "".concat(limit, " ").concat(this.$utils().constants('OFFSET'), " ").concat(offset));
                        }
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _f.sent();
                        if ((_b = this.$db.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
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
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('COUNT'), "(*) ").concat(this.$utils().constants('AS'), " total"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        count = _f.sent();
                        total = count.shift().total || 0;
                        lastPage = Math.ceil(total / limit) || 0;
                        lastPage = lastPage > 1 ? lastPage : 1;
                        return [2 /*return*/, {
                                meta: {
                                    total: total,
                                    limit: limit,
                                    current_page: currentPage,
                                    last_page: lastPage,
                                    next_page: nextPage,
                                    prev_page: prevPage
                                },
                                data: result
                            }];
                }
            });
        });
    };
    Database.prototype.paginate = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.limit, limit = _c === void 0 ? 15 : _c, _d = _b.page, page = _d === void 0 ? 1 : _d;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.pagination({ limit: limit, page: page })];
                    case 1: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    Database.prototype.first = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._getSQL();
                        if (!sql.includes(this.$utils().constants('LIMIT')))
                            sql = "".concat(sql, " ").concat(this.$utils().constants('LIMIT'), " 1");
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), "".concat(this.$utils().constants('LIMIT'), " 1"));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        return [2 /*return*/, result.shift() || null];
                }
            });
        });
    };
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
    Database.prototype.get = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        return [2 /*return*/, result || []];
                }
            });
        });
    };
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
    Database.prototype.toJSON = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _b.sent();
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumn(result);
                        return [2 /*return*/, JSON.stringify(result) || []];
                }
            });
        });
    };
    Database.prototype.toArray = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, toArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(column));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        toArray = result.map(function (data) { return data[column]; });
                        return [2 /*return*/, toArray];
                }
            });
        });
    };
    Database.prototype.count = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('COUNT'), "(").concat(column, ") ").concat(this.$utils().constants('AS'), " total"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift().total || 0];
                }
            });
        });
    };
    Database.prototype.exists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('EXISTS'), "(").concat(this.$utils().constants('SELECT'), " * ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE'), " LIMIT 1) as 'exists'");
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!result.shift().exists || false];
                }
            });
        });
    };
    Database.prototype.avg = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('AVG'), "(").concat(column, ") ").concat(this.$utils().constants('AS'), " avg"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift().avg || 0];
                }
            });
        });
    };
    Database.prototype.sum = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('SUM'), "(").concat(column, ") ").concat(this.$utils().constants('AS'), " sum"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift().sum || 0];
                }
            });
        });
    };
    Database.prototype.max = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('MAX'), "(").concat(column, ") ").concat(this.$utils().constants('AS'), " max"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift().max || 0];
                }
            });
        });
    };
    Database.prototype.min = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('MIN'), "(").concat(column, ") ").concat(this.$utils().constants('AS'), " min"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift().min || 0];
                }
            });
        });
    };
    Database.prototype.delete = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't delete without where condition");
                        this.$db.set('DELETE', "".concat(this.$utils().constants('DELETE'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE')));
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
    Database.prototype.getGroupBy = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results, data, sqlGroups, groups, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('GROUP_BY', "".concat(this.$utils().constants('GROUP_BY'), " ").concat(column));
                        this.$db.set('SELECT', this.$db.get('SELECT') + ", ".concat(this.$utils().constants('GROUP_CONCAT'), "(id) ").concat(this.$utils().constants('AS'), " data"));
                        sql = this._getSQL();
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        results = _a.sent();
                        data = [];
                        results.forEach(function (result) {
                            var _a, _b;
                            var splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                            splits.forEach(function (split) { return data = __spreadArray(__spreadArray([], __read(data), false), [split], false); });
                        });
                        sqlGroups = "".concat(this.$utils().constants('SELECT'), " * ").concat(this.$utils().constants('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id ").concat(this.$utils().constants('IN'), " (").concat(data.map(function (a) { return "'".concat(a, "'"); }).join(',') || ['0'], ")");
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
    Database.prototype.save = function (transaction) {
        var _a;
        if (transaction === void 0) { transaction = { query: [{ table: '', id: '' }] }; }
        return __awaiter(this, void 0, void 0, function () {
            var attributes, query_1, query, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.$db.set('TRANSACTION', transaction);
                        attributes = this.$attributes;
                        if ((_a = Object.keys(attributes)) === null || _a === void 0 ? void 0 : _a.length) {
                            if (this.$db.get('WHERE')) {
                                query_1 = this._queryUpdate(attributes);
                                this.$db.set('UPDATE', "".concat(this.$utils().constants('UPDATE'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query_1));
                                this.$db.set('SAVE', 'UPDATE');
                                return [2 /*return*/];
                            }
                            query = this._queryInsert(attributes);
                            this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
                            this.$db.set('SAVE', 'INSERT');
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
    Database.prototype.faker = function (rounds) {
        if (rounds === void 0) { rounds = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var data, round, sql, fields, columnAndValue, fields_1, fields_1_1, _a, field, type, query;
            var e_1, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data = [];
                        round = 0;
                        _d.label = 1;
                    case 1:
                        if (!(round < rounds)) return [3 /*break*/, 4];
                        if (this.$db.get('TABLE_NAME') === '' || this.$db.get('TABLE_NAME') == null)
                            throw new Error("unknow table");
                        sql = "".concat(this.$utils().constants('SHOW'), " ").concat(this.$utils().constants('FIELDS'), " ").concat(this.$utils().constants('FROM'), " ").concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 2:
                        fields = _d.sent();
                        columnAndValue = {};
                        try {
                            for (fields_1 = (e_1 = void 0, __values(fields)), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                _a = fields_1_1.value, field = _a.Field, type = _a.Type;
                                if (field.toLowerCase() === 'id' || field.toLowerCase() === '_id')
                                    continue;
                                if (!this.$db.get('UUID') && field.toLowerCase() === 'uuid')
                                    continue;
                                columnAndValue = __assign(__assign({}, columnAndValue), (_c = {}, _c[field] = this.$utils().faker(type), _c));
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        data = __spreadArray(__spreadArray([], __read(data), false), [columnAndValue], false);
                        _d.label = 3;
                    case 3:
                        round++;
                        return [3 /*break*/, 1];
                    case 4:
                        query = this._queryInsertMultiple(data);
                        this.$db.set('INSERT', "".concat(this.$utils().constants('INSERT'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(query));
                        this.$db.set('SAVE', 'INSERT_MULTIPLE');
                        return [2 /*return*/, this.save()];
                }
            });
        });
    };
    Database.prototype.truncate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "TRUNCATE TABLE ".concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Database.prototype.drop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "DROP TABLE ".concat(this.$db.get('TABLE_NAME'));
                        return [4 /*yield*/, this._queryStatement(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
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
                        sql = "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('EXISTS'), "(").concat(this.$utils().constants('SELECT'), " * ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('LIMIT'), " 1) ").concat(this.$utils().constants('AS'), " 'exists'");
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
                        sql_1 = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id = ").concat(id);
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
    Database.prototype._queryStatement = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var CONNECTION, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (this.$db.get('DEBUG'))
                            this.$utils().consoleDebug(sql);
                        return [4 /*yield*/, this.$utils().connection()];
                    case 1:
                        CONNECTION = _a.sent();
                        return [4 /*yield*/, CONNECTION.query(sql)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype._actionStatement = function (_a) {
        var _b = _a === void 0 ? {} : _a, sql = _b.sql, _c = _b.returnId, returnId = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var CONNECTION, result_2, result, err_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.$utils().connection()];
                    case 1:
                        CONNECTION = _d.sent();
                        if (this.$db.get('DEBUG'))
                            this.$utils().consoleDebug(sql);
                        if (!returnId) return [3 /*break*/, 3];
                        return [4 /*yield*/, CONNECTION.query(sql)];
                    case 2:
                        result_2 = _d.sent();
                        return [2 /*return*/, [result_2.affectedRows, result_2.insertId]];
                    case 3: return [4 /*yield*/, CONNECTION.query(sql)];
                    case 4:
                        result = (_d.sent()).affectedRows;
                        return [2 /*return*/, result];
                    case 5:
                        err_2 = _d.sent();
                        throw new Error(err_2.message);
                    case 6: return [2 /*return*/];
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
                        sql = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id = ").concat(id);
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
            var e_2, _b;
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
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (arrayId_1_1 && !arrayId_1_1.done && (_b = arrayId_1.return)) _b.call(arrayId_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        sql = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id ").concat(this.$utils().constants('IN'), " (").concat(arrayId, ")");
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
            var e_3, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't update or insert without where condition");
                        sql = '';
                        check = false;
                        sql = "".concat(this.$utils().constants('SELECT'), " ").concat(this.$utils().constants('EXISTS'), "(").concat(this.$utils().constants('SELECT'), " * ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE'), " ").concat(this.$utils().constants('LIMIT'), " 1) ").concat(this.$utils().constants('AS'), " 'exists'");
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
                        sql_2 = "".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$utils().constants('WHERE'), " id = ").concat(id);
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
                        return [4 /*yield*/, this._queryStatement("".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE')))];
                    case 8:
                        data = _e.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                            try {
                                for (data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                                    val = data_1_1.value;
                                    val.action_status = 'update';
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (data_1_1 && !data_1_1.done && (_d = data_1.return)) _d.call(data_1);
                                }
                                finally { if (e_3) throw e_3.error; }
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
            var result, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.$db.get('WHERE') && !ignoreWhere)
                            throw new Error("Can't update without where condition");
                        return [4 /*yield*/, this._actionStatement({ sql: "".concat(this.$db.get('UPDATE'), " ").concat(this.$db.get('WHERE')) })];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._queryStatement("".concat(this.$db.get('SELECT'), " ").concat(this.$db.get('FROM'), " ").concat(this.$db.get('TABLE_NAME'), " ").concat(this.$db.get('WHERE')))];
                    case 2:
                        data = _a.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                            return [2 /*return*/, data || []];
                        res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', res);
                        return [2 /*return*/, res];
                    case 3: return [2 /*return*/, null];
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
            return "".concat(column, " = ").concat(value == null || value === 'NULL' ?
                'NULL' :
                "'".concat(_this.$utils().covertBooleanToNumber(value), "'"));
        });
        return "".concat(this.$utils().constants('SET'), " ").concat(keyValue);
    };
    Database.prototype._queryInsert = function (data) {
        var _this = this;
        var columns = Object.keys(data).map(function (column) { return "".concat(column); });
        var values = Object.values(data).map(function (value) {
            return "".concat(value == null || value === 'NULL' ?
                'NULL' :
                "'".concat(_this.$utils().covertBooleanToNumber(value), "'"));
        });
        return "(".concat(columns, ") ").concat(this.$utils().constants('VALUES'), " (").concat(values, ")");
    };
    Database.prototype._queryInsertMultiple = function (data) {
        var e_4, _a;
        var _this = this;
        var _b;
        var values = [];
        try {
            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                var objects = data_2_1.value;
                var vals = Object.values(objects).map(function (value) {
                    return "".concat(value == null || value === 'NULL' ?
                        'NULL' :
                        "'".concat(_this.$utils().covertBooleanToNumber(value), "'"));
                });
                values.push("(".concat(vals.join(','), ")"));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var columns = Object.keys((_b = data[0]) !== null && _b !== void 0 ? _b : []).map(function (column) { return "".concat(column); });
        return "(".concat(columns, ") ").concat(this.$utils().constants('VALUES'), " ").concat(values.join(','));
    };
    Database.prototype._valueAndOperator = function (value, operator, useDefault) {
        if (useDefault === void 0) { useDefault = false; }
        if (useDefault)
            return [operator, '='];
        if (operator === this.$utils().constants('LIKE'))
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
    Database.prototype._getSQL = function () {
        var arraySql = [];
        if (this.$db.get('INSERT')) {
            arraySql = [
                this.$db.get('INSERT'),
            ];
        }
        else if (this.$db.get('UPDATE')) {
            arraySql = [
                this.$db.get('UPDATE'),
                this.$db.get('WHERE'),
            ];
        }
        else if (this.$db.get('DELETE')) {
            arraySql = [
                this.$db.get('DELETE')
            ];
        }
        else {
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
        }
        var filterSql = arraySql.filter(function (data) { return data !== ''; });
        var sql = filterSql.join(' ');
        return sql;
    };
    return Database;
}(AbstractDatabase_1.default));
exports.default = Database;
