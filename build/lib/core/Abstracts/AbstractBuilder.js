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
            '$relation'
        ];
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
    }
}
exports.AbstractBuilder = AbstractBuilder;
exports.default = AbstractBuilder;
//# sourceMappingURL=AbstractBuilder.js.map