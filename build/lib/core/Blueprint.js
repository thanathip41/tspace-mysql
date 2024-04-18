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
     * Assign type 'serial' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static serial(_) {
        const instance = new Blueprint;
        instance._addAssignType('SERIAL');
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'serial' in table
     * @return {Blueprint<T>} Blueprint
     */
    serial(_) {
        const instance = new Blueprint;
        instance._addAssignType('SERIAL');
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'INT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static int(_) {
        const instance = new Blueprint;
        instance._addAssignType('INT');
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'INT' in table
     * @return {Blueprint<T>} Blueprint
     */
    int(_) {
        const instance = new Blueprint;
        instance._addAssignType('INT');
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    static tinyInt(number = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`TINYINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    tinyInt(number = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`TINYINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    static tinyint(number = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`TINYINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    tinyint(number = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`TINYINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    static bigInt(number = 10) {
        const instance = new Blueprint;
        instance._addAssignType(`BIGINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    bigInt(number = 10) {
        const instance = new Blueprint;
        instance._addAssignType(`BIGINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    static bigint(number = 10) {
        const instance = new Blueprint;
        instance._addAssignType(`BIGINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    bigint(number = 10) {
        const instance = new Blueprint;
        instance._addAssignType(`BIGINT(${number})`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BOOLEAN' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static boolean() {
        const instance = new Blueprint;
        instance._addAssignType(`BOOLEAN`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'BOOLEAN' in table
     * @return {Blueprint<T>} Blueprint
     */
    boolean() {
        const instance = new Blueprint;
        instance._addAssignType(`BOOLEAN`);
        instance._valueType = Number;
        return instance;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    static double(length = 0, decimal = 0) {
        const instance = new Blueprint;
        instance._valueType = Number;
        if (!length || !decimal) {
            instance._addAssignType(`DOUBLE`);
            return instance;
        }
        instance._addAssignType(`DOUBLE(${length},${decimal})`);
        return instance;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    double(length = 0, decimal = 0) {
        const instance = new Blueprint;
        instance._valueType = Number;
        if (!length || !decimal) {
            instance._addAssignType(`DOUBLE`);
            return instance;
        }
        instance._addAssignType(`DOUBLE(${length},${decimal})`);
        return instance;
    }
    /**
     * Assign type 'FLOAT' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    static float(length = 0, decimal = 0) {
        const instance = new Blueprint;
        instance._valueType = Number;
        if (!length || !decimal) {
            instance._addAssignType(`FLOAT`);
            return instance;
        }
        instance._addAssignType(`FLOAT(${length},${decimal})`);
        return instance;
    }
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    float(length = 0, decimal = 0) {
        const instance = new Blueprint;
        instance._valueType = Number;
        if (!length || !decimal) {
            instance._addAssignType(`FLOAT`);
            return instance;
        }
        instance._addAssignType(`FLOAT(${length},${decimal})`);
        return instance;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @static
     * @param {number} length  [length = 191] length of string
     * @return {Blueprint<T>} Blueprint
     */
    static varchar(length = 191) {
        const instance = new Blueprint;
        if (length > 255)
            length = 255;
        if (length <= 0)
            length = 1;
        instance._addAssignType(`VARCHAR(${length})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 191] length of string
     * @return {Blueprint<T>} Blueprint
     */
    varchar(length = 191) {
        const instance = new Blueprint;
        if (length > 255)
            length = 255;
        if (length <= 0)
            length = 1;
        instance._addAssignType(`VARCHAR(${length})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'CHAR' in table
     * @static
     * @param {number} length [length = 1] length of string
     * @return {Blueprint<T>} Blueprint
     */
    static char(length = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`CHAR(${length})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {Blueprint<T>} Blueprint
     */
    char(length = 1) {
        const instance = new Blueprint;
        instance._addAssignType(`CHAR(${length})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static longText() {
        const instance = new Blueprint;
        instance._addAssignType(`LONGTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    longText() {
        const instance = new Blueprint;
        instance._addAssignType(`LONGTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'BINARY' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static binary() {
        const instance = new Blueprint;
        instance._addAssignType(`BINARY`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'BINARY' in table
     * @return {Blueprint<T>} Blueprint
     */
    binary() {
        const instance = new Blueprint;
        instance._addAssignType(`BINARY`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static longtext() {
        const instance = new Blueprint;
        instance._addAssignType(`LONGTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    longtext() {
        const instance = new Blueprint;
        instance._addAssignType(`LONGTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'JSON' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static json() {
        const instance = new Blueprint;
        instance._addAssignType(`JSON`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'JSON' in table
     * @return {Blueprint<T>} Blueprint
     */
    json() {
        const instance = new Blueprint;
        instance._addAssignType(`JSON`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static mediumText() {
        const instance = new Blueprint;
        instance._addAssignType(`MEDIUMTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    mediumText() {
        const instance = new Blueprint;
        instance._addAssignType(`MEDIUMTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static mediumtext() {
        const instance = new Blueprint;
        instance._addAssignType(`MEDIUMTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    mediumtext() {
        const instance = new Blueprint;
        instance._addAssignType(`MEDIUMTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static tinyText() {
        const instance = new Blueprint;
        instance._addAssignType(`TINYTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    tinyText() {
        const instance = new Blueprint;
        instance._addAssignType(`TINYTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static tinytext() {
        const instance = new Blueprint;
        instance._addAssignType(`TINYTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    tinytext() {
        const instance = new Blueprint;
        instance._addAssignType(`TINYTEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static text() {
        const instance = new Blueprint;
        instance._addAssignType(`TEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'TEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    text() {
        const instance = new Blueprint;
        instance._addAssignType(`TEXT`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'ENUM'
     * @static
     * @param {...string} enums n1, n2, n3, ...n
     * @return {Blueprint<T>} Blueprint
     */
    static enum(...enums) {
        const instance = new Blueprint;
        instance._addAssignType(`ENUM(${enums.map(e => `'${e.replace(/'/g, '')}'`)})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {Blueprint<T>} Blueprint
     */
    enum(...enums) {
        const instance = new Blueprint;
        instance._addAssignType(`ENUM(${enums.map(e => `'${e.replace(/'/g, '')}'`)})`);
        instance._valueType = String;
        return instance;
    }
    /**
     * Assign type 'DATE' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static date() {
        const instance = new Blueprint;
        instance._addAssignType(`DATE`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'DATE' in table
     * @return {Blueprint<T>} Blueprint
     */
    date() {
        const instance = new Blueprint;
        instance._addAssignType(`DATE`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static dateTime() {
        const instance = new Blueprint;
        instance._addAssignType(`DATETIME`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {Blueprint<T>} Blueprint
     */
    dateTime() {
        const instance = new Blueprint;
        instance._addAssignType(`DATETIME`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static datetime() {
        const instance = new Blueprint;
        instance._addAssignType(`DATETIME`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {Blueprint<T>} Blueprint
     */
    datetime() {
        const instance = new Blueprint;
        instance._addAssignType(`DATETIME`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static timestamp() {
        const instance = new Blueprint;
        instance._addAssignType(`TIMESTAMP`);
        instance._valueType = Date;
        return instance;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {Blueprint<T>} Blueprint
     */
    timestamp() {
        const instance = new Blueprint;
        instance._addAssignType(`TIMESTAMP`);
        instance._valueType = Date;
        return instance;
    }
    //---------------------------- attributes ------------------------------------//
    /**
     * Assign attributes 'UNSIGNED' in table
     * @return {Blueprint<T>} Blueprint
     */
    unsigned() {
        this._addAssignAttribute(`UNSIGNED`);
        return this;
    }
    /**
     * Assign attributes 'UNIQUE' in table
     * @return {Blueprint<T>} Blueprint
     */
    unique() {
        this._addAssignAttribute(`UNIQUE`);
        return this;
    }
    /**
     * Assign attributes 'NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    null() {
        this._addAssignAttribute(`NULL`);
        return this;
    }
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    notNull() {
        this._addAssignAttribute(`NOT NULL`);
        return this;
    }
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    notnull() {
        this._addAssignAttribute(`NOT NULL`);
        return this;
    }
    /**
     * Assign attributes 'PRIMARY KEY' in table
     * @return {Blueprint<T>} Blueprint
     */
    primary() {
        this._addAssignAttribute(`PRIMARY KEY`);
        return this;
    }
    /**
     * Assign attributes 'default' in table
     * @param {string | number} value  default value
     * @return {Blueprint<T>} Blueprint
     */
    default(value) {
        this._addAssignAttribute(`DEFAULT '${value}'`);
        return this;
    }
    /**
     * Assign attributes 'defaultValue' in table
     * @param {string | number} value  default value
     * @return {Blueprint<T>} Blueprint
     */
    defaultValue(value) {
        this._addAssignAttribute(`DEFAULT '${value}'`);
        return this;
    }
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {Blueprint<T>} Blueprint
     */
    currentTimestamp() {
        this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
        return this;
    }
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {Blueprint<T>} Blueprint
     */
    currenttimestamp() {
        this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
        return this;
    }
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {Blueprint<T>} Blueprint
     */
    autoIncrement() {
        this._addAssignAttribute(`AUTO_INCREMENT`);
        return this;
    }
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {Blueprint<T>} Blueprint
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
     * @return {Blueprint<T>} Blueprint
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