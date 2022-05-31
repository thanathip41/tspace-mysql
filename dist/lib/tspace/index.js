"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blueprint = exports.Schema = exports.Model = exports.DB = void 0;
var DB_1 = __importDefault(require("./DB"));
exports.DB = DB_1.default;
var Model_1 = __importDefault(require("./Model"));
exports.Model = Model_1.default;
var Schema_1 = require("./Schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return Schema_1.Schema; } });
Object.defineProperty(exports, "Blueprint", { enumerable: true, get: function () { return Schema_1.Blueprint; } });
exports.default = {
    DB: DB_1.default,
    Model: Model_1.default,
    Schema: Schema_1.Schema,
    Blueprint: Schema_1.Blueprint
};
