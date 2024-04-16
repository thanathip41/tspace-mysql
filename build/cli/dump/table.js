"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { dir, cwd, fs, values, sql } = cmd;
    if (dir) {
        try {
            fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(`${cwd}/${dir}`, {
                recursive: true
            });
        }
    }
    if (sql == null || sql === '') {
        console.log(`Example  tspace-mysql dump:table "table" --dir=app/table`);
        process.exit(0);
    }
    if (!values) {
        const directory = `${cwd}/${dir}/dump-schema_${+new Date()}.sql`;
        new lib_1.DB().backupTableSchemaToFile({
            filePath: directory,
            table: sql
        })
            .then(r => console.log(`dump table schema "${sql}" file successfully`))
            .catch(err => console.log(err))
            .finally(() => process.exit(0));
    }
    const directory = `${cwd}/${dir}/dump_${+new Date()}.sql`;
    new lib_1.DB().backupTableToFile({
        filePath: directory,
        table: sql
    })
        .then(r => console.log(`dump table "${sql}" file successfully`))
        .catch(err => console.log(err))
        .finally(() => process.exit(0));
};
//# sourceMappingURL=table.js.map