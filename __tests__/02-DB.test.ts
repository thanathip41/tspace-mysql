import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { userSchemaObject , userSchemaArray , userDataObject, userDataArray } from './specs/default-spec'
import { DB }  from '../src/lib'

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

    const lasted = await new DB('users').latest().first();

    const updated = await new DB('users').where('id',lasted?.id).update({ name : 'was update'}).save() as Record<string,any>
    expect(updated).to.be.an('object')
    expect(updated).to.be.jsonSchema(userSchemaObject)
    expect(updated.name).to.be.equal('was update')

    const deleted = await new DB('users').where('id',lasted?.id).delete()
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

describe('JOIN', function () {

  it('DB: INNER JOIN should return matching records only', async function () {

    const results = await new DB('users')
    .select('users.*')
    .join((join) => {
      return join.on('users.id', 'posts.user_id');
    })
    .get()

    expect(results).to.be.an('array');

    const results2 = await new DB('users')
    .select('users.*')
    .join('users.id', 'posts.user_id')
    .get()

    expect(results2).to.be.an('array');
   
  });

  it('DB: LEFT JOIN should include users without posts', async function () {

    const results = await new DB('users')
      .select('users.*')
      .leftJoin((join) => {
        return join.on('users.id', 'posts.user_id');
      })
      .get();

    expect(results).to.be.an('array');
    expect(results.length).to.be.greaterThan(0);

    const results2 = await new DB('users')
    .select('users.*')
    .leftJoin('users.id', 'posts.user_id')
    .get()

    expect(results2).to.be.an('array');
    expect(results2.length).to.be.greaterThan(0);

  });

  it('DB: LEFT JOIN should return null joined columns when relation does not exist', async function () {

    const result = await new DB('users')
      .select('users.*')
      .leftJoin((join) => {
        return join.on('users.id', 'posts.user_id');
      })
      .where('users.id', 999999)
      .first();

    if (result) {
      expect(result.user_id).to.equal(null);
    }

    const result2 = await new DB('users')
      .select('users.*')
      .leftJoin('users.id', 'posts.user_id')
      .where('users.id', 999999)
      .first();

    if (result2) {
      expect(result2.user_id).to.equal(null);
    }
  });

  it('DB: RIGHT JOIN should return all records from joined table', async function () {

    const results = await new DB('users')
      .select('users.*')
      .rightJoin((join) => {
        return join.on('users.id', 'posts.user_id');
      })
      .get();

    expect(results).to.be.an('array');
    expect(results.length).to.be.greaterThan(0);

    const results2 = await new DB('users')
      .select('users.*')
      .rightJoin('users.id', 'posts.user_id')
      .get();

    expect(results2).to.be.an('array');
    expect(results2.length).to.be.greaterThan(0);
  });

  it('DB: JOIN should support multiple conditions', async function () {

    const results = await new DB('users')
      .select('users.*')
      .join((join) => {
        return join
          .on('users.id', 'posts.user_id')
          .and('posts.deleted_at', null);
      })
      .get();

    expect(results).to.be.an('array');

  });

});
