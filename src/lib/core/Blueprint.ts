import { Model } from "./Model";

type TExtendType =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | DateConstructor
  | readonly TExtendType[]
  | { [_: string]: TExtendType };

type ResolveType<T> =
  T extends NumberConstructor ? number :
  T extends StringConstructor ? string :
  T extends BooleanConstructor ? boolean :
  T extends DateConstructor ? Date :
  T extends readonly (infer U)[] ? ResolveType<U>[] :
  T extends Record<string, any>
    ? { [K in keyof T]: ResolveType<T[K]> }
    : never

/**
 * Class 'Blueprint' is used to make the schema for table
 * @example
 *   import { Schema , Blueprint }  from 'tspace-mysql'
 *   import sql from '../../../build/lib/core/SqlLike';
import { default } from '../../../app/$audit';
 *   await new Schema().table('users',{ 
 *      id          : Blueprint.int().notNull().primary().autoIncrement(),
 *      name        : Blueprint.varchar(255).default('my name').index(),
 *      email       : Blueprint.varchar(255).unique().compositeIndex(['verify']), // composite index email,verify
 *      json        : Blueprint.json().null(),
 *      verify      : Blueprint.tinyInt(1).notNull(),
 *      created_at  : Blueprint.timestamp().null(),
 *      updated_at  : Blueprint.timestamp().null(),
 *      deleted_at  : Blueprint.timestamp().null()
 *   })
 */
class Blueprint<T = any> {
  private _default: string | number | null = null;
  private _enum :string[] = [];
  private _type: string = "INT";
  private _attributes: string[] = [];
  private _foreignKey: Record<string, any> | null = null;
  private _index: string | null = null;
  private _compositeIndex : { columns : string[] , name ?: string } | null = null;
  private _column: string | null = null;
  private _isVirtual: boolean = false;
  private _isEnum : boolean = false;
  private _isNull : boolean = true;
  private _sql: {
    select?: string;
    where?: string;
    orderBy?: string;
    groupBy?: string;
  } | null = null;

  private _valueType!: TExtendType

