"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Table = function (table, npm) {
    return "import { Schema , Blueprint , DB } from '".concat(npm, "'\n(async () => {\n    await new Schema().table('").concat(table, "',{ \n        id :  new Blueprint().int().notNull().primary().autoIncrement(),\n        name : new Blueprint().varchar(120).default('my name'),\n        email : new Blueprint().varchar(120).unique(),\n        email_verify : new Blueprint().tinyInt(),\n        password : new Blueprint().varchar(120),\n        birthdate : new Blueprint().date(),\n        created_at : new Blueprint().null().timestamp(),\n        updated_at : new Blueprint().null().timestamp()\n    })\n\n    /**\n     * \n     *  @Faker data\n     *  await new DB().table('").concat(table, "').faker(5)\n    */\n})()\n");
};
exports.default = Table;
