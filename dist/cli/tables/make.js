"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = __importDefault(require("./table"));
exports.default = (function (_ref) {
    var file = _ref.file, type = _ref.type, cwd = _ref.cwd, dir = _ref.dir, fs = _ref.fs, npm = _ref.npm;
    try {
        fs.accessSync(cwd + "/".concat(file), fs.F_OK, {
            recursive: true
        });
    }
    catch (e) {
        fs.mkdirSync(cwd + "/".concat(file), {
            recursive: true
        });
    }
    var folderMigrate = dir ? "".concat(cwd, "/").concat(dir, "/create_").concat(file, "_table").concat(type) : "".concat(cwd, "/create_").concat(file, "_table").concat(type);
    var table = (0, table_1.default)(file, npm);
    fs.writeFile(folderMigrate, table, function (err) {
        if (err)
            console.log(err.message);
    });
    console.log("Migration : ".concat(file, " created successfully"));
});
