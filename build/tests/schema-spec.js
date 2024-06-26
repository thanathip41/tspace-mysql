"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchemaArray = exports.postSchemaObject = exports.userSchemaArray = exports.userSchemaObject = exports.PostUser = exports.Post = exports.User = exports.pattern = void 0;
const lib_1 = require("../../src/lib");
exports.pattern = 'snake_case';
class User extends lib_1.Model {
    constructor() {
        super();
        this.usePattern(exports.pattern);
        this.useUUID();
        this.useTimestamp();
        this.useSoftDelete();
        this.hasMany({ model: Post, name: 'posts' });
        this.hasOne({ model: Post, name: 'post' });
        this.useSchema(lib_1.Model.formatPattern({
            data: {
                id: new lib_1.Blueprint().int().primary().autoIncrement(),
                uuid: new lib_1.Blueprint().varchar(50).null(),
                email: new lib_1.Blueprint().varchar(50).null(),
                name: new lib_1.Blueprint().varchar(255).null(),
                username: new lib_1.Blueprint().varchar(255).null(),
                password: new lib_1.Blueprint().varchar(255).null(),
                createdAt: new lib_1.Blueprint().timestamp().null(),
                updatedAt: new lib_1.Blueprint().timestamp().null(),
                deletedAt: new lib_1.Blueprint().timestamp().null(),
            },
            pattern: exports.pattern
        }));
    }
}
exports.User = User;
class Post extends lib_1.Model {
    constructor() {
        super();
        this.usePattern(exports.pattern);
        this.useUUID();
        this.useTimestamp();
        this.useSoftDelete();
        this.belongsTo({ name: 'user', model: User });
        this.belongsToMany({ name: 'subscribers', model: User, modelPivot: PostUser });
        this.useSchema(lib_1.Model.formatPattern({
            data: {
                id: new lib_1.Blueprint().int().notNull().primary().autoIncrement(),
                uuid: new lib_1.Blueprint().varchar(50).null(),
                userId: new lib_1.Blueprint().int().null(),
                title: new lib_1.Blueprint().varchar(100).notNull(),
                subtitle: new lib_1.Blueprint().varchar(100).null(),
                description: new lib_1.Blueprint().varchar(255).null(),
                createdAt: new lib_1.Blueprint().timestamp().null(),
                updatedAt: new lib_1.Blueprint().timestamp().null(),
                deletedAt: new lib_1.Blueprint().timestamp().null()
            },
            pattern: exports.pattern
        }));
    }
}
exports.Post = Post;
class PostUser extends lib_1.Model {
    constructor() {
        super();
        this.usePattern(exports.pattern);
        this.useUUID();
        this.useTimestamp();
        this.useSoftDelete();
        this.useTableSingular();
        this.useSchema(lib_1.Model.formatPattern({
            data: {
                id: new lib_1.Blueprint().int().notNull().primary().autoIncrement(),
                uuid: new lib_1.Blueprint().varchar(50).null(),
                userId: new lib_1.Blueprint().int().notNull(),
                postId: new lib_1.Blueprint().int().notNull(),
                createdAt: new lib_1.Blueprint().timestamp().null(),
                updatedAt: new lib_1.Blueprint().timestamp().null(),
                deletedAt: new lib_1.Blueprint().timestamp().null()
            },
            pattern: exports.pattern
        }));
    }
}
exports.PostUser = PostUser;
exports.userSchemaObject = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        uuid: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        email: { type: 'string' },
        name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        username: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        password: { type: 'string' },
        createdAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
        updatedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
        deletedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
    }
};
exports.userSchemaArray = {
    type: 'array',
    items: Object.assign({}, exports.userSchemaObject)
};
exports.postSchemaObject = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        uuid: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        userId: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        title: { type: 'string' },
        subtitle: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        description: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        createdAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
        updatedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
        deletedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }, { type: 'null' }] },
    }
};
exports.postSchemaArray = {
    type: 'array',
    items: Object.assign({}, exports.postSchemaObject)
};
//# sourceMappingURL=schema-spec.js.map