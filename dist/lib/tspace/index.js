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
var Schema_1 = __importDefault(require("./Schema"));
exports.Schema = Schema_1.default;
var Blueprint_1 = __importDefault(require("./Blueprint"));
exports.Blueprint = Blueprint_1.default;
exports.default = {
    DB: DB_1.default,
    Model: Model_1.default,
    Schema: Schema_1.default,
    Blueprint: Blueprint_1.default
};
