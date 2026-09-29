# Backup

To backup a database, you can perform the following steps:

```js
await new DB().clone({
    database: 'try-to-backup',  // clone current database to  new database name
    // Options dump value 
    value : true,
    // options Can you clone current database to other server with new database
    to : {
        host: 'localhost',
        port : 3306,
        username: 'username',
        password: 'password',
    }
})

await new DB().dump({
    database: 'try-to-dump',
    filePath: 'dump.sql',
    // Options dump value 
    value : true,
})

```

<div class="page-nav-cards">
  <a href="#/condition" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Condition </div>
  </a>

  <a href="#/injection" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Injection </div>
  </a>
</div>