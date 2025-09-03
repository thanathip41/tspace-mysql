# SQL Like
SQL (Structured Query Language) is used to manage data in relational databases.  
Here are the four most common commands with **tspace-mysql** examples:

## Select Statements
Retrieve data from a table. You can select specific columns or all columns.

```js
import { sql, OP } from 'tspace-mysql'

await sql()
  .select('id', 'name')
  .from('users')
  .where({
    name: 'tspace',
    id: OP.in([1, 2, 3])
  })
  .limit(3)
  .orderBy('name')

```

## Insert Statements
Add new data into a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .insert('users')
  .values({
    email: 'tspace@example.com'
  })

await sql()
  .insert('users')
  .values({
    email: 'tspace@example.com'
  })
  .returning({
    id: true,
    email: true,
    enum: true
  })
```

## Update Statements

Modify existing data in a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .update('users')
  .where({ id: 1 })
  .set({
    email: 'tspace@example.com'
  })

await sql()
  .update('users')
  .where({ id: 1 })
  .set({
    email: 'tspace@example.com'
  })
  .returning()

```

## Delete Statements

Remove data from a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .delete('users')
  .where({ id: 1 })
  
```
<div class="page-nav-cards">
    <a href="#" class="prev-card">
      <div class="nav-label"> 
          <span style="color:#fff; font-size:16px;">←</span> 
          Previous
      </div>
      <div class="nav-title"> Getting Started</div>
    </a>

  <a href="#/query-builder" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title">Query Builder</div>
  </a>
</div>