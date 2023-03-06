"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractDatabase {
    constructor() {
        this.$setters = [
            '$attributes',
            '$logger',
            '$utils',
            '$constants',
            '$pool',
            '$state',
        ];
        this.$utils = {};
        this.$constants = (name) => { };
        this.$state = {
            original: () => { },
            get: (key) => { },
            set: (key, value) => { },
            clone: (data) => { }
        };
        this.$pool = {
            query: (sql) => { },
            set: (pool) => { },
            get: () => { }
        };
        this.$logger = {
            get: () => { },
            set: (value) => { },
            check: (value) => true || false
        };
        this.$attributes = null;
    }
}
exports.default = AbstractDatabase;
