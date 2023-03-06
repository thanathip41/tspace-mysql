"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { sql } = cmd;
    new lib_1.DB().rawQuery(sql === null || sql === void 0 ? void 0 : sql.replace(/`/g, '')).then(result => console.log(result));
};
