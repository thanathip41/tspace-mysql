"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __importDefault(require("./model"));
var table_1 = __importDefault(require("../tables/table"));
var pluralize_1 = __importDefault(require("pluralize"));
exports.default = (function (formCommand) {
    var file = formCommand.file, migrate = formCommand.migrate, dir = formCommand.dir, type = formCommand.type, cwd = formCommand.cwd, fs = formCommand.fs, npm = formCommand.npm;
    if (dir) {
        try {
            fs.accessSync(cwd + "/".concat(dir), fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(cwd + "/".concat(dir), {
                recursive: true
            });
        }
    }
    var model = dir ? "".concat(cwd, "/").concat(dir, "/").concat(file).concat(type) : "".concat(cwd, "/").concat(file).concat(type);
    var data = (0, model_1.default)(file, npm);
    fs.writeFile(model, data, function (err) {
        if (err)
            throw err.message;
    });
    console.log("Model : '".concat(file, "' created successfully"));
    if (migrate) {
        var tableName = (0, pluralize_1.default)(file.replace(/([A-Z])/g, function (str) { return '_' + str.toLowerCase(); }).slice(1));
        var folder = dir ? "".concat(dir, "/Migrations") : "/Migrations";
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
        var folderMigrate = "".concat(cwd, "/").concat(folder, "/create_").concat(tableName, "_table").concat(type);
        var table = (0, table_1.default)(tableName, npm);
        fs.writeFile(folderMigrate, table, function (err) {
            if (err)
                throw err;
        });
        console.log("Migration : '".concat(tableName, "' created successfully"));
    }
});
