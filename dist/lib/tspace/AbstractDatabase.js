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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("../utils"));
var AbstractDatabase = /** @class */ (function () {
    function AbstractDatabase() {
        this._setters = [
            '$attributes',
            '$logger',
            '$utils',
            '$db'
        ];
        this.$utils = function () {
            return __assign({}, utils_1.default);
        };
        this.$db = {
            get: function (key) { },
            set: function (key, value) { }
        };
        this.$logger = {
            get: function () { },
            set: function (value) { },
            check: function (value) {
                return true || false;
            }
        };
        this.$attributes = {};
    }
    return AbstractDatabase;
}());
exports.default = AbstractDatabase;
