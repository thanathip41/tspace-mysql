import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { DB }  from '../lib'

chai.use(chaiJsonSchema)

describe('Testing Driver', function () {
  /* ##################################################### */

  it(`Driver: Using driver in ['mysql','mysql2', 'pg', 'postgres' ,'mariadb','mssql','sqlite3'] ?`, 
  async function () {

    const driver = new DB().driver()

    console.log(`
        \x1b[1m\x1b[32m
        Connection to the database. \x1b[0m \n
        ---------------------------- \n
              Driver : ${driver} \n
        ---------------------------- \x1b[34m
    `)

    const validDrivers = ['mysql','mysql2', 'pg', 'postgres' ,'mariadb','mssql','sqlite3']
    expect(validDrivers).to.include(driver)
  })
  /* ###################################################### */
})

