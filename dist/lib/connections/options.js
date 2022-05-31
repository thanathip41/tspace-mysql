"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __importDefault(require("../config/env"));
var defaultOptions = {
    connectionLimit: 10,
    dateStrings: true,
    waitForConnections: false,
    charset: 'utf8mb4'
};
var options = {
    host: env_1.default.DB_HOST,
    database: env_1.default.DB_DATABASE,
    port: env_1.default.DB_PORT,
    user: env_1.default.DB_USERNAME,
    password: env_1.default.DB_PASSWORD
};
var configs = __assign(__assign({}, defaultOptions), options);
exports.default = configs;
