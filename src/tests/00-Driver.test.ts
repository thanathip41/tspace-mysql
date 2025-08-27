import chai , { expect  } from 'chai'
import { describe, it } from 'mocha'
import chaiJsonSchema from 'chai-json-schema'
import { DB }  from '../lib'
import fs from "fs";
import path from "path";

chai.use(chaiJsonSchema)

describe('Testing Driver', function () {
  /* ##################################################### */

  it(`Driver: Using driver in ['mysql','postgres' ,'mariadb','mssql','sqlite3'] ?`, 
  async function () {

    const driver = new DB().driver()

    console.log(`
        \x1b[1m\x1b[32m
        Connection to the database. \x1b[0m \n
        ---------------------------- \n
              Driver : ${driver} \n
        ---------------------------- \x1b[34m
    `)

    const validDrivers = ['mysql','postgres' ,'mariadb','mssql','sqlite3']
    expect(validDrivers).to.include(driver)

    const sqlFile = path.join(path.resolve(), "dbs", `${driver}.sql`);
    const sql = fs.readFileSync(sqlFile, "utf8");

    const statements = sql
    .split(/;\s*/g)
    .map(s => s.trim())
    .filter(Boolean);

    for (const stmt of statements) {
      await new DB().query(stmt).catch(err => console.log(err))
    }

    await new Promise(r => setTimeout(r, 1000 * 5));
  })
  /* ###################################################### */
})

