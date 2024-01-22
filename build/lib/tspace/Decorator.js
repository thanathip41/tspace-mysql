"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsToMany = exports.BelongsTo = exports.HasMany = exports.HasOne = exports.SnakeCase = exports.CamelCase = exports.Pattern = exports.SoftDelete = exports.Timestamp = exports.Observer = exports.UUID = exports.Validate = exports.Column = exports.TablePlural = exports.TableSingular = exports.Table = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const Blueprint_1 = require("./Blueprint");
const Table = (name) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$table = name;
    };
};
exports.Table = Table;
const TableSingular = () => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        const name = String(constructor.name).replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1);
        constructor.prototype.$table = pluralize_1.default.singular(name);
    };
};
exports.TableSingular = TableSingular;
const TablePlural = () => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        const name = constructor.name.replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1);
        constructor.prototype.$table = pluralize_1.default.plural(name);
    };
};
exports.TablePlural = TablePlural;
const Column = (blueprint) => {
    return (target, key) => {
        if (!(blueprint() instanceof Blueprint_1.Blueprint))
            return;
        if (target.$schema == null)
            target.$schema = {};
        target.$schema = Object.assign(Object.assign({}, target.$schema), { [key]: blueprint() });
    };
};
exports.Column = Column;
const Validate = (validate) => {
    return (target, key) => {
        if (target.$validateSchema == null)
            target.$validateSchema = {};
        target.$validateSchema = Object.assign(Object.assign({}, target.$validateSchema), { [key]: validate });
    };
};
exports.Validate = Validate;
const UUID = (column) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$uuid = true;
        constructor.prototype.$uuidColumn = column;
    };
};
exports.UUID = UUID;
const Observer = (observer) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$observer = observer;
    };
};
exports.Observer = Observer;
const Timestamp = (timestampColumns) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$timestamp = true;
        constructor.prototype.$timestampColumns = timestampColumns;
    };
};
exports.Timestamp = Timestamp;
const SoftDelete = (column) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$softDelete = true;
        constructor.prototype.$softDeleteColumn = column;
    };
};
exports.SoftDelete = SoftDelete;
const Pattern = (pattern) => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$pattern = pattern;
    };
};
exports.Pattern = Pattern;
const CamelCase = () => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$pattern = 'camelCase';
    };
};
exports.CamelCase = CamelCase;
const SnakeCase = () => {
    return (constructor) => {
        if (constructor.prototype == null)
            return;
        constructor.prototype.$pattern = 'snake_case';
    };
};
exports.SnakeCase = SnakeCase;
const HasOne = ({ name, as, model, localKey, foreignKey, freezeTable }) => {
    return (target, key) => {
        if (target.$hasOne == null)
            target.$hasOne = [];
        target.$hasOne.push({
            name: name == null ? key : name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
    };
};
exports.HasOne = HasOne;
const HasMany = ({ name, as, model, localKey, foreignKey, freezeTable }) => {
    return (target, key) => {
        if (target.$hasMany == null)
            target.$hasMany = [];
        target.$hasMany.push({
            name: name == null ? key : name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
    };
};
exports.HasMany = HasMany;
const BelongsTo = ({ name, as, model, localKey, foreignKey, freezeTable }) => {
    return (target, key) => {
        if (target.$belongsTo == null)
            target.$belongsTo = [];
        target.$belongsTo.push({
            name: name == null ? key : name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
    };
};
exports.BelongsTo = BelongsTo;
const BelongsToMany = ({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }) => {
    return (target, key) => {
        if (target.$belongsToMany == null)
            target.$belongsToMany = [];
        target.$belongsToMany.push({
            name: name == null ? key : name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            modelPivot
        });
    };
};
exports.BelongsToMany = BelongsToMany;
