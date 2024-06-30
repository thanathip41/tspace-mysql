"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table = ({ table, npm, type }) => {
    switch (type.replace(/./, '').toLocaleLowerCase()) {
        case 'js': {
            return `const { Schema , Blueprint , DB } = require('${npm}');

(async () => {
    await new Schema().table('${table}', { 
        id :  new Blueprint().int().notNull().primary().autoIncrement(),
        uuid : new Blueprint().varchar(50).null(),
        name : new Blueprint().varchar(120).default('my name'),
        email : new Blueprint().varchar(120).unique(),
        email_verify : new Blueprint().tinyInt(),
        password : new Blueprint().varchar(120),
        birthdate : new Blueprint().date(),
        created_at : new Blueprint().timestamp().null(),
        updated_at : new Blueprint().timestamp().null()
    })

    /**
     * 
     *  @Faker data
     *  await new DB().table('${table}').faker(5)
    */
})()
`;
        }
        case 'ts': {
            return `import { Schema , Blueprint , DB } from '${npm}';
(async () => {
    await new Schema().table('${table}',{ 
        id :  new Blueprint().int().notNull().primary().autoIncrement(),
        uuid : new Blueprint().varchar(50).null(),
        name : new Blueprint().varchar(120).default('my name'),
        email : new Blueprint().varchar(120).unique(),
        email_verify : new Blueprint().tinyInt(),
        password : new Blueprint().varchar(120),
        birthdate : new Blueprint().date(),
        created_at : new Blueprint().timestamp().null(),
        updated_at : new Blueprint().timestamp().null()
    })

    /**
     * 
     *  @Faker data
     *  await new DB().table('${table}').faker(5)
    */
})()
`;
        }
    }
};
exports.default = Table;
//# sourceMappingURL=table.js.map