#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const make_1 = __importDefault(require("./models/make"));
const make_2 = __importDefault(require("./tables/make"));
const make_3 = __importDefault(require("./migrate/make"));
const make_4 = __importDefault(require("./generate/make"));
const make_5 = __importDefault(require("./migrations/make"));
const make_db_1 = __importDefault(require("./migrations/make-db"));
const query_1 = __importDefault(require("./query"));
const db_1 = __importDefault(require("./dump/db"));
const table_1 = __importDefault(require("./dump/table"));
const commands = {
    'query': query_1.default,
    'make:model': make_1.default,
    'make:table': make_2.default,
    'make:migration': make_2.default,
    'migrate': make_3.default,
    'generate:models': make_4.default,
    'gen:models': make_4.default,
    'dump:db': db_1.default,
    'dump:table': table_1.default,
    'migrations:models': make_5.default,
    'migrations:db': make_db_1.default,
    'help': () => {
        console.log(`
        \x1b[31m
            tspace-mysql make:model User --m --dir=app/Models  
            tspace-mysql make:migration users --dir=app/Models/Migrations
            tspace-mysql migrate --dir=App/Models/Migrations --type=js
            tspace-mysql query "SELECT * FROM users" --env=development
            tspace-mysql generate:models --dir=app/Models --env=development
            tspace-mysql generate:models --dir=app/Models --env=development --decorators
            tspace-mysql dump:db "database" --dir=app/db --v --env=development
            tspace-mysql dump:table "table" --dir=app/table --v --env=development
            tspace-mysql migrations:models --dir=migrations --models=src/models --generate
            tspace-mysql migrations:models --dir=migrations --models=src/models --push
            tspace-mysql migrations:db --dir=migrations --generate
            tspace-mysql migrations:db --dir=migrations --push
        \x1b[0m
    `);
        console.log(`Read more https://www.npmjs.com/package/tspace-mysql`);
    }
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
    const models = (_m = (_l = (_k = process.argv.slice(2)) === null || _k === void 0 ? void 0 : _k.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--models=');
    })) === null || _l === void 0 ? void 0 : _l.replace('--models=', '/')) !== null && _m !== void 0 ? _m : null;
    const db = (_q = (_p = (_o = process.argv.slice(2)) === null || _o === void 0 ? void 0 : _o.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--db=');
    })) === null || _p === void 0 ? void 0 : _p.replace('--db=', '')) !== null && _q !== void 0 ? _q : null;
    const table = (_t = (_s = (_r = process.argv.slice(2)) === null || _r === void 0 ? void 0 : _r.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--table=');
    })) === null || _s === void 0 ? void 0 : _s.replace('--table=', '')) !== null && _t !== void 0 ? _t : null;
    let type = ((_w = (_v = (_u = process.argv.slice(2)) === null || _u === void 0 ? void 0 : _u.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--type=');
    })) === null || _v === void 0 ? void 0 : _v.replace('--type=', '.')) !== null && _w !== void 0 ? _w : '.ts');
    type = ['.js', '.ts'].includes(type) ? type : '.ts';
    const file = (_x = process.argv.slice(3)[0]) !== null && _x !== void 0 ? _x : '';
    const env = (_0 = (_z = (_y = process.argv.slice(2)) === null || _y === void 0 ? void 0 : _y.find(data => {
        return data === null || data === void 0 ? void 0 : data.includes('--env=');
    })) === null || _z === void 0 ? void 0 : _z.replace('--env=', '')) !== null && _0 !== void 0 ? _0 : null;
    const values = (_3 = (((_1 = process.argv.slice(2)) === null || _1 === void 0 ? void 0 : _1.includes('--values')) || ((_2 = process.argv.slice(2)) === null || _2 === void 0 ? void 0 : _2.includes('--v')))) !== null && _3 !== void 0 ? _3 : false;
    const decorator = (_6 = (((_4 = process.argv.slice(2)) === null || _4 === void 0 ? void 0 : _4.includes('--decorator')) || ((_5 = process.argv.slice(2)) === null || _5 === void 0 ? void 0 : _5.includes('--decorators')))) !== null && _6 !== void 0 ? _6 : false;
    const push = (_8 = (_7 = process.argv.slice(2)) === null || _7 === void 0 ? void 0 : _7.includes('--push')) !== null && _8 !== void 0 ? _8 : false;
    const generate = (_10 = (_9 = process.argv.slice(2)) === null || _9 === void 0 ? void 0 : _9.includes('--generate')) !== null && _10 !== void 0 ? _10 : false;
    if (env != null)
        process.env.NODE_ENV = env;
    const cmd = {
        name,
        file,
        dir,
        models,
        migrate,
        type,
        cwd: process.cwd(),
        fs: fs_1.default,
        sql,
        db,
        table,
        values,
        decorator,
        env,
        push,
        generate,
        npm: 'tspace-mysql'
    };
    commands[process.argv[2]](cmd);
}
catch (err) {
    console.log("The input command failed. Please try again using 'tspace-mysql help'");
}
