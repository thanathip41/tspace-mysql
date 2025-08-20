import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { User as UserWithOutSchema } from './default-spec';
import { User as UserWithSchema } from './schema-spec';
import { Meta } from '../lib';

chai.use(chaiJsonSchema)

describe('Testing Meta', function () {
  /* ##################################################### */
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
        //@ts-expect-error
        const enums         = metaUserWithSchema.enums('role')

        expect(table).to.be.equal('users')
        expect(column).to.be.equal('id')
        expect(columnRef).to.be.equal('`users`.`id`')
        expect(columnTypeOf).to.be.equal('number')
        expect(columnType).to.be.equal('INT')
        expect(columns).to.deep.equal([
            'id',         'uuid',
            'email',      'name',
            'username',   'password',
            'status',     'role',
            'created_at', 'updated_at',
            'deleted_at'
        ])
        expect(hasColumn).to.be.equal(true)
        expect(primaryKey).to.be.equal('id')
        expect(indexes).to.deep.equal(['users.email@index'])
        expect(nullable).to.deep.equal([
            'uuid',
            'email',
            'name',
            'username',
            'password',
            'created_at',
            'updated_at',
            'deleted_at'
        ])
        expect(defaults).to.be.deep.equal({ 
            id: null,
            uuid: null,
            email: null,
            name: null,
            username: null,
            password: null,
            status: 0,
            role: 'user',
            created_at: null,
            updated_at: null,
            deleted_at: null
        })

        expect(enums).to.deep.equal(['admin', 'user'])
    })
    /* ###################################################### */
})

