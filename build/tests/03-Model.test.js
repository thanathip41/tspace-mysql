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
chai_1.default.use(chai_json_schema_1.default);
(0, mocha_1.describe)('Testing Model', function () {
    /* ##################################################### */
    (0, mocha_1.it)(`Model: Start to mock up the data in table 'users' for testing CRUD
    - Truncate : new User().truncate()
    - Create : new User().create(userDataObject).save()
    - Select : new User().first()
    - CreateMultiple : new User().createMultiple(userDataArray).save()
    - Update : new User().where('id',6).update({ name : 'was update'}).save()
    - Delete : new User().where('id',6).delete()
  `, function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield new schema_spec_1.User().truncate();
            const created = yield new schema_spec_1.User().create(mock_data_spec_1.userDataObject).save();
            (0, chai_1.expect)(created).to.be.an('object');
            (0, chai_1.expect)(created).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            const selectd = yield new schema_spec_1.User().first();
            (0, chai_1.expect)(selectd).to.be.an('object');
            (0, chai_1.expect)(selectd).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            const createds = yield new schema_spec_1.User().createMultiple(mock_data_spec_1.userDataArray).save();
            (0, chai_1.expect)(createds).to.be.an('array');
            (0, chai_1.expect)(createds).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            const updated = yield new schema_spec_1.User().where('id', 6).update({ name: 'was update' }).save();
            (0, chai_1.expect)(updated).to.be.an('object');
            (0, chai_1.expect)(updated).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(updated.name).to.be.equal('was update');
            const deleted = yield new schema_spec_1.User().where('id', 6).delete();
            (0, chai_1.expect)(deleted).to.be.an('boolean');
            (0, chai_1.expect)(deleted).to.be.equal(true);
        });
    });
    (0, mocha_1.it)(`Model: Start to mock up the data in table 'posts' for testing CRUD
    - Truncate : new Post().truncate()
    - Create : new Post().create(postDataObject).save()
    - Select : new Post().first()
    - CreateMultiple : new Post().createMultiple(postDataArray).save()
    - Update : new Post().where('id',6).update({ title : 'was update'}).save()
    - Delete : new Post().where('id',6).delete()
  `, function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield new schema_spec_1.Post().truncate();
            const created = yield new schema_spec_1.Post().create(mock_data_spec_1.postDataObject).save();
            (0, chai_1.expect)(created).to.be.an('object');
            (0, chai_1.expect)(created).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            const selectd = yield new schema_spec_1.Post().first();
            (0, chai_1.expect)(selectd).to.be.an('object');
            (0, chai_1.expect)(selectd).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            const createds = yield new schema_spec_1.Post().createMultiple(mock_data_spec_1.postDataArray).save();
            (0, chai_1.expect)(createds).to.be.an('array');
            (0, chai_1.expect)(createds).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            const updated = yield new schema_spec_1.Post().where('id', 6).update({ title: 'was update' }).save();
            (0, chai_1.expect)(updated).to.be.an('object');
            (0, chai_1.expect)(updated).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            (0, chai_1.expect)(updated.title).to.be.equal('was update');
            const deleted = yield new schema_spec_1.Post().where('id', 6).delete();
            (0, chai_1.expect)(deleted).to.be.an('boolean');
            (0, chai_1.expect)(deleted).to.be.equal(true);
        });
    });
    (0, mocha_1.it)(`Model: Start to mock up the data in table 'postUser' for testing CRUD
    - Truncate : new PostUser().truncate()
    - CreateMultiple : new PostUser().createMultiple([]).save()
  `, function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield new schema_spec_1.PostUser().truncate();
            const createds = yield new schema_spec_1.PostUser().createMultiple([1, 2, 3, 4, 5].map(v => ({ userId: v, postId: v }))).save();
            (0, chai_1.expect)(createds).to.be.an('array');
        });
    });
    (0, mocha_1.it)(`Model: User using all where conditions
    - where 
    - whereObject
    - whereIn
    - whereNotIn
    - whereBetween
    - whereNotBetween
    - whereNull
    - whereNotNull
    - whereSubQuery
    - whereNotSubQuery
    - whereQuery
  `, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const whereEq = yield new schema_spec_1.User().where("id", 1).first();
            (0, chai_1.expect)(whereEq).to.be.an('object');
            (0, chai_1.expect)(whereEq).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(whereEq === null || whereEq === void 0 ? void 0 : whereEq.id).to.be.equal(1);
            const whereNotEq = yield new schema_spec_1.User().where("id", '<>', 1).get();
            (0, chai_1.expect)(whereNotEq).to.be.an('array');
            (0, chai_1.expect)(whereNotEq).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            (0, chai_1.expect)(whereNotEq.every(v => (v === null || v === void 0 ? void 0 : v.id) !== 1)).to.be.equal(true);
            const whereMoreThanOne = yield new schema_spec_1.User().where("id", ">", 1).get();
            (0, chai_1.expect)(whereMoreThanOne).to.be.an('array');
            (0, chai_1.expect)(whereMoreThanOne).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            (0, chai_1.expect)(whereMoreThanOne.every(v => (v === null || v === void 0 ? void 0 : v.id) > 1)).to.be.equal(true);
            const whereLessThanOne = yield new schema_spec_1.User().where("id", "<", 1).get();
            (0, chai_1.expect)(whereLessThanOne).to.be.an('array');
            (0, chai_1.expect)(whereLessThanOne).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            (0, chai_1.expect)(whereLessThanOne.every(v => (v === null || v === void 0 ? void 0 : v.id) < 1)).to.be.equal(true);
            const whereUsingObject = yield new schema_spec_1.User().where({ id: 1 }).first();
            (0, chai_1.expect)(whereUsingObject).to.be.an('object');
            (0, chai_1.expect)(whereUsingObject).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(whereUsingObject === null || whereUsingObject === void 0 ? void 0 : whereUsingObject.id).to.be.equal(1);
            const whereObject = yield new schema_spec_1.User().whereObject({ id: 1 }).first();
            (0, chai_1.expect)(whereObject).to.be.an('object');
            (0, chai_1.expect)(whereObject).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(whereObject === null || whereObject === void 0 ? void 0 : whereObject.id).to.be.equal(1);
            const whereIn = yield new schema_spec_1.User().whereIn("id", [2, 3, 4, 5]).get();
            (0, chai_1.expect)(whereIn).to.be.an('array');
            (0, chai_1.expect)(whereIn).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            (0, chai_1.expect)(whereIn.every((v, i) => [2, 3, 4, 5].includes(v.id))).to.be.equal(true);
        });
    });
    (0, mocha_1.it)(`Relation : 'user' hasOne 'post' 1:1 ?`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new schema_spec_1.User().with('post').first();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(result).to.have.property('post');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.an('object');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            const results = yield new schema_spec_1.User().with('post').get();
            (0, chai_1.expect)(results).to.be.an('array');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            for (const result of results) {
                (0, chai_1.expect)(result).to.have.property('post');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.an('object');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            }
            const pagination = yield new schema_spec_1.User().with('post').pagination();
            (0, chai_1.expect)(pagination.meta).to.be.an('object');
            (0, chai_1.expect)(pagination.meta).to.have.property('total');
            (0, chai_1.expect)(pagination.meta).to.have.property('limit');
            (0, chai_1.expect)(pagination.meta).to.have.property('totalPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('currentPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('lastPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('nextPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('prevPage');
            (0, chai_1.expect)(pagination.data).to.be.an('array');
            (0, chai_1.expect)(pagination.data).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            for (const result of pagination.data) {
                (0, chai_1.expect)(result).to.have.property('post');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.an('object');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            }
        });
    });
    (0, mocha_1.it)(`Relation : 'user' hasMany 'posts'  1:m ?`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield new schema_spec_1.User().with('posts').first();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(result).to.have.property('posts');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.an('array');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            const results = yield new schema_spec_1.User().with('posts').get();
            (0, chai_1.expect)(results).to.be.an('array');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            for (const result of results) {
                (0, chai_1.expect)(result).to.have.property('posts');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.an('array');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.jsonSchema(schema_spec_1.postSchemaArray);
                for (const post of ((_a = result === null || result === void 0 ? void 0 : result.posts) !== null && _a !== void 0 ? _a : [])) {
                    (0, chai_1.expect)(post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
                }
            }
            const pagination = yield new schema_spec_1.User().with('posts').pagination();
            (0, chai_1.expect)(pagination.meta).to.be.an('object');
            (0, chai_1.expect)(pagination.meta).to.have.property('total');
            (0, chai_1.expect)(pagination.meta).to.have.property('limit');
            (0, chai_1.expect)(pagination.meta).to.have.property('totalPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('currentPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('lastPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('nextPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('prevPage');
            (0, chai_1.expect)(pagination.data).to.be.an('array');
            (0, chai_1.expect)(pagination.data).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            for (const result of pagination.data) {
                (0, chai_1.expect)(result).to.have.property('posts');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.an('array');
                (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.jsonSchema(schema_spec_1.postSchemaArray);
                for (const post of ((_b = result === null || result === void 0 ? void 0 : result.posts) !== null && _b !== void 0 ? _b : [])) {
                    (0, chai_1.expect)(post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
                }
            }
        });
    });
    (0, mocha_1.it)(`Relation : 'post' belongsTo 'user' 1:1  ?`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new schema_spec_1.Post().with('user').first();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            (0, chai_1.expect)(result).to.have.property('user');
            (0, chai_1.expect)(result.user).to.be.an('object');
            (0, chai_1.expect)(result.user).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            const results = yield new schema_spec_1.Post().with('user').get();
            (0, chai_1.expect)(results).to.be.an('array');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            for (const result of results) {
                (0, chai_1.expect)(result).to.have.property('user');
                (0, chai_1.expect)(result.user).to.be.an('object');
                (0, chai_1.expect)(result.user).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            }
            const pagination = yield new schema_spec_1.Post().with('user').pagination();
            (0, chai_1.expect)(pagination.meta).to.be.an('object');
            (0, chai_1.expect)(pagination.meta).to.have.property('total');
            (0, chai_1.expect)(pagination.meta).to.have.property('limit');
            (0, chai_1.expect)(pagination.meta).to.have.property('totalPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('currentPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('lastPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('nextPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('prevPage');
            (0, chai_1.expect)(pagination.data).to.be.an('array');
            (0, chai_1.expect)(pagination.data).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            for (const result of pagination.data) {
                (0, chai_1.expect)(result).to.have.property('user');
                (0, chai_1.expect)(result.user).to.be.an('object');
                (0, chai_1.expect)(result.user).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            }
        });
    });
    (0, mocha_1.it)(`Relation : 'posts' belongsToMany 'users'  m:m ?`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new schema_spec_1.Post().with('subscribers').first();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            (0, chai_1.expect)(result).to.have.property('subscribers');
            (0, chai_1.expect)(result.subscribers).to.be.an('array');
            (0, chai_1.expect)(result.subscribers).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            const results = yield new schema_spec_1.Post().with('subscribers').get();
            (0, chai_1.expect)(results).to.be.an('array');
            (0, chai_1.expect)(results).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            for (const result of results) {
                (0, chai_1.expect)(result).to.have.property('subscribers');
                (0, chai_1.expect)(result.subscribers).to.be.an('array');
                (0, chai_1.expect)(result.subscribers).to.be.jsonSchema(schema_spec_1.userSchemaArray);
            }
            const pagination = yield new schema_spec_1.Post().with('subscribers').pagination();
            (0, chai_1.expect)(pagination.meta).to.be.an('object');
            (0, chai_1.expect)(pagination.meta).to.have.property('total');
            (0, chai_1.expect)(pagination.meta).to.have.property('limit');
            (0, chai_1.expect)(pagination.meta).to.have.property('totalPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('currentPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('lastPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('nextPage');
            (0, chai_1.expect)(pagination.meta).to.have.property('prevPage');
            (0, chai_1.expect)(pagination.data).to.be.an('array');
            (0, chai_1.expect)(pagination.data).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            for (const result of pagination.data) {
                (0, chai_1.expect)(result).to.have.property('subscribers');
                (0, chai_1.expect)(result.subscribers).to.be.an('array');
                (0, chai_1.expect)(result.subscribers).to.be.jsonSchema(schema_spec_1.userSchemaArray);
                for (const subscriber of result.subscribers) {
                    (0, chai_1.expect)(subscriber).to.be.an('object');
                    (0, chai_1.expect)(subscriber).to.be.jsonSchema(schema_spec_1.userSchemaObject);
                }
            }
        });
    });
    (0, mocha_1.it)(`Relation : nested 'users' hasMany 'posts' 'posts' belongsTo 'users' ?`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield new schema_spec_1.User()
                .with('posts')
                .withQuery('posts', (query) => {
                return query.with('user')
                    .withQuery('user', (query) => query.with('post'));
            })
                .first();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.be.jsonSchema(schema_spec_1.userSchemaObject);
            (0, chai_1.expect)(result).to.have.property('posts');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.an('array');
            (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.posts).to.be.jsonSchema(schema_spec_1.postSchemaArray);
            for (const post of ((_a = result === null || result === void 0 ? void 0 : result.posts) !== null && _a !== void 0 ? _a : [])) {
                (0, chai_1.expect)(post).to.have.property('user');
                (0, chai_1.expect)(post.user).to.be.an('object');
                (0, chai_1.expect)(post.user).to.be.jsonSchema(schema_spec_1.userSchemaObject);
                (0, chai_1.expect)(post.user.post).to.be.an('object');
                (0, chai_1.expect)(post.user.post).to.be.jsonSchema(schema_spec_1.postSchemaObject);
            }
        });
    });
    /* ###################################################### */
});
//# sourceMappingURL=03-Model.test.js.map