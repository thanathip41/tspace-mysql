"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var AbstractModel_1 = require("./AbstractModel");
var pluralize_1 = __importDefault(require("pluralize"));
var DB_1 = require("./DB");
var ProxyHandler_1 = require("./ProxyHandler");
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this._initialModel();
        return new Proxy(_this, ProxyHandler_1.proxyHandler);
    }
    /**
     *
     * Assign function callback in model
     * @return {this} this
     */
    Model.prototype.useRegistry = function () {
        this.$db.set('REGISTRY', __assign(__assign({}, this.$db.get('REGISTRY')), { attach: this._attach, detach: this._detach }));
        return this;
    };
    /**
    *
    * Assign function callback in model
    * @return {this} this
    */
    Model.prototype.usePrimaryKey = function (primary) {
        this.$db.set('PRIMARY_KEY', primary);
        return this;
    };
    /**
     * Assign in model uuid when creating
     * @param {string} uuid custom column uuid
     * @return {this} this
     */
    Model.prototype.useUUID = function (uuid) {
        this.$db.set('UUID', true);
        if (uuid)
            this.$db.set('UUID_FORMAT', uuid);
        return this;
    };
    /**
     * Assign in model console.log sql statement
     * @return {this} this
     */
    Model.prototype.useDebug = function () {
        this.$db.set('DEBUG', true);
        return this;
    };
    /**
     *
     * Assign in model use pattern [snake_case , camelCase]
     * @param  {string} pattern
     * @return {this} this
     */
    Model.prototype.usePattern = function (pattern) {
        var allowPattern = [
            this.$constants('PATTERN').snake_case,
            this.$constants('PATTERN').camelCase
        ];
        this._assertError(!allowPattern.includes(pattern), "allow pattern ".concat(allowPattern, " only"));
        this.$db.set('PATTERN', pattern);
        return this;
    };
    /**
     *
     * Assign in model show data not be deleted
     * Relations has reference this method
     * @return {this} this
     */
    Model.prototype.useSoftDelete = function () {
        this.$db.set('SOFT_DELETE', true);
        this.$db.set('SOFT_DELETE_RELATIONS', true);
        return this;
    };
    /**
     * Assign in model show data not be deleted in relations
     * repicate
     * @return {this} this
     */
    Model.prototype.useDisableSoftDeleteInRelations = function () {
        this.$db.set('SOFT_DELETE_RELATIONS', false);
        return this;
    };
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @return {this} this
     */
    Model.prototype.useTimestamp = function (timestampFormat) {
        this.$db.set('TIMESTAMP', true);
        if (timestampFormat)
            this.$db.set('TIMESTAMP_FORMAT', {
                CREATED_AT: timestampFormat.createdAt,
                UPDATED_AT: timestampFormat.updatedAt
            });
        return this;
    };
    /**
     *
     * Assign table name in model
     * @return {this} this
     */
    Model.prototype.useTable = function (table) {
        this.$db.set('TABLE_NAME', "`".concat(table, "`"));
        this.$db.get('SELECT', "".concat(this.$constants('SELECT'), " *"));
        this.$db.get('FROM', "".concat(this.$constants('FROM'), "'"));
        return this;
    };
    /**
     *
     * Assign table name in model with signgular pattern
     * @return {this} this
     */
    Model.prototype.useTableSingular = function () {
        var table = this._classToTableName(this.constructor.name, { singular: true });
        this.$db.set('TABLE_NAME', "`".concat(pluralize_1.default.singular(table), "`"));
        this.$db.get('SELECT', "".concat(this.$constants('SELECT'), " *"));
        this.$db.get('FROM', "".concat(this.$constants('FROM'), "'"));
        return this;
    };
    /**
     *
     * Assign table name in model with pluarl pattern
     * @return {this} this
     */
    Model.prototype.useTablePlural = function () {
        var table = this._classToTableName(this.constructor.name);
        this.$db.set('TABLE_NAME', "`".concat(pluralize_1.default.plural(table), "`"));
        this.$db.get('SELECT', "".concat(this.$constants('SELECT'), " *"));
        this.$db.get('FROM', "".concat(this.$constants('FROM'), "'"));
        return this;
    };
    /**
     * Assign ignore delete_at in model
     * @return {this} this
     */
    Model.prototype.ignoreSoftDelete = function (condition) {
        if (condition === void 0) { condition = false; }
        this.$db.set('SOFT_DELETE', condition);
        return this;
    };
    /**
     * return ignore delete at all data
     * @return {this} this
     */
    Model.prototype.disableSoftDelete = function (condition) {
        if (condition === void 0) { condition = false; }
        this.$db.set('SOFT_DELETE', condition);
        return this;
    };
    /**
     *
     * @param {function} func
     * @return {this} this
     */
    Model.prototype.registry = function (func) {
        this.$db.set('REGISTRY', __assign(__assign({}, func), { attach: this._attach, detach: this._detach }));
        return this;
    };
    /**
     *
     * relation model retrun result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    Model.prototype.with = function () {
        var _this = this;
        var nameRelations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nameRelations[_i] = arguments[_i];
        }
        var relations = nameRelations.map(function (name) {
            var _a;
            var relation = (_a = _this.$db.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find(function (data) { return data.name === name; });
            if (relation == null)
                throw new Error("relation ".concat(name, " not be register !"));
            var relationHasExists = Object.values(_this.$constants('RELATIONSHIP')).includes(relation.relation);
            if (!relationHasExists) {
                throw new Error("unknown relationship in [".concat(_this.$constants('RELATIONSHIP'), "] !"));
            }
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        relations.sort(function (cur, prev) { return cur.relation.length - prev.relation.length; });
        var setRelations = this.$db.get('WITH').length
            ? __spreadArray(__spreadArray([], __read(relations.map(function (w) {
                var exists = _this.$db.get('WITH').find(function (r) { return r.name === w.name; });
                if (exists)
                    return null;
                return w;
            }).filter(function (d) { return d != null; })), false), __read(this.$db.get('WITH')), false) : relations;
        this.$db.set('WITH', setRelations);
        return this;
    };
    /**
     *
     * relation model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this}
     */
    Model.prototype.withExists = function () {
        var nameRelations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nameRelations[_i] = arguments[_i];
        }
        this.with.apply(this, __spreadArray([], __read(nameRelations), false));
        this.$db.set('WITH_EXISTS', true);
        return this;
    };
    /**
     *
     * deep relation in model return callback query
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    Model.prototype.withQuery = function (nameRelation, callback) {
        var relation = this.$db.get('WITH').find(function (data) { return data.name === nameRelation; });
        if (relation == null)
            throw new Error("relation ".concat(nameRelation, " not be register !"));
        if (!Object.values(this.$constants('RELATIONSHIP')).includes(relation.relation)) {
            throw new Error("unknown relationship in [".concat(this.$constants('RELATIONSHIP'), "] !"));
        }
        relation.query = callback(new relation.model());
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.hasOne = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.hasMany = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.belongsTo = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            as: as,
            model: model,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.belongsToMany = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    /**
    * Assign the relation in model Objects
    * @param {object} relations registry relation in your model
    * @param {string?} relation.name
    * @param {string} relation.as
    * @param {class}  relation.model
    * @param {string} relation.localKey
    * @param {string} relation.foreignKey
    * @param {string} relation.freezeTable
    * @return {this} this
    */
    Model.prototype.hasOneQuery = function (_a, callback) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        var relation = {
            name: nameRelation,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        this.with(nameRelation);
        var r = this.$db.get('WITH').find(function (data) { return data.name === nameRelation; });
        this._assertError(r == null, "relation ".concat(nameRelation, " not be register !"));
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), "unknown relationship in [".concat(this.$constants('RELATIONSHIP'), "] !"));
        r.query = callback(new r.model());
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string?} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.hasManyQuery = function (_a, callback) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        var relation = {
            name: nameRelation,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        this.with(nameRelation);
        var r = this.$db.get('WITH').find(function (data) { return data.name === nameRelation; });
        this._assertError(r == null, "relation ".concat(nameRelation, " not be register !"));
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), "unknown relationship in [".concat(this.$constants('RELATIONSHIP'), "] !"));
        r.query = callback(new r.model());
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.belongsToQuery = function (_a, callback) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        var relation = {
            name: nameRelation,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        this.with(nameRelation);
        var r = this.$db.get('WITH').find(function (data) { return data.name === nameRelation; });
        this._assertError(r == null, "relation ".concat(nameRelation, " not be register !"));
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), "unknown relationship in [".concat(this.$constants('RELATIONSHIP'), "] !"));
        r.query = callback(new r.model());
        return this;
    };
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    Model.prototype.belongsToManyQuery = function (_a, callback) {
        var name = _a.name, as = _a.as, model = _a.model, localKey = _a.localKey, foreignKey = _a.foreignKey, freezeTable = _a.freezeTable;
        var nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        var relation = {
            name: nameRelation,
            model: model,
            as: as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey: localKey,
            foreignKey: foreignKey,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        this.with(nameRelation);
        var r = this.$db.get('WITH').find(function (data) { return data.name === nameRelation; });
        this._assertError(r == null, "relation ".concat(nameRelation, " not be register !"));
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), "unknown relationship in [".concat(this.$constants('RELATIONSHIP'), "] !"));
        r.query = callback(new r.model());
        return this;
    };
    /**
     * return only in trashed (data has been remove)
     * @return {promise}
     */
    Model.prototype.trashed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.whereNotNull(this._valuePattern('deletedAt'));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._execute(sql, 'GET')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * return all only in trashed (data has been remove)
     * @return {promise}
     */
    Model.prototype.onlyTrashed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SOFT_DELETE', false);
                        this.whereNotNull(this._valuePattern('deletedAt'));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._execute(sql, 'GET')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * restore data in trashed
     * @return {promise}
     */
    Model.prototype.restore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAt, deletedAt, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedAt = this._valuePattern('updatedAt');
                        deletedAt = this._valuePattern('deletedAt');
                        query = this.$db.get('TIMESTAMP')
                            ? "".concat(deletedAt, " = NULL , ").concat(updatedAt, " = '").concat(this.$utils.timestamp(), "'")
                            : "".concat(deletedAt, " = NULL");
                        this.$db.set('UPDATE', [
                            "".concat(this.$constants('UPDATE')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "SET ".concat(query)
                        ].join(' '));
                        this.$db.set('SAVE', 'UPDATE');
                        return [4 /*yield*/, this.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {string}
    */
    Model.prototype.toString = function () {
        return this._queryGenrateModel();
    };
    /**
     *
     * @override Method
     * @return {string}
    */
    Model.prototype.toSQL = function () {
        return this._queryGenrateModel();
    };
    /**
     *
     * @override Method
     * @return {promise<string>}
    */
    Model.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _a.sent();
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(result);
                        return [2 /*return*/, JSON.stringify(result)];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<Array>}
    */
    Model.prototype.toArray = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, toArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(column));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _a.sent();
                        toArray = result.map(function (data) { return data[column]; });
                        return [2 /*return*/, toArray];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    Model.prototype.avg = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('AVG'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " avg")
                        ].join(' '));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.avg) || 0];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    Model.prototype.sum = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('SUM'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " sum")
                        ].join(' '));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.sum) || 0];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    Model.prototype.max = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('MAX'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " max")
                        ].join(' '));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.max) || 0];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    Model.prototype.min = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('MIN'), "(").concat(column, ")"),
                            "".concat(this.$constants('AS'), " min")
                        ].join(' '));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.min) || 0];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    Model.prototype.count = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " ").concat(this.$constants('COUNT'), "(").concat(column, ") ").concat(this.$constants('AS'), " total"));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.total) || 0];
                }
            });
        });
    };
    /**
     * delete data from the database
     * @override Method
     * @return {promise<boolean>}
     */
    Model.prototype.delete = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var deletedAt, query, sql, updatedAt, result_1, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't delete without where condition");
                        if (!this.$db.get('SOFT_DELETE')) return [3 /*break*/, 2];
                        deletedAt = this._valuePattern('deletedAt');
                        query = "".concat(deletedAt, " = '").concat(this.$utils.timestamp(), "'");
                        sql = [
                            "".concat(this.$constants('UPDATE')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('SET')),
                            "".concat(query)
                        ].join(' ');
                        if (this.$db.get('TIMESTAMP')) {
                            updatedAt = this._valuePattern('updatedAt');
                            sql = "".concat(sql, " , ").concat(updatedAt, " = '").concat(this.$utils.timestamp(), "'");
                        }
                        this.$db.set('UPDATE', "".concat(sql, " ").concat(this.$db.get('WHERE')));
                        return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('UPDATE') })];
                    case 1:
                        result_1 = _c.sent();
                        return [2 /*return*/, (_a = !!result_1) !== null && _a !== void 0 ? _a : false];
                    case 2:
                        this.$db.set('DELETE', [
                            "".concat(this.$constants('DELETE')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE'))
                        ].join(' '));
                        return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('DELETE') })];
                    case 3:
                        result = _c.sent();
                        return [2 /*return*/, (_b = !!result) !== null && _b !== void 0 ? _b : false];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    Model.prototype.first = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.$db.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        sql = this._queryGenrateModel();
                        if (!!sql.includes(this.$constants('LIMIT'))) return [3 /*break*/, 4];
                        sql = "".concat(sql, " ").concat(this.$constants('LIMIT'), " 1");
                        return [4 /*yield*/, this._execute(sql, 'FIRST')];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        sql = sql.replace(this.$db.get('LIMIT'), "".concat(this.$constants('LIMIT'), " 1"));
                        return [4 /*yield*/, this._execute(sql, 'FIRST')];
                    case 5: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    Model.prototype.findOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.first()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    Model.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME'))
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    Model.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE')),
                            "".concat(this.$constants('PRIMARY_KEY'), " = ").concat(id)
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.shift() || null];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    Model.prototype.get = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.$db.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._execute(sql, 'GET')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    Model.prototype.findMany = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.$db.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._execute(sql, 'GET')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    Model.prototype.pagination = function (paginationOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var limit, page, offset, sql;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        limit = 15;
                        page = 1;
                        if (paginationOptions != null) {
                            limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                            page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
                        }
                        this._assertError((_a = this.$logger) === null || _a === void 0 ? void 0 : _a.check('limit'), "this '[pagination]' can't support '[limit]' method");
                        if (!((_b = this.$db.get('EXCEPT')) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        offset = (page - 1) * limit;
                        this.$db.set('PER_PAGE', limit);
                        this.$db.set('PAGE', page);
                        sql = this._queryGenrateModel();
                        if (!!sql.includes(this.$constants('LIMIT'))) return [3 /*break*/, 4];
                        sql = [
                            "".concat(sql),
                            "".concat(this.$constants('LIMIT')),
                            "".concat(limit),
                            "".concat(this.$constants('OFFSET')),
                            "".concat(offset)
                        ].join(' ');
                        return [4 /*yield*/, this._execute(sql, 'PAGINATION')];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4:
                        sql = sql.replace(this.$db.get('LIMIT'), [
                            "".concat(this.$constants('LIMIT')),
                            "".concat(limit),
                            "".concat(this.$constants('OFFSET')),
                            "".concat(offset)
                        ].join(' '));
                        return [4 /*yield*/, this._execute(sql, 'PAGINATION')];
                    case 5: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {Object} pagination page , limit
     * @param {number} pagination.limit
     * @param {number} pagination.page
     * @return {promise<Pagination>}
     */
    Model.prototype.paginate = function (paginationOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = 15;
                        page = 1;
                        if (paginationOptions != null) {
                            limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                            page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
                        }
                        return [4 /*yield*/, this.pagination({ limit: limit, page: page })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @override Method
     * @param {string} column
     * @return {Promise<array>}
     */
    Model.prototype.getGroupBy = function (column) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, results, data, sqlChild, childData, child, resultData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.$db.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        this.$db.set('GROUP_BY', "".concat(this.$constants('GROUP_BY'), " ").concat(column));
                        this.$db.set('SELECT', [
                            "".concat(this.$db.get('SELECT'), ","),
                            "".concat(this.$constants('GROUP_CONCAT'), "(id)"),
                            "".concat(this.$constants('AS'), " data")
                        ].join(' '));
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 3:
                        results = _b.sent();
                        data = [];
                        results.forEach(function (result) {
                            var _a, _b;
                            var splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                            splits.forEach(function (split) { return data = __spreadArray(__spreadArray([], __read(data), false), [split], false); });
                        });
                        sqlChild = [
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id"),
                            "".concat(this.$constants('IN')),
                            "(".concat(data.map(function (a) { return "'".concat(a, "'"); }).join(',') || ['0'], ")")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sqlChild)];
                    case 4:
                        childData = _b.sent();
                        return [4 /*yield*/, this._executeGroup(childData)];
                    case 5:
                        child = _b.sent();
                        resultData = results.map(function (result) {
                            var _a;
                            var id = result[column];
                            var newData = child.filter(function (data) { return data[column] === id; });
                            return (_a = {},
                                _a[column] = id,
                                _a.data = newData,
                                _a);
                        });
                        return [2 /*return*/, resultData];
                }
            });
        });
    };
    /**
     *
     * update data in the database
     * @override Method
     * @param {object} data
     * @return {this} this
     */
    Model.prototype.update = function (data) {
        var query = this._queryUpdateModel(data);
        this.$db.set('UPDATE', [
            "".concat(this.$constants('UPDATE')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE');
        return this;
    };
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    Model.prototype.insert = function (data) {
        var query = this._queryInsertModel(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    Model.prototype.create = function (data) {
        var query = this._queryInsertModel(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    Model.prototype.updateOrCreate = function (data) {
        var queryUpdate = this._queryUpdateModel(data);
        var queryInsert = this._queryInsertModel(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(queryInsert)
        ].join(' '));
        this.$db.set('UPDATE', [
            "".concat(this.$constants('UPDATE')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(queryUpdate)
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    };
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    Model.prototype.updateOrInsert = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
    *
    * @override Method
    * @param {object} data for update or create
    * @return {this} this
    */
    Model.prototype.insertOrUpdate = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    Model.prototype.createOrUpdate = function (data) {
        this.updateOrCreate(data);
        return this;
    };
    /**
     *
     * insert muliple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    Model.prototype.createMultiple = function (data) {
        var query = this._queryInsertMultipleModel(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    /**
     *
     * insert muliple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    Model.prototype.insertMultiple = function (data) {
        var query = this._queryInsertMultipleModel(data);
        this.$db.set('INSERT', [
            "".concat(this.$constants('INSERT')),
            "".concat(this.$db.get('TABLE_NAME')),
            "".concat(query)
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    /**
     *
     * @override Method
     * @param {object?} transaction using DB.beginTransaction()
     * Ex. +---------------------------------------------------+
     * const transaction = await new DB().beginTransaction()
     *
     * try {
     *      const useSave = await create  ...something then .save(transaction)
     *      const useSave2 = await create ...something then .save(transaction)
     *      throw new Error('try to errors')
     * } catch (e) {
     *      const rollback = await transaction.rollback()
     *      // rollback => ture
     *      // !done transaction has been rolled back [useSave , useSave2]
     * }
     *
     * @return {Promise<array | object | null>}
     */
    Model.prototype.save = function (transaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var attributes, query_1, query, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (transaction != null)
                            this.$db.set('TRANSACTION', transaction);
                        attributes = this.$attributes;
                        if ((_a = Object.keys(attributes)) === null || _a === void 0 ? void 0 : _a.length) {
                            while (true) {
                                if (this.$db.get('WHERE')) {
                                    query_1 = this._queryUpdateModel(attributes);
                                    this.$db.set('UPDATE', [
                                        "".concat(this.$constants('UPDATE')),
                                        "".concat(this.$db.get('TABLE_NAME')),
                                        "".concat(query_1)
                                    ].join(' '));
                                    this.$db.set('SAVE', 'UPDATE');
                                    break;
                                }
                                query = this._queryInsertModel(attributes);
                                this.$db.set('INSERT', [
                                    "".concat(this.$constants('INSERT')),
                                    "".concat(this.$db.get('TABLE_NAME')),
                                    "".concat(query)
                                ].join(' '));
                                this.$db.set('SAVE', 'INSERT');
                                break;
                            }
                        }
                        _b = this.$db.get('SAVE');
                        switch (_b) {
                            case 'INSERT_MULTIPLE': return [3 /*break*/, 1];
                            case 'INSERT': return [3 /*break*/, 3];
                            case 'UPDATE': return [3 /*break*/, 5];
                            case 'INSERT_NOT_EXISTS': return [3 /*break*/, 7];
                            case 'UPDATE_OR_INSERT': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this._createMultipleModel()];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [4 /*yield*/, this._createModel()];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [4 /*yield*/, this._updateModel()];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this._insertNotExistsModel()];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [4 /*yield*/, this._updateOrInsertModel()];
                    case 10: return [2 /*return*/, _c.sent()];
                    case 11: throw new Error("unknown this [".concat(this.$db.get('SAVE'), "]"));
                }
            });
        });
    };
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any}
     */
    Model.prototype.faker = function (rows) {
        if (rows === void 0) { rows = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var data, row, sql, fields, columnAndValue, fields_1, fields_1_1, _a, field, type, check, query;
            var e_1, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data = [];
                        row = 0;
                        _d.label = 1;
                    case 1:
                        if (!(row < rows)) return [3 /*break*/, 4];
                        sql = [
                            "".concat(this.$constants('SHOW')),
                            "".concat(this.$constants('FIELDS')),
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME'))
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 2:
                        fields = _d.sent();
                        columnAndValue = {};
                        try {
                            for (fields_1 = (e_1 = void 0, __values(fields)), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                _a = fields_1_1.value, field = _a.Field, type = _a.Type;
                                check = [
                                    field.toLowerCase() === 'id',
                                    field.toLowerCase() === '_id',
                                    field.toLowerCase() === 'uuid'
                                ].some(function (f) { return f; });
                                if (check)
                                    continue;
                                columnAndValue = __assign(__assign({}, columnAndValue), (_c = {}, _c[field] = this.$utils.faker(type), _c));
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        data = __spreadArray(__spreadArray([], __read(data), false), [columnAndValue], false);
                        _d.label = 3;
                    case 3:
                        row++;
                        return [3 /*break*/, 1];
                    case 4:
                        query = this._queryInsertMultipleModel(data);
                        this.$db.set('INSERT', [
                            "".concat(this.$constants('INSERT')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(query)
                        ].join(' '));
                        this.$db.set('SAVE', 'INSERT_MULTIPLE');
                        return [4 /*yield*/, this.save()];
                    case 5: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    /**
    *
    * @override Method
    * @param {number} id
    * @return {this}
    */
    Model.prototype.whereUser = function (id) {
        var column = this._valuePattern('userId');
        id = this.$utils.escape(id);
        if (!this.$db.get('WHERE').includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                "".concat(this.$constants('WHERE')),
                "".concat(column, " = '").concat(id, "'")
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            "".concat(this.$db.get('WHERE')),
            "".concat(this.$constants('AND')),
            "".concat(column, " = '").concat(id, "'")
        ].join(' '));
        return this;
    };
    Model.prototype._queryStatementModel = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.$db.get('DEBUG'))
                            this.$utils.consoleDebug(sql);
                        return [4 /*yield*/, this.$pool.get(sql)];
                    case 1:
                        result = _a.sent();
                        this._registry(result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Model.prototype._actionStatementModel = function (_a) {
        var _b = _a === void 0 ? {} : _a, sql = _b.sql, _c = _b.returnId, returnId = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var result_2, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.$db.get('DEBUG'))
                            this.$utils.consoleDebug(sql);
                        if (!returnId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$pool.get(sql)];
                    case 1:
                        result_2 = _d.sent();
                        return [2 /*return*/, [result_2.affectedRows, result_2.insertId]];
                    case 2: return [4 /*yield*/, this.$pool.get(sql)];
                    case 3:
                        result = (_d.sent()).affectedRows;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Model.prototype._valuePattern = function (value) {
        switch (this.$db.get('PATTERN')) {
            case this.$constants('PATTERN').snake_case: {
                return value.replace(/([A-Z])/g, function (str) { return "_".concat(str.toLowerCase()); });
            }
            case this.$constants('PATTERN').camelCase: {
                return value.replace(/(.(\_|-|\s)+.)/g, function (str) { return "".concat(str[0]).concat(str[str.length - 1].toUpperCase()); });
            }
            default: return value;
        }
    };
    Model.prototype._isPatternSnakeCase = function () {
        return this.$db.get('PATTERN') === this.$constants('PATTERN').snake_case;
    };
    Model.prototype._classToTableName = function (className, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.singular, singular = _c === void 0 ? false : _c;
        if (className == null)
            className = this.constructor.name;
        var tb = className.replace(/([A-Z])/g, function (str) { return '_' + str.toLowerCase(); }).slice(1);
        if (singular)
            return tb;
        return pluralize_1.default.plural(tb);
    };
    Model.prototype._tableName = function () {
        var tb = this._classToTableName();
        this.$db.set('SELECT', "".concat(this.$constants('SELECT'), " *"));
        this.$db.set('FROM', "".concat(this.$constants('FROM')));
        this.$db.set('TABLE_NAME', "`".concat(tb, "`"));
        return this;
    };
    Model.prototype._valueInRelation = function (relationModel) {
        var _a, _b;
        var relation = relationModel.relation;
        var model = (_a = relationModel.model) === null || _a === void 0 ? void 0 : _a.name;
        var table = relationModel.freezeTable
            ? relationModel.freezeTable
            : (_b = relationModel.query) === null || _b === void 0 ? void 0 : _b.tableName;
        var name = relationModel.name;
        var as = relationModel.as;
        if (!model || model == null)
            throw new Error('Not found model');
        var localKey = relationModel.localKey
            ? relationModel.localKey
            : this.$db.get('PRIMARY_KEY');
        var foreignKey = relationModel.foreignKey
            ? relationModel.foreignKey
            : this._valuePattern([
                "".concat(pluralize_1.default.singular(this.$db.get('TABLE_NAME').replace(/\`/g, ''))),
                "".concat(this.$db.get('PRIMARY_KEY'))
            ].join('_'));
        var checkRelationIsBelongsTo = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsTo
        ].every(function (c) { return c; });
        if (checkRelationIsBelongsTo) {
            foreignKey = localKey;
            localKey = this._valuePattern([
                "".concat(pluralize_1.default.singular(table)),
                "".concat(this.$db.get('PRIMARY_KEY'))
            ].join('_'));
        }
        return { name: name, as: as, relation: relation, table: table, localKey: localKey, foreignKey: foreignKey, model: model };
    };
    Model.prototype._queryGenrateModel = function () {
        var sql = [];
        while (true) {
            if (this.$db.get('SOFT_DELETE')) {
                var deletedAt = this._valuePattern('deletedAt');
                this.whereNull(deletedAt);
            }
            if (this.$db.get('INSERT')) {
                sql = [
                    this.$db.get('INSERT')
                ];
                break;
            }
            if (this.$db.get('UPDATE')) {
                sql = [
                    this.$db.get('UPDATE'),
                    this.$db.get('WHERE'),
                ];
                break;
            }
            if (this.$db.get('DELETE')) {
                sql = [
                    this.$db.get('DELETE')
                ];
                break;
            }
            sql = [
                this.$db.get('SELECT'),
                this.$db.get('FROM'),
                this.$db.get('TABLE_NAME'),
                this.$db.get('JOIN'),
                this.$db.get('WHERE'),
                this.$db.get('GROUP_BY'),
                this.$db.get('HAVING'),
                this.$db.get('ORDER_BY'),
                this.$db.get('LIMIT'),
                this.$db.get('OFFSET')
            ];
            break;
        }
        var filterSql = sql.filter(function (data) { return data !== '' || data == null; });
        return filterSql.join(' ');
    };
    Model.prototype._exceptColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, rawColumns, columns, removeExcept;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = [
                            "".concat(this.$constants('SHOW')),
                            "".concat(this.$constants('COLUMNS')),
                            "".concat(this.$constants('FROM')),
                            "".concat(this.$db.get('TABLE_NAME'))
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        rawColumns = _a.sent();
                        columns = rawColumns.map(function (column) { return column.Field; });
                        removeExcept = columns.filter(function (column) { return !_this.$db.get('EXCEPT').includes(column); });
                        this.select(removeExcept.join(','));
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Model.prototype._showOnly = function (data) {
        var _this = this;
        var result = [];
        var hasNameRelation = this.$db.get('WITH').map(function (w) { var _a; return (_a = w.as) !== null && _a !== void 0 ? _a : w.name; });
        data.forEach(function (d) {
            var newData = {};
            _this.$db.get('ONLY').forEach(function (only) {
                var _a;
                if (d.hasOwnProperty(only))
                    newData = __assign(__assign({}, newData), (_a = {}, _a[only] = d[only], _a));
            });
            hasNameRelation.forEach(function (name) {
                var _a;
                if (name)
                    newData = __assign(__assign({}, newData), (_a = {}, _a[name] = d[name], _a));
            });
            result = __spreadArray(__spreadArray([], __read(result), false), [newData], false);
        });
        return result;
    };
    Model.prototype._execute = function (sql, type) {
        return __awaiter(this, void 0, void 0, function () {
            var result, emptyData, relations, relations_1, relations_1_1, relation, relationIsBelongsToMany, dataFromRelation, e_2_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        emptyData = this._returnEmpty(type);
                        if (!result.length)
                            return [2 /*return*/, emptyData];
                        relations = this.$db.get('WITH');
                        if (!relations.length)
                            return [2 /*return*/, this._returnResult(type, result) || emptyData];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 9, 10, 11]);
                        relations_1 = __values(relations), relations_1_1 = relations_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!relations_1_1.done) return [3 /*break*/, 8];
                        relation = relations_1_1.value;
                        relationIsBelongsToMany = relation.relation === this.$constants('RELATIONSHIP').belongsToMany;
                        if (!relationIsBelongsToMany) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._belongsToMany(result, relation)];
                    case 4:
                        result = _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._relation(result, relation)];
                    case 6:
                        dataFromRelation = _b.sent();
                        result = this._relationFilter(result, dataFromRelation, relation);
                        _b.label = 7;
                    case 7:
                        relations_1_1 = relations_1.next();
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (relations_1_1 && !relations_1_1.done && (_a = relations_1.return)) _a.call(relations_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(result);
                        return [2 /*return*/, this._returnResult(type, result) || emptyData];
                }
            });
        });
    };
    Model.prototype._executeGroup = function (dataParents, type) {
        var _a;
        if (type === void 0) { type = 'GET'; }
        return __awaiter(this, void 0, void 0, function () {
            var emptyData, relations, relations_2, relations_2_1, relation, dataChilds, e_3_1, resultData;
            var e_3, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        emptyData = this._returnEmpty(type);
                        if (!dataParents.length)
                            return [2 /*return*/, emptyData];
                        relations = this.$db.get('WITH');
                        if (!relations.length) return [3 /*break*/, 8];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        relations_2 = __values(relations), relations_2_1 = relations_2.next();
                        _c.label = 2;
                    case 2:
                        if (!!relations_2_1.done) return [3 /*break*/, 5];
                        relation = relations_2_1.value;
                        if (relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                            return [2 /*return*/, this._belongsToMany(dataParents, relation)];
                        }
                        return [4 /*yield*/, this._relation(dataParents, relation)];
                    case 3:
                        dataChilds = _c.sent();
                        dataParents = this._relationFilter(dataParents, dataChilds, relation);
                        _c.label = 4;
                    case 4:
                        relations_2_1 = relations_2.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_3_1 = _c.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (relations_2_1 && !relations_2_1.done && (_b = relations_2.return)) _b.call(relations_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumnModel(dataParents);
                        resultData = this._returnResult(type, dataParents);
                        return [2 /*return*/, resultData || emptyData];
                }
            });
        });
    };
    Model.prototype._relationFilter = function (dataParents, dataChilds, relations) {
        var e_4, _a, e_5, _b;
        var _this = this;
        var _c = this._valueInRelation(relations), name = _c.name, as = _c.as, relation = _c.relation, localKey = _c.localKey, foreignKey = _c.foreignKey;
        var keyRelation = as !== null && as !== void 0 ? as : name;
        try {
            for (var dataParents_1 = __values(dataParents), dataParents_1_1 = dataParents_1.next(); !dataParents_1_1.done; dataParents_1_1 = dataParents_1.next()) {
                var dataParent = dataParents_1_1.value;
                var relationIsHasOneOrBelongsTo = [
                    this.$constants('RELATIONSHIP').hasOne,
                    this.$constants('RELATIONSHIP').belongsTo
                ].some(function (r) { return r === relation; });
                if (relationIsHasOneOrBelongsTo)
                    dataParent[keyRelation] = null;
                else
                    dataParent[keyRelation] = [];
                if (!dataChilds.length)
                    continue;
                try {
                    for (var dataChilds_1 = (e_5 = void 0, __values(dataChilds)), dataChilds_1_1 = dataChilds_1.next(); !dataChilds_1_1.done; dataChilds_1_1 = dataChilds_1.next()) {
                        var dataChild = dataChilds_1_1.value;
                        if (dataChild[foreignKey] === dataParent[localKey]) {
                            var relationIsHasOneOrBelongsTo_1 = [
                                this.$constants('RELATIONSHIP').hasOne,
                                this.$constants('RELATIONSHIP').belongsTo
                            ].some(function (r) { return r === relation; });
                            if (relationIsHasOneOrBelongsTo_1) {
                                dataParent[keyRelation] = dataParent[keyRelation] || dataChild;
                                continue;
                            }
                            if (dataParent[keyRelation] == null)
                                dataParent[keyRelation] = [];
                            dataParent[keyRelation].push(dataChild);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (dataChilds_1_1 && !dataChilds_1_1.done && (_b = dataChilds_1.return)) _b.call(dataChilds_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (dataParents_1_1 && !dataParents_1_1.done && (_a = dataParents_1.return)) _a.call(dataParents_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (this.$db.get('WITH_EXISTS')) {
            var dataPerentOnlyRelationIsNotNull = dataParents.filter(function (dataPerent) {
                if (Array.isArray(dataPerent[keyRelation])) {
                    var isNotEmpty_1 = Boolean(dataPerent[keyRelation].length);
                    if (!isNotEmpty_1 && dataPerent.id) {
                        _this.$db.set('WITH_EXISTS_NOT_ID', __spreadArray(__spreadArray([], __read(_this.$db.get('WITH_EXISTS_NOT_ID')), false), [
                            dataPerent.id
                        ], false));
                    }
                    return isNotEmpty_1;
                }
                var isNotEmpty = dataPerent[keyRelation] != null;
                if (!isNotEmpty && dataPerent.id) {
                    _this.$db.set('WITH_EXISTS_NOT_ID', __spreadArray(__spreadArray([], __read(_this.$db.get('WITH_EXISTS_NOT_ID')), false), [
                        dataPerent.id
                    ], false));
                }
                return isNotEmpty;
            });
            return dataPerentOnlyRelationIsNotNull;
        }
        return dataParents;
    };
    Model.prototype._relation = function (parents, relation) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, localKey, foreignKey, localKeyId, dataPerentId, query, dataFromRelation;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length))
                            return [2 /*return*/, []];
                        _b = this._valueInRelation(relation), localKey = _b.localKey, foreignKey = _b.foreignKey;
                        localKeyId = parents.map(function (parent) {
                            return parent[localKey];
                        }).filter(function (data) { return data != null; });
                        dataPerentId = Array.from(new Set(localKeyId)) || [];
                        if (!dataPerentId.length && this.$db.get('WITH_EXISTS'))
                            return [2 /*return*/, []];
                        this._assertError(!dataPerentId.length, "unknown relationship without primary or foreign key");
                        return [4 /*yield*/, relation.query];
                    case 1:
                        query = _c.sent();
                        this._assertError(query == null, "unknown callback query in [relation : '".concat(relation.name, "']"));
                        return [4 /*yield*/, query
                                .whereIn(foreignKey, dataPerentId)
                                .debug(this.$db.get('DEBUG'))
                                .ignoreSoftDelete(this.$db.get('SOFT_DELETE_RELATIONS'))
                                .get()];
                    case 2:
                        dataFromRelation = _c.sent();
                        return [2 /*return*/, dataFromRelation];
                }
            });
        });
    };
    Model.prototype._handleBelongsToMany = function (dataFromParent, relation, pivotTable) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, localKey, foreignKey, localKeyId, dataPerentId, modelOther, other, otherlocalKey, otherforeignKey, sqldataChilds, dataChilds, otherId, otherArrId, otherdataChilds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this._valueInRelation(relation), name = _a.name, localKey = _a.localKey, foreignKey = _a.foreignKey;
                        localKeyId = dataFromParent.map(function (dataPerent) {
                            return dataPerent[localKey];
                        }).filter(function (data) { return data != null; });
                        dataPerentId = Array.from(new Set(localKeyId)).join(',') || [];
                        this._assertError(!dataPerentId.length, "unknown relationship without primary or foreign key");
                        modelOther = new relation.model();
                        other = this._classToTableName(modelOther.constructor.name, { singular: true });
                        otherlocalKey = 'id';
                        otherforeignKey = this._valuePattern("".concat(other, "Id"));
                        sqldataChilds = [
                            "".concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$constants('FROM')),
                            "".concat(pivotTable),
                            "".concat(this.$constants('WHERE')),
                            "".concat(foreignKey, " ").concat(this.$constants('IN'), " (").concat(dataPerentId, ")")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sqldataChilds)];
                    case 1:
                        dataChilds = _b.sent();
                        otherId = dataChilds.map(function (sub) { return sub[otherforeignKey]; }).filter(function (data) { return data != null; });
                        otherArrId = Array.from(new Set(otherId)) || [];
                        return [4 /*yield*/, this._queryStatementModel(modelOther
                                .whereIn(otherlocalKey, otherArrId)
                                .toString())];
                    case 2:
                        otherdataChilds = _b.sent();
                        dataChilds.forEach(function (sub) {
                            sub[other] = [];
                            otherdataChilds.forEach(function (otherSub) {
                                if (otherSub[otherlocalKey] === sub[otherforeignKey]) {
                                    sub[other] = otherSub;
                                }
                            });
                        });
                        dataFromParent.forEach(function (dataPerent) {
                            if (dataPerent[name] == null)
                                dataPerent[name] = [];
                            dataChilds.forEach(function (sub) {
                                if (sub[foreignKey] === dataPerent[localKey]) {
                                    dataPerent[name].push(sub);
                                }
                            });
                        });
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(dataFromParent);
                        return [2 /*return*/, dataFromParent];
                }
            });
        });
    };
    Model.prototype._belongsToMany = function (dataFromParent, relation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var local, modelOther, other, pivotTable, err_1, pivotTable, e_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        local = this.$utils.columnRelation(this.constructor.name);
                        modelOther = new relation.model();
                        other = this._classToTableName(modelOther.constructor.name, { singular: true });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 8]);
                        pivotTable = (_a = relation.freezeTable) !== null && _a !== void 0 ? _a : "".concat(local, "_").concat(other);
                        return [4 /*yield*/, this._handleBelongsToMany(dataFromParent, relation, pivotTable)];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3:
                        err_1 = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        pivotTable = (_b = relation.freezeTable) !== null && _b !== void 0 ? _b : "".concat(other, "_").concat(local);
                        return [4 /*yield*/, this._handleBelongsToMany(dataFromParent, relation, pivotTable)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6:
                        e_6 = _c.sent();
                        throw new Error(err_1.message);
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._pagination = function (data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var currentPage, limit, sql, res, total, lastPage, nextPage, prevPage, totalPage, meta;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        currentPage = +(this.$db.get('PAGE'));
                        this.select([
                            "".concat(this.$constants('COUNT'), "(").concat(this.$db.get('PRIMARY_KEY'), ")"),
                            "".concat(this.$constants('AS')),
                            "total"
                        ].join(' '));
                        limit = Number(this.$db.get('PER_PAGE'));
                        this._assertError(limit < 1, "minimun less 1 of limit");
                        if (Boolean((_a = this.$db.get('WITH_EXISTS_NOT_ID')) === null || _a === void 0 ? void 0 : _a.length)) {
                            this.whereNotIn('id', __spreadArray([], __read(new Set(this.$db.get('WITH_EXISTS_NOT_ID'))), false));
                        }
                        sql = this._queryGenrateModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        res = _d.sent();
                        total = (_b = res.shift().total) !== null && _b !== void 0 ? _b : 0;
                        lastPage = Math.ceil(total / limit) || 0;
                        lastPage = lastPage > 1 ? lastPage : 1;
                        nextPage = currentPage + 1;
                        prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
                        totalPage = (_c = data === null || data === void 0 ? void 0 : data.length) !== null && _c !== void 0 ? _c : 0;
                        meta = {
                            total: total,
                            limit: limit,
                            totalPage: totalPage,
                            currentPage: currentPage,
                            lastPage: lastPage,
                            nextPage: nextPage,
                            prevPage: prevPage,
                        };
                        if (this._isPatternSnakeCase()) {
                            return [2 /*return*/, this.$utils.snakeCase(this._result({
                                    meta: meta,
                                    data: data
                                }))];
                        }
                        return [2 /*return*/, this._result({
                                meta: meta,
                                data: data
                            })];
                }
            });
        });
    };
    Model.prototype._result = function (data) {
        this.$db.get('RESULT', data);
        return data;
    };
    Model.prototype._returnEmpty = function (type) {
        var emptyData = null;
        switch (type) {
            case 'FIRST': {
                emptyData = null;
                break;
            }
            case 'GET': {
                emptyData = [];
                break;
            }
            case 'PAGINATION': {
                emptyData = {
                    meta: {
                        total: 0,
                        limit: Number(this.$db.get('PER_PAGE')),
                        totalPage: 0,
                        currentPage: Number(this.$db.get('PAGE')),
                        lastPage: 0,
                        nextPage: 0,
                        prevPage: 0
                    },
                    data: []
                };
                break;
            }
            default: {
                throw new Error('Missing method first get or pagination');
            }
        }
        if (this._isPatternSnakeCase())
            return this.$utils.snakeCase(this._result(emptyData));
        return this._result(emptyData);
    };
    Model.prototype._returnResult = function (type, data) {
        var _this = this;
        var _a, _b, _c;
        if ((_a = Object.keys(this.$db.get('REGISTRY'))) === null || _a === void 0 ? void 0 : _a.length) {
            data === null || data === void 0 ? void 0 : data.forEach(function (d) {
                for (var name in _this.$db.get('REGISTRY')) {
                    var registry = _this.$db.get('REGISTRY');
                    d[name] = registry[name];
                }
            });
        }
        if ((_b = this.$db.get('ONLY')) === null || _b === void 0 ? void 0 : _b.length) {
            data = this._showOnly(data);
        }
        switch (type) {
            case 'FIRST': {
                if (this.$db.get('PLUCK')) {
                    var pluck = this.$db.get('PLUCK');
                    var newData = data.shift();
                    var checkProperty = newData.hasOwnProperty(pluck);
                    this._assertError(!checkProperty, "can't find property '".concat(pluck, "' of result"));
                    return this._result(newData[pluck]);
                }
                return this._result((_c = data.shift()) !== null && _c !== void 0 ? _c : null);
            }
            case 'GET': {
                if (this.$db.get('CHUNK')) {
                    var result = data.reduce(function (resultArray, item, index) {
                        var chunkIndex = Math.floor(index / _this.$db.get('CHUNK'));
                        if (!resultArray[chunkIndex])
                            resultArray[chunkIndex] = [];
                        resultArray[chunkIndex].push(item);
                        return resultArray;
                    }, []);
                    return this._result(result);
                }
                if (this.$db.get('PLUCK')) {
                    var pluck_1 = this.$db.get('PLUCK');
                    var newData = data.map(function (d) { return d[pluck_1]; });
                    this._assertError(newData.every(function (d) { return d == null; }), "can't find property '".concat(pluck_1, "' of result"));
                    return this._result(newData);
                }
                return this._result(data);
            }
            case 'PAGINATION': {
                return this._pagination(data);
            }
            default: {
                throw new Error('Missing method first get or pagination');
            }
        }
    };
    Model.prototype._hiddenColumnModel = function (object) {
        var hidden = this.$db.get('HIDDEN');
        if (object === null || object === void 0 ? void 0 : object.length) {
            hidden.forEach(function (column) {
                object.forEach(function (objColumn) {
                    delete objColumn[column];
                });
            });
        }
        return object;
    };
    Model.prototype._attach = function (name, dataId, fields) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var relation, thisTable, relationTable, result, pivotTable, success, e_7, errorTable, search, pivotTable, success, e_8;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._assertError(!Array.isArray(dataId), "this ".concat(dataId, " is not an array"));
                        relation = (_a = this.$db.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find(function (data) { return data.name === name; });
                        this._assertError(!relation, "unknown name relation ['".concat(name, "'] in model"));
                        thisTable = this.$utils.columnRelation(this.constructor.name);
                        relationTable = this._classToTableName(relation.model.name, { singular: true });
                        result = this.$db.get('RESULT');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 8]);
                        pivotTable = "".concat(thisTable, "_").concat(relationTable);
                        return [4 /*yield*/, new DB_1.DB().table(pivotTable).createMultiple(dataId.map(function (id) {
                                var _a;
                                return __assign((_a = {}, _a[_this._valuePattern("".concat(relationTable, "Id"))] = id, _a[_this._valuePattern("".concat(thisTable, "Id"))] = result.id, _a), fields);
                            })).save()];
                    case 2:
                        success = _b.sent();
                        return [2 /*return*/, success];
                    case 3:
                        e_7 = _b.sent();
                        errorTable = e_7.message;
                        search = errorTable.search("ER_NO_SUCH_TABLE");
                        if (!!search)
                            throw new Error(e_7.message);
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        pivotTable = "".concat(relationTable, "_").concat(thisTable);
                        return [4 /*yield*/, new DB_1.DB().table(pivotTable).createMultiple(dataId.map(function (id) {
                                var _a;
                                return __assign((_a = {}, _a[_this._valuePattern("".concat(relationTable, "Id"))] = id, _a[_this._valuePattern("".concat(thisTable, "Id"))] = result.id, _a), fields);
                            })).save()];
                    case 5:
                        success = _b.sent();
                        return [2 /*return*/, success];
                    case 6:
                        e_8 = _b.sent();
                        throw new Error(e_8.message);
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._detach = function (name, dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var relation, thisTable, relationTable, result, pivotTable, dataId_1, dataId_1_1, id, e_9_1, e_10, errorTable, search, pivotTable, dataId_2, dataId_2_1, id, e_11_1, e_12;
            var e_9, _a, e_11, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._assertError(!Array.isArray(dataId), "this ".concat(dataId, " is not an array"));
                        relation = this.$db.get('RELATION').find(function (data) { return data.name === name; });
                        this._assertError(!relation, "unknown name relation [".concat(name, "] in model"));
                        thisTable = this.$utils.columnRelation(this.constructor.name);
                        relationTable = this._classToTableName(relation.model.name, { singular: true });
                        result = this.$db.get('RESULT');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 22]);
                        pivotTable = "".concat(thisTable, "_").concat(relationTable);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 7, 8, 9]);
                        dataId_1 = __values(dataId), dataId_1_1 = dataId_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!dataId_1_1.done) return [3 /*break*/, 6];
                        id = dataId_1_1.value;
                        return [4 /*yield*/, new DB_1.DB().table(pivotTable)
                                .where(this._valuePattern("".concat(relationTable, "Id")), id)
                                .where(this._valuePattern("".concat(thisTable, "Id")), result.id)
                                .delete()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        dataId_1_1 = dataId_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_9_1 = _c.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (dataId_1_1 && !dataId_1_1.done && (_a = dataId_1.return)) _a.call(dataId_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, true];
                    case 10:
                        e_10 = _c.sent();
                        errorTable = e_10.message;
                        search = errorTable.search("ER_NO_SUCH_TABLE");
                        if (!!search)
                            throw new Error(e_10.message);
                        _c.label = 11;
                    case 11:
                        _c.trys.push([11, 20, , 21]);
                        pivotTable = "".concat(relationTable, "_").concat(thisTable);
                        _c.label = 12;
                    case 12:
                        _c.trys.push([12, 17, 18, 19]);
                        dataId_2 = __values(dataId), dataId_2_1 = dataId_2.next();
                        _c.label = 13;
                    case 13:
                        if (!!dataId_2_1.done) return [3 /*break*/, 16];
                        id = dataId_2_1.value;
                        return [4 /*yield*/, new DB_1.DB().table(pivotTable)
                                .where(this._valuePattern("".concat(relationTable, "Id")), id)
                                .where(this._valuePattern("".concat(thisTable, "Id")), result.id)
                                .delete()];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        dataId_2_1 = dataId_2.next();
                        return [3 /*break*/, 13];
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        e_11_1 = _c.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 19];
                    case 18:
                        try {
                            if (dataId_2_1 && !dataId_2_1.done && (_b = dataId_2.return)) _b.call(dataId_2);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/, true];
                    case 20:
                        e_12 = _c.sent();
                        throw new Error(e_12.message);
                    case 21: return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._queryUpdateModel = function (objects) {
        var _a;
        var _this = this;
        if (this.$db.get('TIMESTAMP')) {
            var updatedAt = this._valuePattern('updatedAt');
            objects = __assign(__assign({}, objects), (_a = {}, _a[updatedAt] = this.$utils.timestamp(), _a));
        }
        var keyValue = Object.entries(objects).map(function (_a) {
            var _b = __read(_a, 2), column = _b[0], value = _b[1];
            return "".concat(column, " = ").concat(value == null || value === 'NULL'
                ? 'NULL'
                : "'".concat(_this.$utils.covertBooleanToNumber(value), "'"));
        });
        return "".concat(this.$constants('SET'), " ").concat(keyValue);
    };
    Model.prototype._queryInsertModel = function (objects) {
        var _a, _b;
        var _this = this;
        if (this.$db.get('TIMESTAMP')) {
            var createdAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').CREATED_AT);
            var updatedAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').UPDATED_AT);
            objects = __assign(__assign({}, objects), (_a = {}, _a[createdAt] = this.$utils.timestamp(), _a[updatedAt] = this.$utils.timestamp(), _a));
        }
        if (this.$db.get('UUID')) {
            console.log(this.$db.get('UUID_FORMAT'));
            objects = __assign(__assign({}, objects), (_b = {}, _b[this.$db.get('UUID_FORMAT')] = this.$utils.generateUUID(), _b));
        }
        var columns = Object.keys(objects).map(function (data) { return "".concat(data); });
        var values = Object.values(objects).map(function (data) {
            return "".concat(data == null || data === 'NULL' ?
                'NULL' :
                "'".concat(_this.$utils.covertBooleanToNumber(data), "'"));
        });
        return "(".concat(columns, ") ").concat(this.$constants('VALUES'), " (").concat(values, ")");
    };
    Model.prototype._queryInsertMultipleModel = function (data) {
        var e_13, _a, _b, _c;
        var _this = this;
        var _d;
        var values = [];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var objects = data_1_1.value;
                if (this.$db.get('TIMESTAMP')) {
                    var createdAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').CREATED_AT);
                    var updatedAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').UPDATED_AT);
                    objects = __assign(__assign({}, objects), (_b = {}, _b[createdAt] = this.$utils.timestamp(), _b[updatedAt] = this.$utils.timestamp(), _b));
                }
                if (this.$db.get('UUID')) {
                    objects = __assign(__assign({}, objects), (_c = {}, _c[this.$db.get('UUID_FORMAT')] = this.$utils.generateUUID(), _c));
                }
                var val = Object.values(objects).map(function (data) {
                    return "".concat(data == null || data === 'NULL' ?
                        'NULL' :
                        "'".concat(_this.$utils.covertBooleanToNumber(data), "'"));
                });
                values.push("(".concat(val.join(','), ")"));
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_13) throw e_13.error; }
        }
        var columns = Object.keys((_d = data[0]) !== null && _d !== void 0 ? _d : []).map(function (data) { return "".concat(data); });
        return "(".concat(columns, ") ").concat(this.$constants('VALUES'), " ").concat(values.join(','));
    };
    Model.prototype._registry = function (data) {
        var _this = this;
        var _a;
        if ((_a = Object.keys(this.$db.get('REGISTRY'))) === null || _a === void 0 ? void 0 : _a.length) {
            data === null || data === void 0 ? void 0 : data.forEach(function (d) {
                for (var name in _this.$db.get('REGISTRY')) {
                    var registry = _this.$db.get('REGISTRY');
                    d[name] = registry[name];
                }
            });
        }
        return this;
    };
    Model.prototype._insertNotExistsModel = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, check, _b, result, _c, _d, result_3, id, sql_1, data;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this._assertError(!this.$db.get('WHERE'), "can't insert [insertNotExists] without where condition");
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('EXISTS'), "(").concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE')),
                            "".concat(this.$constants('LIMIT'), " 1)"),
                            "".concat(this.$constants('AS'), " 'exists'")
                        ].join(' ');
                        check = false;
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        _b = __read.apply(void 0, [_e.sent(), 1]), result = _b[0].exists;
                        check = !!parseInt(result);
                        _c = check;
                        switch (_c) {
                            case false: return [3 /*break*/, 2];
                            case true: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 2: return [4 /*yield*/, this._actionStatementModel({
                            sql: this.$db.get('INSERT'),
                            returnId: true
                        })];
                    case 3:
                        _d = __read.apply(void 0, [_e.sent(), 2]), result_3 = _d[0], id = _d[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_3) return [3 /*break*/, 5];
                        sql_1 = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id = ").concat(id)
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql_1)];
                    case 4:
                        data = _e.sent();
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.shift()) || null];
                    case 5: return [2 /*return*/, null];
                    case 6:
                        {
                            return [2 /*return*/, null];
                        }
                        _e.label = 7;
                    case 7:
                        {
                            return [2 /*return*/, null];
                        }
                        _e.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._createModel = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, result, id, sql, data, result_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._actionStatementModel({
                            sql: this.$db.get('INSERT'),
                            returnId: true
                        })];
                    case 1:
                        _b = __read.apply(void 0, [_c.sent(), 2]), result = _b[0], id = _b[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result) return [3 /*break*/, 3];
                        sql = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id = ").concat(id)
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 2:
                        data = _c.sent();
                        result_4 = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', result_4);
                        return [2 /*return*/, result_4];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    Model.prototype._createMultipleModel = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, result, id, arrayId, arrayId_1, arrayId_1_1, id_1, sql, data, resultData;
            var e_14, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._actionStatementModel({
                            sql: this.$db.get('INSERT'),
                            returnId: true
                        })];
                    case 1:
                        _b = __read.apply(void 0, [_d.sent(), 2]), result = _b[0], id = _b[1];
                        if (!result) return [3 /*break*/, 3];
                        arrayId = __spreadArray([], __read(Array(result)), false).map(function (_, i) { return i + id; });
                        try {
                            for (arrayId_1 = __values(arrayId), arrayId_1_1 = arrayId_1.next(); !arrayId_1_1.done; arrayId_1_1 = arrayId_1.next()) {
                                id_1 = arrayId_1_1.value;
                                if (this.$db.get('TRANSACTION')) {
                                    (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                        table: this.$db.get('TABLE_NAME'),
                                        id: id_1
                                    });
                                }
                            }
                        }
                        catch (e_14_1) { e_14 = { error: e_14_1 }; }
                        finally {
                            try {
                                if (arrayId_1_1 && !arrayId_1_1.done && (_c = arrayId_1.return)) _c.call(arrayId_1);
                            }
                            finally { if (e_14) throw e_14.error; }
                        }
                        sql = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id"),
                            "".concat(this.$constants('IN'), " (").concat(arrayId, ")")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 2:
                        data = _d.sent();
                        resultData = data || null;
                        this.$db.set('RESULT', resultData);
                        return [2 /*return*/, resultData];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    Model.prototype._updateOrInsertModel = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sql, check, _b, result, _c, _d, result_5, id, sql_2, data, resultData, result_6, data, data_2, data_2_1, val;
            var e_15, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        this._assertError(!this.$db.get('WHERE'), "can't update or insert [updateOrInsert] without where condition");
                        sql = '';
                        check = false;
                        sql = [
                            "".concat(this.$constants('SELECT')),
                            "".concat(this.$constants('EXISTS'), "(").concat(this.$constants('SELECT')),
                            "*",
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$db.get('WHERE')),
                            "".concat(this.$constants('LIMIT'), " 1)"),
                            "".concat(this.$constants('AS'), " 'exists'")
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        _b = __read.apply(void 0, [_f.sent(), 1]), result = _b[0].exists;
                        check = !!Number.parseInt(result);
                        _c = check;
                        switch (_c) {
                            case false: return [3 /*break*/, 2];
                            case true: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this._actionStatementModel({
                            sql: this.$db.get('INSERT'),
                            returnId: true
                        })];
                    case 3:
                        _d = __read.apply(void 0, [_f.sent(), 2]), result_5 = _d[0], id = _d[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_5) return [3 /*break*/, 5];
                        sql_2 = [
                            "".concat(this.$db.get('SELECT')),
                            "".concat(this.$db.get('FROM')),
                            "".concat(this.$db.get('TABLE_NAME')),
                            "".concat(this.$constants('WHERE'), " id = ").concat(id)
                        ].join(' ');
                        return [4 /*yield*/, this._queryStatementModel(sql_2)];
                    case 4:
                        data = _f.sent();
                        resultData = __assign(__assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$db.set('RESULT', resultData);
                        return [2 /*return*/, resultData];
                    case 5: return [2 /*return*/, null];
                    case 6: return [4 /*yield*/, this._actionStatementModel({
                            sql: [
                                "".concat(this.$db.get('UPDATE')),
                                "".concat(this.$db.get('WHERE'))
                            ].join(' ')
                        })];
                    case 7:
                        result_6 = _f.sent();
                        if (!result_6) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._queryStatementModel([
                                "".concat(this.$db.get('SELECT')),
                                "".concat(this.$db.get('FROM')),
                                "".concat(this.$db.get('TABLE_NAME')),
                                "".concat(this.$db.get('WHERE'))
                            ].join(' '))];
                    case 8:
                        data = _f.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                            try {
                                for (data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                                    val = data_2_1.value;
                                    val.action_status = 'update';
                                }
                            }
                            catch (e_15_1) { e_15 = { error: e_15_1 }; }
                            finally {
                                try {
                                    if (data_2_1 && !data_2_1.done && (_e = data_2.return)) _e.call(data_2);
                                }
                                finally { if (e_15) throw e_15.error; }
                            }
                            return [2 /*return*/, data || []];
                        }
                        return [2 /*return*/, __assign(__assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'update' }) || null];
                    case 9: return [2 /*return*/, null];
                    case 10:
                        {
                            return [2 /*return*/, null];
                        }
                        _f.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._updateModel = function (ignoreWhere) {
        if (ignoreWhere === void 0) { ignoreWhere = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, data, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._assertError(!this.$db.get('WHERE') && !ignoreWhere, "can't update [update] without where condition");
                        return [4 /*yield*/, this._actionStatementModel({ sql: [
                                    "".concat(this.$db.get('UPDATE')),
                                    "".concat(this.$db.get('WHERE'))
                                ].join(' '), returnId: true })];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                        if (!result)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this._queryStatementModel([
                                "".concat(this.$db.get('SELECT')),
                                "".concat(this.$db.get('FROM')),
                                "".concat(this.$db.get('TABLE_NAME')),
                                "".concat(this.$db.get('WHERE'))
                            ].join(' '))];
                    case 2:
                        data = _b.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                            return [2 /*return*/, data || []];
                        res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', res);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Model.prototype._assertError = function (condition, message) {
        if (condition === void 0) { condition = true; }
        if (message === void 0) { message = 'error'; }
        if (typeof condition === 'string') {
            throw new Error(condition);
        }
        if (condition)
            throw new Error(message);
        return;
    };
    Model.prototype._functionRelationName = function () {
        var functionName = __spreadArray([], __read(this.$logger.get()), false)[this.$logger.get().length - 2];
        return functionName.replace(/([A-Z])/g, function (str) { return "_".concat(str.toLowerCase()); });
    };
    Model.prototype._initialModel = function () {
        this.$db = this._setupModel();
        this._tableName();
        return this;
    };
    Model.prototype._setupModel = function () {
        var _this = this;
        var db = new Map(Object.entries(__assign({}, this.$constants('MODEL'))));
        return {
            get: function (key) {
                if (key == null)
                    return db;
                _this._assertError(!db.has(key), "can't get this [".concat(key, "]"));
                return db.get(key);
            },
            set: function (key, value) {
                _this._assertError(!db.has(key), "can't set this [".concat(key, "]"));
                db.set(key, value);
                return;
            }
        };
    };
    return Model;
}(AbstractModel_1.AbstractModel));
exports.Model = Model;
exports.default = Model;
