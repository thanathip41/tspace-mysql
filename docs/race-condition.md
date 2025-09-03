# Race Condition

Within a race condition, you can utilize the following:

```js
import { Model, DB }  from 'tspace-mysql'

class Product extends Model {}

class Order extends Model {}

const purchaseForUpdate = async({userId , productId , qty } : { 
  userId: number;
  productId: number;
  qty: number 
}): Promise<void> => {
  const trx = await DB.beginTransaction()
  try {
   
    await trx.startTransaction()

    const product = await new Product()
    .where('id',productId)
    .rowLock('FOR_UPDATE') // don't forget this, lock this product for update
    .bind(trx)
    .first()

    if (product == null) throw new Error("Product not found");

    if (product.stock < qty) throw new Error("Not enough stock");

    await new Product()
    .where('id',productId)
    .update({
      stock : `${DB.raw('stock')} - ${qty}`,
      id: productId
    })
    .bind(trx)
    .save()

    await new Order()
    .create({
      user_id : userId,
      product_id : productId,
      qty
    })
    .bind(trx)
    .save()

    await trx.commit();
    console.log(`✅ [FOR UPDATE] User ${userId} purchased ${qty}`);

  } catch (err: any) {
    await trx.rollback();
    console.log(`❌ [FOR UPDATE] User ${userId} failed: ${err.message}`);
  } finally {
    await trx.end();
  }
}

const simulateRaceConnection = async (): Promise<void> => {
  const MAX_CONNECTION = 500;
  const TASKS: Function[] = [];
  const STOCK = MAX_CONNECTION * 10

  await new Product()
  .where('id',1)
  .update({
    stock : STOCK,
  })
  .save()

  const successes : number[] = []
  const fails     : number[] = []
  let purchased   : number = 0
  let outOfStock  : number = 0
  for (let i = 1; i <= MAX_CONNECTION; i++) {
    TASKS.push(async () => {
      const qty = Math.floor(Math.random() * 30) + 1 
      await purchaseForUpdate({
        userId : i, 
        productId : 1 , 
        qty
      })
      .then(_ => {
        successes.push(1)
        purchased += qty
      })
      .catch(_ => {
        fails.push(1)
        outOfStock += qty
      })
    });
  }

  console.log("=== Simulation ===");
  const start = Date.now();
  await Promise.all(TASKS.map(v => v()));
  const end = Date.now();
  console.log(`USING TIME TO TEST IN ${end - start} ms`)
  console.log(`ALL STOCK: ${STOCK} qty`)
  console.log(`✅ [SUCCESS(${successes.length})] [Purchased]: ${purchased} qty`);
  console.log(`❌ [FAIL(${fails.length})] [OutOfStock]: ${outOfStock} qty`);
  console.log('======== DONE ============')
  process.exit(0)
}

simulateRaceConnection();

```

<div class="page-nav-cards">
  <a href="#/database-transactions" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> Database Transactions </div>
  </a>

  <a href="#/connection" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title"> Connection </div>
  </a>
</div>