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
var AbstractModel_1 = __importDefault(require("./AbstractModel"));
var pluralize_1 = __importDefault(require("pluralize"));
var DB_1 = __importDefault(require("./DB"));
var ProxyHandler_1 = __importDefault(require("./ProxyHandler"));
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this._initModel();
        return new Proxy(_this, ProxyHandler_1.default);
    }
    Model.prototype.useRegistry = function () {
        this.$db.set('REGISTRY', __assign(__assign({}, this.$db.get('REGISTRY')), { attach: this._attach, detach: this._detach }));
        return this;
    };
    Model.prototype.useUUID = function (custom) {
        if (custom === void 0) { custom = 'uuid'; }
        this.$db.set('UUID', true);
        this.$db.set('UUID_CUSTOM', custom);
        return this;
    };
    Model.prototype.useDebug = function () {
        this.$db.set('DEBUG', true);
        return this;
    };
    Model.prototype.usePattern = function (pattern) {
        var allowPattern = [this.$utils().constants('PATTERN').snake_case, this.$utils().constants('PATTERN').camelCase];
        if (!allowPattern.includes(pattern))
            throw new Error("allow pattern " + allowPattern + " only");
        this.$db.set('PATTERN', pattern);
        return this;
    };
    Model.prototype.useSoftDelete = function () {
        this.$db.set('SOFT_DELETE', true);
        return this;
    };
    Model.prototype.useTimestamp = function () {
        this.$db.set('TIMESTAMP', true);
        return this;
    };
    Model.prototype.useTable = function (table) {
        this.$db.set('TABLE_NAME', "`" + table + "`");
        this.$db.get('SELECT', this.$utils().constants('SELECT') + " *");
        this.$db.get('FROM', this.$utils().constants('FROM') + "'");
        return this;
    };
    Model.prototype.disabledSoftDelete = function () {
        this.$db.set('SOFT_DELETE', false);
        return this;
    };
    Model.prototype.registry = function (func) {
        this.$db.set('REGISTRY', __assign(__assign({}, func), { attach: this._attach, detach: this._detach }));
        return this;
    };
    Model.prototype.withQuery = function (name, callback) {
        var relation = this.$db.get('WITH').find(function (data) { return data.name === name; });
        if (relation == null)
            throw new Error("relation " + name + " not be register !");
        if (!Object.values(this.$utils().constants('RELATIONSHIP')).includes(relation.relation))
            throw new Error("unknow relationship in [" + this.$utils().constants('RELATIONSHIP') + "] !");
        relation.query = callback(new relation.model());
        return this;
    };
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
                throw new Error("relation " + name + " not be register !");
            if (!Object.values(_this.$utils().constants('RELATIONSHIP')).includes(relation.relation))
                throw new Error("unknow relationship in [" + _this.$utils().constants('RELATIONSHIP') + "] !");
            relation.query = new relation.model();
            return relation;
        });
        relations.sort(function (cur, prev) { return cur.relation.length - prev.relation.length; });
        this.$db.set('WITH', relations);
        return this;
    };
    Model.prototype.withExists = function () {
        var nameRelations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nameRelations[_i] = arguments[_i];
        }
        this.with.apply(this, __spreadArray([], __read(nameRelations), false));
        this.$db.set('WITH_EXISTS', true);
        return this;
    };
    Model.prototype.whereUser = function (id) {
        var column = this._isPatternSnakeCase() ? 'user_id' : 'userId';
        var operator = '=';
        id = this.$utils().escape(id);
        if (!this.$db.get('WHERE').includes(this.$utils().constants('WHERE'))) {
            this.$db.set('WHERE', this.$utils().constants('WHERE') + " " + column + " " + operator + " '" + id + "'");
            return this;
        }
        this.$db.set('WHERE', this.$db.get('WHERE') + " " + this.$utils().constants('AND') + " " + column + " " + operator + " '" + id + "'");
        return this;
    };
    Model.prototype.hasOne = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, pk = _a.pk, fk = _a.fk, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$utils().constants('RELATIONSHIP').hasOne,
            pk: pk,
            fk: fk,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    Model.prototype.hasMany = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, pk = _a.pk, fk = _a.fk, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$utils().constants('RELATIONSHIP').hasMany,
            pk: pk,
            fk: fk,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    Model.prototype.belongsTo = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, pk = _a.pk, fk = _a.fk, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            as: as,
            model: model,
            relation: this.$utils().constants('RELATIONSHIP').belongsTo,
            pk: pk,
            fk: fk,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    Model.prototype.belongsToMany = function (_a) {
        var name = _a.name, as = _a.as, model = _a.model, pk = _a.pk, fk = _a.fk, freezeTable = _a.freezeTable;
        var relation = {
            name: name,
            model: model,
            as: as,
            relation: this.$utils().constants('RELATIONSHIP').belongsToMany,
            pk: pk,
            fk: fk,
            freezeTable: freezeTable,
            query: null
        };
        this.$db.set('RELATION', __spreadArray(__spreadArray([], __read(this.$db.get('RELATION')), false), [relation], false));
        return this;
    };
    Model.prototype.trashed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.whereNotNull(this._isPatternSnakeCase() ? 'deleted_at' : 'deletedAt');
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._exec(sql, 'GET')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Model.prototype.onlyTrashed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.whereNotNull(this._isPatternSnakeCase() ? 'deleted_at' : 'deletedAt');
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._exec(sql, 'GET')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Model.prototype.restore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAt, deletedAt, query;
            return __generator(this, function (_a) {
                updatedAt = this._isPatternSnakeCase() ? 'updated_at' : 'updatedAt';
                deletedAt = this._isPatternSnakeCase() ? 'deleted_at' : 'deletedAt';
                query = this.$db.get('TIMESTAMP') ? deletedAt + " = NULL , " + updatedAt + " = '" + this.$utils().timestamp() + "'" : deletedAt + " = NULL";
                this.$db.set('UPDATE', this.$utils().constants('UPDATE') + " " + this.$db.get('TABLE_NAME') + " SET " + query);
                this.$db.set('SAVE', 'UPDATE');
                return [2 /*return*/, this.save()];
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.toString = function () {
        return this._getSQLModel();
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.toSQL = function () {
        return this._getSQLModel();
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.toJSON = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _a.sent();
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(result);
                        return [2 /*return*/, JSON.stringify(result) || []];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.toArray = function (column) {
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, toArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + column);
                        sql = this._getSQLModel();
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
     * @Override Method
     *
    */
    Model.prototype.avg = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + this.$utils().constants('AVG') + "(" + column + ") " + this.$utils().constants('AS') + " avg");
                        sql = this._getSQLModel();
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
     * @Override Method
     *
    */
    Model.prototype.sum = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + this.$utils().constants('SUM') + "(" + column + ") " + this.$utils().constants('AS') + " sum");
                        sql = this._getSQLModel();
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
     * @Override Method
     *
    */
    Model.prototype.max = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + this.$utils().constants('MAX') + "(" + column + ") " + this.$utils().constants('AS') + " max");
                        sql = this._getSQLModel();
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
     * @Override Method
     *
    */
    Model.prototype.min = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + this.$utils().constants('MIN') + "(" + column + ") " + this.$utils().constants('AS') + " min");
                        sql = this._getSQLModel();
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
     * @Override Method
     *
    */
    Model.prototype.count = function (column) {
        var _a;
        if (column === void 0) { column = 'id'; }
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$db.set('SELECT', this.$utils().constants('SELECT') + " " + this.$utils().constants('COUNT') + "(" + column + ") " + this.$utils().constants('AS') + " total");
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.shift()) === null || _a === void 0 ? void 0 : _a.total) || 0];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
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
                        deletedAt = this._isPatternSnakeCase() ? 'deleted_at' : 'deletedAt';
                        query = deletedAt + " = '" + this.$utils().timestamp() + "'";
                        sql = this.$utils().constants('UPDATE') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('SET') + " " + query;
                        if (this.$db.get('TIMESTAMP')) {
                            updatedAt = this._isPatternSnakeCase() ? 'updated_at' : 'updatedAt';
                            sql = sql + " , " + updatedAt + " = '" + this.$utils().timestamp() + "'";
                        }
                        this.$db.set('UPDATE', sql + " " + this.$db.get('WHERE'));
                        return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('UPDATE') })];
                    case 1:
                        result_1 = _c.sent();
                        return [2 /*return*/, (_a = !!result_1) !== null && _a !== void 0 ? _a : false];
                    case 2:
                        this.$db.set('DELETE', this.$utils().constants('DELETE') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$db.get('WHERE'));
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
     * @Override Method
     *
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
                        sql = this._getSQLModel();
                        if (!sql.includes(this.$utils().constants('LIMIT')))
                            sql = sql + " " + this.$utils().constants('LIMIT') + " 1";
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), this.$utils().constants('LIMIT') + " 1");
                        return [4 /*yield*/, this._exec(sql, 'FIRST')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this.$utils().constants('SELECT') + " * " + this.$utils().constants('FROM') + " " + this.$db.get('TABLE_NAME');
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
     * @Override Method
     *
    */
    Model.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = this.$utils().constants('SELECT') + " * " + this.$utils().constants('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id = " + id;
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
     * @Override Method
     *
    */
    Model.prototype.findOne = function () {
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
                        sql = this._getSQLModel();
                        if (!sql.includes(this.$utils().constants('LIMIT')))
                            sql = sql + " " + this.$utils().constants('LIMIT') + " 1";
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), this.$utils().constants('LIMIT') + " 1");
                        return [4 /*yield*/, this._exec(sql, 'FIRST')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
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
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._exec(sql, 'GET')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
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
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._exec(sql, 'GET')];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.pagination = function (_a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.limit, limit = _e === void 0 ? 15 : _e, _f = _d.page, page = _f === void 0 ? 1 : _f;
        return __awaiter(this, void 0, void 0, function () {
            var offset, sql;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if ((_b = this.$logger) === null || _b === void 0 ? void 0 : _b.check('limit'))
                            throw new Error("this [pagination] can't used [limit] method");
                        if (!((_c = this.$db.get('EXCEPT')) === null || _c === void 0 ? void 0 : _c.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _g.sent();
                        _g.label = 2;
                    case 2:
                        offset = (page - 1) * limit;
                        this.$db.set('PER_PAGE', limit);
                        this.$db.set('PAGE', page);
                        sql = this._getSQLModel();
                        if (!sql.includes(this.$utils().constants('LIMIT')))
                            sql = sql + " " + this.$utils().constants('LIMIT') + " " + limit + " " + this.$utils().constants('OFFSET') + " " + offset;
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), this.$utils().constants('LIMIT') + " " + limit + " " + this.$utils().constants('OFFSET') + " " + offset);
                        return [4 /*yield*/, this._exec(sql, 'PAGINATION')];
                    case 3: return [2 /*return*/, _g.sent()];
                }
            });
        });
    };
    Model.prototype.paginate = function (_a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.limit, limit = _e === void 0 ? 15 : _e, _f = _d.page, page = _f === void 0 ? 1 : _f;
        return __awaiter(this, void 0, void 0, function () {
            var offset, sql;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if ((_b = this.$logger) === null || _b === void 0 ? void 0 : _b.check('limit'))
                            throw new Error("this [pagination] can't used [limit] method");
                        if (!((_c = this.$db.get('EXCEPT')) === null || _c === void 0 ? void 0 : _c.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._exceptColumns()];
                    case 1:
                        _g.sent();
                        _g.label = 2;
                    case 2:
                        offset = (page - 1) * limit;
                        this.$db.set('PER_PAGE', limit);
                        this.$db.set('PAGE', page);
                        sql = this._getSQLModel();
                        if (!sql.includes(this.$utils().constants('LIMIT')))
                            sql = sql + " " + this.$utils().constants('LIMIT') + " " + limit + " " + this.$utils().constants('OFFSET') + " " + offset;
                        else
                            sql = sql.replace(this.$db.get('LIMIT'), this.$utils().constants('LIMIT') + " " + limit + " " + this.$utils().constants('OFFSET') + " " + offset);
                        return [4 /*yield*/, this._exec(sql, 'PAGINATION')];
                    case 3: return [2 /*return*/, _g.sent()];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
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
                        this.$db.set('GROUP_BY', this.$utils().constants('GROUP_BY') + " " + column);
                        this.$db.set('SELECT', this.$db.get('SELECT') + ", " + this.$utils().constants('GROUP_CONCAT') + "(id) " + this.$utils().constants('AS') + " data");
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 3:
                        results = _b.sent();
                        data = [];
                        results.forEach(function (result) {
                            var _a, _b;
                            var splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                            splits.forEach(function (split) { return data = __spreadArray(__spreadArray([], __read(data), false), [split], false); });
                        });
                        sqlChild = this.$utils().constants('SELECT') + " * " + this.$utils().constants('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id " + this.$utils().constants('IN') + " (" + (data.map(function (a) { return "'" + a + "'"; }).join(',') || ['0']) + ")";
                        return [4 /*yield*/, this._queryStatementModel(sqlChild)];
                    case 4:
                        childData = _b.sent();
                        return [4 /*yield*/, this._execGroup(childData)];
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
    * @Override Method
    *
   */
    Model.prototype.update = function (objects) {
        var query = this._queryUpdateModel(objects);
        this.$db.set('UPDATE', this.$utils().constants('UPDATE') + " " + this.$db.get('TABLE_NAME') + " " + query);
        this.$db.set('SAVE', 'UPDATE');
        return this;
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.insert = function (objects) {
        var query = this._queryInsertModel(objects);
        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.create = function (objects) {
        var query = this._queryInsertModel(objects);
        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
        this.$db.set('SAVE', 'INSERT');
        return this;
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.updateOrCreate = function (objects) {
        var queryUpdate = this._queryUpdateModel(objects);
        var queryInsert = this._queryInsertModel(objects);
        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + queryInsert);
        this.$db.set('UPDATE', this.$utils().constants('UPDATE') + " " + this.$db.get('TABLE_NAME') + " " + queryUpdate);
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    };
    Model.prototype.updateOrInsert = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
    Model.prototype.insertOrUpdate = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
    Model.prototype.createOrUpdate = function (objects) {
        this.updateOrCreate(objects);
        return this;
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.createMultiple = function (data) {
        var query = this._queryInsertMultipleModel(data);
        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.insertMultiple = function (data) {
        var query = this._queryInsertMultipleModel(data);
        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    };
    Model.prototype._queryStatementModel = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var CONNECTION, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (this.$db.get('DEBUG'))
                            this.$utils().consoleDebug(sql);
                        return [4 /*yield*/, this.$utils().connection()];
                    case 1:
                        CONNECTION = _a.sent();
                        return [4 /*yield*/, CONNECTION.query(sql)];
                    case 2:
                        result = _a.sent();
                        this._registry(result);
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._actionStatementModel = function (_a) {
        var _b = _a === void 0 ? {} : _a, sql = _b.sql, _c = _b.returnId, returnId = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var CONNECTION, result_2, result, err_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.$utils().connection()];
                    case 1:
                        CONNECTION = _d.sent();
                        if (this.$db.get('DEBUG'))
                            this.$utils().consoleDebug(sql);
                        if (!returnId) return [3 /*break*/, 3];
                        return [4 /*yield*/, CONNECTION.query(sql)];
                    case 2:
                        result_2 = _d.sent();
                        return [2 /*return*/, [result_2.affectedRows, result_2.insertId]];
                    case 3: return [4 /*yield*/, CONNECTION.query(sql)];
                    case 4:
                        result = (_d.sent()).affectedRows;
                        return [2 /*return*/, result];
                    case 5:
                        err_2 = _d.sent();
                        throw new Error(err_2.message);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._isPatternSnakeCase = function () {
        return this.$db.get('PATTERN') === this.$utils().constants('PATTERN').snake_case;
    };
    Model.prototype._classToTableName = function (className, belongsTo) {
        if (belongsTo === void 0) { belongsTo = false; }
        if (className == null)
            className = this.constructor.name;
        var tb = className.replace(/([A-Z])/g, function (str) { return '_' + str.toLowerCase(); }).slice(1);
        if (belongsTo)
            return tb;
        return (0, pluralize_1.default)(tb);
    };
    Model.prototype._tableName = function () {
        var tb = this._classToTableName();
        this.$db.set('SELECT', this.$utils().constants('SELECT') + " *");
        this.$db.set('FROM', "" + this.$utils().constants('FROM'));
        this.$db.set('TABLE_NAME', "`" + tb + "`");
        return this;
    };
    Model.prototype._valueInRelation = function (data) {
        var _a;
        var relation = data.relation;
        var model = (_a = data.model) === null || _a === void 0 ? void 0 : _a.name;
        var table = data.freezeTable ? data.freezeTable : this._classToTableName(model);
        var name = data.name;
        var as = data.as;
        if (!model || model == null)
            throw new Error('model missing');
        var patternId = this._isPatternSnakeCase() ? '_id' : 'Id';
        var pk = data.pk ? data.pk : 'id';
        var fk = data.fk ? data.fk : this._classToTableName(null, true) + patternId;
        if (data.pk == null && data.fk == null && relation === this.$utils().constants('RELATIONSHIP').belongsTo) {
            fk = pk;
            pk = this._classToTableName(model, true) + patternId;
        }
        return { name: name, as: as, relation: relation, table: table, pk: pk, fk: fk, model: model };
    };
    Model.prototype._getSQLModel = function () {
        var sql = [];
        if (this.$db.get('INSERT')) {
            sql = [
                this.$db.get('INSERT')
            ];
        }
        else if (this.$db.get('UPDATE')) {
            sql = [
                this.$db.get('UPDATE'),
                this.$db.get('WHERE'),
            ];
        }
        else if (this.$db.get('DELETE')) {
            sql = [
                this.$db.get('DELETE')
            ];
        }
        else {
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
                        sql = this.$utils().constants('SHOW') + " " + this.$utils().constants('COLUMNS') + " " + this.$utils().constants('FROM') + " " + this.$db.get('TABLE_NAME');
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
    Model.prototype._exec = function (sql, type) {
        return __awaiter(this, void 0, void 0, function () {
            var mains, emptyData, relations, relations_1, relations_1_1, relation, subs, e_1_1, resultData, err_3;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        mains = _b.sent();
                        emptyData = this._returnEmpty(type, mains);
                        if (!mains.length)
                            return [2 /*return*/, emptyData];
                        relations = this.$db.get('WITH');
                        if (!relations.length) return [3 /*break*/, 11];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 9, 10, 11]);
                        relations_1 = __values(relations), relations_1_1 = relations_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!relations_1_1.done) return [3 /*break*/, 8];
                        relation = relations_1_1.value;
                        if (!(relation.relation === this.$utils().constants('RELATIONSHIP').belongsToMany)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._belongsToMany(type, mains, relation)];
                    case 4:
                        mains = _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._relation(mains, relation)];
                    case 6:
                        subs = _b.sent();
                        mains = this._relationFilter(mains, subs, relation);
                        _b.label = 7;
                    case 7:
                        relations_1_1 = relations_1.next();
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (relations_1_1 && !relations_1_1.done && (_a = relations_1.return)) _a.call(relations_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(mains);
                        resultData = this._returnResult(type, mains);
                        return [2 /*return*/, resultData || emptyData];
                    case 12:
                        err_3 = _b.sent();
                        throw new Error(err_3.message);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._execGroup = function (mains, type) {
        var _a;
        if (type === void 0) { type = 'GET'; }
        return __awaiter(this, void 0, void 0, function () {
            var emptyData, relations, relations_2, relations_2_1, relation, subs, e_2_1, resultData;
            var e_2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        emptyData = this._returnEmpty(type, mains);
                        if (!mains.length)
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
                        if (relation.relation === this.$utils().constants('RELATIONSHIP').belongsToMany)
                            return [2 /*return*/, this._belongsToMany(type, mains, relation)];
                        return [4 /*yield*/, this._relation(mains, relation)];
                    case 3:
                        subs = _c.sent();
                        mains = this._relationFilter(mains, subs, relation);
                        _c.label = 4;
                    case 4:
                        relations_2_1 = relations_2.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (relations_2_1 && !relations_2_1.done && (_b = relations_2.return)) _b.call(relations_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if ((_a = this.$db.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                            this._hiddenColumnModel(mains);
                        resultData = this._returnResult(type, mains);
                        return [2 /*return*/, resultData || emptyData];
                }
            });
        });
    };
    Model.prototype._relationFilter = function (mains, subs, relations) {
        var _this = this;
        var _a = this._valueInRelation(relations), name = _a.name, as = _a.as, relation = _a.relation, pk = _a.pk, fk = _a.fk;
        var keyRelation = as !== null && as !== void 0 ? as : name;
        mains.forEach(function (main) {
            if (relation === _this.$utils().constants('RELATIONSHIP').hasOne || relation === _this.$utils().constants('RELATIONSHIP').belongsTo)
                main[keyRelation] = null;
            else
                main[keyRelation] = [];
            if (subs.length) {
                subs.forEach(function (sub) {
                    if (sub[fk] === main[pk]) {
                        if (relation === _this.$utils().constants('RELATIONSHIP').hasOne || relation === _this.$utils().constants('RELATIONSHIP').belongsTo) {
                            main[keyRelation] = main[keyRelation] || sub;
                        }
                        else {
                            if (main[keyRelation] == null)
                                main[keyRelation] = [];
                            main[keyRelation].push(sub);
                        }
                    }
                });
            }
        });
        if (this.$db.get('WITH_EXISTS')) {
            return mains.filter(function (main) {
                if (Array.isArray(main[keyRelation]))
                    return main[keyRelation].length;
                return main[keyRelation] != null;
            });
        }
        return mains;
    };
    Model.prototype._relation = function (mains, relations) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, pk, fk, pkId, mainId, query, subs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!Object.keys(relations).length)
                            return [2 /*return*/, []];
                        _a = this._valueInRelation(relations), pk = _a.pk, fk = _a.fk;
                        pkId = mains.map(function (main) { return main[pk]; }).filter(function (data) { return data != null; });
                        mainId = Array.from(new Set(pkId)) || [];
                        if (!mainId.length && !this.$db.get('WITH_EXISTS'))
                            throw new Error("can't relationship without primary or foreign key");
                        if (!mainId.length && this.$db.get('WITH_EXISTS'))
                            return [2 /*return*/, []];
                        return [4 /*yield*/, relations.query];
                    case 1:
                        query = _b.sent();
                        return [4 /*yield*/, query.whereIn(fk, mainId).debug(this.$db.get('DEBUG')).get()];
                    case 2:
                        subs = _b.sent();
                        return [2 /*return*/, subs];
                }
            });
        });
    };
    Model.prototype._belongsToMany = function (type, mains, dataRelation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, name_1, pk_1, fk_1, pkId, mainId, local, modelOther, other_1, pivotTable, otherPk_1, otherFk_1, sqlSubs, subs_1, otherId, otherArrId, otherSubs_1, err_4, _d, name_2, pk_2, fk_2, pkId, mainId, local, modelOther, other_2, pivotTable, otherPk_2, otherFk_2, sqlSubs, subs_2, otherId, otherArrId, otherSubs_2, err_5;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 9]);
                        _c = this._valueInRelation(dataRelation), name_1 = _c.name, pk_1 = _c.pk, fk_1 = _c.fk;
                        pkId = mains.map(function (main) { return main[pk_1]; }).filter(function (data) { return data != null; });
                        mainId = Array.from(new Set(pkId)).join(',') || [];
                        if (!mainId.length)
                            throw new Error("can't relationship without primary or foreign key");
                        local = this.$utils().columnRelation(this.constructor.name);
                        modelOther = new dataRelation.model();
                        other_1 = this._classToTableName(modelOther.constructor.name, true);
                        pivotTable = (_a = dataRelation.freezeTable) !== null && _a !== void 0 ? _a : local + "_" + other_1;
                        pk_1 = 'id';
                        fk_1 = this._isPatternSnakeCase() ? local + "_id" : local + "Id";
                        otherPk_1 = 'id';
                        otherFk_1 = this._isPatternSnakeCase() ? other_1 + "_id" : other_1 + "Id";
                        sqlSubs = this.$utils().constants('SELECT') + " * " + this.$utils().constants('FROM') + " " + pivotTable + " " + this.$utils().constants('WHERE') + " " + fk_1 + " " + this.$utils().constants('IN') + " (" + mainId + ")";
                        return [4 /*yield*/, this._queryStatementModel(sqlSubs)];
                    case 1:
                        subs_1 = _e.sent();
                        otherId = subs_1.map(function (sub) { return sub[otherFk_1]; }).filter(function (data) { return data != null; });
                        otherArrId = Array.from(new Set(otherId)) || [];
                        return [4 /*yield*/, modelOther.whereIn(otherPk_1, otherArrId).get()];
                    case 2:
                        otherSubs_1 = _e.sent();
                        subs_1.forEach(function (sub) {
                            sub[other_1] = [];
                            otherSubs_1.forEach(function (otherSub) {
                                if (otherSub[otherPk_1] === sub[otherFk_1]) {
                                    sub[other_1] = otherSub;
                                }
                            });
                        });
                        mains.forEach(function (main) {
                            if (main[name_1] == null)
                                main[name_1] = [];
                            subs_1.forEach(function (sub) {
                                if (sub[fk_1] === main[pk_1]) {
                                    main[name_1].push(sub);
                                }
                            });
                        });
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(mains);
                        return [2 /*return*/, mains];
                    case 3:
                        err_4 = _e.sent();
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 7, , 8]);
                        _d = this._valueInRelation(dataRelation), name_2 = _d.name, pk_2 = _d.pk, fk_2 = _d.fk;
                        pkId = mains.map(function (main) { return main[pk_2]; }).filter(function (data) { return data != null; });
                        mainId = Array.from(new Set(pkId)).join(',') || [];
                        if (!mainId.length)
                            throw new Error("can't relationship without primary or foreign key");
                        local = this.$utils().columnRelation(this.constructor.name);
                        modelOther = new dataRelation.model();
                        other_2 = modelOther.constructor.name.toLocaleLowerCase();
                        pivotTable = (_b = dataRelation.freezeTable) !== null && _b !== void 0 ? _b : other_2 + "_" + local;
                        pk_2 = 'id';
                        fk_2 = this._isPatternSnakeCase() ? local + "_id" : local + "Id";
                        otherPk_2 = 'id';
                        otherFk_2 = this._isPatternSnakeCase() ? other_2 + "_id" : other_2 + "Id";
                        sqlSubs = this.$utils().constants('SELECT') + " * " + this.$utils().constants('FROM') + " " + pivotTable + " " + this.$utils().constants('WHERE') + " " + fk_2 + " " + this.$utils().constants('IN') + " (" + mainId + ")";
                        return [4 /*yield*/, this._queryStatementModel(sqlSubs)];
                    case 5:
                        subs_2 = _e.sent();
                        otherId = subs_2.map(function (sub) { return sub[otherFk_2]; }).filter(function (data) { return data != null; });
                        otherArrId = Array.from(new Set(otherId)) || [];
                        return [4 /*yield*/, this._queryStatementModel(modelOther
                                .whereIn(otherPk_2, otherArrId)
                                .toString())];
                    case 6:
                        otherSubs_2 = _e.sent();
                        subs_2.forEach(function (sub) {
                            otherSubs_2.forEach(function (otherSub) {
                                if (otherSub[otherPk_2] === sub[otherFk_2]) {
                                    sub[other_2] = otherSub;
                                }
                            });
                        });
                        mains.forEach(function (main) {
                            if (main[name_2] == null)
                                main[name_2] = [];
                            subs_2.forEach(function (sub) {
                                if (sub[fk_2] === main[pk_2]) {
                                    main[name_2].push(sub);
                                }
                            });
                        });
                        if (this.$db.get('HIDDEN').length)
                            this._hiddenColumnModel(mains);
                        return [2 /*return*/, mains];
                    case 7:
                        err_5 = _e.sent();
                        throw new Error(err_5.message);
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._pagination = function (data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var currentPage, sql, res, total, limit, lastPage, nextPage, prevPage, totalPage, meta;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentPage = this.$db.get('PAGE');
                        this.select(this.$utils().constants('COUNT') + "(*) " + this.$utils().constants('AS') + " total");
                        sql = this._getSQLModel();
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        res = _b.sent();
                        total = res.shift().total || 0;
                        limit = this.$db.get('PER_PAGE');
                        lastPage = Math.ceil(total / limit) || 0;
                        lastPage = lastPage > 1 ? lastPage : 1;
                        nextPage = currentPage + 1;
                        prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
                        totalPage = (_a = data === null || data === void 0 ? void 0 : data.length) !== null && _a !== void 0 ? _a : 0;
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
                            return [2 /*return*/, this.$utils().snakeCase(this._result({
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
    Model.prototype._returnEmpty = function (type, data) {
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
                        limit: this.$db.get('PER_PAGE'),
                        totalPage: 0,
                        currentPage: this.$db.get('PAGE'),
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
            return this.$utils().snakeCase(this._result(emptyData));
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
            case 'FIRST': return this._result((_c = data[0]) !== null && _c !== void 0 ? _c : {});
            case 'GET': return this._result(data);
            case 'PAGINATION': return this._pagination(data);
            default: throw new Error('Missing method first get or pagination');
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
            var relation, thisTable, relationTable, result, pivotTable, success, e_3, errorTable, search, pivotTable, success, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!Array.isArray(dataId))
                            throw new Error("this " + dataId + " is not an array");
                        relation = (_a = this.$db.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find(function (data) { return data.name === name; });
                        if (!relation)
                            throw new Error("unknow name relation [" + name + "] in model");
                        thisTable = this.$utils().columnRelation(this.constructor.name);
                        relationTable = this._classToTableName(relation.model.name, true);
                        result = this.$db.get('RESULT');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 8]);
                        pivotTable = thisTable + "_" + relationTable;
                        return [4 /*yield*/, new DB_1.default().table(pivotTable).createMultiple(dataId.map(function (id) {
                                var _a;
                                return __assign((_a = {}, _a[_this._isPatternSnakeCase() ? relationTable + "_id" : relationTable + "Id"] = id, _a[_this._isPatternSnakeCase() ? thisTable + "_id" : thisTable + "Id"] = result === null || result === void 0 ? void 0 : result.id, _a), fields);
                            })).save()];
                    case 2:
                        success = _b.sent();
                        return [2 /*return*/, success];
                    case 3:
                        e_3 = _b.sent();
                        errorTable = e_3.message;
                        search = errorTable.search("ER_NO_SUCH_TABLE");
                        if (!!search)
                            throw new Error(e_3.message);
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        pivotTable = relationTable + "_" + thisTable;
                        return [4 /*yield*/, new DB_1.default().table(pivotTable).createMultiple(dataId.map(function (id) {
                                var _a;
                                return __assign((_a = {}, _a[_this._isPatternSnakeCase() ? relationTable + "_id" : relationTable + "Id"] = id, _a[_this._isPatternSnakeCase() ? thisTable + "_id" : thisTable + "Id"] = result.id, _a), fields);
                            })).save()];
                    case 5:
                        success = _b.sent();
                        return [2 /*return*/, success];
                    case 6:
                        e_4 = _b.sent();
                        throw new Error(e_4.message);
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype._detach = function (name, dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var relation, thisTable, relationTable, result, pivotTable, dataId_1, dataId_1_1, id, e_5_1, e_6, errorTable, search, pivotTable, dataId_2, dataId_2_1, id, e_7_1, e_8;
            var e_5, _a, e_7, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!Array.isArray(dataId))
                            throw new Error("this " + dataId + " is not an array");
                        relation = this.$db.get('RELATION').find(function (data) { return data.name === name; });
                        if (!relation)
                            throw new Error("unknow name relation [" + name + "] in model");
                        thisTable = this.$utils().columnRelation(this.constructor.name);
                        relationTable = this._classToTableName(relation.model.name, true);
                        result = this.$db.get('RESULT');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 22]);
                        pivotTable = thisTable + "_" + relationTable;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 7, 8, 9]);
                        dataId_1 = __values(dataId), dataId_1_1 = dataId_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!dataId_1_1.done) return [3 /*break*/, 6];
                        id = dataId_1_1.value;
                        return [4 /*yield*/, new DB_1.default().table(pivotTable)
                                .where(this._isPatternSnakeCase() ? relationTable + "_id" : relationTable + "Id", id)
                                .where(this._isPatternSnakeCase() ? thisTable + "_id" : thisTable + "Id", result.id)
                                .delete()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        dataId_1_1 = dataId_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _c.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (dataId_1_1 && !dataId_1_1.done && (_a = dataId_1.return)) _a.call(dataId_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, true];
                    case 10:
                        e_6 = _c.sent();
                        errorTable = e_6.message;
                        search = errorTable.search("ER_NO_SUCH_TABLE");
                        if (!!search)
                            throw new Error(e_6.message);
                        _c.label = 11;
                    case 11:
                        _c.trys.push([11, 20, , 21]);
                        pivotTable = relationTable + "_" + thisTable;
                        _c.label = 12;
                    case 12:
                        _c.trys.push([12, 17, 18, 19]);
                        dataId_2 = __values(dataId), dataId_2_1 = dataId_2.next();
                        _c.label = 13;
                    case 13:
                        if (!!dataId_2_1.done) return [3 /*break*/, 16];
                        id = dataId_2_1.value;
                        return [4 /*yield*/, new DB_1.default().table(pivotTable)
                                .where(this._isPatternSnakeCase() ? relationTable + "_id" : relationTable + "Id", id)
                                .where(this._isPatternSnakeCase() ? thisTable + "_id" : thisTable + "Id", result.id)
                                .delete()];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        dataId_2_1 = dataId_2.next();
                        return [3 /*break*/, 13];
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        e_7_1 = _c.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 19];
                    case 18:
                        try {
                            if (dataId_2_1 && !dataId_2_1.done && (_b = dataId_2.return)) _b.call(dataId_2);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/, true];
                    case 20:
                        e_8 = _c.sent();
                        throw new Error(e_8.message);
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
            var updatedAt = this._isPatternSnakeCase() ? 'updated_at' : 'updatedAt';
            objects = __assign(__assign({}, objects), (_a = {}, _a[updatedAt] = this.$utils().timestamp(), _a));
        }
        var keyValue = Object.entries(objects).map(function (_a) {
            var _b = __read(_a, 2), column = _b[0], value = _b[1];
            return column + " = " + (value == null || value === 'NULL' ?
                'NULL' :
                "'" + _this.$utils().covertBooleanToNumber(value) + "'");
        });
        return this.$utils().constants('SET') + " " + keyValue;
    };
    Model.prototype._queryInsertModel = function (objects) {
        var _a, _b;
        var _this = this;
        if (this.$db.get('TIMESTAMP')) {
            var createdAt = this._isPatternSnakeCase() ? 'created_at' : 'createdAt';
            var updatedAt = this._isPatternSnakeCase() ? 'updated_at' : 'updatedAt';
            objects = __assign(__assign({}, objects), (_a = {}, _a[createdAt] = this.$utils().timestamp(), _a[updatedAt] = this.$utils().timestamp(), _a));
        }
        if (this.$db.get('UUID')) {
            objects = __assign(__assign({}, objects), (_b = {}, _b[this.$db.get('UUID_CUSTOM')] = this.$utils().generateUUID(), _b));
        }
        var columns = Object.keys(objects).map(function (data) { return "" + data; });
        var values = Object.values(objects).map(function (data) {
            return "" + (data == null || data === 'NULL' ?
                'NULL' :
                "'" + _this.$utils().covertBooleanToNumber(data) + "'");
        });
        return "(" + columns + ") " + this.$utils().constants('VALUES') + " (" + values + ")";
    };
    Model.prototype._queryInsertMultipleModel = function (data) {
        var e_9, _a;
        var _this = this;
        var _b;
        var values = [];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var objects = data_1_1.value;
                if (this.$db.get('TIMESTAMP')) {
                    var createdAt = this._isPatternSnakeCase() ? 'created_at' : 'createdAt';
                    var updatedAt = this._isPatternSnakeCase() ? 'updated_at' : 'updatedAt';
                    objects[createdAt] = this.$utils().timestamp();
                    objects[updatedAt] = this.$utils().timestamp();
                }
                if (this.$db.get('UUID'))
                    objects[this.$db.get('UUID_CUSTOM')] = this.$utils().generateUUID();
                var val = Object.values(objects).map(function (data) {
                    return "" + (data == null || data === 'NULL' ?
                        'NULL' :
                        "'" + _this.$utils().covertBooleanToNumber(data) + "'");
                });
                values.push("(" + val.join(',') + ")");
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        var columns = Object.keys((_b = data[0]) !== null && _b !== void 0 ? _b : []).map(function (data) { return "" + data; });
        return "(" + columns + ") " + this.$utils().constants('VALUES') + " " + values.join(',');
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
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't insert not exists without where condition");
                        sql = '';
                        check = false;
                        sql = this.$utils().constants('SELECT') + " " + this.$utils().constants('EXISTS') + "(" + this.$utils().constants('SELECT') + " * " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$db.get('WHERE') + " " + this.$utils().constants('LIMIT') + " 1) " + this.$utils().constants('AS') + " 'exists'";
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
                    case 2: return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 3:
                        _d = __read.apply(void 0, [_e.sent(), 2]), result_3 = _d[0], id = _d[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_3) return [3 /*break*/, 5];
                        sql_1 = this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id = " + id;
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
                    case 0: return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 1:
                        _b = __read.apply(void 0, [_c.sent(), 2]), result = _b[0], id = _b[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result) return [3 /*break*/, 3];
                        sql = this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id = " + id;
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
            var e_10, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('INSERT'), returnId: true })];
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
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (arrayId_1_1 && !arrayId_1_1.done && (_c = arrayId_1.return)) _c.call(arrayId_1);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        sql = this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id " + this.$utils().constants('IN') + " (" + arrayId + ")";
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
            var e_11, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.$db.get('WHERE'))
                            throw new Error("Can't update or insert without where condition");
                        sql = '';
                        check = false;
                        sql = this.$utils().constants('SELECT') + " " + this.$utils().constants('EXISTS') + "(" + this.$utils().constants('SELECT') + " * " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$db.get('WHERE') + " " + this.$utils().constants('LIMIT') + " 1) " + this.$utils().constants('AS') + " 'exists'";
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 1:
                        _b = __read.apply(void 0, [_f.sent(), 1]), result = _b[0].exists;
                        check = !!parseInt(result);
                        _c = check;
                        switch (_c) {
                            case false: return [3 /*break*/, 2];
                            case true: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('INSERT'), returnId: true })];
                    case 3:
                        _d = __read.apply(void 0, [_f.sent(), 2]), result_5 = _d[0], id = _d[1];
                        if (this.$db.get('TRANSACTION')) {
                            (_a = this.$db.get('TRANSACTION')) === null || _a === void 0 ? void 0 : _a.query.push({
                                table: this.$db.get('TABLE_NAME'),
                                id: id
                            });
                        }
                        if (!result_5) return [3 /*break*/, 5];
                        sql_2 = this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$utils().constants('WHERE') + " id = " + id;
                        return [4 /*yield*/, this._queryStatementModel(sql_2)];
                    case 4:
                        data = _f.sent();
                        resultData = __assign(__assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$db.set('RESULT', resultData);
                        return [2 /*return*/, resultData];
                    case 5: return [2 /*return*/, null];
                    case 6: return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('UPDATE') + " " + this.$db.get('WHERE') })];
                    case 7:
                        result_6 = _f.sent();
                        if (!result_6) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._queryStatementModel(this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$db.get('WHERE'))];
                    case 8:
                        data = _f.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                            try {
                                for (data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                                    val = data_2_1.value;
                                    val.action_status = 'update';
                                }
                            }
                            catch (e_11_1) { e_11 = { error: e_11_1 }; }
                            finally {
                                try {
                                    if (data_2_1 && !data_2_1.done && (_e = data_2.return)) _e.call(data_2);
                                }
                                finally { if (e_11) throw e_11.error; }
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
            var result, data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.$db.get('WHERE') && !ignoreWhere)
                            throw new Error("Can't update without where condition");
                        return [4 /*yield*/, this._actionStatementModel({ sql: this.$db.get('UPDATE') + " " + this.$db.get('WHERE') })];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._queryStatementModel(this.$db.get('SELECT') + " " + this.$db.get('FROM') + " " + this.$db.get('TABLE_NAME') + " " + this.$db.get('WHERE'))];
                    case 2:
                        data = _a.sent();
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                            return [2 /*return*/, data || []];
                        res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                        this.$db.set('RESULT', res);
                        return [2 /*return*/, res];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.save = function (transaction) {
        var _a;
        if (transaction === void 0) { transaction = { query: [{ table: '', id: '' }] }; }
        return __awaiter(this, void 0, void 0, function () {
            var attributes, query_1, query, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.$db.set('TRANSACTION', transaction);
                        attributes = this.$attributes;
                        if ((_a = Object.keys(attributes)) === null || _a === void 0 ? void 0 : _a.length) {
                            if (this.$db.get('WHERE')) {
                                query_1 = this._queryUpdateModel(attributes);
                                this.$db.set('UPDATE', this.$utils().constants('UPDATE') + " " + this.$db.get('TABLE_NAME') + " " + query_1);
                                this.$db.set('SAVE', 'UPDATE');
                                return [2 /*return*/];
                            }
                            query = this._queryInsertModel(attributes);
                            this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
                            this.$db.set('SAVE', 'INSERT');
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
                    case 11: throw new Error("unknow this [" + this.$db.get('SAVE') + "]");
                }
            });
        });
    };
    /**
     *
     * @Override Method
     *
    */
    Model.prototype.faker = function (rounds) {
        if (rounds === void 0) { rounds = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var data, round, sql, fields, columnAndValue, fields_1, fields_1_1, _a, field, type, query;
            var e_12, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data = [];
                        round = 0;
                        _d.label = 1;
                    case 1:
                        if (!(round < rounds)) return [3 /*break*/, 4];
                        if (this.$db.get('TABLE_NAME') === '' || this.$db.get('TABLE_NAME') == null)
                            throw new Error("unknow table");
                        sql = this.$utils().constants('SHOW') + " " + this.$utils().constants('FIELDS') + " " + this.$utils().constants('FROM') + " " + this.$db.get('TABLE_NAME');
                        return [4 /*yield*/, this._queryStatementModel(sql)];
                    case 2:
                        fields = _d.sent();
                        columnAndValue = {};
                        try {
                            for (fields_1 = (e_12 = void 0, __values(fields)), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                _a = fields_1_1.value, field = _a.Field, type = _a.Type;
                                if (field.toLowerCase() === 'id' || field.toLowerCase() === '_id' || field.toLowerCase() === 'uuid')
                                    continue;
                                columnAndValue = __assign(__assign({}, columnAndValue), (_c = {}, _c[field] = this.$utils().faker(type), _c));
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                        data = __spreadArray(__spreadArray([], __read(data), false), [columnAndValue], false);
                        _d.label = 3;
                    case 3:
                        round++;
                        return [3 /*break*/, 1];
                    case 4:
                        query = this._queryInsertMultipleModel(data);
                        this.$db.set('INSERT', this.$utils().constants('INSERT') + " " + this.$db.get('TABLE_NAME') + " " + query);
                        this.$db.set('SAVE', 'INSERT_MULTIPLE');
                        return [2 /*return*/, this.save()];
                }
            });
        });
    };
    Model.prototype._initModel = function () {
        this.$db = this._setupModel();
        this.$logger = this._setupLogger();
        this._tableName();
        return this;
    };
    Model.prototype._setupLogger = function () {
        var logger = [];
        return {
            get: function () { return logger; },
            set: function (value) {
                logger = __spreadArray(__spreadArray([], __read(logger), false), [value], false);
                return;
            },
            check: function (value) { return logger.indexOf(value) != -1; }
        };
    };
    Model.prototype._setupModel = function () {
        var modelData = {
            TRANSACTION: { query: [{
                        table: '',
                        id: ''
                    }] },
            REGISTRY: {},
            RESULT: null,
            DISTINCT: '',
            PLUCK: '',
            SAVE: '',
            DELETE: '',
            UPDATE: '',
            INSERT: '',
            SELECT: '',
            ONLY: [],
            EXCEPT: [],
            COUNT: '',
            FROM: '',
            JOIN: '',
            WHERE: '',
            GROUP_BY: '',
            ORDER_BY: '',
            LIMIT: '',
            OFFSET: '',
            HAVING: '',
            TABLE_NAME: '',
            UUID_CUSTOM: '',
            PATTERN: 'snake_case',
            TIMESTAMP: false,
            HIDDEN: [],
            DEBUG: false,
            UUID: false,
            SOFT_DELETE: false,
            RELATION: [],
            DEFAULT_SCOPE: {
                where: {},
                whereNot: {},
                whereNull: {},
                whereNotNull: {}
            },
            WITH: [],
            WITH_EXISTS: false,
            PAGE: 1,
            PER_PAGE: 1
        };
        return {
            get: function (key) {
                if (key) {
                    if (!modelData.hasOwnProperty(key))
                        throw new Error("can't get this [" + key + "]");
                    return modelData[key];
                }
                return modelData;
            },
            set: function (key, value) {
                if (!modelData.hasOwnProperty(key))
                    throw new Error("can't set this [" + key + "]");
                modelData[key] = value;
                return;
            }
        };
    };
    return Model;
}(AbstractModel_1.default));
exports.default = Model;
