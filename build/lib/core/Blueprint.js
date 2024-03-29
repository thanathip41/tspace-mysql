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
        this._valueType = String;
    }
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int(_) {
        this._addAssignType('INT');
        this._valueType = Number;
        return this;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number = 1) {
        this._addAssignType(`TINYINT(${number})`);
        this._valueType = Number;
        return this;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyint(number = 1) {
        this._addAssignType(`TINYINT(${number})`);
        this._valueType = Number;
        return this;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number = 10) {
        this._addAssignType(`BIGINT(${number})`);
        this._valueType = Number;
        return this;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigint(number = 10) {
        this._addAssignType(`BIGINT(${number})`);
        this._valueType = Number;
        return this;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    double(length = 0, decimal = 0) {
        this._valueType = Number;
        if (!length || !decimal) {
            this._addAssignType(`DOUBLE`);
            return this;
        }
        this._addAssignType(`DOUBLE(${length},${decimal})`);
        return this;
    }
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    float(length = 0, decimal = 0) {
        this._valueType = Number;
        if (!length || !decimal) {
            this._addAssignType(`FLOAT`);
            return this;
        }
        this._addAssignType(`FLOAT(${length},${decimal})`);
        return this;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 191] length of string
     * @return {this} this
     */
    varchar(length = 191) {
        if (length > 255)
            length = 255;
        if (length <= 0)
            length = 1;
        this._addAssignType(`VARCHAR(${length})`);
        return this;
    }
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    char(length = 1) {
        this._addAssignType(`CHAR(${length})`);
        return this;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longText() {
        this._addAssignType(`LONGTEXT`);
        return this;
    }
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longtext() {
        this._addAssignType(`LONGTEXT`);
        return this;
    }
    /**
     * Assign type 'JSON' in table
     * @return {this} this
     */
    json() {
        this._addAssignType(`JSON`);
        return this;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumText() {
        this._addAssignType(`MEDIUMTEXT`);
        return this;
    }
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumtext() {
        this._addAssignType(`MEDIUMTEXT`);
        return this;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinyText() {
        this._addAssignType(`TINYTEXT`);
        return this;
    }
    /**
    * Assign type 'TINYTEXT' in table
    * @return {this} this
    */
    tinytext() {
        this._addAssignType(`TINYTEXT`);
        return this;
    }
    /**
     * Assign type 'TEXT' in table
     * @return {this} this
     */
    text() {
        this._addAssignType(`TEXT`);
        return this;
    }
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    enum(...enums) {
        this._addAssignType(`ENUM(${enums.map(e => `'${e.replace(/'/g, '')}'`)})`);
        return this;
    }
    /**
     * Assign type 'DATE' in table
     * @return {this} this
     */
    date() {
        this._addAssignType(`DATE`);
        this._valueType = Date;
        return this;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    dateTime() {
        this._addAssignType(`DATETIME`);
        this._valueType = Date;
        return this;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    datetime() {
        this._addAssignType(`DATETIME`);
        this._valueType = Date;
        return this;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp() {
        this._addAssignType(`TIMESTAMP`);
        this._valueType = Date;
        return this;
    }
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
