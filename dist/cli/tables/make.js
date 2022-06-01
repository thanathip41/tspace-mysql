"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = __importDefault(require("./table"));
exports.default = (function (_ref) {
    var path = _ref.path, name = _ref.name, type = _ref.type, cwd = _ref.cwd, fs = _ref.fs, npm = _ref.npm;
    var split = path.split('/') || path;
    var f = split.join('/');
    if (name == null)
        console.log("use ".concat(npm, " make:table FOLDER/FOLDER --name=tableName"));
    else {
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
        var folderMigrate = "".concat(cwd, "/").concat(f, "/create_").concat(name, "_table").concat(type);
        var table = (0, table_1.default)(name, npm);
        fs.writeFile(folderMigrate, table, function (err) {
            if (err)
                console.log(err.message);
        });
        console.log("Migration : ".concat(name, " created successfully"));
    }
});
