import chai, { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { userDataObject, postDataArray } from './mock-data-spec';
import { DB }  from '../lib'
import { postSchemaArray } from './default-spec';
import { userSchemaObject } from './schema-spec';

chai.use(chaiJsonSchema)

describe('Testing Transaction', function () {
  /* ##################################################### */

    it(`DB: Transaction committed successfully`, 
    async function () {
        await new DB('users').truncate({ force : true })
        await new DB('posts').truncate({ force : true })

        const connection = await new DB().beginTransaction();

        try {

        await connection.startTransaction();

        const user = await new DB('users')
        .create(userDataObject)
        .bind(connection)
        .save() as Record<string,any>

        await new DB('posts')
        .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
        .bind(connection)
        .save();

        await connection.commit();

        await connection.end();

        const userAfterCommited   = await new DB('users').first();
        expect(userAfterCommited).to.be.an('object')
        expect(userAfterCommited).to.be.jsonSchema(userSchemaObject)

        const postsAfterCommited  = await new DB('posts').get();

        expect(postsAfterCommited).to.be.an('array')
        expect(postsAfterCommited).to.be.jsonSchema(postSchemaArray)

        } catch (err) {
            console.log(err)
            await connection.rollback();
        }
    })

    it(`DB: Transaction skipped commit`, 
    async function () {
        await new DB('users').truncate({ force : true})
        await new DB('posts').truncate({ force : true})

        const connection = await new DB().beginTransaction();

        try {

        await connection.startTransaction();

        const user = await new DB('users')
        .create(userDataObject)
        .bind(connection)
        .save() as Record<string,any>

        await new DB('posts')
        .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
        .bind(connection)
        .save();

        await connection.end();

        const userWithoutCommit   = await new DB('users').first();
        expect(userWithoutCommit).to.be.equal(null);

        const postsWithoutCommit  = await new DB('posts').get();
        expect(postsWithoutCommit).to.be.an('array').that.is.empty

        } catch (err) {
             console.log(err)
            await connection.rollback();
        }
    })

    it(`DB: Transaction rolled back`, 
    async function () {
        await new DB('users').truncate({ force : true })
        await new DB('posts').truncate({ force : true })

        const connection = await new DB().beginTransaction();

        try {

            await connection.startTransaction();

            const user = await new DB('users')
            .create(userDataObject)
            .bind(connection)
            .save() as Record<string,any>

            await new DB('posts')
            .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
            .bind(connection)
            .save();

            // error
            throw new Error('error!')

        } catch (err) {
            
            await connection.rollback();

            const userAfterRollback   = await new DB('users').first();
            expect(userAfterRollback).to.be.equal(null);

            const postsAfterRollback  = await new DB('posts').get();
            expect(postsAfterRollback).to.be.an('array').that.is.empty
        }
    })

    it(`DB: Error thrown when bind transaction used after transaction end: "The transaction has either been closed"`, 
    async function () {
        await new DB('users').truncate({ force : true })
        await new DB('posts').truncate({ force : true })

        const connection = await new DB().beginTransaction();

        try {

        await connection.startTransaction();

        const user = await new DB('users')
        .create(userDataObject)
        .bind(connection)
        .save() as Record<string,any>

        await new DB('posts')
        .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
        .bind(connection)
        .save();

        await connection.commit();

        await connection.end();

        // postsAfterEnd
        await new DB('posts')
        .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
        .bind(connection)
        .save();
        
        } catch (err:any) {
            expect(err?.message).to.be.equal("The transaction has either been closed");
        }
    })

     it(`DB: Error thrown when startTransaction used after transaction end: "The transaction has either been closed"`, 
    async function () {
        await new DB('users').truncate({ force : true })
        await new DB('posts').truncate({ force : true })

        const connection = await new DB().beginTransaction();

        try {

        await connection.startTransaction();

        const user = await new DB('users')
        .create(userDataObject)
        .bind(connection)
        .save() as Record<string,any>

        await new DB('posts')
        .createMultiple(postDataArray.map(v => ({ ...v, user_id: user.id })))
        .bind(connection)
        .save();

        await connection.commit();

        await connection.end();

        await connection.startTransaction();

        } catch (err:any) {
            expect(err?.message).to.be.equal("The transaction has either been closed");
        }
    })
  /* ###################################################### */
})

