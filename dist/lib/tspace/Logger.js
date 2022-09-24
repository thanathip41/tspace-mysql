"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger(self, prop) {
        this.PROP = '';
        this.SELF = self;
        this.PROP = prop;
        return this.initialize();
    }
    Logger.prototype.initialize = function () {
        var _a;
        if (this.SELF == null)
            return;
        var runing = this.SELF[this.PROP];
        if (runing == null)
            return;
        var _function = typeof runing;
        if (_function !== 'function')
            return;
        if (this.SELF.$logger == null)
            return;
        var ignores = [
            'table',
            'hasOne',
            'belongsTo',
            'hasMany',
            'belongsToMany',
            'constructor'
        ];
        var _use = this.PROP.substring(0, 3) !== 'use';
        var _private = this.PROP.charAt(0) !== '_';
        var _setter = this.PROP.charAt(0) !== '$';
        var _ignore = ignores.indexOf(this.PROP) === -1;
        var conditions = [
            _use,
            _private,
            _ignore,
            _setter
        ].every(function (data) { return data === true; });
        if (!conditions)
            return;
        return (_a = this.SELF.$logger) === null || _a === void 0 ? void 0 : _a.set(this.PROP);
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
