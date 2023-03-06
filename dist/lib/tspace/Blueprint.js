"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blueprint = void 0;
class Blueprint {
    constructor() {
        this.type = '';
        this.attrbuites = [];
    }
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int() {
        this._addAssignType('INT');
        return this;
    }
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number = 1) {
        this._addAssignType(`TINYINT(${number})`);
        return this;
    }
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number = 10) {
        this._addAssignType(`BIGINT(${number})`);
        return this;
    }
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    double(length = 0, decimal = 0) {
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
        if (!length || !decimal) {
            this._addAssignType(`FLOAT`);
            return this;
        }
        this._addAssignType(`FLOAT(${length},${decimal})`);
        return this;
    }
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 100] length of string
     * @return {this} this
     */
    varchar(length = 100) {
        if (length > 255)
            length = 255;
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
     * Assign type 'MEDIUMTEXT' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    mediumText() {
        this._addAssignType(`MEDIUMTEXT`);
        return this;
    }
    /**
     * Assign type 'TINYTEXT' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    tinyText() {
        this._addAssignType(`TINYTEXT`);
        return this;
    }
    /**
     * Assign type 'TEXT' in table
     * @param {number} length [length = 1] length of string
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
        this._addAssignType(`ENUM('${enums}')`);
        return this;
    }
    /**
     * Assign type 'DATE' in table
     * @return {this} this
     */
    date() {
        this._addAssignType(`DATE`);
        return this;
    }
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    dateTime() {
        this._addAssignType(`DATETIME`);
        return this;
    }
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp() {
        this._addAssignType(`TIMESTAMP`);
        return this;
    }
    /**
     * Assign type 'UNSIGNED' in table
     * @return {this} this
     */
    unsigned() {
        this._addAssignAttrbuite(`UNSIGNED`);
        return this;
    }
    /**
     * Assign type 'UNIQUE' in table
     * @return {this} this
     */
    unique() {
        this._addAssignAttrbuite(`UNIQUE`);
        return this;
    }
    /**
     * Assign type 'NULL' in table
     * @return {this} this
     */
    null() {
        this._addAssignAttrbuite(`NULL`);
        return this;
    }
    /**
     * Assign type 'NOT NULL' in table
     * @return {this} this
     */
    notNull() {
        this._addAssignAttrbuite(`NOT NULL`);
        return this;
    }
    /**
     * Assign type 'PRIMARY KEY' in table
     * @return {this} this
     */
    primary() {
        this._addAssignAttrbuite(`PRIMARY KEY`);
        return this;
    }
    /**
     * Assign attrbuites 'default' in table
     * @param {string | number} n  default value
     * @return {this} this
     */
    default(n) {
        this._addAssignAttrbuite(`DEFAULT '${n}'`);
        return this;
    }
    /**
     * Assign attrbuites 'default currentTimestamp' in table
     * @return {this} this
     */
    currentTimestamp() {
        this._addAssignAttrbuite(`DEFAULT CURRENT_TIMESTAMP`);
        return this;
    }
    /**
     * Assign attrbuites 'autoIncrement' in table
     * @return {this} this
     */
    autoIncrement() {
        this._addAssignAttrbuite(`AUTO_INCREMENT`);
        return this;
    }
    _addAssignType(type) {
        if (this.type)
            return this;
        this.type = type;
        return this;
    }
    _addAssignAttrbuite(attrbuite) {
        this.attrbuites = [...this.attrbuites, attrbuite];
        return this;
    }
}
exports.Blueprint = Blueprint;
exports.default = Blueprint;
