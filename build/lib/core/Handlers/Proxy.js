"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyHandler = void 0;
const Logger_1 = require("./Logger");
const proxyHandler = {
    set: (self, name, value) => {
        var _a;
        if ((_a = self.$setters) === null || _a === void 0 ? void 0 : _a.includes(name))
            throw new Error(`No allow to set this : ${name}`);
        self.$attributes = Object.assign(Object.assign({}, self.$attributes), { [name]: value });
        return true;
    },
    get: (self, prop, value) => {
        var _a, _b, _c, _d;
        try {
            new Logger_1.LoggerHandler(self, prop);
            switch (prop) {
                case 'tableName': return (_b = (_a = self.$db) === null || _a === void 0 ? void 0 : _a.get('TABLE_NAME')) === null || _b === void 0 ? void 0 : _b.replace(/`/g, '');
                case 'attributes': return self[`$${prop}`];
                case 'logger': return (_c = self.$logger) === null || _c === void 0 ? void 0 : _c.get();
                case 'result': return (_d = self.$db) === null || _d === void 0 ? void 0 : _d.get('RESULT');
                default: return Reflect.get(self, prop, value);
            }
        }
        catch (e) {
            throw new Error(e === null || e === void 0 ? void 0 : e.message);
        }
    }
};
exports.proxyHandler = proxyHandler;
exports.default = proxyHandler;
//# sourceMappingURL=Proxy.js.map