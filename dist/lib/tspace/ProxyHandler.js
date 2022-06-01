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
var Logger_1 = require("./Logger");
exports.default = {
    set: function (target, name, value) {
        var _a;
        var _b;
        if ((_b = target._setters) === null || _b === void 0 ? void 0 : _b.includes(name))
            throw new Error("no allow to set this ".concat(name));
        target.$attributes = __assign(__assign({}, target.$attributes), (_a = {}, _a[name] = value, _a));
        return true;
    },
    get: function (target, prop, value) {
        var _a, _b;
        try {
            (0, Logger_1.LoggerMethod)(target, prop);
            switch (prop) {
                case 'attributes': return target["$".concat(prop)];
                case 'logger': return (_a = target.$logger) === null || _a === void 0 ? void 0 : _a.get();
                case 'result': return (_b = target.$db) === null || _b === void 0 ? void 0 : _b.get('RESULT');
                default: return Reflect.get(target, prop, value);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
};
