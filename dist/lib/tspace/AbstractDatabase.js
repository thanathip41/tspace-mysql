"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractDatabase {
    $setters = [
        '$attributes',
        '$logger',
        '$utils',
        '$constants',
        '$pool',
        '$db'
    ];
    $utils = {};
    $constants = (name) => { };
    $db = {
        get: (key) => { },
        set: (key, value) => { },
        clone: (data) => { }
    };
    $pool = {
        get: (sql) => { },
        set: (pool) => { },
        load: () => { }
    };
    $logger = {
        get: () => { },
        set: (value) => { },
        check: (value) => true || false
    };
    $attributes = {};
}
exports.default = AbstractDatabase;
