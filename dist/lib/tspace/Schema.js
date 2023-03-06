"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const Database_1 = require("./Database");
class Schema extends Database_1.Database {
    constructor() {
        super(...arguments);
        this.table = (table, schemas) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let columns = [];
                for (const key in schemas) {
                    const data = schemas[key];
                    const { type, attrbuites } = data;
                    columns = [
                        ...columns,
                        `${key} ${type} ${attrbuites === null || attrbuites === void 0 ? void 0 : attrbuites.join(' ')}`
                    ];
                }
                const sql = [
                    `CREATE TABLE IF NOT EXISTS`,
                    `${table} (${columns === null || columns === void 0 ? void 0 : columns.join(',')})`,
                    `ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8`
                ].join(' ');
                yield this.rawQuery(sql);
                console.log(`Migrats : '${table}' created successfully`);
            }
            catch (err) {
                console.log((_a = err.message) === null || _a === void 0 ? void 0 : _a.replace(/ER_TABLE_EXISTS_ERROR:/g, ""));
            }
        });
    }
}
exports.Schema = Schema;
exports.default = Schema;
