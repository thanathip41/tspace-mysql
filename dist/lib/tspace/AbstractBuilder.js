"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractBuilder = void 0;
class AbstractBuilder {
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
exports.AbstractBuilder = AbstractBuilder;
exports.default = AbstractBuilder;
