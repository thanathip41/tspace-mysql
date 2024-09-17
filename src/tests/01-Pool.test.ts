import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Pool }  from '../lib'

describe('Testing Pool', function () {
  /* ##################################################### */
  it('Pool: It is connected?', async function () {
    
    expect(Pool).to.have.an('object')
    expect(Pool).to.have.property('query')
    expect(Pool).to.have.property('connection')
    expect(Pool.connection).to.be.a('function')
    expect(Pool.query).to.be.a('function')
    
    const query = await Pool.query('SELECT 1 as ping')

    expect(query).to.be.an('array')
    expect(query.length).to.be.equal(1)
    expect(query[0].ping).to.be.equal(1)

    const connect = await Pool.connection()

    await connect.startTransaction()

    expect(connect).to.be.an('object')
    expect(connect).to.have.property('query')
    expect(connect).to.have.property('startTransaction')
    expect(connect).to.have.property('commit')
    expect(connect).to.have.property('rollback')

    expect(connect.startTransaction).to.be.a('function')
    expect(connect.commit).to.be.a('function')
    expect(connect.rollback).to.be.a('function')
    expect(connect.query).to.be.an('function')

    const connectQuery = await connect.query('SELECT 1 as ping')

    expect(connectQuery).to.be.an('array')
    expect(connectQuery[0].ping).to.be.equal(1)

    await connect.commit()

  })
  /* ###################################################### */
})

