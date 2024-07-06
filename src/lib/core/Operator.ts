import { CONSTANTS } from '../constants'
import { TOperator } from '../types'

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
    'query' : 'QUERY',
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
    '|query' : '|QUERY'
} as const

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
export class Operator {

    private static _handlerResult (operator : keyof TOperator,value ?: any) {

        if(value == null) {
            [
                `${CONSTANTS.OP}(${OPERATOR[operator]})`,
                `${CONSTANTS.VALUE}(NULL)`
            ].join(' ')
        }

        return [
            `${CONSTANTS.OP}(${OPERATOR[operator]})`,
            `${CONSTANTS.VALUE}(${value})`
        ].join(' ')
    }

    static eq (value : string | number | boolean) {
        return Operator._handlerResult('eq', value)
    } 

    static notEq (value : string | number | boolean) {
        return Operator._handlerResult('notEq', value)
    } 

    static more (value : string | number) {
        return Operator._handlerResult('more', value)
    } 

    static less (value : string | number) {
        return Operator._handlerResult('less', value)
    } 

    static moreOrEq (value : string | number) {
        return Operator._handlerResult('moreOrEq', value)
    } 

    static lessOrEq (value : string | number) {
        return Operator._handlerResult('lessOrEq', value)
    } 

    static like (value : string | number) {
        return Operator._handlerResult('like', value)
    } 

    static notLike (value : string | number) {
        return Operator._handlerResult('notLike', value)
    } 

    static in (value : (string | number | boolean | null)[]) {
        return Operator._handlerResult('in', value)
    } 

    static notIn (value : (string | number | boolean | null)[]) {
        return Operator._handlerResult('notIn', value)
    } 

    static isNull () {
        return Operator._handlerResult('isNull')
    } 

    static isNotNull () {
        return Operator._handlerResult('isNotNull')
    } 

    static query (value : string) {
        return Operator._handlerResult('query', value)
    } 

    static orEq (value : string | number | boolean) {
        return Operator._handlerResult('|eq', value)
    } 

    static orNotEq (value : string | number | boolean) {
        return Operator._handlerResult('|notEq', value)
    } 

    static orMore (value : string | number) {
        return Operator._handlerResult('|more', value)
    } 

    static orLess (value : string | number) {
        return Operator._handlerResult('|less', value)
    } 

    static orMoreOrEq (value : string | number) {
        return Operator._handlerResult('|moreOrEq', value)
    } 

    static orLessOrEq (value : string | number) {
        return Operator._handlerResult('|lessOrEq', value)
    } 

    static orLike (value : string | number) {
        return Operator._handlerResult('|like', value)
    } 

    static orNotLike (value : string | number) {
        return Operator._handlerResult('|notLike', value)
    } 

    static orIn (value : (string | number | boolean | null)[]) {
        return Operator._handlerResult('|in', value)
    } 

    static orNotIn (value : (string | number | boolean | null)[]) {
        return Operator._handlerResult('|notIn', value)
    } 

    static orIsNull () {
        return Operator._handlerResult('|isNull')
    } 

    static orIsNotNull () {
        return Operator._handlerResult('|isNotNull')
    } 

    static orQuery (value : string) {
        return Operator._handlerResult('|query', value)
    } 
}