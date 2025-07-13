import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { User as UserWithOutSchema } from './default-spec';
import { User as UserWithSchema } from './schema-spec';
import { Meta } from '../lib';

chai.use(chaiJsonSchema)

describe('Testing Meta', function () {
  /* ##################################################### */
    it(`Meta: Start to get metadata from Model User with of assign schema`, 

    async function () {

        const metaUserWithOfSchema  = Meta(UserWithOutSchema)

        const table         = metaUserWithOfSchema.table()
        const column        = metaUserWithOfSchema.column('id')
        const columnRef     = metaUserWithOfSchema.columnReference('id')
        const columnTypeOf  = metaUserWithOfSchema.columnTypeOf('id')
        const columnType    = metaUserWithOfSchema.columnType('id')
        const columns       = metaUserWithOfSchema.columns()
        const hasColumn     = metaUserWithOfSchema.hasColumn('id')
        const primaryKey    = metaUserWithOfSchema.primaryKey()
        const indexes       = metaUserWithOfSchema.indexes()
        const nullable      = metaUserWithOfSchema.nullable()
        const defaults      = metaUserWithOfSchema.defaults()

        expect(table).to.be.equal('users')
        expect(column).to.be.equal('id')
        expect(columnRef).to.be.equal('`users`.`id`')
        expect(columnTypeOf).to.be.equal(undefined)
        expect(columnType).to.be.equal(undefined)
        expect(columns).to.be.an('array')
        expect(hasColumn).to.be.equal(false)
        expect(primaryKey).to.be.equal(undefined)
        expect(indexes).to.be.an('array')
        expect(nullable).to.be.an('array')
        expect(defaults).to.be.equal(null)
    })

    it(`Meta: Start to get metadata from Model User with assign schema`, 
    async function () {

        const metaUserWithSchema    = Meta(UserWithSchema)
        
        const table         = metaUserWithSchema.table()
        const column        = metaUserWithSchema.column('id')
        const columnRef     = metaUserWithSchema.columnReference('id')
        const columnTypeOf  = metaUserWithSchema.columnTypeOf('id')
        const columnType    = metaUserWithSchema.columnType('id')
        const columns       = metaUserWithSchema.columns()
        const hasColumn     = metaUserWithSchema.hasColumn('id')
        const primaryKey    = metaUserWithSchema.primaryKey()
        const indexes       = metaUserWithSchema.indexes()
        const nullable      = metaUserWithSchema.nullable()
        const defaults      = metaUserWithSchema.defaults()

        expect(table).to.be.equal('users')
        expect(column).to.be.equal('id')
        expect(columnRef).to.be.equal('`users`.`id`')
        expect(columnTypeOf).to.be.equal('number')
        expect(columnType).to.be.equal('INT')
        expect(columns).to.be.an('array')
        expect(hasColumn).to.be.equal(true)
        expect(primaryKey).to.be.equal('id')
        expect(indexes).to.be.an('array')
        expect(nullable).to.be.an('array')
        expect(defaults).to.be.equal(null)
        
    })
    /* ###################################################### */
})

