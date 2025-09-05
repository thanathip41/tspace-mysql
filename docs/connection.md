# Connection

When establishing a connection, you can specify options as follows:

```js
const connection = await new DB().getConnection({
    host: 'localhost',
    port : 3306,
    database: 'database'
    username: 'username',
    password: 'password',
})

const users = await new DB('users')
.bind(connection) // don't forget this
.findMany()
```
<div class="page-nav-cards">
  <a href="#/race-condition" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Race Condition </div>
  </a>

  <a href="#/backup" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Backup </div>
  </a>
</div>