  /**
   * Assign type 'virtual' to column
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static virtualColumn(sql:| string | { select?: string; where?: string; orderBy?: string; groupBy?: string }): Blueprint<unknown> {
    return new Blueprint().virtualColumn(sql);
  }

  /**
   * Assign type 'virtual' to column
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public virtualColumn(sql:| string | { select?: string; where?: string; orderBy?: string; groupBy?: string }): Blueprint<unknown> {
    const instance = new Blueprint();
    instance._isVirtual = true;
    if (typeof sql === "object" && sql !== null) {
      instance._sql = sql;
      return instance;
    }

    instance._sql = { select: sql, where: sql, orderBy: sql, groupBy: sql };

    return instance;
  }
  /**
   * Assign type 'serial' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static serial(_?: number): Blueprint<number> {
    return new Blueprint<number>().serial(_);
  }

  /**
   * Assign type 'serial' in table
   * @return {Blueprint<T>} Blueprint
   */
  public serial(_?: number): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._addAssignType("SERIAL");
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'INT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static int(_?: number): Blueprint<number> {
    return new Blueprint<number>().int(_);
  }

  /**
   * Assign type 'INT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public int(_?: number): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._addAssignType("INT");
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'INT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static integer(_?: number): Blueprint<number> {
    return new Blueprint<number>().int(_);
  }

  /**
   * Assign type 'INT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public integer(_?: number): Blueprint<number> {
    return new Blueprint<number>().int(_);
  }

  /**
   * Assign type 'TINYINT' in table
   * @static
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  public static tinyInt(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number>().tinyInt(number);
  }

  /**
   * Assign type 'TINYINT' in table
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  public tinyInt(number: number = 1): Blueprint<number | boolean> {
    const instance = new Blueprint<number | boolean>();
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
  public static tinyint(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().tinyInt(number);
  }

  /**
   * Assign type 'TINYINT' in table
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  public tinyint(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().tinyInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @static
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  public static bigInt(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  public bigInt(number: number = 10): Blueprint<number> {
    const instance = new Blueprint<number>();
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
  public static bigint(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  public bigint(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BOOLEAN' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static boolean(): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().boolean();
  }

  /**
   * Assign type 'BOOLEAN' in table
   * @return {Blueprint<T>} Blueprint
   */
  public boolean(): Blueprint<number | boolean> {
    const instance = new Blueprint<number | boolean>();
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
  public static double(length: number = 0, decimal: number = 0): Blueprint<number> {
    return new Blueprint<number>().double(length,decimal);
  }

  /**
   * Assign type 'DOUBLE' in table
   * @param {number} length  between 1-255
   * @param {number} decimal  0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  public double(length: number = 0, decimal: number = 0): Blueprint<number> {
    const instance = new Blueprint<number>();

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
  public static float(length: number = 0, decimal: number = 0): Blueprint<number> {
    return new Blueprint<number>().float(length,decimal);
  }

  /**
   * Assign type 'FLOAT' in table
   * @param {number} length  between 1-255
   * @param {number} decimal 0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  public float(length: number = 0, decimal: number = 0): Blueprint<number> {
    const instance = new Blueprint<number>();
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
  public static varchar(length: number = 191): Blueprint<string> {
    return new Blueprint<string>().varchar(length);
  }

  /**
   * Assign type 'VARCHAR' in table
   * @param {number} length  [length = 191] length of string
   * @return {Blueprint<T>} Blueprint
   */
  public varchar(length: number = 191): Blueprint<string> {
    const instance = new Blueprint<string>();

    if (length > 255) length = 255;

    if (length <= 0) length = 1;

    instance._addAssignType(`VARCHAR(${length})`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'UUID' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static uuid(): Blueprint<string> {
    return new Blueprint<string>().uuid();
  }

  /**
   * Assign type 'UUID' in table
   * @return {Blueprint<T>} Blueprint
   */
  public uuid(): Blueprint<string> {

    const instance = new Blueprint<string>();

    instance._addAssignType(`UUID`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'CHAR' in table
   * @static
   * @param {number} length [length = 1] length of string
   * @return {Blueprint<T>} Blueprint
   */
  public static char(length: number = 1): Blueprint<string> {
    return new Blueprint<string>().char(length);
  }

  /**
   * Assign type 'CHAR' in table
   * @param {number} length [length = 1] length of string
   * @return {Blueprint<T>} Blueprint
   */
  public char(length: number = 1): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`CHAR(${length})`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static longText(): Blueprint<string> {
    return new Blueprint<string>().longText();
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public longText(): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`LONGTEXT`);

    instance._valueType = String;

    return instance;
  }

   /**
   * Assign type 'LONGTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static longtext(): Blueprint<string> {
    return new Blueprint<string>().longtext();
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public longtext(): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`LONGTEXT`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'BINARY' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static binary(): Blueprint<string> {
    return new Blueprint<string>().binary();
  }

  /**
   * Assign type 'BINARY' in table
   * @return {Blueprint<T>} Blueprint
   */
  public binary(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`BINARY`);
    instance._valueType = String;
    return instance;
  }
  /**
   * Assign type 'JSON' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static json(): Blueprint<Record<string, any> | string> {
    return new Blueprint<string>().json();
  }

  /**
   * Assign type 'JSON' in table
   * @return {Blueprint<T>} Blueprint
   */
  public json(): Blueprint<Record<string, any> | string> {
    const instance = new Blueprint<Record<string, any>>();
    instance._addAssignType(`JSON`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static mediumText(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public mediumText(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`MEDIUMTEXT`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static mediumtext(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public mediumtext(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static tinyText(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public tinyText(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`TINYTEXT`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static tinytext(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public tinytext(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static text(): Blueprint<string> {
    return new Blueprint<string>().text();
  }

  /**
   * Assign type 'TEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  public text(): Blueprint<string> {
    const instance = new Blueprint<string>();
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
  public static enum<K extends string | string[] | Record<string, string>>(
    ...enums: (K extends string ? K : K)[]
  ): Blueprint<K extends string ? K : K[keyof K]> {
    return new Blueprint<K extends string ? K : K[keyof K]>().enum(...enums);
  }

  /**
   * Assign type 'ENUM'
   * @param {...string} enums n1, n2, n3, ...n
   * @return {Blueprint<T>} Blueprint
   */
  public enum<K extends string | string[] | Record<string, string>>(
    ...enums: (K extends string ? K : K)[]
  ): Blueprint<K extends string ? K : K[keyof K]> {
    const instance = new Blueprint<K extends string ? K : K[keyof K]>();

    let enumValues: string[] = [];

    if (enums.length === 1 && typeof enums[0] === 'object') {
      enumValues = Object.values(enums[0] as Record<string, string>);
    } else {
      enumValues = enums as string[];
    }

    enumValues = enumValues.map(e => e.replace(/'/g, ''));

    instance._addAssignType(
      `ENUM(${enumValues.map(e => `'${e}'`).join(',')})`
    );
    instance._valueType = String;
    instance._enum = enumValues as any;
    instance._isEnum = true;
    return instance;
  }

  /**
   * Assign type 'DATE' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static date(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().date();
  }

  /**
   * Assign type 'DATE' in table
   * @return {Blueprint<T>} Blueprint
   */
  public date(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`DATE`);
    instance._valueType = Date;

    return instance;
  }

  /**
   * Assign type 'DATETIME' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static dateTime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'DATETIME' in table
   * @return {Blueprint<T>} Blueprint
   */
  public dateTime(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`DATETIME`);
    instance._valueType = Date;
    return instance;
  }

  /**
   * Assign type 'DATETIME' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static datetime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'DATETIME' in table
   * @return {Blueprint<T>} Blueprint
   */
  public datetime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'TIMESTAMP' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  public static timestamp(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().timestamp();
  }

  /**
   * Assign type 'TIMESTAMP' in table
   * @return {Blueprint<T>} Blueprint
   */
  public timestamp(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`TIMESTAMP`);
    instance._valueType = Date;
    return instance;
  }

  //---------------------------- attributes ------------------------------------//

  /**
   * Assign attributes 'UNSIGNED' in table
   * @return {Blueprint<T>} Blueprint
   */
  public unsigned(): Blueprint<T> {
    this._addAssignAttribute(`UNSIGNED`);
    return this;
  }

  /**
   * Assign attributes 'UNIQUE' in table
   * @return {Blueprint<T>} Blueprint
   */
  public unique(): Blueprint<T> {
    this._addAssignAttribute(`UNIQUE`);
    return this;
  }

  /**
   * Assign attributes 'NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  public null(): Blueprint<T | null> {
    this._addAssignAttribute(`NULL`);
    return this;
  }

  /**
   * Assign attributes 'NOT NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  public notNull(): Blueprint<T> {
    this._addAssignAttribute(`NOT NULL`);
    this._isNull = false;
    return this as Blueprint<T>;
  }

  /**
   * Assign attributes 'NOT NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  public notnull(): Blueprint<T> {
    this._addAssignAttribute(`NOT NULL`);
    this._isNull = false;
    return this;
  }

  /**
   * Assign attributes 'PRIMARY KEY' in table
   * @return {Blueprint<T>} Blueprint
   */
  public primary(): Blueprint<T> {
    this._addAssignAttribute(`PRIMARY KEY`);
    return this;
  }

  /**
   * Assign attributes 'default' in table
   * @param {string | number} value  default value
   * @return {Blueprint<T>} Blueprint
   */
  public default(value: string | number | boolean): Blueprint<T> {
    if (typeof value === 'boolean') {
      this._addAssignAttribute(`DEFAULT ${value ? 1 : 0}`);
      this._default = value ? 1 : 0
      return this
    }

    if (typeof value === 'number') {
      this._addAssignAttribute(`DEFAULT ${value}`);
      this._default = value
      return this
    }

    this._addAssignAttribute(`DEFAULT '${value}'`);
    this._default = `${value}`
    return this;
  }

  /**
   * Assign attributes 'default currentTimestamp' in table
   * @return {Blueprint<T>} Blueprint
   */
  public currentTimestamp(): Blueprint<T> {
    this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
    return this;
  }

  /**
   * Assign attributes 'default currentTimestamp' in table
   * @return {Blueprint<T>} Blueprint
   */
  public currenttimestamp(): Blueprint<T> {
    this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
    return this;
  }

  /**
   * Assign attributes 'autoIncrement' in table
   * @return {Blueprint<T>} Blueprint
   */
  public autoIncrement(): Blueprint<T> {
    this._addAssignAttribute(`AUTO_INCREMENT`);
    return this;
  }

  /**
   * Assign attributes 'autoIncrement' in table
   * @return {Blueprint<T>} Blueprint
   */
  public autoincrement(): Blueprint<T> {
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
  public foreign({
    references,
    on,
    onDelete,
    onUpdate,
  }: {
    references?: string;
    on: (new () => Model) | string;
    onDelete?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
    onUpdate?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
  }): Blueprint<T> {
    if (on == null) return this;

    this._foreignKey = {
      references: references == null ? "id" : references,
      on,
      onDelete: onDelete == null ? "CASCADE" : onDelete,
      onUpdate: onUpdate == null ? "CASCADE" : onUpdate,
    };

    return this;
  }

  /**
   * Assign attributes 'index' in table
   * @param {string} name of index
   * @return {Blueprint<T>} Blueprint
   */
  public index(name: string = ""): Blueprint<T> {
    this._index = name;
    return this;
  }

  /**
   * Assign attributes 'index' in table
   * @param {string} name of index
   * @return {Blueprint<T>} Blueprint
   */
  public compositeIndex(columns: string[], name: string = ""): Blueprint<T> {
    this._compositeIndex = {
      columns,
      name
    }
    return this;
  }

  /**
   * Assign type to blueprint
   * @param {NumberConstructor|StringConstructor|BooleanConstructor|DateConstructor} type
   * @return {Blueprint<T>} Blueprint
   */
  public transform<T extends TExtendType>(type: T): Blueprint<ResolveType<T>> {
    const instance = new Blueprint<ResolveType<T>>()

    instance._valueType = type;

    return instance
  }

  public get sql() {
    return this._sql;
  }

  public get column() {
    return this._column;
  }

  public get type() {
    return this._type;
  }

  public get attributes() {
    return this._attributes;
  }

  public get foreignKey() {
    return this._foreignKey;
  }

  public get indexKey() {
    return this._index;
  }

  public get compositeIndexKey() {
    return this._compositeIndex;
  }

  public get defaultValue () {
    return this._default
  }

  public get valueType() {
    return this._valueType;
  }

  public get enums() {
    return this._enum
  }

  public get isVirtual() {
    return this._isVirtual
  }

  public get isEnum() {
    return this._isEnum
  }

  public get isNull() {
    return this._isNull
  }

  private _addAssignType(type: string) {
    this._type = type;
    return this;
  }

  private _addAssignAttribute(attribute: string) {
    this._attributes = [...this.attributes, attribute];
    return this;
  }
}

export { Blueprint };
export default Blueprint;
