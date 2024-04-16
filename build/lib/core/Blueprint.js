"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blueprint = void 0;
/**
 * Make schema for table with Blueprint
 * @example
 *   import { Schema , Blueprint }  from 'tspace-mysql'
 *   await new Schema().table('users',{
 *      id          : new Blueprint().int().notNull().primary().autoIncrement(),
 *      name        : new Blueprint().varchar(255).default('my name'),
 *      email       : new Blueprint().varchar(255).unique(),
 *      json        : new Blueprint().json().null(),
 *      verify      : new Blueprint().tinyInt(1).notNull(),
 *      created_at  : new Blueprint().timestamp().null(),
 *      updated_at  : new Blueprint().timestamp().null(),
 *      deleted_at  : new Blueprint().timestamp().null()
 *   })
 */
class Blueprint {
    constructor() {
        this._type = 'INT';
        this._attributes = [];
        this._foreignKey = null;
        this._column = null;
    }
    /**
     * Assign type 'int' in table
     * @static
     * @return {this} this
     */
    static int(_) {
        const self = new Blueprint;
        self._addAssignType('INT');
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int(_) {
        const self = new Blueprint;
        self._addAssignType('INT');
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {this} this
     */
    static tinyInt(number = 1) {
        const self = new Blueprint;
        self._addAssignType(`TINYINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number = 1) {
        const self = new Blueprint;
        self._addAssignType(`TINYINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {this} this
     */
    static tinyint(number = 1) {
        const self = new Blueprint;
        self._addAssignType(`TINYINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyint(number = 1) {
        const self = new Blueprint;
        self._addAssignType(`TINYINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {this} this
     */
    static bigInt(number = 10) {
        const self = new Blueprint;
        self._addAssignType(`BIGINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number = 10) {
        const self = new Blueprint;
        self._addAssignType(`BIGINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {this} this
     */
    static bigint(number = 10) {
        const self = new Blueprint;
        self._addAssignType(`BIGINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigint(number = 10) {
        const self = new Blueprint;
        self._addAssignType(`BIGINT(${number})`);
        self._valueType = Number;
        return self;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    static double(length = 0, decimal = 0) {
        const self = new Blueprint;
        self._valueType = Number;
        if (!length || !decimal) {
            self._addAssignType(`DOUBLE`);
            return self;
        }
        self._addAssignType(`DOUBLE(${length},${decimal})`);
        return self;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    double(length = 0, decimal = 0) {
        const self = new Blueprint;
        self._valueType = Number;
        if (!length || !decimal) {
            self._addAssignType(`DOUBLE`);
            return self;
        }
        self._addAssignType(`DOUBLE(${length},${decimal})`);
        return self;
    }
    /**
     * Assign type 'FLOAT' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    static float(length = 0, decimal = 0) {
        const self = new Blueprint;
        self._valueType = Number;
        if (!length || !decimal) {
            self._addAssignType(`FLOAT`);
            return self;
        }
        self._addAssignType(`FLOAT(${length},${decimal})`);
        return self;
    }
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    float(length = 0, decimal = 0) {
        const self = new Blueprint;
        self._valueType = Number;
        if (!length || !decimal) {
            self._addAssignType(`FLOAT`);
            return self;
        }
        self._addAssignType(`FLOAT(${length},${decimal})`);
        return self;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @static
     * @param {number} length  [length = 191] length of string
     * @return {this} this
     */
    static varchar(length = 191) {
        const self = new Blueprint;
        if (length > 255)
            length = 255;
        if (length <= 0)
            length = 1;
        self._addAssignType(`VARCHAR(${length})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 191] length of string
     * @return {this} this
     */
    varchar(length = 191) {
        const self = new Blueprint;
        if (length > 255)
            length = 255;
        if (length <= 0)
            length = 1;
        self._addAssignType(`VARCHAR(${length})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'CHAR' in table
     * @static
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    static char(length = 1) {
        const self = new Blueprint;
        self._addAssignType(`CHAR(${length})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    char(length = 1) {
        const self = new Blueprint;
        self._addAssignType(`CHAR(${length})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {this} this
     */
    static longText() {
        const self = new Blueprint;
        self._addAssignType(`LONGTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longText() {
        const self = new Blueprint;
        self._addAssignType(`LONGTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {this} this
     */
    static longtext() {
        const self = new Blueprint;
        self._addAssignType(`LONGTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longtext() {
        const self = new Blueprint;
        self._addAssignType(`LONGTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'JSON' in table
     * @static
     * @return {this} this
     */
    static json() {
        const self = new Blueprint;
        self._addAssignType(`JSON`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'JSON' in table
     * @return {this} this
     */
    json() {
        const self = new Blueprint;
        self._addAssignType(`JSON`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {this} this
     */
    static mediumText() {
        const self = new Blueprint;
        self._addAssignType(`MEDIUMTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumText() {
        const self = new Blueprint;
        self._addAssignType(`MEDIUMTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {this} this
     */
    static mediumtext() {
        const self = new Blueprint;
        self._addAssignType(`MEDIUMTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumtext() {
        const self = new Blueprint;
        self._addAssignType(`MEDIUMTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {this} this
     */
    static tinyText() {
        const self = new Blueprint;
        self._addAssignType(`TINYTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinyText() {
        const self = new Blueprint;
        self._addAssignType(`TINYTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {this} this
     */
    static tinytext() {
        const self = new Blueprint;
        self._addAssignType(`TINYTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinytext() {
        const self = new Blueprint;
        self._addAssignType(`TINYTEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TEXT' in table
     * @static
     * @return {this} this
     */
    static text() {
        const self = new Blueprint;
        self._addAssignType(`TEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'TEXT' in table
     * @return {this} this
     */
    text() {
        const self = new Blueprint;
        self._addAssignType(`TEXT`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'ENUM'
     * @static
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    static enum(...enums) {
        const self = new Blueprint;
        self._addAssignType(`ENUM(${enums.map(e => `'${e.replace(/'/g, '')}'`)})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    enum(...enums) {
        const self = new Blueprint;
        self._addAssignType(`ENUM(${enums.map(e => `'${e.replace(/'/g, '')}'`)})`);
        self._valueType = String;
        return self;
    }
    /**
     * Assign type 'DATE' in table
     * @static
     * @return {this} this
     */
    static date() {
        const self = new Blueprint;
        self._addAssignType(`DATE`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'DATE' in table
     * @return {this} this
     */
    date() {
        const self = new Blueprint;
        self._addAssignType(`DATE`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {this} this
     */
    static dateTime() {
        const self = new Blueprint;
        self._addAssignType(`DATETIME`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    dateTime() {
        const self = new Blueprint;
        self._addAssignType(`DATETIME`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {this} this
     */
    static datetime() {
        const self = new Blueprint;
        self._addAssignType(`DATETIME`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    datetime() {
        const self = new Blueprint;
        self._addAssignType(`DATETIME`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @static
     * @return {this} this
     */
    static timestamp() {
        const self = new Blueprint;
        self._addAssignType(`TIMESTAMP`);
        self._valueType = Date;
        return self;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp() {
        const self = new Blueprint;
        self._addAssignType(`TIMESTAMP`);
        self._valueType = Date;
        return self;
    }
    //---------------------------- attributes ------------------------------------//
    /**
     * Assign attributes 'UNSIGNED' in table
     * @return {this} this
     */
    unsigned() {
        this._addAssignAttribute(`UNSIGNED`);
        return this;
    }
    /**
     * Assign attributes 'UNIQUE' in table
     * @return {this} this
     */
    unique() {
        this._addAssignAttribute(`UNIQUE`);
        return this;
    }
    /**
     * Assign attributes 'NULL' in table
     * @return {this} this
     */
    null() {
        this._addAssignAttribute(`NULL`);
        return this;
    }
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notNull() {
        this._addAssignAttribute(`NOT NULL`);
        return this;
    }
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notnull() {
        this._addAssignAttribute(`NOT NULL`);
        return this;
    }
    /**
     * Assign attributes 'PRIMARY KEY' in table
     * @return {this} this
     */
    primary() {
        this._addAssignAttribute(`PRIMARY KEY`);
        return this;
    }
    /**
     * Assign attributes 'default' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    default(value) {
        this._addAssignAttribute(`DEFAULT '${value}'`);
        return this;
    }
    /**
     * Assign attributes 'defaultValue' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    defaultValue(value) {
        this._addAssignAttribute(`DEFAULT '${value}'`);
        return this;
    }
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currentTimestamp() {
        this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
        return this;
    }
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currenttimestamp() {
        this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
        return this;
    }
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoIncrement() {
        this._addAssignAttribute(`AUTO_INCREMENT`);
        return this;
    }
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoincrement() {
        this._addAssignAttribute(`AUTO_INCREMENT`);
        return this;
    }
    /**
     * Assign attributes 'foreign' in table
     * Reference bettwen Column Main to Column Child
     * @param    {object}  property object { key , value , operator }
     * @property {string?}  property.reference
     * @property {Model | string}  property.on
     * @property {string?} property.onDelete
     * @property {string?}  property.onUpdate
     * @return {this} this
     */
    foreign({ references, on, onDelete, onUpdate }) {
        if (on == null)
            return this;
        this._foreignKey = {
            references: references == null ? 'id' : references,
            on,
            onDelete: onDelete == null ? 'CASCADE' : onDelete,
            onUpdate: onUpdate == null ? 'CASCADE' : onUpdate
        };
        return this;
    }
    bindColumn(column) {
        this._column = column;
        return this;
    }
    get column() {
        return this._column;
    }
    get type() {
        return this._type;
    }
    get attributes() {
        return this._attributes;
    }
    get foreignKey() {
        return this._foreignKey;
    }
    get valueType() {
        return this._valueType;
    }
    _addAssignType(type) {
        this._type = type;
        return this;
    }
    _addAssignAttribute(attribute) {
        this._attributes = [...this.attributes, attribute];
        return this;
    }
}
exports.Blueprint = Blueprint;
exports.default = Blueprint;
//# sourceMappingURL=Blueprint.js.map