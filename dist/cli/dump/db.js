"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { dir, cwd, fs, db } = cmd;
    if (dir) {
        try {
            fs.accessSync(cwd + `/${dir}`, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(cwd + `/${dir}`, {
                recursive: true
            });
        }
    }
    const directory = `${cwd}/${dir}/dump_${+new Date()}.sql`;
    new lib_1.DB().backupToFile({
        filePath: directory,
        database: db
    })
        .then(r => console.log('dump file successfully'))
        .catch(err => console.log(err));
};
