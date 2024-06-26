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
const date = (value) => {
    const d = value == null ? new Date() : new Date(value);
    const year = d.getFullYear();
    const month = `0${(d.getMonth() + 1)}`.slice(-2);
    const date = `0${(d.getDate())}`.slice(-2);
    const now = `${year}-${month}-${date}`;
    return now;
};
const escape = (str, hard = false) => {
    if (typeof str !== 'string')
        return str;
    if (str.includes('$RAW:') && !hard)
        return str;
    return str.replace(/[\0\b\t\n\r\x1a\'\\]/g, "\\'");
};
const escapeActions = (str) => {
    if (typeof str !== 'string')
        return str;
    return str.replace(/[\0\b\r\x1a\'\\]/g, "\\'");
};
const escapeXSS = (str) => {
    if (typeof str !== 'string')
        return str;
    return str
        .replace(/[;\\]/gi, '')
        .replace(/on\w+="[^"]+"/gi, '')
        .replace(/\s+(onerror|onload)\s*=/gi, '')
        .replace(/\s+alert*/gi, '')
        .replace(/\([^)]*\) *=>/g, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
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
    if (typeOf(data) === 'boolean')
        return +data;
    return data;
};
const covertDateToDateString = (data) => {
    if (typeOf(data) === 'date') {
        return timestamp(data);
    }
    if (typeOf(data) === 'object') {
        for (const key in data) {
            const d = data[key];
            if (!(typeOf(d) === 'date'))
                continue;
            data[key] = timestamp(d);
        }
    }
    return data;
};
const snakeCase = (data) => {
    try {
        if (typeof (data) !== "object")
            return data;
        if (typeof data === 'string') {
            return String(data).replace(/([A-Z])/g, (str) => `_${str.toLocaleLowerCase()}`);
        }
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
        if (typeof (data) !== "object") {
            return data;
        }
        if (typeof data === 'string') {
            return String(data).replace(/(.(_|-|\s)+.)/g, (str) => str[0] + (str[str.length - 1].toUpperCase()));
        }
        Object.entries(data).forEach(([oldName]) => {
            const newName = oldName.replace(/(.(_|-|\s)+.)/g, (str) => str[0] + (str[str.length - 1].toUpperCase()));
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
const consoleDebug = (sql, retry = false) => {
    if (typeof sql !== "string" || sql == null)
        return;
    const maxLength = 5000;
    sql = sql === null || sql === void 0 ? void 0 : sql.replace(/(\r\n|\n|\r|\t)/gm, "");
    if (sql.length > maxLength) {
        sql = `${sql.slice(0, maxLength)}.....`;
    }
    if (!retry) {
        console.log(`\n\x1b[34mQUERY:\x1b[0m \x1b[33m${sql.trim()};\x1b[0m`);
        return;
    }
    console.log(`\n\x1b[31mRETRY QUERY:\x1b[0m \x1b[33m${sql.trim()};\x1b[0m`);
};
const consoleExec = (startTime, endTime) => {
    const diffInMilliseconds = endTime - startTime;
    const diffInSeconds = diffInMilliseconds / 1000;
    console.log(`\n\x1b[34mDURATION:\x1b[0m \x1b[32m${diffInSeconds} sec\x1b[0m`);
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
    if (!value.search('uuid'))
        return generateUUID();
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
const chunkArray = (array, length) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += length) {
        chunks.push(array.slice(i, i + length));
    }
    return chunks;
};
const utils = {
    typeOf,
    isDate,
    consoleDebug,
    consoleExec,
    faker,
    columnRelation,
    timestamp,
    date,
    escape,
    escapeActions,
    escapeXSS,
    generateUUID,
    covertBooleanToNumber,
    covertDateToDateString,
    snakeCase,
    camelCase,
    randomString,
    hookHandle,
    chunkArray
};
exports.utils = utils;
exports.default = utils;
//# sourceMappingURL=index.js.map