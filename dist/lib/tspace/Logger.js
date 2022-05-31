"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMethod = void 0;
var LoggerMethod = function (self, prop) {
    var _a;
    if (self == null)
        return;
    var runing = self[prop];
    if (runing == null)
        return;
    var _function = typeof runing;
    if (_function !== 'function')
        return;
    if (self.$logger == null)
        return;
    var ignores = [
        'table',
        'hasOne',
        'belongsTo',
        'hasMany',
        'belongsToMany',
    ];
    var use = prop.substring(0, 3) !== 'use';
    var _private = prop.charAt(0) !== '_';
    var ignore = ignores.indexOf(prop) === -1;
    var conditions = [use, _private, ignore].every(function (data) { return data === true; });
    if (conditions)
        (_a = self.$logger) === null || _a === void 0 ? void 0 : _a.set(prop);
    return;
};
exports.LoggerMethod = LoggerMethod;
