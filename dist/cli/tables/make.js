"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = __importDefault(require("./table"));
exports.default = (formCommand) => {
    const { file, type, cwd, dir, fs, npm } = formCommand;
    try {
        fs.accessSync(cwd + `/${file}`, fs.F_OK, {
            recursive: true
        });
    }
    catch (e) {
        fs.mkdirSync(cwd + `/${file}`, {
            recursive: true
        });
    }
    const folderMigrate = dir ? `${cwd}/${dir}/create_${file}_table${type}` : `${cwd}/create_${file}_table${type}`;
    const table = (0, table_1.default)(file, npm);
    fs.writeFile(folderMigrate, table, (err) => {
        if (err)
            console.log(err.message);
    });
    console.log(`Migration : ${file} created successfully`);
};
