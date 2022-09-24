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
var timestamp = function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var date = ("0" + d.getDate()).slice(-2);
    var hours = ("0" + d.getHours()).slice(-2);
    var minutes = ("0" + d.getMinutes()).slice(-2);
    var seconds = ("0" + d.getSeconds()).slice(-2);
    var now = "".concat(year, "-").concat(month, "-").concat(date, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
    return now;
};
var date = function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var date = ("0" + d.getDate()).slice(-2);
    var now = "".concat(year, "-").concat(month, "-").concat(date);
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
                name = name.replace(matche, "_".concat(matche.toUpperCase()));
        });
    }
    return "".concat(name.toLocaleLowerCase());
};
var generateUUID = function () {
    var date = +new Date();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        r = (date + r) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
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
            var newName = oldName.replace(/([A-Z])/g, function (str) { return "_".concat(str.toLowerCase()); });
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
var consoleDebug = function (debug) {
    if (debug == null)
        return;
    console.log("SQL Statement: \u001B[33m".concat(debug, " \u001B[0m "));
};
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
    columnRelation: columnRelation,
    timestamp: timestamp,
    date: date,
    escape: escape,
    escapeSubQuery: escapeSubQuery,
    generateUUID: generateUUID,
    covertBooleanToNumber: covertBooleanToNumber,
    snakeCase: snakeCase,
    camelCase: camelCase
};
