"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const mocha_1 = require("mocha");
const chai_json_schema_1 = __importDefault(require("chai-json-schema"));
const lib_1 = require("../lib");
chai_1.default.use(chai_json_schema_1.default);
class User extends lib_1.Model {
}
(0, mocha_1.describe)('Testing Model', function () {
    /* ##################################################### */
    (0, mocha_1.it)('Try to select * from users with User Model ?', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield new User().get();
            (0, chai_1.expect)(results).to.be.an('array');
            const usersSchema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        uuid: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                        email: { type: 'string' },
                        name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                        username: { type: 'string' },
                        password: { type: 'string' },
                        createdAt: { anyOf: [{ type: 'string' }, { type: 'date' }, { type: 'null' }] },
                        updatedAt: { anyOf: [{ type: 'string' }, { type: 'date' }, { type: 'null' }] },
                        deletedAt: { anyOf: [{ type: 'string' }, { type: 'date' }, { type: 'null' }] },
                    },
                    required: ['uuid'],
                }
            };
            (0, chai_1.expect)(results).to.be.jsonSchema(usersSchema);
        });
    });
    /* ###################################################### */
});
//# sourceMappingURL=03-Model.test.js.map