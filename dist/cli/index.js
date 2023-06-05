#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const make_1 = __importDefault(require("./models/make"));
const make_2 = __importDefault(require("./tables/make"));
const make_3 = __importDefault(require("./migrate/make"));
const make_4 = __importDefault(require("./generate/make"));
const query_1 = __importDefault(require("./query"));
const db_1 = __importDefault(require("./dump/db"));
const commands = {
    'query': query_1.default,
    'make:model': make_1.default,
    'make:table': make_2.default,
    'make:migration': make_2.default,
    'migrate': make_3.default,
    'generate:models': make_4.default,
    'dump:db': db_1.default,
};
try {
    const name = (_c = (_b = (_a = process.argv.slice(2)) === null || _a === void 0 ? void 0 : _a.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--name=');
    })) === null || _b === void 0 ? void 0 : _b.replace('--name=', '')) !== null && _c !== void 0 ? _c : null;
    const sql = (_d = process.argv.slice(3)[0]) !== null && _d !== void 0 ? _d : '';
    const migrate = (_f = (_e = process.argv.slice(2)) === null || _e === void 0 ? void 0 : _e.includes('--m')) !== null && _f !== void 0 ? _f : false;
    const dir = (_j = (_h = (_g = process.argv.slice(2)) === null || _g === void 0 ? void 0 : _g.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--dir=');
    })) === null || _h === void 0 ? void 0 : _h.replace('--dir=', '/')) !== null && _j !== void 0 ? _j : null;
    const db = (_m = (_l = (_k = process.argv.slice(2)) === null || _k === void 0 ? void 0 : _k.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--db=');
    })) === null || _l === void 0 ? void 0 : _l.replace('--db=', '')) !== null && _m !== void 0 ? _m : null;
    let type = (_q = (_p = (_o = process.argv.slice(2)) === null || _o === void 0 ? void 0 : _o.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--type=');
    })) === null || _p === void 0 ? void 0 : _p.replace('--type=', '.')) !== null && _q !== void 0 ? _q : '.ts';
    type = ['.js', '.ts'].includes(type) ? type : '.ts';
    const file = (_r = process.argv.slice(3)[0]) !== null && _r !== void 0 ? _r : '';
    const cmd = {
        name,
        file,
        dir,
        migrate,
        type,
        cwd: process.cwd(),
        fs: fs_1.default,
        sql,
        db,
        npm: 'tspace-mysql'
    };
    commands[process.argv[2]](cmd);
}
catch (err) {
    console.log(`
        tspace-mysql make:model User --m --dir=app/Models  
        tspace-mysql make:migration users --dir=app/Models/Migrations
        tspace-mysql migrate --dir=App/Models/Migrations --type=js
        tspace-mysql query "SELECT * FROM users"
        tspace-mysql generate:models --dir=app/Models 
        tspace-mysql dump:db --dir=app/Models 
    `);
    console.log(`Read more https://www.npmjs.com/package/tspace-mysql`);
}
