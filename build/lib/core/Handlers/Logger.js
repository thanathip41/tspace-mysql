"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHandler = void 0;
class LoggerHandler {
    constructor(self, prop) {
        this.PROP = '';
        this.SELF = self;
        this.PROP = prop;
        return this.initialize();
    }
    initialize() {
        var _a;
        if (this.SELF == null)
            return;
        const runing = this.SELF[this.PROP];
        if (runing == null)
            return;
        const _function = typeof runing;
        if (_function !== 'function')
            return;
        if (this.SELF.$logger == null)
            return;
        const ignores = [
            'table',
            'hasOne',
            'belongsTo',
            'hasMany',
            'belongsToMany',
            'constructor',
            'boot',
            'define'
        ];
        const _use = this.PROP.substring(0, 3) !== 'use';
        const _private = this.PROP.charAt(0) !== '_';
        const _setter = this.PROP.charAt(0) !== '$';
        const _ignore = ignores.indexOf(this.PROP) === -1;
        const conditions = [
            _use,
            _private,
            _ignore,
            _setter
        ].every((data) => data === true);
        if (!conditions)
            return;
        return (_a = this.SELF.$logger) === null || _a === void 0 ? void 0 : _a.set(this.PROP);
    }
}
exports.LoggerHandler = LoggerHandler;
exports.default = LoggerHandler;
//# sourceMappingURL=Logger.js.map