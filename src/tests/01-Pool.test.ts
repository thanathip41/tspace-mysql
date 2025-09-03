import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Pool }  from '../lib'

describe('Testing Pool', function () {
  /* ##################################################### */
  it('Pool: It is connected?', async function () {

    const pool = Pool.connected()
    expect(pool).to.have.an('object')
    expect(pool).to.have.property('query')
    expect(pool).to.have.property('connection')
    expect(pool.connection).to.be.a('function')
    expect(pool.query).to.be.a('function')

    const query = await pool.query('SELECT 1 as ping')

    expect(query).to.be.an('array')
    expect(query.length).to.be.equal(1)
    expect(query[0].ping).to.be.equal(1)
  })

  it('Pool: It is Pool can open new connection?', async function () {
    
    const pool = Pool.connected();
    const connect = await pool.connection();

    expect(connect.query).to.be.an('function')

    const connectQuery = await connect.query('SELECT 1 as ping')

    expect(connectQuery).to.be.an('array')
    expect(connectQuery[0].ping).to.be.equal(1)

  })
  /* ###################################################### */
})

