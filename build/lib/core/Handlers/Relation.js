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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationHandler = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const Model_1 = require("../Model");
class RelationHandler {
    constructor(model) {
        this.MODEL = model;
        this.$constants = this.MODEL["$constants"];
        this.$logger = this.MODEL["$logger"];
    }
    load(parents, relation) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const relationIsBelongsToMany = relation.relation === this.$constants('RELATIONSHIP').belongsToMany;
            if (relationIsBelongsToMany) {
                return yield this._belongsToMany(parents, relation);
            }
            if (!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length))
                return [];
            const { localKey, foreignKey } = this._valueInRelation(relation);
            const localKeyId = parents
                .map((parent) => {
                const data = parent[localKey];
                if (parent.hasOwnProperty(localKey))
                    return data;
                if (data == null) {
                    const message = `This relationship lacks a primary or foreign key in the '${relation === null || relation === void 0 ? void 0 : relation.name}' relation. Please review the query to identify whether the key '${localKey}' or '${foreignKey}' is missing.`;
                    throw this.MODEL['_assertError'](message);
                }
            })
                .filter(d => d != null);
            const parentIds = Array.from(new Set(localKeyId)) || [];
            const query = relation.query;
            this._assertError(query == null, `Unknown callback query in [Relation : ${relation.name}]`);
            if (relation.count) {
                const childs = yield query
                    .whereIn(foreignKey, parentIds)
                    .select(foreignKey)
                    .selectRaw(`${this.$constants('COUNT')}(\`${foreignKey}\`) ${this.$constants('AS')} \`aggregate\``)
                    .debug(this.MODEL['$state'].get('DEBUG'))
                    .when(relation.trashed, (query) => query.onlyTrashed())
                    .when(relation.all, (query) => query.disableSoftDelete())
                    .bind(this.MODEL['$pool'].get())
                    .groupBy(foreignKey)
                    .get();
                return this._relationMapData({
                    parents,
                    childs,
                    relation
                });
            }
            const childs = yield query
                .whereIn(foreignKey, parentIds)
                .debug(this.MODEL['$state'].get('DEBUG'))
                .when(relation.trashed, (query) => query.onlyTrashed())
                .when(relation.all, (query) => query.disableSoftDelete())
                .bind(this.MODEL['$pool'].get())
                .get();
            return this._relationMapData({
                parents,
                childs,
                relation
            });
        });
    }
    loadExists() {
        var _a, _b, _c;
        const relations = this.MODEL['$state'].get('RELATIONS');
        for (const index in relations) {
            const relation = relations[index];
            if (!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length))
                continue;
            if (relation.exists == null)
                continue;
            const { localKey, foreignKey, pivot, modelPivot } = this._valueInRelation(relation);
            const query = relation.query;
            this._assertError(query == null, `Unknown callback query in [Relation : '${relation.name}']`);
            let clone = new Model_1.Model().clone(query);
            const cloneRelations = clone['$state'].get('RELATIONS');
            if (cloneRelations.length) {
                for (const r of cloneRelations) {
                    if (!r.exists)
                        continue;
                    if (r.query == null)
                        continue;
                    const sql = (_c = (_b = clone['$relation']) === null || _b === void 0 ? void 0 : _b._handleRelationsExists(r)) !== null && _c !== void 0 ? _c : '';
                    clone.whereExists(sql);
                }
            }
            if (relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                const thisPivot = modelPivot
                    ? new modelPivot
                    : new Model_1.Model().table(String(pivot));
                const sql = clone
                    .bind(this.MODEL['$pool'].get())
                    .selectRaw("1")
                    .whereReference(`\`${query.getTableName()}\`.\`${foreignKey}\``, `\`${thisPivot.getTableName()}\`.\`${localKey}\``)
                    .toString();
                thisPivot.whereExists(sql);
                const sqlPivot = thisPivot
                    .bind(this.MODEL['$pool'].get())
                    .selectRaw("1")
                    .whereReference(`\`${this.MODEL['getTableName']()}\`.\`${foreignKey}\``, `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize_1.default.singular(this.MODEL['getTableName']()), foreignKey].join("_"))}\``)
                    .toString();
                this.MODEL['whereExists'](sqlPivot);
                continue;
            }
            const sql = clone
                .bind(this.MODEL['$pool'].get())
                .selectRaw("1")
                .whereReference(`\`${this.MODEL.getTableName()}\`.\`${localKey}\``, `\`${query.getTableName()}\`.\`${foreignKey}\``)
                .toString();
            this.MODEL['whereExists'](sql);
        }
        const sql = this.MODEL['_queryBuilder']().select();
        return sql;
    }
    apply(nameRelations, type) {
        const relations = nameRelations.map((name) => {
            var _a, _b, _c;
            const relation = (_a = this.MODEL['$state'].get('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            this._assertError(relation == null, `The relation '${name}' is not registered in the model '${(_b = this.MODEL.constructor) === null || _b === void 0 ? void 0 : _b.name}'.`);
            const relationHasExists = (_c = Object.values(this.$constants('RELATIONSHIP'))) === null || _c === void 0 ? void 0 : _c.includes(relation.relation);
            this._assertError(!relationHasExists, `Unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
            this._assertError(relation.model == null, `The model is not found'.`);
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        for (const relation of relations) {
            if (type === 'default')
                break;
            relation[type] = true;
        }
        return this.MODEL['$state'].get('RELATIONS').length
            ? [...relations.map((w) => {
                    const exists = this.MODEL['$state'].get('RELATIONS').find((r) => r.name === w.name);
                    if (exists)
                        return null;
                    return w;
                }).filter((d) => d != null),
                ...this.MODEL['$state'].get('RELATIONS')]
            : relations;
    }
    callback(nameRelation, cb) {
        var _a, _b;
        const relation = this.MODEL['$state'].get('RELATIONS').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `This Relation "${nameRelation}" not be register in Model "${(_a = this.MODEL.constructor) === null || _a === void 0 ? void 0 : _a.name}"`);
        const relationHasExists = (_b = Object.values(this.$constants('RELATIONSHIP'))) === null || _b === void 0 ? void 0 : _b.includes(relation.relation);
        this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        relation.query = cb(new relation.model());
        return;
    }
    hasOne({ name, as, model, localKey, foreignKey, freezeTable }) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        return this.MODEL['$state'].set('RELATION', [...this.MODEL['$state'].get('RELATION'), relation]);
    }
    hasMany({ name, as, model, localKey, foreignKey, freezeTable }) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        return this.MODEL['$state'].set('RELATION', [...this.MODEL['$state'].get('RELATION'), relation]);
    }
    belongsTo({ name, as, model, localKey, foreignKey, freezeTable }) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        return this.MODEL['$state']
            .set('RELATION', [
            ...this.MODEL['$state'].get('RELATION'),
            relation
        ]);
    }
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            query: null,
            modelPivot
        };
        return this.MODEL['$state']
            .set('RELATION', [
            ...this.MODEL['$state'].get('RELATION'),
            relation
        ]);
    }
    hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable, }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._relationBuilder(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return;
    }
    hasManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._relationBuilder(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return;
    }
    belongsToBuilder({ name, as, model, localKey, foreignKey, freezeTable, }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._relationBuilder(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return;
    }
    belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            query: null
        };
        const r = this._relationBuilder(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return;
    }
    _handleRelationsExists(relation) {
        var _a, _b, _c, _d;
        this._assertError(!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length), `unknown [relation]`);
        const { localKey, foreignKey } = this._valueInRelation(relation);
        const query = relation.query;
        this._assertError(query == null, `Unknown callback query in [Relation : '${relation.name}']`);
        const clone = new Model_1.Model().clone(query);
        const cloneRelations = clone['$state'].get('RELATIONS');
        if (cloneRelations.length) {
            for (const r of cloneRelations) {
                if (!r.exists)
                    continue;
                if (r.query == null)
                    continue;
                if (r.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                    const data = (_b = clone['$relation']) === null || _b === void 0 ? void 0 : _b._valueInRelation(r);
                    if (data == null)
                        continue;
                    const { modelPivot, pivot, foreignKey } = data;
                    const thisPivot = modelPivot == null && pivot == null
                        ? new Model_1.Model().table(`${this._valuePattern([
                            pluralize_1.default.singular(clone.getTableName()),
                            pluralize_1.default.singular(this.MODEL['getTableName']())
                        ].join("_"))}`)
                        : modelPivot ? new modelPivot : new Model_1.Model().table(`${pivot}`);
                    const sql = clone
                        .bind(this.MODEL['$pool'].get())
                        .selectRaw("1")
                        .whereReference(`\`${clone.getTableName()}\`.\`${foreignKey}\``, `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([
                        pluralize_1.default.singular(clone.getTableName()),
                        localKey
                    ].join('_'))}\``)
                        .toString();
                    thisPivot.whereExists(sql);
                    const sqlPivot = thisPivot
                        .bind(this.MODEL['$pool'].get())
                        .selectRaw("1")
                        .whereReference(`\`${this.MODEL['getTableName']()}\`.\`${foreignKey}\``, `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize_1.default.singular(this.MODEL['getTableName']()), foreignKey].join("_"))}\``)
                        .toString();
                    clone.whereExists(sqlPivot);
                    continue;
                }
                const sql = (_d = (_c = clone['$relation']) === null || _c === void 0 ? void 0 : _c._handleRelationsExists(r)) !== null && _d !== void 0 ? _d : '';
                clone.whereExists(sql);
            }
        }
        const sql = clone
            .bind(this.MODEL['$pool'].get())
            .selectRaw("1")
            .whereReference(`\`${this.MODEL['getTableName']()}\`.\`${localKey}\``, `\`${clone.getTableName()}\`.\`${foreignKey}\``)
            .toString();
        return sql;
    }
    _relationBuilder(nameRelation, relation) {
        var _a;
        this.MODEL['$state'].set('RELATION', [...this.MODEL['$state'].get('RELATION'), relation]);
        this.MODEL['with'](nameRelation);
        const r = this.MODEL['$state'].get('RELATIONS').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `The relation '${nameRelation}' is not registered in the model '${(_a = this.MODEL.constructor) === null || _a === void 0 ? void 0 : _a.name}'.`);
        return r;
    }
    _functionRelationName() {
        const functionName = [...this.$logger.get()][this.$logger.get().length - 2];
        return functionName.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
    }
    _relationMapData({ parents, childs, relation }) {
        var _a;
        let { name, as, query, relation: relationName, localKey, foreignKey } = this._valueInRelation(relation);
        const keyRelation = as !== null && as !== void 0 ? as : name;
        localKey = query == null ? localKey : query.covertFixColumnToColumnSchema(localKey);
        foreignKey = query == null ? foreignKey : query.covertFixColumnToColumnSchema(foreignKey);
        for (const dataParent of parents) {
            const relationIsHasOneOrBelongsTo = [
                this.$constants('RELATIONSHIP').hasOne,
                this.$constants('RELATIONSHIP').belongsTo
            ].some(r => r === relationName);
            dataParent[keyRelation] = relation.count ? 0 : [];
            if (relationIsHasOneOrBelongsTo)
                dataParent[keyRelation] = relation.count ? 0 : null;
            if (!childs.length)
                continue;
            for (const dataChild of childs) {
                if (dataChild[foreignKey] === dataParent[localKey]) {
                    if (relation.count) {
                        dataParent[keyRelation] = (_a = dataChild === null || dataChild === void 0 ? void 0 : dataChild.aggregate) !== null && _a !== void 0 ? _a : 0;
                        continue;
                    }
                    const relationIsHasOneOrBelongsTo = [
                        this.$constants('RELATIONSHIP').hasOne,
                        this.$constants('RELATIONSHIP').belongsTo
                    ].some(r => r === relationName);
                    if (relationIsHasOneOrBelongsTo) {
                        dataParent[keyRelation] = dataParent[keyRelation] || dataChild;
                        continue;
                    }
                    if (dataParent[keyRelation] == null)
                        dataParent[keyRelation] = [];
                    dataParent[keyRelation].push(dataChild);
                }
            }
        }
        return parents;
    }
    _belongsToMany(parents, relation) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { name, foreignKey, localKey, pivot, oldVersion, modelPivot } = this._valueInRelation(relation);
            const localKeyId = parents.map((parent) => {
                const data = parent[foreignKey];
                if (parent.hasOwnProperty(foreignKey))
                    return data;
                this._assertError(data == null, `This relationship lacks a primary or foreign key in the '${relation === null || relation === void 0 ? void 0 : relation.name}' relation. Please review the query to identify whether the key '${localKey}' or '${foreignKey}' is missing.`);
            }).filter((d) => d != null);
            const mainResultIds = Array.from(new Set(localKeyId));
            const modelRelation = relation.query == null ? new relation.model() : relation.query;
            const relationColumn = this.MODEL['_classToTableName'](modelRelation.constructor.name, { singular: true });
            const mainlocalKey = 'id';
            const relationForeignKey = this._valuePattern(`${relationColumn}Id`);
            const localKeyPivotTable = this._valuePattern([pluralize_1.default.singular(this.MODEL['getTableName']()), foreignKey].join("_"));
            const pivotTable = String(((_a = relation.pivot) !== null && _a !== void 0 ? _a : pivot));
            const sqlPivotExists = new Model_1.Model()
                .copyModel(modelRelation)
                .selectRaw("1")
                .whereReference(`\`${modelRelation.getTableName()}\`.\`${foreignKey}\``, `\`${pivotTable}\`.\`${localKey}\``)
                .toString();
            const queryPivot = modelPivot
                ? new modelPivot()
                : new Model_1.Model().table(pivotTable);
            if (relation.count) {
                const pivotResults = yield queryPivot
                    .whereIn(localKeyPivotTable, mainResultIds)
                    .select(localKeyPivotTable)
                    .selectRaw(`${this.$constants('COUNT')}(${localKeyPivotTable}) ${this.$constants('AS')} \`aggregate\``)
                    .when(relation.exists, (query) => query.whereExists(sqlPivotExists))
                    .when(relation.trashed, (query) => query.onlyTrashed())
                    .when(relation.all, (query) => query.disableSoftDelete())
                    .groupBy(localKeyPivotTable)
                    .bind(this.MODEL['$pool'].get())
                    .debug(this.MODEL['$state'].get('DEBUG'))
                    .get();
                for (const parent of parents) {
                    if (parent[name] == null)
                        parent[name] = 0;
                    for (const pivotResult of pivotResults) {
                        if (pivotResult[localKeyPivotTable] !== parent[foreignKey])
                            continue;
                        parent[name] = (_b = pivotResult.aggregate) !== null && _b !== void 0 ? _b : 0;
                    }
                }
                if (this.MODEL['$state'].get('HIDDEN').length)
                    this.MODEL['_hiddenColumnModel'](parents);
                return parents;
            }
            const pivotResults = yield queryPivot
                .whereIn(localKeyPivotTable, mainResultIds)
                .when(relation.query != null, (query) => query.select(localKeyPivotTable, localKey))
                .when(relation.exists, (query) => query.whereExists(sqlPivotExists))
                .when(relation.trashed, (query) => query.onlyTrashed())
                .when(relation.all, (query) => query.disableSoftDelete())
                .bind(this.MODEL['$pool'].get())
                .debug(this.MODEL['$state'].get('DEBUG'))
                .get();
            const relationIds = Array.from(new Set(pivotResults
                .map((pivotResult) => pivotResult[relationForeignKey])
                .filter((d) => d != null)));
            const relationResults = yield this.MODEL.rawQuery(modelRelation
                .whereIn(mainlocalKey, relationIds)
                .when(relation.trashed, (query) => query.disableSoftDelete())
                .toString());
            if (oldVersion) {
                for (const pivotResult of pivotResults) {
                    for (const relationResult of relationResults) {
                        if (relationResult[mainlocalKey] !== pivotResult[relationForeignKey])
                            continue;
                        pivotResult[relationColumn] = relationResult;
                    }
                }
                for (const parent of parents) {
                    if (parent[name] == null)
                        parent[name] = [];
                    for (const pivotResult of pivotResults) {
                        if (pivotResult[localKeyPivotTable] !== parent[foreignKey])
                            continue;
                        parent[name].push(pivotResult);
                    }
                }
                if (this.MODEL['$state'].get('HIDDEN').length)
                    this.MODEL['_hiddenColumnModel'](parents);
                return parents;
            }
            for (const parent of parents) {
                if (parent[name] == null)
                    parent[name] = [];
                for (const pivotResult of pivotResults) {
                    if (pivotResult[localKeyPivotTable] !== parent[foreignKey])
                        continue;
                    const data = relationResults.find(relationResult => relationResult[foreignKey] === pivotResult[localKey]);
                    if (data == null)
                        continue;
                    data.pivot = {
                        [localKeyPivotTable]: pivotResult[localKeyPivotTable],
                        [localKey]: pivotResult[localKey],
                    };
                    parent[name].push(data);
                }
            }
            if (this.MODEL['$state'].get('HIDDEN').length)
                this.MODEL['_hiddenColumnModel'](parents);
            return parents;
        });
    }
    _valueInRelation(relationModel) {
        var _a, _b;
        this._assertError((relationModel === null || relationModel === void 0 ? void 0 : relationModel.query) instanceof Promise, 'The Promise method does not support nested relations.');
        this._assertError(!((relationModel === null || relationModel === void 0 ? void 0 : relationModel.query) instanceof Model_1.Model), 'The callback function only supports instances of the Model class.');
        const relation = relationModel.relation;
        const model = relationModel.model;
        const modelPivot = relationModel.modelPivot;
        const oldVersion = relationModel.oldVersion;
        const query = relationModel === null || relationModel === void 0 ? void 0 : relationModel.query;
        const table = relationModel.freezeTable
            ? relationModel.freezeTable
            : (_a = relationModel.query) === null || _a === void 0 ? void 0 : _a.getTableName();
        let pivot = null;
        const name = relationModel.name;
        const as = relationModel.as;
        this._assertError(!model || model == null, 'Model not found.');
        let localKey = this._valuePattern(relationModel.localKey
            ? relationModel.localKey
            : this.MODEL['$state'].get('PRIMARY_KEY'));
        let foreignKey = relationModel.foreignKey
            ? relationModel.foreignKey
            : this._valuePattern([
                `${pluralize_1.default.singular(this.MODEL['getTableName']())}`,
                `${this.MODEL['$state'].get('PRIMARY_KEY')}`
            ].join('_'));
        const checkRelationIsBelongsTo = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsTo
        ].every(r => r);
        if (checkRelationIsBelongsTo) {
            foreignKey = this._valuePattern(localKey);
            localKey = this._valuePattern([
                `${pluralize_1.default.singular(table !== null && table !== void 0 ? table : '')}`,
                `${this.MODEL['$state'].get('PRIMARY_KEY')}`
            ].join('_'));
        }
        const checkRelationIsBelongsToMany = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsToMany
        ].every(r => r);
        if (checkRelationIsBelongsToMany) {
            localKey = this._valuePattern([
                `${pluralize_1.default.singular(table !== null && table !== void 0 ? table : '')}`,
                `${this.MODEL['$state'].get('PRIMARY_KEY')}`
            ].join('_'));
            foreignKey = 'id';
            const pivotModel = relationModel.query;
            pivot = (_b = relationModel.pivot) !== null && _b !== void 0 ? _b : this._valuePattern([
                pluralize_1.default.singular(this.MODEL['getTableName']()),
                pluralize_1.default.singular(pivotModel.getTableName())
            ].sort().join('_'));
        }
        foreignKey = this.MODEL.covertColumnSchemaToFixColumn(foreignKey);
        localKey = this.MODEL.covertColumnSchemaToFixColumn(localKey);
        return {
            name,
            as,
            relation,
            table,
            localKey,
            foreignKey,
            model,
            query,
            pivot,
            oldVersion,
            modelPivot
        };
    }
    _valuePattern(value) {
        const schema = this.MODEL['$state'].get('SCHEMA_TABLE');
        switch (this.MODEL['$state'].get('PATTERN')) {
            case this.$constants('PATTERN').snake_case: {
                if (schema == null) {
                    return value.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
                }
                const find = schema[value];
                if (find == null || find.column == null) {
                    return value.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
                }
                return find.column;
            }
            case this.$constants('PATTERN').camelCase: {
                if (schema == null) {
                    return value.replace(/(.(\_|-|\s)+.)/g, (str) => `${str[0]}${str[str.length - 1].toUpperCase()}`);
                }
                const find = schema[value];
                if (find == null || find.column == null) {
                    return value.replace(/(.(\_|-|\s)+.)/g, (str) => `${str[0]}${str[str.length - 1].toUpperCase()}`);
                }
                return find.column;
            }
            default: return value;
        }
    }
    _assertError(condition = true, message = 'error') {
        if (typeof condition === 'string') {
            throw new Error(condition);
        }
        if (condition)
            throw new Error(message);
        return;
    }
}
exports.RelationHandler = RelationHandler;
exports.default = RelationHandler;
