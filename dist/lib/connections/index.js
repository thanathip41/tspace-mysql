"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var mysql_1 = require("mysql");
var options_1 = __importDefault(require("./options"));
var pool = (0, mysql_1.createPool)(options_1.default);
var optionIsNull = Object === null || Object === void 0 ? void 0 : Object.entries(options_1.default).some(function (_a) {
    var _b = __read(_a, 2), _ = _b[0], option = _b[1];
    return option == null;
});
var messsage = optionIsNull ?
    "Can't get optionuration in environment !" :
    "Connection lost to database !";
pool.getConnection(function (err, connection) {
    if (err) {
        console.log("\u001B[1m\u001B[31m\n    ".concat(messsage, " \u001B[0m\n    ------------------------------- \u001B[33m\n        DB_HOST     : ").concat(options_1.default === null || options_1.default === void 0 ? void 0 : options_1.default.host, "         \n        DB_PORT     : ").concat(options_1.default === null || options_1.default === void 0 ? void 0 : options_1.default.port, "        \n        DB_USERNAME : ").concat(options_1.default.user, "           \n        DB_PASSWORD : ").concat(options_1.default.password, "   \n        DB_DATABASE : ").concat(options_1.default.database, " \u001B[0m  \n    -------------------------------\n    "));
    }
    if (connection)
        connection.release();
    return;
});
pool.query = (0, util_1.promisify)(pool.query);
exports.default = pool;
