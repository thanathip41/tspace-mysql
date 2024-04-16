"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { dir, cwd, fs, env, db, push, generate } = cmd;
    if (dir) {
        try {
            fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(`${cwd}/${dir}`, {
                recursive: true
            });
        }
    }
    if (push) {
        const filePath = `${cwd}/${dir}/migrations.sql`;
        const sqlString = fs.readFileSync(filePath, 'utf8');
        const sqlStatements = sqlString.split(';');
        const pushMigration = (sqlStatements) => __awaiter(void 0, void 0, void 0, function* () {
            const createTables = [];
            const inserts = [];
            for (const sql of sqlStatements) {
                if (sql.trim() === '')
                    continue;
                const match = sql.match(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`([^`]+)`/i);
                const createDatabase = match ? match[0] : null;
                if (createDatabase) {
                    const result = yield new lib_1.DB()
                        .rawQuery(createDatabase)
                        .catch(e => console.log(`Failed to push changes errors: '${e.message}'`));
                    if (result != null) {
                        console.log(`The database '${createDatabase}' has been created`);
                    }
                    continue;
                }
                const createTableStatements = sql
                    .split(';')
                    .filter((statement) => statement.replace(/--.*\n/g, '').trim().startsWith('CREATE TABLE IF NOT EXISTS'));
                const inserttatements = sql
                    .split(';')
                    .filter((statement) => statement.replace(/--.*\n/g, '').trim().startsWith('INSERT INTO'));
                if (!createTableStatements.length && !inserttatements.length)
                    continue;
                if (createTableStatements.length) {
                    const match = createTableStatements.join(' ').match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+`[^`]+`\.`([^`]+)`/i);
                    const table = match ? match[1] : null;
                    createTables.push({
                        table: table == null ? '' : table,
                        sql: createTableStatements.join(' ')
                    });
                }
                if (inserttatements.length) {
                    const match = inserttatements.join(' ').match(/INSERT\s+INTO\s+`[^`]+`\.`([^`]+)`/i);
                    const table = match ? match[1] : null;
                    inserts.push({
                        table: table == null ? '' : table,
                        sql: inserttatements.join(' ')
                    });
                }
            }
            for (const c of createTables) {
                const result = yield new lib_1.DB()
                    .rawQuery(c.sql)
                    .catch(e => console.log(`Failed to push changes errors: '${e.message}'`));
                if (result != null) {
                    console.log(`The table '${c.table}' has been created`);
                }
            }
            for (const c of inserts) {
                const result = yield new lib_1.DB()
                    .rawQuery(c.sql)
                    .catch(e => console.log(`Failed to push changes errors: '${e.message}'`));
                if (result != null) {
                    console.log(`The data inserted into the '${c.table}' table has been successful.`);
                }
            }
        });
        pushMigration(sqlStatements)
            .then(_ => console.log(`Migrations are migrating successfully`))
            .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
            .finally(() => process.exit(0));
    }
    if (generate) {
        const directory = `${cwd}/${dir}/migrations.sql`;
        new lib_1.DB()
            .loadEnv(env)
            .backupToFile({
            filePath: directory,
            database: db != null && db != '' ? db : 'db-name'
        })
            .then(_ => console.log(`Migrations are migrating successfully`))
            .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
            .finally(() => process.exit(0));
    }
    throw new Error("Do you want to generate or push changes ? use '--generate' or '--push");
};
//# sourceMappingURL=make-db.js.map