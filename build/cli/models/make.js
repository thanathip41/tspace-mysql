"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const table_1 = __importDefault(require("../tables/table"));
const pluralize_1 = __importDefault(require("pluralize"));
exports.default = (cmd) => {
    const { file, migrate, dir, type, cwd, fs, npm } = cmd;
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
    const model = dir ? `${cwd}/${dir}/${file}${type}` : `${cwd}/${file}${type}`;
    const data = (0, model_1.default)(file, npm);
    fs.writeFile(model, data, (err) => {
        if (err)
            throw err.message;
    });
    console.log(`Model : '${file}' created successfully`);
    if (migrate) {
        const tableName = (0, pluralize_1.default)(file.replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1));
        const folder = dir ? `${dir}/Migrations` : `/Migrations`;
        try {
            fs.accessSync(cwd + folder, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(cwd + folder, {
                recursive: true
            });
        }
        const folderMigrate = `${cwd}/${folder}/create_${tableName}_table${type}`;
        const table = (0, table_1.default)(tableName, npm);
        fs.writeFile(folderMigrate, table, (err) => {
            if (err)
                throw err;
        });
        console.log(`Migration : '${tableName}' created successfully`);
    }
};
