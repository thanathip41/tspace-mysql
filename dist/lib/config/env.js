"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var environment = function () {
    var _a;
    var NODE_ENV = (_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV;
    var dotenvWithoutEnviroment = path_1.default.join(path_1.default.resolve(), ".env");
    var dotenWithEnviroment = path_1.default.join(path_1.default.resolve(), ".env.".concat(NODE_ENV));
    if (NODE_ENV == null) {
        if (fs_1.default.existsSync(dotenvWithoutEnviroment))
            return dotenvWithoutEnviroment;
        if (fs_1.default.existsSync(dotenWithEnviroment))
            return dotenWithEnviroment;
    }
    if (fs_1.default.existsSync(dotenWithEnviroment))
        return dotenWithEnviroment;
    return dotenvWithoutEnviroment;
};
dotenv_1.default.config({ path: environment() });
var env = Object.freeze({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE
});
exports.default = env;
