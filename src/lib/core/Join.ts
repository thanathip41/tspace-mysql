import { Builder } from "./Builder";
import { utils }   from "../utils";
class Join {
    private join : string[] = []

    constructor(
        protected builder : Builder , 
        protected type : 'INNER_JOIN' | 'LEFT_JOIN' | 'RIGHT_JOIN' | 'CROSS_JOIN' = 'INNER_JOIN'
    ) {}

    /**
     * The 'on' method is used to Adds an ON condition to the current JOIN clause.
     *
     * Creates a join condition by comparing two column references.
     * Both parameters must be fully qualified column names in the
     * format `table.column`.
     *
     * @param localKey - The local column reference (e.g. `users.id`).
     * @param referenceKey - The referenced column reference (e.g. `posts.user_id`).
     *
     * @returns The current join builder instance for method chaining.
     *
     * @example
     * new User()
     *   .join((join) => join.on('users.id', 'posts.user_id'));
     * 
     */
    public on (localKey: `${string}.${string}`, referenceKey : `${string}.${string}`) {
       
        const table = referenceKey.split('.')?.shift();

        const join = [
            `${this.builder['$constants'](this.type)}`,
            `\`${table}\` ${this.builder['$constants']('ON')}`,
            `${this.builder.bindColumn(localKey)} = ${this.builder.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    /**
     * The 'and' method is used to Adds an additional condition to the current JOIN ON clause using AND.
     *
     * This method must be called after `.on()`.
     *
     * @param localKey - The left-side column reference.
     * @param referenceKey - The right-side column reference.
     *
     * @returns The current join builder instance.
     *
     * @example
     * new User()
     *   .join((join) =>
     *     join
     *       .on('users.id', 'posts.user_id')
     *       .and('posts.type', 'article')
     *       .and('posts.published', true)
     *   );
     */
    public and(
        localKey: `${string}.${string}`,
        referenceKey: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ): this;

    public and(
        localKey: `${string}.${string}`,
        operator: "=" | "<" | ">" | "!=" | "<>" | "<=" | ">=" | "LIKE" | "like",
        referenceKey?: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ): this;

    public and (
        localKey: `${string}.${string}`, 
        operator: "=" | "<" | ">" | "!=" | "<>" | "<=" | ">=" | "LIKE" | "like", 
        referenceKey?: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ) {

        if (!this.join.length) {
            throw new Error("Call .on() before using this");
        }

        [referenceKey, operator] = utils.valueAndOperator(
            referenceKey,
            operator,
            arguments.length === 2
        );

        if(typeof referenceKey === 'string' && /\./.test(referenceKey)) {
            const join = [
                this.builder['$constants']('AND'),
                this.builder.bindColumn(localKey),
                operator,
                this.builder.bindColumn(String(referenceKey))
            ].join(' ')

            this.join.push(join)

            return this
        }
        

        const format = this.formatValue(referenceKey , operator);

        if(format.isRaw) {
            
            const join = [
                this.builder['$constants']('AND'),
                this.builder.bindColumn(localKey), 
                format.value
            ].join(' ')

            this.join.push(join);

            return this
        }

        const join = [
            this.builder['$constants']('AND'),
            this.builder.bindColumn(localKey),
            format.operator,
            format.value
        ].join(' ')

        this.join.push(join)

        return this
    }

    /**
     * The 'or' method is used to Adds an additional condition to the current JOIN ON clause using OR.
     *
     * This method must be called after `.on()`.
     *
     * @param localKey - The left-side column reference.
     * @param referenceKey - The right-side column reference.
     *
     * @returns The current join builder instance.
     *
     * @example
     * new User()
     *   .join((join) =>
     *     join
     *       .on('users.id', 'posts.user_id')
     *       .or('posts.type', 'article')
     *       .or('posts.published', true)
     *   );
     */
    public or(
        localKey: `${string}.${string}`,
        referenceKey: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ): this;

    public or(
        localKey: `${string}.${string}`,
        operator: "=" | "<" | ">" | "!=" | "<>" | "<=" | ">=" | "LIKE" | "like",
        referenceKey?: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ): this;
    public or (
        localKey: `${string}.${string}`, 
        operator: "=" | "<" | ">" | "!=" | "<>" | "<=" | ">=" | "LIKE" | "like", 
        referenceKey?: `${string}.${string}` | string | number | boolean | null | (string | number | boolean | null)[]
    ) {

        if (!this.join.length) {
            throw new Error("Call .on() before using this");
        }

        [referenceKey, operator] = utils.valueAndOperator(
            referenceKey,
            operator,
            arguments.length === 2
        );

        if(typeof referenceKey === 'string' && /\./.test(referenceKey)) {
            const join = [
                `${this.builder['$constants']('OR')}`,
                `${this.builder.bindColumn(localKey)} ${operator} ${this.builder.bindColumn(String(referenceKey))}`
            ].join(' ')

            this.join.push(join)

            return this
        }

         const format = this.formatValue(referenceKey , operator);

        if(format.isRaw) {
            
            const join = [
                this.builder['$constants']('OR'),
                this.builder.bindColumn(localKey), 
                format.value
            ].join(' ')

            this.join.push(join);

            return this
        }

        const join = [
            this.builder['$constants']('OR'),
            this.builder.bindColumn(localKey),
            format.operator,
            format.value
        ].join(' ')

        this.join.push(join)

        return this
    }

    protected toString() {
        return this.join.join(' ')
    }

    private formatValue (value : unknown , operator: unknown) {
        let formated = utils.formatQueryValue(value);

        if(utils.checkValueHasRaw(value)) {
            return { isRaw : true , value : formated , operator : null }
        }

        if (value == null) {
            formated = '';
            operator = `${this.builder['$constants']('IS_NULL')}`;
        }

        if(Array.isArray(value)) {
            formated = `(${value.map((v) => utils.formatQueryValue(v)).join(', ')})`;
            operator = `${this.builder['$constants']('IN')}`;
        }

        return { isRaw : false , value : formated , operator };
    }
}

export { Join }
export default Join