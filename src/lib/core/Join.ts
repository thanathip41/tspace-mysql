import { Builder } from "./Builder"
class Join {
    private join : string[] = []

    constructor(
        protected self : Builder , 
        protected type : 'INNER_JOIN' | 'LEFT_JOIN' | 'RIGHT_JOIN' | 'CROSS_JOIN' = 'INNER_JOIN'
    ) {}

    on (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {
       
        const table = referenceKey?.split('.')?.shift()

        const join = [
            `${this.self['$constants'](this.type)}`,
            `\`${table}\` ${this.self['$constants']('ON')}`,
            `${this.self.bindColumn(localKey)} = ${this.self.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    and (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {

        if(!this.join.length) {

            return this.on(localKey, referenceKey)
        }
       
        const join = [
            `${this.self['$constants']('AND')}`,
            `${this.self.bindColumn(localKey)} = ${this.self.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    or (localKey: `${string}.${string}`, referenceKey ?: `${string}.${string}`) {

        if(!this.join.length) {

            return this.on(localKey, referenceKey)
        }

        const join = [
            `${this.self['$constants']('OR')}`,
            `${this.self.bindColumn(localKey)} = ${this.self.bindColumn(String(referenceKey))}`
        ].join(' ')

        this.join.push(join)

        return this
    }

    protected toString() {
        return this.join.join(' ')
    }
}

export { Join }
export default Join