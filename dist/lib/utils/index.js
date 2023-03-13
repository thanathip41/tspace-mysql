"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const timestamp = () => {
    const d = new Date();
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
    try {
        const check = str == null || str === true || str === false || Number.isInteger(str);
        if (check)
            return str;
        const regxs = ['DROP TABLE', 'UPDATE ', 'DELETE FROM ', 'OR', 'SELECT ', 'FROM ', 'WHERE ', 'OR'];
        for (let i in regxs) {
            if (str.includes(regxs[i].toLocaleLowerCase())) {
                str = str.split(regxs[i]).join("");
            }
        }
        return str;
    }
    catch (e) {
        return str;
    }
};
const escapeSubQuery = (str) => {
    const check = str == null || str === true || str === false || Number.isInteger(str);
    if (check)
        return str;
    const regxs = ['DROP TABLE', 'UPDATE ', 'DELETE FROM ', 'TRUNCATE'];
    for (let i in regxs) {
        if (str.includes(regxs[i])) {
            str = str.split(regxs[i]).join("");
        }
    }
    return str;
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
const snakeCase = (obj) => {
    try {
        if (typeof (obj) !== "object")
            return obj;
        Object.entries(obj).forEach(([oldName, _]) => {
            const newName = oldName.replace(/([A-Z])/g, (str) => `_${str.toLocaleLowerCase()}`);
            if (newName !== oldName) {
                if (obj.hasOwnProperty(oldName)) {
                    obj = Object.assign(Object.assign({}, obj), { [newName]: obj[oldName] });
                    delete obj[oldName];
                }
            }
            if (typeof (obj[newName]) === "object")
                obj[newName] = snakeCase(obj[newName]);
        });
        return obj;
    }
    catch (e) {
        return obj;
    }
};
const camelCase = (obj) => {
    try {
        if (typeof (obj) !== "object")
            return obj;
        Object.entries(obj).forEach(([oldName, _]) => {
            const newName = oldName.replace(/(.(\_|-|\s)+.)/g, (str) => str[0] + (str[str.length - 1].toUpperCase()));
            if (newName !== oldName) {
                if (obj.hasOwnProperty(oldName)) {
                    obj = Object.assign(Object.assign({}, obj), { [newName]: obj[oldName] });
                    delete obj[oldName];
                }
            }
            if (typeof (obj[newName]) === "object")
                obj[newName] = camelCase(obj[newName]);
        });
        return obj;
    }
    catch (e) {
        return obj;
    }
};
const consoleDebug = (debug) => {
    if (debug == null)
        return;
    console.log(`\n\x1b[33m${debug.replace(/(\r\n|\n|\r|\t)/gm, "").trim()};\x1b[0m`);
};
const faker = (value) => {
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
        return [...Array(50)].map(() => Math.random().toString(36).substring(7)).join('');
    if (!value.search('int'))
        return Math.floor(Math.random() * 1000);
    if (!value.search('float'))
        return (Math.random() * 100).toFixed(2);
    if (!value.search('double'))
        return (Math.random() * 100).toFixed(2);
    if (!value.search('varchar'))
        return Buffer.from(Math.random().toString(36).substring(7)).toString('base64');
    return 'fake data';
};
const utils = {
    consoleDebug,
    faker,
    columnRelation,
    timestamp,
    date,
    escape,
    escapeSubQuery,
    generateUUID,
    covertBooleanToNumber,
    snakeCase,
    camelCase
};
exports.utils = utils;
exports.default = utils;
