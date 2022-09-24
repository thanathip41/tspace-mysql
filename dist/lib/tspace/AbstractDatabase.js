"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDatabase = /** @class */ (function () {
    function AbstractDatabase() {
        this.$setters = [
            '$attributes',
            '$logger',
            '$utils',
            '$constants',
            '$pool',
            '$db'
        ];
        this.$utils = {};
        this.$constants = function (name) { };
        this.$db = {
            get: function (key) { },
            set: function (key, value) { }
        };
        this.$pool = {
            get: function (sql) { },
            set: function (pool) { }
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
