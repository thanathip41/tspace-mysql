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
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyHandler = void 0;
var Logger_1 = require("./Logger");
var proxyHandler = {
    set: function (self, name, value) {
        var _a;
        var _b;
        if ((_b = self.$setters) === null || _b === void 0 ? void 0 : _b.includes(name))
            throw new Error("no allow to set this ".concat(name));
        self.$attributes = __assign(__assign({}, self.$attributes), (_a = {}, _a[name] = value, _a));
        return true;
    },
    get: function (self, prop, value) {
        var _a, _b, _c, _d;
        try {
            new Logger_1.Logger(self, prop);
            switch (prop) {
                case 'tableName': return (_b = (_a = self.$db) === null || _a === void 0 ? void 0 : _a.get('TABLE_NAME')) === null || _b === void 0 ? void 0 : _b.replace(/`/g, '');
                case 'attributes': return self["$".concat(prop)];
                case 'logger': return (_c = self.$logger) === null || _c === void 0 ? void 0 : _c.get();
                case 'result': return (_d = self.$db) === null || _d === void 0 ? void 0 : _d.get('RESULT');
                default: return Reflect.get(self, prop, value);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
};
exports.proxyHandler = proxyHandler;
exports.default = proxyHandler;
