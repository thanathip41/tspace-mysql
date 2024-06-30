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
const schema_spec_1 = require("./schema-spec");
const mock_data_spec_1 = require("./mock-data-spec");
const lib_1 = require("../lib");
chai_1.default.use(chai_json_schema_1.default);
(0, mocha_1.describe)('Testing DB', function () {
    /* ##################################################### */
    (0, mocha_1.it)(`DB: Start to mock up the data in table 'users' for testing CRUD
    - Truncate : new DB('users').truncate()
    - Create : new DB('users').create(userDataObject).save()
    - Select : new DB('users').first()
    - CreateMultiple : new DB('users').createMultiple(userDataArray).save()
    - Update : new DB('users').where('id',5).update({ name : 'was update'}).save()
    - Delete : new DB('users').where('id',5).delete()
  `, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const truncate = yield new lib_1.DB('users').truncate({ force: true });
            (0, chai_1.expect)(truncate).to.be.equal(true);
            const created = yield new lib_1.DB('users').create(mock_data_spec_1.userDataObject).save();
            (0, chai_1.expect)(created).to.be.an('object');
            (0, chai_1.expect)(created).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            const selectd = yield new lib_1.DB('users').first();
            (0, chai_1.expect)(selectd).to.be.an('object');
            (0, chai_1.expect)(selectd).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            const createds = yield new lib_1.DB('users').createMultiple(mock_data_spec_1.userDataArray).save();
            (0, chai_1.expect)(createds).to.be.an('array');
            (0, chai_1.expect)(createds).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            const updated = yield new lib_1.DB('users').where('id', 5).update({ name: 'was update' }).save();
            (0, chai_1.expect)(updated).to.be.an('object');
            (0, chai_1.expect)(updated).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(updated.name).to.be.equal('was update');
            const deleted = yield new lib_1.DB('users').where('id', 5).delete();
            (0, chai_1.expect)(deleted).to.be.an('boolean');
            (0, chai_1.expect)(deleted).to.be.equal(true);
        });
    });
    (0, mocha_1.it)(`DB: await new DB('users').get()
    It should return an array and must have all user schema attributes`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield new lib_1.DB('users').limit(5).get();
            (0, chai_1.expect)(results).to.be.an('array');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.userSchemaArray);
        });
    });
    (0, mocha_1.it)(`DB: await new DB('users').first()
    It should returns an object and must have all user schema attributes`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield new lib_1.DB('users').first();
            (0, chai_1.expect)(results).to.be.an('object');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.userSchemaObject);
        });
    });
    (0, mocha_1.it)(`DB: await new DB('users').select('id').first()
    It should returns an object and must only have an 'id'`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield new lib_1.DB('users').select('id').first();
            (0, chai_1.expect)(results).to.be.an('object');
            (0, chai_1.expect)(results).to.have.property('id');
        });
    });
    (0, mocha_1.it)(`DB: await new DB('users').except('id').first()
    It should returns an object and must only have an 'id'`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield new lib_1.DB('users').except('id').first();
            (0, chai_1.expect)(results).to.be.an('object');
            (0, chai_1.expect)(results).to.not.have.property('id');
        });
    });
    /* ###################################################### */
});
//# sourceMappingURL=02-DB.test.js.map