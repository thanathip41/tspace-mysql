"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const constants_1 = require("../constants");
const OPERATOR = {
    'eq': '=',
    'notEq': '<>',
    'more': '>',
    'less': '<',
    'moreOrEq': '>=',
    'lessOrEq': '<=',
    'like': 'LIKE',
    'notLike': 'NOT LIKE',
    'in': 'IN',
    'notIn': 'NOT IN',
    'isNull': 'IS NULL',
    'isNotNull': 'IS NOT NULL',
    'query': 'QUERY',
    '|eq': '|=',
    '|notEq': '|<>',
    '|more': '|>',
    '|less': '|<',
    '|moreOrEq': '|>=',
    '|lessOrEq': '|<=',
    '|like': '|LIKE',
    '|notLike': '|NOT LIKE',
    '|in': '|IN',
    '|notIn': '|NOT IN',
    '|isNull': '|IS NULL',
    '|isNotNull': '|IS NOT NULL',
    '|query': '|QUERY'
};
/**
 * The 'Operator' class is used to operator for where conditions.
 * @example
 * import { Operator , DB } from 'tspace-mysql'
 *
 * const whereObject = await new DB("users")
 *  .whereObject({
 *      id :  Operator.eq(1),
 *      username :  Operator.orIn(['user1','user2']),
 *      name :  Operator.like('%value%')
 *  })
 *  .findMany();
 */
class Operator {
    static _handlerResult(operator, value) {
        if (value == null) {
            [
                `${constants_1.CONSTANTS.OP}(${OPERATOR[operator]})`,
                `${constants_1.CONSTANTS.VALUE}(NULL)`
            ].join(' ');
        }
        return [
            `${constants_1.CONSTANTS.OP}(${OPERATOR[operator]})`,
            `${constants_1.CONSTANTS.VALUE}(${value})`
        ].join(' ');
    }
    static eq(value) {
        return Operator._handlerResult('eq', value);
    }
    static notEq(value) {
        return Operator._handlerResult('notEq', value);
    }
    static more(value) {
        return Operator._handlerResult('more', value);
    }
    static less(value) {
        return Operator._handlerResult('less', value);
    }
    static moreOrEq(value) {
        return Operator._handlerResult('moreOrEq', value);
    }
    static lessOrEq(value) {
        return Operator._handlerResult('lessOrEq', value);
    }
    static like(value) {
        return Operator._handlerResult('like', value);
    }
    static notLike(value) {
        return Operator._handlerResult('notLike', value);
    }
    static in(value) {
        return Operator._handlerResult('in', value);
    }
    static notIn(value) {
        return Operator._handlerResult('notIn', value);
    }
    static isNull() {
        return Operator._handlerResult('isNull');
    }
    static isNotNull() {
        return Operator._handlerResult('isNotNull');
    }
    static query(value) {
        return Operator._handlerResult('query', value);
    }
    static orEq(value) {
        return Operator._handlerResult('|eq', value);
    }
    static orNotEq(value) {
        return Operator._handlerResult('|notEq', value);
    }
    static orMore(value) {
        return Operator._handlerResult('|more', value);
    }
    static orLess(value) {
        return Operator._handlerResult('|less', value);
    }
    static orMoreOrEq(value) {
        return Operator._handlerResult('|moreOrEq', value);
    }
    static orLessOrEq(value) {
        return Operator._handlerResult('|lessOrEq', value);
    }
    static orLike(value) {
        return Operator._handlerResult('|like', value);
    }
    static orNotLike(value) {
        return Operator._handlerResult('|notLike', value);
    }
    static orIn(value) {
        return Operator._handlerResult('|in', value);
    }
    static orNotIn(value) {
        return Operator._handlerResult('|notIn', value);
    }
    static orIsNull() {
        return Operator._handlerResult('|isNull');
    }
    static orIsNotNull() {
        return Operator._handlerResult('|isNotNull');
    }
    static orQuery(value) {
        return Operator._handlerResult('|query', value);
    }
}
exports.Operator = Operator;
//# sourceMappingURL=Operator.js.map