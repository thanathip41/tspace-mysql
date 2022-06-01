"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __importDefault(require("./model"));
var table_1 = __importDefault(require("../tables/table"));
var utils_1 = __importDefault(require("../../lib/utils"));
exports.default = (function (_ref) {
    var path = _ref.path, migrate = _ref.migrate, migrateFolder = _ref.migrateFolder, type = _ref.type, name = _ref.name, cwd = _ref.cwd, fs = _ref.fs, npm = _ref.npm;
    var split = path.split('/') || path;
    var model = split.pop();
    var f = split.join('/');
    try {
        fs.accessSync(cwd + "/".concat(f), fs.F_OK, {
            recursive: true
        });
    }
    catch (e) {
        fs.mkdirSync(cwd + "/".concat(f), {
            recursive: true
        });
    }
    var folder = "".concat(cwd, "/").concat(f, "/").concat(model).concat(type);
    var data = (0, model_1.default)(name || model, npm);
    fs.writeFile(folder, data, function (err) {
        if (err)
            throw err.message;
    });
    console.log("Model : '".concat(model, "' created successfully"));
    if (migrate) {
        var tableName = utils_1.default.tableName(name || model);
        var folder_1 = migrateFolder !== null && migrateFolder !== void 0 ? migrateFolder : "/".concat(f, "/Migrations");
        try {
            fs.accessSync(cwd + folder_1, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(cwd + folder_1, {
                recursive: true
            });
        }
        var folderMigrate = "".concat(cwd, "/").concat(folder_1, "/create_").concat(tableName, "_table").concat(type);
        var table = (0, table_1.default)(tableName, npm);
        fs.writeFile(folderMigrate, table, function (err) {
            if (err)
                throw err;
        });
        console.log("Migration : '".concat(tableName, "' created successfully"));
    }
});
