import { AbstractBuilder } from './Abstracts/AbstractBuilder';
import { TPagination, TConnectionOptions, TConnection, TConnectionTransaction } from '../types';
declare class Builder extends AbstractBuilder {
    constructor();
    /**
     * The 'instance' method is used get instance.
     * @static
     * @returns {Builder} instance of the Builder
     */
    static get instance(): Builder;
    /**
     * The 'distinct' method is used to apply the DISTINCT keyword to a database query.
     *
     * It allows you to retrieve unique values from one or more columns in the result set, eliminating duplicate rows.
     * @returns {this} this
     */
    distinct(): this;
    /**
     * The 'select' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set of a database query.
     * @param {string[]} ...columns
     * @returns {this} this
     */
    select(...columns: string[]): this;
    /**
     * The 'selectRaw' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set of a database query.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string[]} ...columns
     * @returns {this} this
     */
    selectRaw(...columns: string[]): this;
    /**
     * The 'selectObject' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set to 'Object' of a database query.
     * @param {string} object table name
     * @param {string} alias as name of the column
     * @returns {this} this
     */
    selectObject(object: Record<string, string>, alias: string): this;
    /**
     * The 'sleep' method is used to delay the query.
     *
     * @param {number} second - The number of seconds to sleep
     * @returns {this} this
     */
    sleep(second: number): this;
    /**
     * The 'returnType' method is used covert the results to type 'object' or 'array'.
     *
     * @param {string} type - The types 'object' | 'array'
     * @returns {this} this
     */
    returnType(type: 'object' | 'array'): this;
    /**
     * The 'pluck' method is used to retrieve the value of a single column from the first result of a query.
     *
     * It is often used when you need to retrieve a single value,
     * such as an ID or a specific attribute, from a query result.
     * @param {string} column
     * @returns {this}
     */
    pluck(column: string): this;
    /**
     * The 'except' method is used to specify which columns you don't want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be not included in the result set of a database query.
     * @param {...string} columns
     * @returns {this} this
     */
    except(...columns: string[]): this;
    /**
     * The 'exceptTimestamp' method is used to timestamp columns (created_at , updated_at) you don't want to retrieve from a database table.
     *
     * @returns {this} this
     */
    exceptTimestamp(): this;
    /**
     * The 'void' method is used to specify which you don't want to return a result from database table.
     *
     * @returns {this} this
     */
    void(): this;
    /**
     * The 'only' method is used to specify which columns you don't want to retrieve from a result.
     *
     * It allows you to choose the specific columns that should be not included in the result.
     * @param {...string} columns show only colums selected
     * @returns {this} this
     */
    only(...columns: string[]): this;
    /**
     * The 'chunk' method is used to process a large result set from a database query in smaller, manageable "chunks" or segments.
     *
     * It's particularly useful when you need to iterate over a large number of database records without loading all of them into memory at once.
     *
     * This helps prevent memory exhaustion and improves the performance of your application when dealing with large datasets.
     * @param {number} chunk
     * @returns {this} this
     */
    chunk(chunk: number): this;
    /**
     * The 'when' method is used to specify if condition should be true will be next to the actions
     * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
     * @returns {this} this
     */
    when(condition: string | number | undefined | null | Boolean, callback: Function): this;
    /**
     * The 'where' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * If has only 2 arguments default operator '='
     * @param {string} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    where(column: string | Record<string, any>, operator?: any, value?: any): this;
    /**
     * The 'orWhere' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * If has only 2 arguments default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    orWhere(column: string, operator?: any, value?: any): this;
    /**
     * The 'whereRaw' method is used to add a raw SQL condition to a database query.
     *
     * It allows you to include custom SQL expressions as conditions in your query,
     * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
     * @param {string} sql where column with raw sql
     * @returns {this} this
     */
    whereRaw(sql: string): this;
    /**
     * The 'orWhereRaw' method is used to add a raw SQL condition to a database query.
     *
     * It allows you to include custom SQL expressions as conditions in your query,
     * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
     * @param {string} sql where column with raw sql
     * @returns {this} this
     */
    orWhereRaw(sql: string): this;
    /**
     * The 'whereObject' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in object that records in the database must meet in order to be included in the result set.
     *
     * This method is defalut operator '=' only
     * @param {Object} columns
     * @returns {this}
     */
    whereObject(columns: Record<string, any>): this;
    /**
     * The 'whereJSON' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
     * @param    {string} column
     * @param    {object}  property object { key , value , operator }
     * @property {string}  property.key
     * @property {string}  property.value
     * @property {string?} property.operator
     * @returns   {this}
     */
    whereJSON(column: string, { key, value, operator }: {
        key: string;
        value: string;
        operator?: string;
    }): this;
    /**
     * The 'whereJSON' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
     * @param    {string} column
     * @param    {object}  property object { key , value , operator }
     * @property {string}  property.key
     * @property {string}  property.value
     * @property {string?} property.operator
     * @returns   {this}
     */
    whereJson(column: string, { key, value, operator }: {
        key: string;
        value: string;
        operator?: string;
    }): this;
    /**
     *
     * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
     *
     * It allows you to filter records based on whether a specified condition is true for related records.
     * @param {string} sql
     * @returns {this}
     */
    whereExists(sql: string): this;
    /**
     *
     * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
     *
     * It allows you to filter records based on whether a specified condition is true for related records.
     * @param {string} sql
     * @returns {this}
     */
    whereNotExists(sql: string): this;
    /**
     *
     * @param {number} id
     * @returns {this} this
     */
    whereId(id: number, column?: string): this;
    /**
     *
     * @param {string} email where using email
     * @returns {this}
     */
    whereEmail(email: string): this;
    /**
     *
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @returns {this}
     */
    whereUser(userId: number, column?: string): this;
    /**
     * The 'whereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
     *
     * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereIn(column: string, array: any[]): this;
    /**
     * The 'orWhereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
     *
     * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereIn(column: string, array: any[]): this;
    /**
     * The 'whereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
     *
     * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotIn(column: string, array: any[]): this;
    /**
     * The 'orWhereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
     *
     * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotIn(column: string, array: any[]): this;
    /**
     * The 'whereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereSubQuery(column: string, subQuery: string): this;
    /**
     * The 'whereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereNotSubQuery(column: string, subQuery: string): this;
    /**
     * The 'orWhereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereSubQuery(column: string, subQuery: string): this;
    /**
     * The 'orWhereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereNotSubQuery(column: string, subQuery: string): this;
    /**
     * The 'whereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereBetween(column: string, array: any[]): this;
    /**
     * The 'orWhereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereBetween(column: string, array: any[]): this;
    /**
     * The 'whereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotBetween(column: string, array: any[]): this;
    /**
     * The 'orWhereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotBetween(column: string, array: any[]): this;
    /**
     * The 'whereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
     *
     * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
     * @param {string} column
     * @returns {this}
     */
    whereNull(column: string): this;
    /**
     * The 'orWhereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
     *
     * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
     * @param {string} column
     * @returns {this}
     */
    orWhereNull(column: string): this;
    /**
     * The 'whereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
     *
     * This method is useful when you want to filter records based on whether a particular column has a non-null value.
     * @param {string} column
     * @returns {this}
     */
    whereNotNull(column: string): this;
    /**
     * The 'orWhereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
     *
     * This method is useful when you want to filter records based on whether a particular column has a non-null value.
     * @param {string} column
     * @returns {this}
     */
    orWhereNotNull(column: string): this;
    /**
     * The 'whereSensitive' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereSensitive(column: string, operator?: any, value?: any): this;
    /**
     * The 'whereStrict' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereStrict(column: string, operator?: any, value?: any): this;
    /**
     * The 'orWhereSensitive' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    orWhereSensitive(column: string, operator?: any, value?: any): this;
    /**
     * The 'whereQuery' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {Function} callback callback query
     * @returns {this}
     */
    whereQuery(callback: Function): this;
    /**
     * The 'whereGroup' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @returns {this}
     */
    whereGroup(callback: Function): this;
    /**
     * The 'orWhereQuery' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @returns {this}
     */
    orWhereQuery(callback: Function): this;
    /**
     * The 'orWhereGroup' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @returns {this}
     */
    orWhereGroup(callback: Function): this;
    /**
     * The 'whereAny' method is used to add conditions to a database query,
     * where either the original condition or the new condition must be true.
     *
     * If has only 2 arguments default operator '='
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAny(columns: string[], operator?: any, value?: any): this;
    /**
     * The 'whereAll' method is used to clause to a database query.
     *
     * This method allows you to specify conditions that the retrieved records must meet.
     *
     * If has only 2 arguments default operator '='
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAll(columns: string[], operator?: any, value?: any): this;
    /**
     * The 'whereCases' method is used to add conditions with cases to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * @param {Array<{when , then}>} cases used to add conditions when and then
     * @param {string?} elseCase else when end of conditions
     * @returns {this}
     */
    whereCases(cases: {
        when: string;
        then: string;
    }[], elseCase?: string): this;
    /**
     * The 'orWhereCases' method is used to add conditions with cases to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * @param {Array<{when , then}>} cases used to add conditions when and then
     * @param {string?} elseCase else when end of conditions
     * @returns {this}
     */
    orWhereCases(cases: {
        when: string;
        then: string;
    }[], elseCase?: string): this;
    /**
     * select by cases
     * @param {array} cases array object [{ when : 'id < 7' , then : 'id is than under 7'}]
     * @param {string} as assign name
     * @returns {this}
     */
    case(cases: {
        when: string;
        then: string;
    }[], as: string): this;
    /**
     * The 'join' method is used to perform various types of SQL joins between two or more database tables.
     *
     * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @example
     * await new DB('users')
     * .select('users.id as userId','posts.id as postId','email')
     * .join('users.id','posts.id')
     * .join('posts.category_id','categories.id')
     * .where('users.id',1)
     * .where('posts.id',2)
     * .get()
     * @returns {this}
     */
    join(localKey: `${string}.${string}`, referenceKey: `${string}.${string}`): this;
    /**
    * The 'joinSubQuery' method is used to perform various types of SQL joins between two or more database tables.
    *
    * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
    * @param    {object}  property object { localKey , foreignKey , sqlr }
    * @property {string} property.localKey local key in current table
    * @property {string} property.foreignKey reference key in next table
    * @property {string} property.sql sql string
    * @example
    * await new DB('users')
    * .joinSubQuery({ localKey : 'id' , foreignKey : 'userId' , sql : '....sql'})
    * .get()
    * @returns {this}
    */
    joinSubQuery({ localKey, foreignKey, sql }: {
        localKey: string;
        foreignKey: string;
        sql: string;
    }): this;
    /**
     * The 'rightJoin' method is used to perform a right join operation between two database tables.
     *
     * A right join, also known as a right outer join, retrieves all rows from the right table and the matching rows from the left table.
     *
     * If there is no match in the left table, NULL values are returned for columns from the left table
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @returns {this}
     */
    rightJoin(localKey: `${string}.${string}`, referenceKey: `${string}.${string}`): this;
    /**
     * The 'leftJoin' method is used to perform a left join operation between two database tables.
     *
     * A left join retrieves all rows from the left table and the matching rows from the right table.
     *
     * If there is no match in the right table, NULL values are returned for columns from the right table.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @returns {this}
     */
    leftJoin(localKey: `${string}.${string}`, referenceKey: `${string}.${string}`): this;
    /**
     * The 'crossJoin' method performs a cross join operation between two or more tables.
     *
     * A cross join, also known as a Cartesian join, combines every row from the first table with every row from the second table.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @returns {this}
     */
    crossJoin(localKey: `${string}.${string}`, referenceKey: `${string}.${string}`): this;
    /**
     * The 'orderBy' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
     * @param {string} column
     * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
     * @returns {this}
     */
    orderBy(column: string, order?: 'ASC' | 'DESC'): this;
    /**
     * The 'orderByRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @returns {this}
     */
    orderByRaw(column: string, order?: string): this;
    /**
     * The 'random' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
     *
     * @returns {this}
     */
    random(): this;
    /**
     * The 'inRandom' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
     *
     * @returns {this}
     */
    inRandom(): this;
    /**
     * The 'latest' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    latest(...columns: string[]): this;
    /**
     * The 'latestRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    latestRaw(...columns: string[]): this;
    /**
     * The 'oldest' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    oldest(...columns: string[]): this;
    /**
     * The 'oldestRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    oldestRaw(...columns: string[]): this;
    /**
     * The groupBy method is used to group the results of a database query by one or more columns.
     *
     * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
     *
     * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    groupBy(...columns: string[]): this;
    /**
     * The groupBy method is used to group the results of a database query by one or more columns.
     *
     * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
     *
     * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    groupByRaw(...columns: string[]): this;
    /**
     * The 'having' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
     *
     * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
     *
     * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
     * @param {string} condition
     * @returns {this}
     */
    having(condition: string): this;
    /**
     * The 'havingRaw' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
     *
     * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
     *
     * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string} condition
     * @returns {this}
     */
    havingRaw(condition: string): this;
    /**
     * The 'limit' method is used to limit the number of records returned by a database query.
     *
     * It allows you to specify the maximum number of rows to retrieve from the database table.
     * @param {number=} number [number=1]
     * @returns {this}
     */
    limit(number?: number): this;
    /**
     * The 'limit' method is used to limit the number of records returned by a database query.
     *
     * It allows you to specify the maximum number of rows to retrieve from the database table.
     * @param {number=} number [number=1]
     * @returns {this}
     */
    take(number?: number): this;
    /**
     * The offset method is used to specify the number of records to skip from the beginning of a result set.
     *
     * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
     * @param {number=} number [number=1]
     * @returns {this}
     */
    offset(number?: number): this;
    /**
     * The offset method is used to specify the number of records to skip from the beginning of a result set.
     *
     * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
     * @param {number=} number [number=1]
     * @returns {this}
     */
    skip(number?: number): this;
    /**
     * The 'hidden' method is used to specify which columns you want to hidden result.
     * It allows you to choose the specific columns that should be hidden in the result.
     * @param {...string} columns
     * @returns {this} this
     */
    hidden(...columns: string[]): this;
    /**
     * The 'update' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove one record that match certain criteria.
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
     * @returns {this} this
     */
    update(data: Record<string, any>, updateNotExists?: string[]): this;
    /**
     * The 'updateMany' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove more records that match certain criteria.
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
     * @returns {this} this
     */
    updateMany(data: Record<string, any>, updateNotExists?: string[]): this;
    /**
     *
     * The 'updateMultiple' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove more records that match certain criteria.
     * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
     * @returns {this} this
     */
    updateMultiple(cases: {
        when: Record<string, any>;
        columns: Record<string, any>;
    }[]): this;
    /**
     * The 'updateNotExists' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It method will be update record if data is empty or null in the column values
     * @param {object} data
     * @returns {this} this
     */
    updateNotExists(data: Record<string, any>): this;
    /**
     * The 'insert' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {object} data
     * @returns {this} this
     */
    insert(data: Record<string, any>): this;
    /**
     * The 'create' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {object} data
     * @returns {this} this
     */
    create(data: Record<string, any>): this;
    /**
     * The 'createMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @param {array} data create multiple data
     * @returns {this} this this
     */
    createMultiple(data: any[]): this;
    /**
     * The 'insertMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @param {array} data create multiple data
     * @returns {this} this this
     */
    insertMultiple(data: any[]): this;
    /**
     * The 'createNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
     * @param {object} data create not exists data
     * @returns {this} this this
     */
    createNotExists(data: Record<string, any>): this;
    /**
     * The 'insertNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
     * @param {object} data insert not exists data
     * @returns {this} this this
     */
    insertNotExists(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'createOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
     * @param {object} data insert data
     * @returns {this} this this
     */
    createOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'insertOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
     * @param {object} data insert or update data
     * @returns {this} this this
     */
    insertOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'updateOrCreate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @returns {this} this this
     */
    updateOrCreate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'updateOrInsert' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @returns {this} this this
     */
    updateOrInsert(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'insertOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @returns {this} this this
     */
    insertOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * The 'createOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data create or update data
     * @returns {this} this this
     */
    createOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     * The 'toString' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @returns {string} return sql query
     */
    toString(): string;
    /**
     * The 'toSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @returns {string} return sql query
     */
    toSQL(): string;
    /**
     * The 'toRawSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @returns {string}
    */
    toRawSQL(): string;
    /**
     * The 'getTableName' method is used to get table name
     * @returns {string} return table name
     */
    getTableName(): string;
    /**
     * The 'getColumns' method is used to get columns
     * @returns {this} this this
     */
    getColumns(): Promise<string[]>;
    /**
     * The 'getSchema' method is used to get schema information
     * @returns {this} this this
     */
    getSchema(): Promise<any[]>;
    /**
     * The 'bindColumn' method is used to concat table and column -> `users`.`id`
     * @param {string} column
     * @returns {string} return table.column
     */
    bindColumn(column: string): string;
    /**
     * The 'debug' method is used to console.log raw SQL query that would be executed by a query builder
     * @param {boolean} debug debug sql statements
     * @returns {this} this this
     */
    debug(debug?: boolean): this;
    /**
     * The 'dd' method is used to console.log raw SQL query that would be executed by a query builder
     * @param {boolean} debug debug sql statements
     * @returns {this} this this
     */
    dd(debug?: boolean): this;
    /**
     * The 'hook' method is used function when execute returns a result to callback function
     * @param {Function} func function for callback result
     * @returns {this}
    */
    hook(func: Function): this;
    /**
     * The 'before' method is used function when execute returns a result to callback function
     * @param {Function} func function for callback result
     * @returns {this}
    */
    before(func: Function): this;
    /**
     *
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.user
     * @param {string} option.password
     * @returns {this} this
     */
    connection(options: TConnectionOptions): this;
    /**
     *
     * @param {string} env load environment using with command line arguments
     * @returns {this} this
     */
    loadEnv(env?: string): this;
    /**
     *
     * @param {Function} pool pool connection database
     * @returns {this} this
     */
    pool(pool: TConnection): this;
    /**
     * make sure this connection has same transaction in pool connection
     * @param {object} connection pool database
     * @returns {this} this
     */
    bind(connection: TConnection | TConnectionTransaction): this;
    /**
     * This 'rawQuery' method is used to execute sql statement
     *
     * @param {string} sql
     * @returns {promise<any>}
     */
    rawQuery(sql: string): Promise<any>;
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @returns {promise<any>}
     */
    increment(column?: string, value?: number): Promise<any>;
    /**
     *
     * minus value then update
     * @param {string} column
     * @param {number} value
     * @returns {promise<any>}
     */
    decrement(column?: string, value?: number): Promise<any>;
    version(): Promise<string>;
    /**
     * The 'all' method is used to retrieve all records from a database table associated.
     *
     * It returns an array instances, ignore all condition.
     * @returns {promise<any>}
     */
    all(): Promise<any>;
    /**
     * The 'find' method is used to retrieve a single record from a database table by its primary key.
     *
     * This method allows you to quickly fetch a specific record by specifying the primary key value, which is typically an integer id.
     * @param {number} id
     * @returns {promise<any>}
     */
    find(id: number): Promise<Record<string, any> | null>;
    /**
     * The 'pagination' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit default 15
     * @param {number} paginationOptions.page default 1
     * @returns {promise<Pagination>}
     */
    pagination(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<TPagination>;
    /**
     * The 'paginate' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @returns {promise<Pagination>}
     */
    paginate(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<TPagination>;
    /**
     *
     * The 'first' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @param {Function?} cb callback function return query sql
     * @returns {promise<object | null>}
     */
    first(cb?: Function): Promise<Record<string, any> | null>;
    /**
     *
     * The 'findOne' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @param {Function?} cb callback function return query sql
     * @returns {promise<object | null>}
     */
    findOne(cb?: Function): Promise<Record<string, any> | null>;
    /**
     * The 'firstOrError' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     *
     * If record is null, this method will throw an error
     * @returns {promise<object | Error>}
     */
    firstOrError(message: string, options?: Record<string, any>): Promise<Record<string, any>>;
    /**
     * The 'findOneOrError' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     *
     * If record is null, this method will throw an error
     * execute data return object | null
     * @returns {promise<object | null>}
     */
    findOneOrError(message: string, options?: Record<string, any>): Promise<Record<string, any>>;
    /**
     * The 'get' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     * @param {Function?} cb callback function return query sql
     * @returns {promise<any[]>}
     */
    get(cb?: Function): Promise<any[]>;
    /**
     * The 'findMany' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     * @param {Function?} cb callback function return query sql
     * @returns {promise<any[]>}
     */
    findMany(cb?: Function): Promise<any[]>;
    /**
     *
     * The 'toJSON' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns a JSON formatted
     * @returns {promise<string>}
     */
    toJSON(): Promise<string>;
    /**
     * The 'toArray' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns an array formatted
     * @param {string=} column [column=id]
     * @returns {promise<Array>}
     */
    toArray(column?: string): Promise<any[]>;
    /**
     * The 'exists' method is used to determine if any records exist in the database table that match the query conditions.
     *
     * It returns a boolean value indicating whether there are any matching records.
     * @returns {promise<boolean>}
     */
    exists(): Promise<boolean>;
    /**
     * The 'count' method is used to retrieve the total number of records that match the specified query conditions.
     *
     * It returns an integer representing the count of records.
     * @param {string=} column [column=id]
     * @returns {promise<number>}
     */
    count(column?: string): Promise<number>;
    /**
     * The 'avg' method is used to calculate the average value of a numeric column in a database table.
     *
     * It calculates the mean value of the specified column for all records that match the query conditions and returns the result as a floating-point number.
     * @param {string=} column [column=id]
     * @returns {promise<number>}
     */
    avg(column?: string): Promise<number>;
    /**
     * The 'sum' method is used to calculate the sum of values in a numeric column of a database table.
     *
     * It computes the total of the specified column's values for all records that match the query conditions and returns the result as a numeric value.
     * @param {string=} column [column=id]
     * @returns {promise<number>}
     */
    sum(column?: string): Promise<number>;
    /**
     * The 'max' method is used to retrieve the maximum value of a numeric column in a database table.
     *
     * It finds the highest value in the specified column among all records that match the query conditions and returns that value.
     * @param {string=} column [column=id]
     * @returns {promise<number>}
     */
    max(column?: string): Promise<number>;
    /**
     * The 'min' method is used to retrieve the minimum (lowest) value of a numeric column in a database table.
     *
     * It finds the smallest value in the specified column among all records that match the query conditions and returns that value.
     * @param {string=} column [column=id]
     * @returns {promise<number>}
     */
    min(column?: string): Promise<number>;
    /**
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one record that match certain criteria.
     * @returns {promise<boolean>}
     */
    delete(): Promise<boolean>;
    /**
     * The 'deleteMany' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove more records that match certain criteria.
     * @returns {promise<boolean>}
     */
    deleteMany(): Promise<boolean>;
    /**
     *
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one or more records that match certain criteria.
     *
     * This method should be ignore the soft delete
     * @returns {promise<boolean>}
     */
    forceDelete(): Promise<boolean>;
    /**
     * The 'getGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns record an Array-Object key by column *grouping results in column
     * @param {string} column
     * @returns {promise<Array>}
     */
    getGroupBy(column: string): Promise<any[]>;
    /**
     *
     * The 'getGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns record an Array-Object key by column *grouping results in column
     * @param {string} column
     * @returns {promise<Array>}
     */
    findGroupBy(column: string): Promise<any[]>;
    /**
     * The 'save' method is used to persist a new 'Model' or new 'DB' instance or update an existing model instance in the database.
     *
     * It's a versatile method that can be used in various scenarios, depending on whether you're working with a new or existing record.
     * @returns {Promise<any>} promise
     */
    save(): Promise<Record<string, any> | any[] | null | undefined>;
    /**
     *
     * The 'makeSelectStatement' method is used to make select statement.
     * @returns {Promise<string>} string
     */
    makeSelectStatement(): Promise<string>;
    /**
     *
     * The 'makeInsertStatement' method is used to make insert table statement.
     * @returns {Promise<string>} string
     */
    makeInsertStatement(): Promise<string>;
    /**
     *
     * The 'makeUpdateStatement' method is used to make update table statement.
     * @returns {Promise<string>} string
     */
    makeUpdateStatement(): Promise<string>;
    /**
     *
     * The 'makeDeleteStatement' method is used to make delete statement.
     * @returns {Promise<string>} string
     */
    makeDeleteStatement(): Promise<string>;
    /**
     *
     * The 'makeCreateTableStatement' method is used to make create table statement.
     * @returns {Promise<string>} string
     */
    makeCreateTableStatement(): Promise<string>;
    /**
     * The 'showTables' method is used to show schema table.
     *
     * @returns {Promise<Array>}
     */
    showTables(): Promise<string[]>;
    /**
     *
     * The 'showColumns' method is used to show columns table.
     *
     * @param {string=} table table name
     * @returns {Promise<Array>}
     */
    showColumns(table?: string): Promise<string[]>;
    /**
     * The 'showSchema' method is used to show schema table.
     *
     * @param {string=} table [table= current table name]
     * @returns {Promise<Array>}
     */
    showSchema(table?: string): Promise<string[]>;
    /**
     * The 'showSchemas' method is used to show schema table.
     *
     * @param {string=} table [table= current table name]
     * @returns {Promise<Array>}
     */
    showSchemas(table?: string): Promise<string[]>;
    /**
     *
     * The 'showValues' method is used to show values table.
     *
     * @param {string=} table table name
     * @returns {Promise<Array>}
     */
    showValues(table?: string): Promise<string[]>;
    /**
     *
     * The 'faker' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {number} rows number of rows
     * @returns {promise<any>}
     */
    faker(rows: number, cb?: Function): Promise<void>;
    /**
     *
     * truncate of table
     * @returns {promise<boolean>}
     */
    truncate(): Promise<boolean>;
    /**
     *
     * drop of table
     * @returns {promise<boolean>}
     */
    drop(): Promise<boolean>;
    protected exceptColumns(): Promise<string[]>;
    protected _updateHandler(column: string, value?: string | number | null | boolean): string;
    protected copyBuilder(instance: Builder, options?: {
        update?: boolean;
        insert?: boolean;
        delete?: boolean;
        where?: boolean;
        limit?: boolean;
        orderBy?: boolean;
        join?: boolean;
        offset?: boolean;
        groupBy?: boolean;
        select?: boolean;
        having?: boolean;
    }): Builder;
    protected _queryBuilder(): {
        select: () => string;
        insert: () => string;
        update: () => string;
        delete: () => string;
        where: () => string | null;
        any: () => string;
    };
    protected _buildQueryStatement(): {
        select: () => string;
        insert: () => string;
        update: () => string;
        delete: () => string;
        where: () => string | null;
        any: () => string;
    };
    protected _resultHandler(data: any): any;
    whereReference(tableAndLocalKey: string, tableAndForeignKey?: string): this;
    protected _queryStatement(sql: string): Promise<any[]>;
    protected _actionStatement({ sql, returnId }: {
        sql: string;
        returnId?: boolean;
    }): Promise<any>;
    private _insertNotExists;
    private _insert;
    protected _checkValueHasRaw(value: any): string;
    protected _checkValueHasOp(str: string): {
        op: string;
        value: string;
    } | null;
    private _insertMultiple;
    private _insertOrSelect;
    private _updateOrInsert;
    private _update;
    private _hiddenColumn;
    private _queryUpdate;
    private _queryInsert;
    private _queryInsertMultiple;
    protected _valueAndOperator(value: string, operator: string, useDefault?: boolean): string[];
    protected _valueTrueFalse(value: any): any;
    private _initialConnection;
}
export { Builder };
export default Builder;
