"use strict";
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
var constant_1 = __importDefault(require("./constant"));
var connections_1 = __importDefault(require("../connections"));
var timestamp = function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var date = ("0" + d.getDate()).slice(-2);
    var hours = ("0" + d.getHours()).slice(-2);
    var minutes = ("0" + d.getMinutes()).slice(-2);
    var seconds = ("0" + d.getSeconds()).slice(-2);
    var now = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return now;
};
var date = function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var date = ("0" + d.getDate()).slice(-2);
    var now = year + "-" + month + "-" + date;
    return now;
};
var escape = function (str) {
    try {
        var check = str == null || str === true || str === false || Number.isInteger(str);
        if (check)
            return str;
        var regx = /[`+#$&*=;'"\\|,\?~]/;
        var res = str.split(regx).join("");
        var regxs = ['DROP TABLE', 'UPDATE ', 'DELETE FROM ', 'OR ', 'SELECT ', 'FROM ', 'WHERE '];
        for (var i in regxs) {
            if (res.includes(regxs[i])) {
                res = res.split(regxs[i]).join("");
            }
        }
        return res;
    }
    catch (e) {
        return str;
    }
};
var escapeSubQuery = function (str) {
    var check = str == null || str === true || str === false || Number.isInteger(str);
    if (check)
        return str;
    var regx = /[`+#$&;"\\|\?~]/;
    var res = str.split(regx).join("");
    var regxs = ['DROP TABLE', 'UPDATE ', 'DELETE FROM ', 'TRUNCATE'];
    for (var i in regxs) {
        if (res.includes(regxs[i])) {
            res = res.split(regxs[i]).join("");
        }
    }
    return res;
};
var columnRelation = function (name) {
    var _a;
    var matches = (_a = name === null || name === void 0 ? void 0 : name.match(/[A-Z]/g)) !== null && _a !== void 0 ? _a : [];
    if (matches.length > 1) {
        matches.forEach(function (matche, i) {
            if (i > 0)
                name = name.replace(matche, "_" + matche.toUpperCase());
        });
    }
    return "" + name.toLocaleLowerCase();
};
var generateUUID = function () {
    var date = +new Date();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        r = (date + r) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
var constants = function (name) {
    var e_1, _a;
    if (!name)
        return constant_1.default;
    try {
        for (var _b = __values(Object === null || Object === void 0 ? void 0 : Object.entries(constant_1.default)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), index = _d[0], _const = _d[1];
            if (index === name)
                return _const;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
var tableName = function (name) {
    var tb = name.replace(/([A-Z])/g, function (str) { return "_" + str.toLowerCase(); }).slice(1);
    var lastString = tb.slice(-1);
    var rule = ['s', 'ss', 'sh', 'ch', 'x', 'z'];
    if (lastString === 'y') {
        tb = tb.slice(0, -1) + 'ies';
    }
    else {
        var checkRule = rule.indexOf(lastString) >= 0;
        var word = checkRule ? 'es' : 's';
        tb = tb + word;
    }
    return tb;
};
var covertBooleanToNumber = function (data) {
    if (Object.prototype.toString.apply(data).slice(8, -1) === 'Boolean')
        return +data;
    return data;
};
var snakeCase = function (obj) {
    try {
        if (typeof (obj) !== "object")
            return obj;
        Object.entries(obj).forEach(function (_a) {
            var _b;
            var _c = __read(_a, 2), oldName = _c[0], _ = _c[1];
            var newName = oldName.replace(/([A-Z])/g, function (str) { return "_" + str.toLowerCase(); });
            if (newName !== oldName) {
                if (obj.hasOwnProperty(oldName)) {
                    obj = __assign(__assign({}, obj), (_b = {}, _b[newName] = obj[oldName], _b));
                    delete obj[oldName];
                }
            }
            if (typeof (obj[newName]) === "object")
                obj[newName] = snakeCase(obj[newName]);
        });
        return obj;
    }
    catch (e) {
        return obj;
    }
};
var camelCase = function (obj) {
    try {
        if (typeof (obj) !== "object")
            return obj;
        Object.entries(obj).forEach(function (_a) {
            var _b;
            var _c = __read(_a, 2), oldName = _c[0], _ = _c[1];
            var newName = oldName.replace(/(.(\_|-|\s)+.)/g, function (str) { return str[0] + (str[str.length - 1].toUpperCase()); });
            if (newName !== oldName) {
                if (obj.hasOwnProperty(oldName)) {
                    obj = __assign(__assign({}, obj), (_b = {}, _b[newName] = obj[oldName], _b));
                    delete obj[oldName];
                }
            }
            if (typeof (obj[newName]) === "object")
                obj[newName] = camelCase(obj[newName]);
        });
        return obj;
    }
    catch (e) {
        return obj;
    }
};
var consoleDebug = function (message) {
    if (message == null)
        return;
    console.log("SQL Statement: \u001B[33m" + message + " \u001B[0m ");
};
var connection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connections_1.default];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var faker = function (value) {
    if (!value.search('timestamp'))
        return timestamp();
    if (!value.search('datetime'))
        return timestamp();
    if (!value.search('date'))
        return date();
    if (!value.search('tinyint'))
        return [true, false][Math.round(Math.random())];
    if (!value.search('boolean'))
        return [true, false][Math.round(Math.random())];
    if (!value.search('longtext'))
        return __spreadArray([], __read(Array(50)), false).map(function () { return Math.random().toString(36).substring(7); }).join('');
    if (!value.search('int'))
        return Math.floor(Math.random() * 1000);
    if (!value.search('float'))
        return (Math.random() * 100).toFixed(2);
    if (!value.search('double'))
        return (Math.random() * 100).toFixed(2);
    if (!value.search('varchar'))
        return Buffer.from(Math.random().toString(36).substring(7)).toString('base64');
    return 'fake data';
};
exports.default = {
    consoleDebug: consoleDebug,
    tableName: tableName,
    faker: faker,
    connection: connection,
    columnRelation: columnRelation,
    timestamp: timestamp,
    date: date,
    escape: escape,
    escapeSubQuery: escapeSubQuery,
    generateUUID: generateUUID,
    constants: constants,
    covertBooleanToNumber: covertBooleanToNumber,
    snakeCase: snakeCase,
    camelCase: camelCase
};
