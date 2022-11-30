#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const make_1 = __importDefault(require("./models/make"));
const make_2 = __importDefault(require("./tables/make"));
const make_3 = __importDefault(require("./migrate/make"));
const commands = {
    'make:model': make_1.default,
    'make:table': make_2.default,
    'make:migration': make_2.default,
    'migrate': make_3.default
};
try {
    const name = process.argv.slice(2)?.find(data => {
        return data?.includes('--name=');
    })?.replace('--name=', '') ?? null;
    const migrate = process.argv.slice(2)?.includes('--m') ?? false;
    const dir = process.argv.slice(2)?.find(data => {
        return data?.includes('--dir=');
    })?.replace('--dir=', '/') ?? null;
    let type = process.argv.slice(2)?.find(data => {
        return data?.includes('--type=');
    })?.replace('--type=', '.') ?? '.ts';
    type = ['.js', '.ts'].includes(type) ? type : '.ts';
    const file = process.argv.slice(3)?.shift() ?? '';
    const cmd = {
        name,
        file,
        dir,
        migrate,
        type,
        cwd: process.cwd(),
        fs: fs_1.default,
        npm: 'tspace-mysql'
    };
    commands[process.argv[2]](cmd);
}
catch (err) {
    console.log(`readme https://www.npmjs.com/package/tspace-mysql`);
}
