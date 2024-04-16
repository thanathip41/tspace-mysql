"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const child_process_1 = require("child_process");
const sql_formatter_1 = require("sql-formatter");
const path_1 = __importDefault(require("path"));
exports.default = (cmd) => {
    const { dir, cwd, fs, generate, push, models, env } = cmd;
    if (models == null)
        throw new Error("Cannot find directory to your models please specify the directory : '--models=src/app/models'");
    if (dir == null)
        throw new Error("Cannot find directory please specify the directory : '--dir=${directory}'");
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
    const migrations = (pathFolders) => __awaiter(void 0, void 0, void 0, function* () {
        const directories = fs.readdirSync(pathFolders, { withFileTypes: true });
        const files = (yield Promise.all(directories.map((directory) => {
            const newDir = path_1.default.resolve(String(pathFolders), directory.name);
            if (directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations'))
                return null;
            return directory.isDirectory() ? lib_1.Schema.sync(newDir) : newDir;
        })));
        let pathModels = [].concat(...files).filter(d => d != null || d === '');
        yield new Promise(r => setTimeout(r, 1500));
        const isFileTs = pathModels.some(pathModel => /\.ts$/.test(pathModel) && !(/\.d\.ts$/.test(pathModel)));
        const outDirForBuildTs = '__tmp-migrations-ts__';
        if (isFileTs) {
            for (const pathModel of pathModels) {
                const command = `tsc "${pathModel}" --outDir ${outDirForBuildTs} --target es6 --esModuleInterop --module commonjs --allowJs`;
                try {
                    (0, child_process_1.execSync)(command, { stdio: 'inherit' });
                }
                catch (error) { }
            }
            const directories = fs.readdirSync(outDirForBuildTs, { withFileTypes: true });
            const files = (yield Promise.all(directories.map((directory) => {
                const newDir = path_1.default.resolve(String(outDirForBuildTs), directory.name);
                if (directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations'))
                    return null;
                return directory.isDirectory() ? lib_1.Schema.sync(newDir) : newDir;
            })));
            pathModels = [].concat(...files).filter(d => d != null || d === '');
        }
        const models = yield Promise.all(pathModels.map((pathModel) => _import(pathModel)).filter(d => d != null));
        if (isFileTs) {
            const removeFolderRecursive = (folderPath) => {
                if (fs.existsSync(folderPath)) {
                    fs.readdirSync(folderPath).forEach((file) => {
                        const curPath = path_1.default.join(folderPath, file);
                        if (fs.lstatSync(curPath).isDirectory())
                            removeFolderRecursive(curPath);
                        fs.unlinkSync(curPath);
                    });
                    fs.rmdirSync(folderPath);
                }
            };
            removeFolderRecursive(outDirForBuildTs);
        }
        if (!models.length)
            return;
        const createTableQueries = [];
        const foreignKeyQueries = [];
        for (const model of models) {
            if (model == null)
                continue;
            const schemaModel = model.getSchemaModel();
            if (!schemaModel)
                continue;
            const createTable = new lib_1.Schema().createTable(`\`${model.getTableName()}\``, schemaModel);
            createTableQueries.push(createTable);
            const foreignKey = _foreignKey({
                schemaModel,
                model
            });
            if (foreignKey == null)
                continue;
            foreignKeyQueries.push(foreignKey);
        }
        let sql = [
            `${createTableQueries.map(c => {
                return (0, sql_formatter_1.format)(c, {
                    language: 'spark',
                    tabWidth: 2,
                    linesBetweenQueries: 1,
                }) + ";";
            }).join('\n\n')}\n`,
            `${foreignKeyQueries.map(f => `${f};`).join('\n')}`,
        ];
        fs.writeFileSync(`${cwd}/${dir}/migrations.sql`, sql.join('\n'));
        return;
    });
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
    const _import = (pathModel) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const loadModel = yield Promise.resolve(`${pathModel}`).then(s => __importStar(require(s)));
            const model = new loadModel.default();
            return model;
        }
        catch (err) {
            console.log(`Check your 'Model' from path : '${pathModel}' is not instance of Model`);
            return null;
        }
    });
    const _foreignKey = ({ schemaModel, model }) => {
        var _a;
        for (const key in schemaModel) {
            if (((_a = schemaModel[key]) === null || _a === void 0 ? void 0 : _a.foreignKey) == null)
                continue;
            const foreign = schemaModel[key].foreignKey;
            if (foreign.on == null)
                continue;
            const onReference = typeof foreign.on === "string" ? foreign.on : new foreign.on;
            const table = typeof onReference === "string" ? onReference : onReference.getTableName();
            const constraintName = `\`${model.getTableName()}(${key})_${table}(${foreign.references})\``;
            const sql = [
                "ALTER TABLE",
                `\`${model.getTableName()}\``,
                'ADD CONSTRAINT',
                `${constraintName}`,
                `FOREIGN KEY(\`${key}\`)`,
                `REFERENCES \`${table}\`(\`${foreign.references}\`)`,
                `ON DELETE ${foreign.onDelete} ON UPDATE ${foreign.onUpdate}`
            ].join(' ');
            return sql;
        }
    };
    if (push) {
        const filePath = `${cwd}/${dir}/migrations.sql`;
        const sqlString = fs.readFileSync(filePath, 'utf8');
        const sqlStatements = sqlString.split(';');
        pushMigration(sqlStatements)
            .then(_ => console.log(`Migrations are migrating successfully`))
            .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
            .finally(() => process.exit(0));
    }
    if (generate) {
        migrations(`${cwd}/${models}`)
            .then(_ => console.log(`Migrations are migrating successfully`))
            .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
            .finally(() => process.exit(0));
        return process.exit(0);
    }
    throw new Error("Do you want to generate or push changes ? use '--generate' or '--push");
};
//# sourceMappingURL=make-model.js.map