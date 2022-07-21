#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var make_1 = __importDefault(require("./models/make"));
var make_2 = __importDefault(require("./tables/make"));
var make_3 = __importDefault(require("./migrate/make"));
var commands = {
    'make:model': make_1.default,
    'make:table': make_2.default,
    'make:migration': make_2.default,
    'migrate': make_3.default
};
try {
    var name = (_c = (_b = (_a = process.argv.slice(2)) === null || _a === void 0 ? void 0 : _a.find(function (data) { return data === null || data === void 0 ? void 0 : data.includes('--name='); })) === null || _b === void 0 ? void 0 : _b.replace('--name=', '')) !== null && _c !== void 0 ? _c : null;
    var migrate = (_e = (_d = process.argv.slice(2)) === null || _d === void 0 ? void 0 : _d.includes('--m')) !== null && _e !== void 0 ? _e : false;
    var dir = (_h = (_g = (_f = process.argv.slice(2)) === null || _f === void 0 ? void 0 : _f.find(function (data) { return data === null || data === void 0 ? void 0 : data.includes('--dir='); })) === null || _g === void 0 ? void 0 : _g.replace('--dir=', '/')) !== null && _h !== void 0 ? _h : null;
    var type = (_l = (_k = (_j = process.argv.slice(2)) === null || _j === void 0 ? void 0 : _j.find(function (data) { return data === null || data === void 0 ? void 0 : data.includes('--type='); })) === null || _k === void 0 ? void 0 : _k.replace('--type=', '.')) !== null && _l !== void 0 ? _l : '.ts';
    type = ['.js', '.ts'].includes(type) ? type : '.ts';
    var file = (_o = (_m = process.argv.slice(3)) === null || _m === void 0 ? void 0 : _m.shift()) !== null && _o !== void 0 ? _o : '';
    var cmd = {
        name: name,
        file: file,
        dir: dir,
        migrate: migrate,
        type: type,
        cwd: process.cwd(),
        fs: fs_1.default,
        npm: 'tspace-mysql'
    };
    commands[process.argv[2]](cmd);
}
catch (err) {
    console.log("readme https://www.npmjs.com/package/tspace-mysql");
}
