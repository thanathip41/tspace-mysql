"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
exports.default = (function (_ref) {
    var e_1, _a;
    var _b, _c, _d;
    var type = _ref.type, dir = _ref.dir, cwd = _ref.cwd, fs = _ref.fs;
    try {
        if (dir == null)
            throw new Error('Not found directory');
        var path = "".concat(cwd, "/").concat(dir);
        var files = (_b = fs.readdirSync(path)) !== null && _b !== void 0 ? _b : [];
        if (!(files === null || files === void 0 ? void 0 : files.length))
            console.log('this folder is empty');
        var cmd = type === '.js' ? 'node' : 'ts-node';
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var _file = files_1_1.value;
                var run = (0, child_process_1.exec)("".concat(cmd, " ").concat(path, "/").concat(_file));
                (_c = run === null || run === void 0 ? void 0 : run.stdout) === null || _c === void 0 ? void 0 : _c.on('data', function (data) {
                    if (data)
                        console.log(data);
                });
                (_d = run === null || run === void 0 ? void 0 : run.stderr) === null || _d === void 0 ? void 0 : _d.on('data', function (err) {
                    if (err)
                        console.error(err);
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
