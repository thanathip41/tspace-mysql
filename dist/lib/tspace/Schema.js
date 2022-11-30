"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const Database_1 = require("./Database");
class Schema extends Database_1.Database {
    table = async (table, schemas) => {
        try {
            let columns = [];
            for (const key in schemas) {
                const data = schemas[key];
                const { type, attrbuites } = data;
                columns = [
                    ...columns,
                    `${key} ${type} ${attrbuites?.join(' ')}`
                ];
            }
            const sql = [
                `CREATE TABLE IF NOT EXISTS`,
                `${table} (${columns?.join(',')})`,
                `ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8`
            ].join(' ');
            await this.rawQuery(sql);
            console.log(`Migrats : '${table}' created successfully`);
        }
        catch (err) {
            console.log(err.message?.replace("ER_TABLE_EXISTS_ERROR: ", ""));
        }
    };
}
exports.Schema = Schema;
exports.default = Schema;
