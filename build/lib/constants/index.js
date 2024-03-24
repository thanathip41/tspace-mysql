"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
const CONSTANTS = Object.freeze({
    ID: 'ID',
    SHOW: 'SHOW',
    BINARY: 'BINARY',
    FIELDS: 'FIELDS',
    COLUMNS: 'COLUMNS',
    TABLES: 'TABLES',
    WHERE: 'WHERE',
    BETWEEN: 'BETWEEN',
    NOT_BETWEEN: 'NOT BETWEEN',
    AND: 'AND',
    NULL: 'NULL',
    IS_NULL: 'IS NULL',
    IS_NOT_NULL: 'IS NOT NULL',
    OR: 'OR',
    LIKE: 'LIKE',
    SELECT: 'SELECT',
    DISTINCT: 'DISTINCT',
    FROM: 'FROM',
    OFFSET: 'OFFSET',
    GROUP_BY: 'GROUP BY',
    GROUP_CONCAT: 'GROUP_CONCAT',
    ORDER_BY: 'ORDER BY',
    DESC: 'DESC',
    ASC: 'ASC',
    INNER_JOIN: 'INNER JOIN',
    LEFT_JOIN: 'LEFT JOIN',
    RIGHT_JOIN: 'RIGHT JOIN',
    CROSS_JOIN: 'CROSS JOIN',
    ON: 'ON',
    LIMIT: 'LIMIT',
    HAVING: 'HAVING',
    COUNT: 'COUNT',
    AVG: 'AVG',
    SUM: 'SUM',
    MAX: 'MAX',
    MIN: 'MIN',
    AS: 'AS',
    IN: 'IN',
    ALL: 'ALL',
    ANY: 'ANY',
    NOT_IN: 'NOT IN',
    SET: 'SET',
    NOT: 'NOT',
    DUPLICATE: 'DUPLICATE',
    KEY: 'KEY',
    RAW: '$RAW:',
    OP: '$OP:',
    IGNORE: '$IGNORE',
    WHEN: 'WHEN',
    THEN: 'THEN',
    ELSE: 'ELSE',
    CASE: 'CASE',
    END: 'END',
    WHERE_NOT_EXISTS: 'WHERE NOT EXISTS',
    EXISTS: 'EXISTS',
    VALUES: 'VALUES',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    INSERT: 'INSERT INTO',
    DROP_TABLE: 'DROP TABLE',
    TRUNCATE_TABLE: 'TRUNCATE TABLE',
    CREATE_DATABASE: 'CREATE DATABASE',
    SHOW_DATABASES: 'SHOW DATABASES',
    SHOW_TABLES: 'SHOW TABLES',
    CREATE_DATABASE_NOT_EXISTS: 'CREATE DATABASE IF NOT EXISTS',
    CREATE_TABLE: 'CREATE TABLE',
    CREATE_TABLE_NOT_EXISTS: 'CREATE TABLE IF NOT EXISTS',
    ENGINE: 'ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4',
    RAND: 'RAND()',
    FOREIGN_KEY: 'FOREIGN KEY',
    REFERENCES: 'REFERENCES',
    ON_DELETE: 'ON DELETE',
    ON_UPDATE: 'ON UPDATE',
    ADD: 'ADD',
    CHANGE: 'CHANGE',
    ADD_CONSTRAINT: 'ADD CONSTRAINT',
    AFTER: 'AFTER',
    ALTER_TABLE: 'ALTER TABLE',
    JSON_OBJECT: 'JSON_OBJECT',
    RELATIONSHIP: {
        hasOne: 'hasOne',
        hasMany: 'hasMany',
        belongsTo: 'belongsTo',
        belongsToMany: 'belongsToMany'
    },
    PATTERN: {
        snake_case: 'snake_case',
        camelCase: 'camelCase'
    },
    DEFAULT: {
        DEBUG: false,
    },
    DB: {
        PRIMARY_KEY: 'id',
        VOID: false,
        RESULT: null,
        DISTINCT: false,
        PLUCK: '',
        SAVE: '',
        DELETE: '',
        UPDATE: '',
        INSERT: '',
        SELECT: [],
        ONLY: [],
        EXCEPTS: [],
        CHUNK: 0,
        COUNT: '',
        FROM: 'FROM',
        JOIN: [],
        WHERE: [],
        GROUP_BY: '',
        ORDER_BY: [],
        LIMIT: '',
        OFFSET: '',
        HAVING: '',
        TABLE_NAME: '',
        UUID_CUSTOM: '',
        HIDDEN: [],
        DEBUG: false,
        UUID: false,
        PAGE: 1,
        PER_PAGE: 1,
        HOOKS: [],
        RETURN_TYPE: null
    },
    MODEL: {
        MODEL_NAME: 'MODEL',
        PRIMARY_KEY: 'id',
        VOID: false,
        SELECT: [],
        DELETE: '',
        UPDATE: '',
        INSERT: '',
        ONLY: [],
        EXCEPTS: [],
        CHUNK: 0,
        COUNT: '',
        FROM: 'FROM',
        JOIN: [],
        WHERE: [],
        GROUP_BY: '',
        ORDER_BY: [],
        LIMIT: '',
        OFFSET: '',
        HAVING: '',
        TABLE_NAME: '',
        UUID_FORMAT: 'uuid',
        HIDDEN: [],
        DEBUG: false,
        UUID: false,
        SOFT_DELETE: false,
        SOFT_DELETE_FORMAT: 'deleted_at',
        SOFT_DELETE_RELATIONS: false,
        PAGE: 1,
        PER_PAGE: 1,
        REGISTRY: {},
        RESULT: null,
        PATTERN: 'snake_case',
        DISTINCT: false,
        PLUCK: '',
        SAVE: '',
        HOOKS: [],
        RELATION: [],
        RELATIONS: [],
        RELATIONS_TRASHED: false,
        RELATIONS_EXISTS: false,
        RELATIONS_EXISTS_NOT_ID: [],
        TIMESTAMP: false,
        TIMESTAMP_FORMAT: {
            CREATED_AT: 'created_at',
            UPDATED_AT: 'updated_at'
        },
        LOGGER: false,
        LOGGER_OPTIONS: null,
        TABLE_LOGGER: '$loggers',
        VALIDATE_SCHEMA: false,
        VALIDATE_SCHEMA_DEFINED: null,
        FUNCTION_RELATION: false,
        SCHEMA_TABLE: null,
        RETRY: 0,
        OBSERVER: null,
        DATA: null,
        BEFORE_CREATING_TABLE: null,
        RETURN_TYPE: null
    }
});
exports.CONSTANTS = CONSTANTS;
exports.default = CONSTANTS;
