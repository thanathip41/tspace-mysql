"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyHandler = void 0;
const Logger_1 = require("./Logger");
const proxyHandler = {
    set: (self, name, value) => {
        if (self.$setters?.includes(name))
            throw new Error(`no allow to set this ${name}`);
        self.$attributes = {
            ...self.$attributes,
            [name]: value
        };
        return true;
    },
    get: (self, prop, value) => {
        try {
            new Logger_1.Logger(self, prop);
            switch (prop) {
                case 'tableName': return self.$db?.get('TABLE_NAME')?.replace(/`/g, '');
                case 'attributes': return self[`$${prop}`];
                case 'logger': return self.$logger?.get();
                case 'result': return self.$db?.get('RESULT');
                default: return Reflect.get(self, prop, value);
            }
        }
        catch (e) {
            throw new Error(e?.message);
        }
    }
};
exports.proxyHandler = proxyHandler;
exports.default = proxyHandler;
