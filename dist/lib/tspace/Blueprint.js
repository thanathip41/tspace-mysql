"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blueprint = void 0;
var Blueprint = /** @class */ (function () {
    function Blueprint() {
        this.type = '';
        this.attrbuites = [];
    }
    Blueprint.prototype._addAssignType = function (type) {
        if (this.type)
            return this;
        this.type = type;
        return this;
    };
    Blueprint.prototype._addAssignAttrbuite = function (attrbuite) {
        this.attrbuites = __spreadArray(__spreadArray([], __read(this.attrbuites), false), [attrbuite], false);
        return this;
    };
    Blueprint.prototype.int = function () {
        this._addAssignType('INT');
        return this;
    };
    /**
     * Assign type
     * @param {number}
     */
    Blueprint.prototype.tinyInt = function (n) {
        if (n === void 0) { n = 1; }
        this._addAssignType("TINYINT(".concat(n, ")"));
        return this;
    };
    /**
     * Assign type
     * @param {number}
     */
    Blueprint.prototype.bigInt = function (n) {
        if (n === void 0) { n = 10; }
        this._addAssignType("BIGINT(".concat(n, ")"));
        return this;
    };
    /**
     * Assign type
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     */
    Blueprint.prototype.double = function (length, decimal) {
        if (length === void 0) { length = 0; }
        if (decimal === void 0) { decimal = 0; }
        if (!length || !decimal) {
            this._addAssignType("DOUBLE");
            return this;
        }
        this._addAssignType("DOUBLE(".concat(length, ",").concat(decimal, ")"));
        return this;
    };
    /**
     * Assign type
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     */
    Blueprint.prototype.float = function (length, decimal) {
        if (length === void 0) { length = 0; }
        if (decimal === void 0) { decimal = 0; }
        if (!length || !decimal) {
            this._addAssignType("FLOAT");
            return this;
        }
        this._addAssignType("FLOAT(".concat(length, ",").concat(decimal, ")"));
        return this;
    };
    /**
     * Assign type
     * @param {number} length string between 1-255
     */
    Blueprint.prototype.varchar = function (n) {
        if (n === void 0) { n = 100; }
        if (n > 255)
            n = 255;
        this._addAssignType("VARCHAR(".concat(n, ")"));
        return this;
    };
    /**
     * Assign type
     * @param {number} length string between 1-255
     */
    Blueprint.prototype.char = function (n) {
        if (n === void 0) { n = 1; }
        this._addAssignType("CHAR(".concat(n, ")"));
        return this;
    };
    Blueprint.prototype.longText = function () {
        this._addAssignType("LONGTEXT");
        return this;
    };
    Blueprint.prototype.mediumText = function () {
        this._addAssignType("MEDIUMTEXT");
        return this;
    };
    Blueprint.prototype.tinyText = function () {
        this._addAssignType("TINYTEXT");
        return this;
    };
    Blueprint.prototype.text = function () {
        this._addAssignType("TEXT");
        return this;
    };
    /**
     * Assign type
     * @param {...string} enum n1, n2, n3, ...n
     */
    Blueprint.prototype.enum = function () {
        var enums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            enums[_i] = arguments[_i];
        }
        this._addAssignType("ENUM('".concat(enums, "')"));
        return this;
    };
    Blueprint.prototype.date = function () {
        this._addAssignType("DATE");
        return this;
    };
    Blueprint.prototype.dateTime = function () {
        this._addAssignType("DATETIME");
        return this;
    };
    Blueprint.prototype.timestamp = function () {
        this._addAssignType("TIMESTAMP");
        return this;
    };
    Blueprint.prototype.unsigned = function () {
        this._addAssignAttrbuite("UNSIGNED");
        return this;
    };
    Blueprint.prototype.unique = function () {
        this._addAssignAttrbuite("UNIQUE");
        return this;
    };
    Blueprint.prototype.null = function () {
        this._addAssignAttrbuite("NULL");
        return this;
    };
    Blueprint.prototype.notNull = function () {
        this._addAssignAttrbuite("NOT NULL");
        return this;
    };
    Blueprint.prototype.primary = function () {
        this._addAssignAttrbuite("PRIMARY KEY");
        return this;
    };
    /**
     * Assign attrbuites
     * @param {string | number} default value
     */
    Blueprint.prototype.default = function (n) {
        this._addAssignAttrbuite("DEFAULT '".concat(n, "'"));
        return this;
    };
    Blueprint.prototype.defaultTimestamp = function () {
        this._addAssignAttrbuite("DEFAULT CURRENT_TIMESTAMP");
        return this;
    };
    Blueprint.prototype.autoIncrement = function () {
        this._addAssignAttrbuite("AUTO_INCREMENT");
        return this;
    };
    return Blueprint;
}());
exports.Blueprint = Blueprint;
exports.default = Blueprint;
