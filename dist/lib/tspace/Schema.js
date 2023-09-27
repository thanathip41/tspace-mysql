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
exports.Schema = void 0;
const Builder_1 = require("./Builder");
const Model_1 = require("./Model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Schema extends Builder_1.Builder {
    constructor() {
        super(...arguments);
        this.table = (table, schemas) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let columns = [];
                for (const key in schemas) {
                    const data = schemas[key];
                    const { type, attributes } = data;
                    columns = [
                        ...columns,
                        `${key} ${type} ${attributes === null || attributes === void 0 ? void 0 : attributes.join(' ')}`
                    ];
                }
                const sql = [
                    `CREATE TABLE IF NOT EXISTS`,
                    `${table} (${columns === null || columns === void 0 ? void 0 : columns.join(',')})`,
                    `ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8`
                ].join(' ');
                yield this.rawQuery(sql);
                console.log(`Migrats : '${table}' created successfully`);
                return;
            }
            catch (err) {
                console.log((_a = err.message) === null || _a === void 0 ? void 0 : _a.replace(/ER_TABLE_EXISTS_ERROR:/g, ""));
            }
        });
        this.createTable = (table, schemas) => {
            let columns = [];
            for (const key in schemas) {
                const data = schemas[key];
                const { type, attributes } = data;
                columns = [
                    ...columns,
                    `${key} ${type} ${attributes === null || attributes === void 0 ? void 0 : attributes.join(' ')}`
                ];
            }
            const sql = [
                `CREATE TABLE IF NOT EXISTS`,
                `${table} (${columns === null || columns === void 0 ? void 0 : columns.join(', ')})`,
                `ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8`
            ].join(' ');
            return sql;
        };
    }
    /**
     *
     * Sync will check for create or update table or columns with useSchema in your model.
     * @param {string} pathFolders directory to models
     * @property {boolean} options.force - forec to always check columns is exists
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.delay - wait for execution
     * @example
     *
     * - node_modules
     * - app
     *   - Models
     *     - User.ts
     *     - Post.ts
     *
     *  // file User.ts
     *  class User extends Model {
     *      constructor(){
     *          super()
     *          this.hasMany({ name : 'posts' , model : Post })
     *          this.useSchema ({
     *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *               uuid        : new Blueprint().varchar(50).null(),
     *               email       : new Blueprint().int().notNull().unique(),
     *               name        : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *   // file Post.ts
     *   class Post extends Model {
     *      constructor(){
     *          super()
     *          this.hasMany({ name : 'comments' , model : Comment })
     *          this.belongsTo({ name : 'user' , model : User })
     *          this.useSchema ({
     *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *               uuid        : new Blueprint().varchar(50).null(),
     *               user_id     : new Blueprint().int().notNull(),
     *               title       : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *  await Schema.sync(`app/Models` , { force : true })
     */
    static sync(pathFolders, { force = false, log = false, delay = 3000 } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const directories = fs_1.default.readdirSync(pathFolders, { withFileTypes: true });
            const files = yield Promise.all(directories.map((directory) => {
                const newDir = path_1.default.resolve(String(pathFolders), directory.name);
                if (directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations'))
                    return null;
                return directory.isDirectory() ? Schema.sync(newDir, { force, log, delay }) : newDir;
            }));
            const pathModels = [].concat(...files).filter(d => d != null || d === '');
            yield new Promise(r => setTimeout(r, delay));
            const promises = pathModels.map((pathModel) => Schema._syncExecute({ pathModel, force, log }));
            yield Promise.all(promises);
            return;
        });
    }
    static _syncExecute({ pathModel, force, log }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const loadModel = yield Promise.resolve(`${pathModel}`).then(s => __importStar(require(s)));
            if (!loadModel.hasOwnProperty('default') && !(loadModel instanceof Model_1.Model))
                return;
            const model = new loadModel.default();
            const schemaModel = yield model.getSchemaModel();
            if (!schemaModel)
                return;
            const checkTableIsExists = Boolean((yield new Builder_1.Builder().rawQuery(`SHOW TABLES LIKE '${model.getTableName()}';`)).length);
            if (!checkTableIsExists) {
                const sql = new Schema().createTable(model.getTableName(), schemaModel);
                yield new Builder_1.Builder().debug(log).rawQuery(sql);
                return;
            }
            if (!force)
                return;
            const schemaTable = yield model.getSchema();
            const schemaTableKeys = schemaTable.map((k) => k.Field);
            const schemaModelKeys = Object.keys(schemaModel);
            const missingColumns = schemaModelKeys.filter(schemaModelKey => !schemaTableKeys.includes(schemaModelKey));
            if (!missingColumns.length)
                return;
            const entries = Object.entries(schemaModel);
            for (const column of missingColumns) {
                const indexWithColumn = entries.findIndex(([key]) => key === column);
                const findAfterIndex = indexWithColumn ? entries[indexWithColumn - 1][0] : null;
                const type = (_b = (_a = schemaModel[column]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
                const attributes = (_d = (_c = schemaModel[column]) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : null;
                if (findAfterIndex == null || type == null || attributes == null)
                    continue;
                const sql = [
                    'ALTER TABLE',
                    `\`${model.getTableName()}\``,
                    'ADD',
                    `\`${column}\` ${type} ${attributes.join(' ')}`,
                    'AFTER',
                    `\`${findAfterIndex}\``
                ].join(' ');
                yield new Builder_1.Builder().debug(log).rawQuery(sql);
            }
            return;
        });
    }
}
exports.Schema = Schema;
exports.default = Schema;
