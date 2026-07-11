import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import { DB, Model, Blueprint } from '../src/lib'

class Product extends Model {
  constructor() {
    super();
    this.useSchema({
      id     : Blueprint.int().notNull().primary().autoIncrement(),
      name   : Blueprint.varchar(100).notNull(),
      stock  : Blueprint.int().notNull()
    });
  }
}

class Order extends Model {
  constructor() {
    super();
    this.useSchema({
      id          : Blueprint.int().notNull().primary().autoIncrement(),
      user_id     : Blueprint.int().notNull(),
      product_id  : Blueprint.int().notNull(),
      qty         : Blueprint.int().notNull(),
      created_at  : Blueprint.timestamp().null()
    });
  }
}

const purchaseForUpdate = async({ 
  userId, 
  productId, 
  qty 
}: { 
  userId: number;
  productId: number;
  qty: number 
}): Promise<void> => {
  const trx = await DB.beginTransaction()

  try {
    await trx.startTransaction()

    const product = await new Product()
      .where('id', productId)
      .rowLock('FOR_UPDATE')
      .bind(trx)
      .first()

    if (product == null) throw new Error("Product not found")
    if (product.stock < qty) throw new Error("Not enough stock")

    await new Product()
      .where('id', productId)
      .update({
        stock: product.stock - qty
      })
      .bind(trx)
      .save()

    await new Order()
      .create({
        user_id: userId,
        product_id: productId,
        qty,
        created_at: new Date()
      })
      .bind(trx)
      .save()

    await trx.commit()

  } catch (err: any) {
    await trx.rollback()
    throw err
  } finally {
    await trx.end()
  }
}

describe('Race Condition Tests', function () {
  
  before(async function () {
    await new Product().truncate({ force: true })
    await new Order().truncate({ force: true })
  })

  it('should handle concurrent purchases without race conditions using FOR UPDATE lock', async function () {
    this.timeout(1000 * 60 * 2)

    const MAX_CONNECTION = 50
    const INITIAL_STOCK = MAX_CONNECTION * 10
    const TASKS: Function[] = []
    const results: { userId: number; qty: number; success: boolean }[] = []

    await new Product()
      .create({
        id: 1,
        name: 'Test Product',
        stock: INITIAL_STOCK
      })
      .save()

    for (let i = 1; i <= MAX_CONNECTION; i++) {
      const qty = Math.floor(Math.random() * 5) + 1
      const userId = i
      
      TASKS.push(async () => {
        try {
          await purchaseForUpdate({
            userId,
            productId: 1,
            qty
          })
          results.push({ userId, qty, success: true })
        } catch (err: any) {
          if (err.message === 'Not enough stock') {
            results.push({ userId, qty, success: false })
          } else {
            throw err
          }
        }
      })
    }

    await Promise.all(TASKS.map(v => v()))
  
    const product = await new Product().where('id', 1).first()
    const orders = await new Order().where('product_id', 1).get()
    
    const totalPurchased = orders.reduce((sum, order) => sum + (order.qty as number), 0)
    const successfulPurchases = results.filter(r => r.success)
   
    expect(product?.stock).to.be.equal(INITIAL_STOCK - totalPurchased)
    expect(totalPurchased).to.be.lessThanOrEqual(INITIAL_STOCK)
    expect(orders.length).to.be.equal(successfulPurchases.length)
  })

  it('should prevent overselling with concurrent transactions', async function () {
    this.timeout(1000 * 60 * 2)

    await new Product().truncate({ force: true })
    await new Order().truncate({ force: true })

    const LIMITED_STOCK = 100
    const CONCURRENT_BUYERS = 200
    const BUY_QTY = 1
    const TASKS: Function[] = []

    await new Product()
      .create({
        id: 2,
        name: 'Limited Product',
        stock: LIMITED_STOCK
      })
      .save()

    for (let i = 1; i <= CONCURRENT_BUYERS; i++) {
      const userId = i
      TASKS.push(async () => {
        try {
          await purchaseForUpdate({
            userId,
            productId: 2,
            qty: BUY_QTY
          })
        } catch (err: any) {
          // Expected failures for out of stock
        }
      })
    }

    await Promise.all(TASKS.map(v => v()))

    const product = await new Product().where('id', 2).first()
    const orders = await new Order().where('product_id', 2).get()
    const totalSold = orders.reduce((sum, order) => sum + (order.qty as number), 0)


    expect(product?.stock).to.be.greaterThanOrEqual(0)
    expect(totalSold).to.be.lessThanOrEqual(LIMITED_STOCK)
    expect(orders.length).to.be.lessThanOrEqual(LIMITED_STOCK / BUY_QTY)
  })

  it('should handle row lock correctly with multiple products', async function () {
    this.timeout(1000 * 60 * 2)

    await new Product().truncate({ force: true })
    await new Order().truncate({ force: true })

    const PRODUCTS = [
      { id: 1, name: 'Product A', stock: 50 },
      { id: 2, name: 'Product B', stock: 30 },
      { id: 3, name: 'Product C', stock: 20 }
    ]

    for (const p of PRODUCTS) {
      await new Product().create(p).save()
    }

    const TASKS: Function[] = []
   
    for (const product of PRODUCTS) {
      for (let i = 0; i < product.stock; i++) {
        const userId = `${product.id}-${i}`
        TASKS.push(async () => {
          try {
            await purchaseForUpdate({
              userId: parseInt(userId.split('-')[1]),
              productId: product.id,
              qty: 1
            })
          } catch (err: any) {
            // Expected failures
          }
        })
      }
    }

    await Promise.all(TASKS.map(v => v()))

    for (const product of PRODUCTS) {
      const p = await new Product().where('id', product.id).first()
      const orders = await new Order().where('product_id', product.id).get()
      const totalSold = orders.reduce((sum, order) => sum + (order.qty as number), 0)

      expect(p?.stock).to.be.equal(0)
      expect(totalSold).to.be.equal(product.stock)
    }

  })

  it('should handle transaction rollback on error correctly', async function () {
    this.timeout(30000)

    await new Product().truncate({ force: true })
    await new Order().truncate({ force: true })

    const INITIAL_STOCK = 100
    await new Product()
      .create({
        id: 4,
        name: 'Rollback Test Product',
        stock: INITIAL_STOCK
      })
      .save()

    const trx = await DB.beginTransaction()
    
    try {
      await trx.startTransaction()

      const product = await new Product()
        .where('id', 4)
        .rowLock('FOR_UPDATE')
        .bind(trx)
        .first()

      if (product == null) throw new Error("Product not found")

      await new Product()
        .where('id', 4)
        .update({
          stock: product.stock - 10
        })
        .bind(trx)
        .save()

      await new Order()
        .create({
          user_id: 999,
          product_id: 4,
          qty: 10,
          created_at: new Date()
        })
        .bind(trx)
        .save()

      throw new Error("Simulated error for rollback test")

    } catch (err: any) {
      await trx.rollback()
      await trx.end()
    }

    const productAfterRollback = await new Product().where('id', 4).first()
    const ordersAfterRollback = await new Order().where('product_id', 4).get()

    expect(productAfterRollback?.stock).to.be.equal(INITIAL_STOCK)
    expect(ordersAfterRollback.length).to.be.equal(0)
  })
})