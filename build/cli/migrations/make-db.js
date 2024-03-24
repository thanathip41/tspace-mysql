"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { dir, cwd, fs, env, sql, push, generate } = cmd;
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
        for (const sql of sqlStatements) {
            if (sql.trim() === '')
                continue;
            const createTableStatements = sql
                .split(';')
                .filter((statement) => statement.trim().startsWith('CREATE TABLE IF NOT EXISTS'));
            const table = createTableStatements.map((statement) => {
                const tableNameMatch = statement.match(/`([^`]+)`/);
                return tableNameMatch && tableNameMatch[1];
            })[0];
            new lib_1.DB()
                .loadEnv(env)
                .rawQuery(`${sql}`)
                .then(_ => console.log(table == null
                ? `The query '${sql}' has been successfully`
                : `The table '${table}' has been successfully`))
                .catch(e => console.log(`Failed to push changes errors: '${e.message}'`));
        }
        return process.exit(0);
    }
    if (sql == null || sql === '') {
        return process.exit(0);
    }
    if (generate) {
        const directory = `${cwd}/${dir}/migrations.sql`;
        new lib_1.DB()
            .loadEnv(env)
            .backupToFile({
            filePath: directory,
            database: sql
        })
            .then(_ => console.log(`Migrations are migrating successfully`))
            .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
            .finally(() => process.exit(0));
    }
    throw new Error("Do you want to generate or push changes ? use '--generate' or '--push");
};
