"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractBuilder = void 0;
const State_1 = require("../Handlers/State");
class AbstractBuilder {
    constructor() {
        this.$setters = [
            '$attributes',
            '$logger',
            '$utils',
            '$constants',
            '$pool',
            '$state',
            '$relation'
        ];
        this.$utils = {};
        this.$constants = (name) => { };
        this.$state = new State_1.StateHandler('default');
        this.$pool = {
            query: (sql) => { },
            set: (pool) => { },
            get: () => { }
        };
        this.$logger = {
            get: () => { },
            set: (value) => { },
            reset: () => { },
            check: (value) => true || false
        };
        this.$attributes = null;
    }
}
exports.AbstractBuilder = AbstractBuilder;
exports.default = AbstractBuilder;
