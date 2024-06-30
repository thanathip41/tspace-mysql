"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDataArray = exports.postDataObject = exports.userDataArray = exports.userDataObject = void 0;
const lib_1 = require("../lib");
const schema_spec_1 = require("./schema-spec");
exports.userDataObject = lib_1.Model.formatPattern({
    data: {
        id: 1,
        uuid: lib_1.DB.generateUUID(),
        email: 'test01@example.com',
        name: 'name:test01',
        username: 'test01',
        password: 'xxxxxxxxxx',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    },
    pattern: schema_spec_1.pattern
});
exports.userDataArray = [2, 3, 4, 5, 6].map(i => {
    return lib_1.Model.formatPattern({
        data: {
            id: i,
            uuid: lib_1.DB.generateUUID(),
            email: `test0${i}@example.com`,
            name: `name:test0${i}`,
            username: `test0${i}`,
            password: 'xxxxxxxxxx',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        },
        pattern: schema_spec_1.pattern
    });
});
exports.postDataObject = lib_1.Model.formatPattern({
    data: {
        id: 1,
        uuid: lib_1.DB.generateUUID(),
        userId: 1,
        title: 'title:01',
        subtitle: 'subtitle:test01',
        description: 'test01',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    },
    pattern: schema_spec_1.pattern
});
exports.postDataArray = [2, 3, 4, 5, 6].map(i => {
    return lib_1.Model.formatPattern({
        data: {
            id: i,
            uuid: lib_1.DB.generateUUID(),
            userId: i === 4 ? null : i,
            title: `title:0${i}`,
            subtitle: `subtitle:test0${i}`,
            description: `test0${i}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        },
        pattern: schema_spec_1.pattern
    });
});
//# sourceMappingURL=mock-data-spec.js.map