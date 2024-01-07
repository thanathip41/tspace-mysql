"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const typeOf = (data) => Object.prototype.toString.apply(data).slice(8, -1).toLocaleLowerCase();
const isDate = (data) => {
    if (typeOf(data) === 'date')
        return true;
    return false;
};
const timestamp = (dateString) => {
    const d = dateString == null ? new Date() : new Date(dateString);
    const year = d.getFullYear();
    const month = `0${(d.getMonth() + 1)}`.slice(-2);
    const date = `0${(d.getDate())}`.slice(-2);
    const hours = `0${(d.getHours())}`.slice(-2);
    const minutes = `0${(d.getMinutes())}`.slice(-2);
    const seconds = `0${(d.getSeconds())}`.slice(-2);
    const ymd = `${[
        year,
        month,
        date
    ].join('-')}`;
    const his = `${[
        hours,
        minutes,
        seconds
    ].join(':')}`;
    return `${ymd} ${his}`;
};
const date = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = `0${(d.getMonth() + 1)}`.slice(-2);
    const date = `0${(d.getDate())}`.slice(-2);
    const now = `${year}-${month}-${date}`;
    return now;
};
const escape = (str) => {
    if (typeof str !== 'string')
        return str;
    return str.replace(/[\0\b\t\n\r\x1a\'\\]/g, '');
};
const escapeXSS = (str) => {
    if (typeof str !== 'string')
        return str;
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]+"/g, '');
};
const isSubQuery = (subQuery) => {
    const checkIsSubQuery = (/\bSELECT\s+(?!\*)/i.test(subQuery));
    if (!checkIsSubQuery)
        return false;
    const selectMatch = subQuery.match(/^\s*SELECT\s+(.*)\s+FROM/i);
    if (!selectMatch)
        return false;
    const selectColumns = selectMatch[1].trim().split(',');
    if (selectColumns.length !== 1)
        return false;
    return true;
};
const columnRelation = (name) => {
    var _a;
    const matches = (_a = name === null || name === void 0 ? void 0 : name.match(/[A-Z]/g)) !== null && _a !== void 0 ? _a : [];
    if (matches.length < 1)
        return `${name.toLocaleLowerCase()}`;
    return name.replace(matches[0], `_${matches[0].toUpperCase()}`);
};
const generateUUID = () => {
    const date = +new Date();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        r = (date + r) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
const covertBooleanToNumber = (data) => {
    if (Object.prototype.toString.apply(data).slice(8, -1) === 'Boolean')
        return +data;
    return data;
};
const covertDataToDateIfDate = (data) => {
    for (const key in data) {
        const d = data[key];
        if (!isDate(d))
            continue;
        data[key] = timestamp(d);
    }
    return;
};
const snakeCase = (data) => {
    try {
        if (typeof (data) !== "object")
            return data;
        Object.entries(data).forEach(([oldName, _]) => {
            const newName = oldName.replace(/([A-Z])/g, (str) => `_${str.toLocaleLowerCase()}`);
            if (newName !== oldName) {
                if (data.hasOwnProperty(oldName)) {
                    data = Object.assign(Object.assign({}, data), { [newName]: data[oldName] });
                    delete data[oldName];
                }
            }
            if (typeof (data[newName]) === "object")
                data[newName] = snakeCase(data[newName]);
        });
        return data;
    }
    catch (e) {
        return data;
    }
};
const camelCase = (data) => {
    try {
        if (typeof (data) !== "object")
            return data;
        Object.entries(data).forEach(([oldName]) => {
            const newName = oldName.replace(/(.(\_|-|\s)+.)/g, (str) => str[0] + (str[str.length - 1].toUpperCase()));
            if (newName !== oldName) {
                if (data.hasOwnProperty(oldName)) {
                    data = Object.assign(Object.assign({}, data), { [newName]: data[oldName] });
                    delete data[oldName];
                }
            }
            if (typeof (data[newName]) === "object")
                data[newName] = camelCase(data[newName]);
        });
        return data;
    }
    catch (e) {
        return data;
    }
};
const consoleDebug = (debug) => {
    if (debug == null)
        return;
    if (typeof debug !== "string")
        return;
    console.log(`\n\x1b[33m${debug === null || debug === void 0 ? void 0 : debug.replace(/(\r\n|\n|\r|\t)/gm, "").trim()};\x1b[0m`);
};
const randomString = (length = 100) => {
    let str = '';
    const salt = 3;
    for (let i = 0; i < length / salt; i++) {
        str += Math.random().toString(36).substring(salt);
    }
    return str.toLocaleLowerCase().replace(/'/g, '').slice(-length);
};
const faker = (value) => {
    var _a, _b;
    value = value.toLocaleLowerCase();
    if (!value.search('timestamp'))
        return timestamp();
    if (!value.search('datetime'))
        return timestamp();
    if (!value.search('date'))
        return date();
    if (!value.search('tinyint'))
        return [true, false][Math.round(Math.random())];
    if (!value.search('boolean'))
        return [true, false][Math.round(Math.random())];
    if (!value.search('longtext'))
        return randomString(500);
    if (!value.search('text'))
        return randomString(500);
    if (!value.search('int'))
        return Number(Math.floor(Math.random() * 1000));
    if (!value.search('float'))
        return Number((Math.random() * 100).toFixed(2));
    if (!value.search('double'))
        return Number((Math.random() * 100).toFixed(2));
    if (!value.search('json')) {
        return JSON.stringify({
            id: Number(Math.floor(Math.random() * 1000)),
            name: randomString(50)
        });
    }
    if (!value.search('varchar')) {
        const regex = /\d+/g;
        const limit = Number((_b = (_a = value === null || value === void 0 ? void 0 : value.match(regex)) === null || _a === void 0 ? void 0 : _a.pop()) !== null && _b !== void 0 ? _b : 255);
        return randomString(limit);
    }
    return 'fake data';
};
const hookHandle = (hooks, result) => __awaiter(void 0, void 0, void 0, function* () {
    for (const hook of hooks)
        yield hook(result);
    return;
});
const utils = {
    typeOf,
    isDate,
    consoleDebug,
    faker,
    columnRelation,
    timestamp,
    date,
    escape,
    escapeXSS,
    isSubQuery,
    generateUUID,
    covertBooleanToNumber,
    covertDataToDateIfDate,
    snakeCase,
    camelCase,
    randomString,
    hookHandle
};
exports.utils = utils;
exports.default = utils;
