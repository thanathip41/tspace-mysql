import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { Blueprint, Model } from '../lib';

function isSortedByDesc(arr:any[], key: string = 'email_username') {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i][key] < arr[i + 1][key]) return false;
    }
    return true;
}

function isSortedByAsc(arr:any[], key: string = 'email_username') {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i][key] > arr[i + 1][key]) return false;
    }
    return true;
}

const virtualJsonSchema =  {
    type : 'object',
    required: ['email_username'],
    properties : {
        email_username :{ type: 'string' }
    }
}

const schema = {
    id : Blueprint.int().primary().autoIncrement(),
    uuid :Blueprint.varchar(50).null(),
    email :Blueprint.varchar(50).null(),
    name :Blueprint.varchar(255).null(),
    username : Blueprint.varchar(255).null(),
    password : Blueprint.varchar(255).null(),
    created_at :Blueprint.timestamp().null(),
    updated_at :Blueprint.timestamp().null(),
    deleted_at :Blueprint.timestamp().null(),

    email_username : new Blueprint().virtualColumn(`CONCAT(email,' ', username)`),
}

class User extends Model {
    protected boot(): void {
        this.useSchema(schema)
    }
}

chai.use(chaiJsonSchema)

describe('Testing Virtual Column', function () {
  /* ##################################################### */
    it(`Virtual Column: Start to get virtual column 'email_username' from Model User`, 

    async function () {

        const user = await new User().first()

        expect(user).to.be.an('object')

        expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)

        expect(user).to.be.jsonSchema(virtualJsonSchema)

        const users = await new User().get()

        expect(users).to.be.an('array')

        expect(users).to.be.jsonSchema({ type : 'array' , items : {...virtualJsonSchema }})

        for(const user of users) {
            expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)
        }
    })

    it(`Virtual Column: use method .select('email','username','email_username')`, 

    async function () {

        const user = await new User().select('email','username','email_username').first()

        expect(user).to.be.an('object')

        expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)

        expect(user).to.be.jsonSchema(virtualJsonSchema)

        const users = await new User().select('email','username','email_username').get()

        expect(users).to.be.an('array')

        expect(users).to.be.jsonSchema({ type : 'array' , items : {...virtualJsonSchema }})

        for(const user of users) {
            expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)
        }
    })

    it(`Virtual Column: use method .where('email_username')`, 

    async function () {

        const userNull = await new User().where('email_username','LIKE','%xxxx%').first()

        expect(userNull).to.be.equal(null)

        const user = await new User().where('email_username','LIKE','%test01%').first()

        expect(user).to.be.an('object')

        expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)

        expect(user).to.be.jsonSchema(virtualJsonSchema)

        const users = await new User().where('email_username','LIKE','%test01%').get()

        expect(users).to.be.an('array')

        expect(users).to.be.jsonSchema({ type : 'array' , items : {...virtualJsonSchema }})

        for(const user of users) {
            expect(user?.email_username).to.be.equal(user?.email + ' ' + user?.username)
        }
    })

    it(`Virtual Column: use method order column 'email_username'
        - orderBy
        - oldest
        - latest
    `, 

    async function () {

        const userAsc = await new User().orderBy('email_username','asc').first()

        expect(userAsc).to.be.an('object')

        expect(userAsc?.id).to.be.equal(1)

        const usersAsc = await new User().orderBy('email_username','asc').get()

        expect(usersAsc).to.be.an('array')

        expect(isSortedByAsc(usersAsc)).to.be.true

        const userDesc = await new User().orderBy('email_username','desc').first()

        expect(userDesc).to.be.an('object')

        expect(userDesc?.id).to.be.equal(6)

        const usersDesc = await new User().orderBy('email_username','desc').get()

        expect(usersDesc).to.be.an('array')

        expect(isSortedByDesc(usersDesc)).to.be.true

        const userOldested = await new User().oldest('email_username').first()

        expect(userOldested).to.be.an('object')

        expect(userOldested?.id).to.be.equal(1)

        const usersOldested = await new User().oldest('email_username').get()

        expect(usersOldested).to.be.an('array')

        expect(isSortedByAsc(usersOldested)).to.be.true

        const userLatested = await new User().latest('email_username').first()

        expect(userLatested).to.be.an('object')

        expect(userLatested?.id).to.be.equal(6)

        const usersLatested = await new User().latest('email_username').get()

        expect(usersLatested).to.be.an('array')

        expect(isSortedByDesc(usersLatested)).to.be.true
    })
})

