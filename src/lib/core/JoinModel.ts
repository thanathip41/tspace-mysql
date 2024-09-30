import pluralize from "pluralize"
import { TModelConstructorOrObject } from "../types"
import { Model } from "./Model"

class JoinModel {
    private join : string[] = []

    constructor(
        protected model : Model , 
        protected type : 'INNER_JOIN' | 'LEFT_JOIN' | 'RIGHT_JOIN' | 'CROSS_JOIN' = 'INNER_JOIN'
    ) {}

    on (m1: TModelConstructorOrObject, m2 : TModelConstructorOrObject) {

        const {
            alias1,
            alias2,
            table1,
            table2,
            model1,
            model2,
            localKey,
            foreignKey
        } = this._handleJoinModel(m1, m2)
       
        const copy = new Model()
        .copyModel(this.model)

        const joinMethod = {
            'INNER_JOIN' : 'join',
            'LEFT_JOIN'  : 'leftJoin',
            'RIGHT_JOIN' : 'rightJoin',
            'CROSS_JOIN' : 'crossJoin',
        }[this.type] as 'join' | 'leftJoin' | 'rightJoin' | 'crossJoin'

        copy[joinMethod](
            `${alias1 === '' ? table1 : `${table1}|${alias1}`}.${localKey}`, 
            `${alias2 === '' ? table2 : `${table2}|${alias2}`}.${foreignKey}`
        )

        if (model1['$state'].get('MODEL_NAME') !== this.model['$state'].get('MODEL_NAME')) {

            const wheres = this.model['$state'].get('WHERE')

            const whereClause = `${alias1 === '' ? table1 : alias1}.${model1['$state'].get('SOFT_DELETE_FORMAT')}`

            const softDeleteIsNull = [
                this.model.bindColumn(whereClause),
                this.model['$constants']('IS_NULL')
            ].join(' ')

            if(!wheres.some((where: string) => where.includes(softDeleteIsNull ))) {
                this.model.whereNull(whereClause)
            }
        }
    
        if (model2['$state'].get('SOFT_DELETE')) {
            const wheres = this.model['$state'].get('WHERE')
            const whereClause = `${alias2 === '' ? table2 : alias2}.${model2['$state'].get('SOFT_DELETE_FORMAT')}`
            const softDeleteIsNull = [
                this.model.bindColumn(whereClause),
                this.model['$constants']('IS_NULL')
            ].join(' ')

            if(!wheres.some((where: string) => where.includes(softDeleteIsNull ))) {
                this.model.whereNull(whereClause)
            }
        }

        this.join.push(...copy['$state'].get('JOIN'))

        return this
    }

    and (m1: TModelConstructorOrObject, m2 : TModelConstructorOrObject) {

        if(!this.join.length) {
            return this.on(m1, m2)
        }

        const {
            alias1,
            alias2,
            table1,
            table2,
            localKey,
            foreignKey
        } = this._handleJoinModel(m1, m2)
       
        const join = this._handleCombindJoin(
            `${alias1 === '' ? table1 : `${table1}|${alias1}`}.${localKey}`, 
            `${alias2 === '' ? table2 : `${table2}|${alias2}`}.${foreignKey}`
        )

        this.join.push(join)

        return this
    }

    or (m1: TModelConstructorOrObject, m2 : TModelConstructorOrObject) {

        if(!this.join.length) {
            return this.on(m1, m2)
        }

        const {
            alias1,
            alias2,
            table1,
            table2,
            model1,
            model2,
            localKey,
            foreignKey
        } = this._handleJoinModel(m1, m2)
       
        const join = this._handleCombindJoin(
            `${alias1 === '' ? table1 : `${table1}|${alias1}`}.${localKey}`, 
            `${alias2 === '' ? table2 : `${table2}|${alias2}`}.${foreignKey}`,
            { operator : 'OR'}
        )

        this.join.push(join)

        return this
    }

    onRaw (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {
       
        const table = referenceKey?.split('.')?.shift()

        const join = [
            `${this.model['$constants'](this.type)}`,
            `\`${table}\` ${this.model['$constants']('ON')}`,
            `${this.model.bindColumn(localKey)} = ${this.model.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    andRaw (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {

        if(!this.join.length) {
            return this.onRaw(localKey, referenceKey)
        }
       
        const join = [
            `${this.model['$constants']('AND')}`,
            `${this.model.bindColumn(localKey)} = ${this.model.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    orRaw (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {

        if(!this.join.length) {

            return this.onRaw(localKey, referenceKey)
        }

        const join = [
            `${this.model['$constants']('OR')}`,
            `${this.model.bindColumn(localKey)} = ${this.model.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    protected toString() {
        return this.join.join(' ')
    }

    private _handleJoinModel ( 
        m1: TModelConstructorOrObject,
        m2: TModelConstructorOrObject
    ) {

        let model1      : Model  = typeof m1 === 'object' ? new m1.model() : new m1()
        let model2      : Model  = typeof m2 === 'object' ? new m2.model() : new m2()
        let localKey    : string = typeof m1 === 'object' ? m1.key != null && m1.key !== '' ? String(m1.key) : '' : ''
        let foreignKey  : string = typeof m2 === 'object' ? m2.key != null && m2.key !== '' ? String(m2.key) : '' : ''
        let alias1      : string = typeof m1 === 'object' ? m1.alias != null && m1.alias !== '' ? m1.alias : '' : ''
        let alias2      : string = typeof m2 === 'object' ? m2.alias != null && m2.alias !== '' ? m2.alias : '' : ''
    
        if(alias1 !== '') {
            if (model1['$state'].get('MODEL_NAME') === this.model['$state'].get('MODEL_NAME')) {
                this.model.alias(alias1)
            }
            model1.alias(alias1)
        }

        if(alias2 !== '') {
            model2.alias(alias2)
        }

        const table1 = model1.getTableName()
        const table2 = model2.getTableName()

        localKey   = ( localKey === '' || localKey == null ) 
            ? 'id' 
            : localKey

        foreignKey = ( foreignKey === '' || foreignKey == null ) 
            ? model2['_valuePattern'](`${pluralize.singular(table1)}_id`) 
            : foreignKey

        return {
            table1,
            table2,
            model1,
            model2,
            alias1,
            alias2,
            localKey,
            foreignKey
        }
    }

    private _handleCombindJoin (localKey: `${string}.${string}` , referenceKey ?: `${string}.${string}` , { operator = 'AND' }: { operator?: 'AND' | 'OR' } = {}) {

        let table = referenceKey?.split('.')?.shift()

        const aliasRef = /\|/.test(String(table))

        if(aliasRef) {

            const tableRef = table?.split('|')?.shift()

            table = `\`${tableRef}\` ${this.model['$constants']('AS')} \`${table?.split('|')?.pop()}\``

            referenceKey =  String(referenceKey?.split('|')?.pop() ?? referenceKey) as `${string}.${string}`
        }

        const alias = /\|/.test(String(localKey))

        if(alias) {
            localKey = String(localKey?.split('|')?.pop() ?? localKey) as `${string}.${string}`
        }

        return [
            `${this.model['$constants'](operator)}`,
            `${this.model.bindColumn(localKey)} = ${this.model.bindColumn(String(referenceKey))}`
        ].join(' ')
    }
}

export { JoinModel}
export default JoinModel