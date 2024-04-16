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
export declare class Operator {
    private static _handlerResult;
    static eq(value: string | number | boolean): string;
    static notEq(value: string | number | boolean): string;
    static more(value: string | number): string;
    static less(value: string | number): string;
    static moreOrEq(value: string | number): string;
    static lessOrEq(value: string | number): string;
    static like(value: string | number): string;
    static notLike(value: string | number): string;
    static in(value: (string | number | boolean | null)[]): string;
    static notIn(value: (string | number | boolean | null)[]): string;
    static isNull(): string;
    static isNotNull(): string;
    static query(value: string): string;
    static orEq(value: string | number | boolean): string;
    static orNotEq(value: string | number | boolean): string;
    static orMore(value: string | number): string;
    static orLess(value: string | number): string;
    static orMoreOrEq(value: string | number): string;
    static orLessOrEq(value: string | number): string;
    static orLike(value: string | number): string;
    static orNotLike(value: string | number): string;
    static orIn(value: (string | number | boolean | null)[]): string;
    static orNotIn(value: (string | number | boolean | null)[]): string;
    static orIsNull(): string;
    static orIsNotNull(): string;
    static orQuery(value: string): string;
}
