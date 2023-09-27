"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractBuilder = void 0;
const StateHandler_1 = require("../StateHandler");
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
        this.$state = new StateHandler_1.StateHandler({});
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
