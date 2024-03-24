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
                    `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                    `${table} (${columns === null || columns === void 0 ? void 0 : columns.join(',')})`,
                    `${this.$constants('ENGINE')}`
                ].join(' ');
                yield this.query(sql);
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
            return [
                `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                `${table} (${columns.join(', ')})`,
                `${this.$constants('ENGINE')}`
            ].join(' ');
        };
    }
    /**
    *
    * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
    *
    * The schema can define with method 'useSchema'
    * @param    {string} pathFolders directory to models
    * @property {boolean} options.force - forec always check all columns if not exists will be created
    * @property {boolean} options.log   - show log execution with sql statements
    * @property {boolean} options.foreign - check when has a foreign keys will be created
    * @property {boolean} options.changed - check when column is changed attribute will be change attribute
    * @return {Promise<void>}
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
    *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
    *               title       : new Blueprint().varchar(255).null(),
    *               created_at  : new Blueprint().timestamp().null(),
    *               updated_at  : new Blueprint().timestamp().null(),
    *               deleted_at  : new Blueprint().timestamp().null()
    *           })
    *       }
    *   }
    *
    *
    *  await new Schema().sync(`app/Models` , { force : true , log = true, foreign = true , changed = true })
    */
    sync(pathFolders, { force = false, log = false, foreign = false, changed = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const directories = fs_1.default.readdirSync(pathFolders, { withFileTypes: true });
            const files = (yield Promise.all(directories.map((directory) => {
                const newDir = path_1.default.resolve(String(pathFolders), directory.name);
                if (directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations'))
                    return null;
                return directory.isDirectory() ? Schema.sync(newDir, { force, log, changed }) : newDir;
            })));
            const pathModels = [].concat(...files).filter(d => d != null || d === '');
            yield new Promise(r => setTimeout(r, 1200));
            const models = yield Promise.all(pathModels.map((pathModel) => this._import(pathModel)).filter(d => d != null));
            if (!models.length)
                return;
            yield this._syncExecute({ models, force, log, foreign, changed });
            return;
        });
    }
    /**
     *
     * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
     *
     * The schema can define with method 'useSchema'
     * @param    {string} pathFolders directory to models
     * @type     {object}  options
     * @property {boolean} options.force - forec always check all columns if not exists will be created
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.foreign - check when has a foreign keys will be created
     * @property {boolean} options.changed - check when column is changed attribute will be change attribute
     * @return {Promise<void>}
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
     *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
     *               title       : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *
     *  await Schema.sync(`app/Models` , { force : true })
     */
    static sync(pathFolders, { force = false, log = false, foreign = false, changed = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this().sync(pathFolders, { force, log, foreign, changed });
        });
    }
    _import(pathModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loadModel = yield Promise.resolve(`${pathModel}`).then(s => __importStar(require(s))).catch(_ => { });
                const model = new loadModel.default();
                return model;
            }
            catch (err) {
                console.log(`Check your 'Model' from path : '${pathModel}' is not instance of Model`);
                return null;
            }
        });
    }
    _syncExecute({ models, force, log, foreign, changed }) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const checkTables = yield this.query(this.$constants('SHOW_TABLES'));
            const existsTables = checkTables.map((c) => Object.values(c)[0]);
            for (const model of models) {
                if (model == null)
                    continue;
                const schemaModel = model.getSchemaModel();
                if (!schemaModel)
                    continue;
                const checkTableIsExists = existsTables.some((table) => table === model.getTableName());
                if (!checkTableIsExists) {
                    const sql = this.createTable(`\`${model.getTableName()}\``, schemaModel);
                    yield model.debug(log).query(sql);
                    const beforeCreatingTheTable = model['$state'].get('BEFORE_CREATING_TABLE');
                    if (beforeCreatingTheTable != null)
                        yield beforeCreatingTheTable();
                    yield this._syncForeignKey({
                        schemaModel,
                        model,
                        log
                    });
                    continue;
                }
                if (foreign) {
                    yield this._syncForeignKey({
                        schemaModel,
                        model,
                        log
                    });
                }
                if (!force)
                    continue;
                const schemaTable = yield model.getSchema();
                const schemaTableKeys = schemaTable.map((k) => k.Field);
                const schemaModelKeys = Object.keys(schemaModel);
                const wasChangedColumns = changed ? Object.entries(schemaModel).map(([key, value]) => {
                    const find = schemaTable.find(t => t.Field === key);
                    if (find == null)
                        return null;
                    const compare = String(find.Type).toLocaleLowerCase() !== String(value.type).toLocaleLowerCase();
                    return compare ? key : null;
                }).filter(d => d != null) : [];
                if (wasChangedColumns.length) {
                    for (const column of wasChangedColumns) {
                        if (column == null)
                            continue;
                        const type = (_b = (_a = schemaModel[column]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
                        const attributes = (_d = (_c = schemaModel[column]) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : null;
                        const sql = [
                            this.$constants('ALTER_TABLE'),
                            `\`${model.getTableName()}\``,
                            this.$constants('CHANGE'),
                            `\`${column}\``,
                            `\`${column}\` ${type} ${attributes.join(' ')}`,
                        ].join(' ');
                        yield this.debug(log).query(sql);
                    }
                }
                const missingColumns = schemaModelKeys.filter(schemaModelKey => !schemaTableKeys.includes(schemaModelKey));
                if (!missingColumns.length)
                    continue;
                const entries = Object.entries(schemaModel);
                for (const column of missingColumns) {
                    const indexWithColumn = entries.findIndex(([key]) => key === column);
                    const findAfterIndex = indexWithColumn ? entries[indexWithColumn - 1][0] : null;
                    const type = (_f = (_e = schemaModel[column]) === null || _e === void 0 ? void 0 : _e.type) !== null && _f !== void 0 ? _f : null;
                    const attributes = (_h = (_g = schemaModel[column]) === null || _g === void 0 ? void 0 : _g.attributes) !== null && _h !== void 0 ? _h : null;
                    if (findAfterIndex == null || type == null || attributes == null)
                        continue;
                    const sql = [
                        this.$constants('ALTER_TABLE'),
                        `\`${model.getTableName()}\``,
                        this.$constants('ADD'),
                        `\`${column}\` ${type} ${attributes.join(' ')}`,
                        this.$constants('AFTER'),
                        `\`${findAfterIndex}\``
                    ].join(' ');
                    yield this.debug(log).query(sql);
                }
                yield this._syncForeignKey({
                    schemaModel,
                    model,
                    log
                });
            }
            return;
        });
    }
    _syncForeignKey({ schemaModel, model, log }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                    this.$constants("ALTER_TABLE"),
                    `\`${model.getTableName()}\``,
                    this.$constants('ADD_CONSTRAINT'),
                    `${constraintName}`,
                    `${this.$constants('FOREIGN_KEY')}(\`${key}\`)`,
                    `${this.$constants('REFERENCES')} \`${table}\`(\`${foreign.references}\`)`,
                    `${this.$constants('ON_DELETE')} ${foreign.onDelete} ${this.$constants('ON_UPDATE')} ${foreign.onUpdate}`
                ].join(' ');
                try {
                    yield this.debug(log).query(sql);
                }
                catch (e) {
                    if (typeof onReference === "string")
                        continue;
                    if (String(e.message).includes("Duplicate foreign key constraint"))
                        continue;
                    const schemaModelOn = yield onReference.getSchemaModel();
                    if (!schemaModelOn)
                        continue;
                    const tableSql = this.createTable(`\`${table}\``, schemaModelOn);
                    yield this.debug(log).query(tableSql).catch(e => console.log(e));
                    yield this.debug(log).query(sql).catch(e => console.log(e));
                    continue;
                }
            }
        });
    }
}
exports.Schema = Schema;
exports.default = Schema;
