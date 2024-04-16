"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { sql, env } = cmd;
    new lib_1.DB().loadEnv(env).rawQuery(sql === null || sql === void 0 ? void 0 : sql.replace(/`/g, ''))
        .then(result => console.log(result))
        .catch(err => console.log(err))
        .finally(() => process.exit(0));
};
//# sourceMappingURL=index.js.map