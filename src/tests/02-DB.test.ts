import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { userSchemaObject , userSchemaArray } from './schema-spec'
import { userDataObject, userDataArray } from './mock-data-spec';
import { DB }  from '../lib'

chai.use(chaiJsonSchema)

describe('Testing DB', function () {
  /* ##################################################### */
  it(`DB: Start to mock up the data in table 'users' for testing CRUD
    - Truncate : new DB('users').truncate()
    - Create : new DB('users').create(userDataObject).save()
    - Select : new DB('users').first()
    - CreateMultiple : new DB('users').createMultiple(userDataArray).save()
    - Update : new DB('users').where('id',5).update({ name : 'was update'}).save()
    - Delete : new DB('users').where('id',5).delete()
  `, 
  async function () {

    const truncate = await new DB('users').truncate({ force : true})
    expect(truncate).to.be.equal(true)
    
    const created = await new DB('users').create(userDataObject).save()
    
    expect(created).to.be.an('object')
    expect(created).to.be.jsonSchema(userSchemaObject)

    const selectd = await new DB('users').first()
    expect(selectd).to.be.an('object')
    expect(selectd).to.be.jsonSchema(userSchemaObject)

    const createds = await new DB('users').createMultiple(userDataArray).save()
    expect(createds).to.be.an('array')
    expect(createds).to.be.jsonSchema(userSchemaArray)

    const updated = await new DB('users').where('id',5).update({ name : 'was update'}).save() as Record<string,any>
    expect(updated).to.be.an('object')
    expect(updated).to.be.jsonSchema(userSchemaObject)
    expect(updated.name).to.be.equal('was update')

    const deleted = await new DB('users').where('id',5).delete()
    expect(deleted).to.be.an('boolean')
    expect(deleted).to.be.equal(true)

  })

  it(`DB: await new DB('users').get()
    It should return an array and must have all user schema attributes`, 
    async function () {
      
    const results = await new DB('users').limit(5).get()

    expect(results).to.be.an('array')

    expect(results).to.be.jsonSchema(userSchemaArray)

  })

  it(`DB: await new DB('users').first()
    It should returns an object and must have all user schema attributes`, 
    async function () {

    const results = await new DB('users').first()

    expect(results).to.be.an('object')

    expect(results).to.be.jsonSchema(userSchemaObject)

  })

  it(`DB: await new DB('users').select('id').first()
    It should returns an object and must only have an 'id'`, 
    async function () {

    const results = await new DB('users').select('id').first()

    expect(results).to.be.an('object')

    expect(results).to.have.property('id')

  })

  it(`DB: await new DB('users').except('id').first()
    It should returns an object and must only have an 'id'`, 
    async function () {

    const results = await new DB('users').except('id').first()

    expect(results).to.be.an('object')

    expect(results).to.not.have.property('id');

  })

  /* ###################################################### */
})

