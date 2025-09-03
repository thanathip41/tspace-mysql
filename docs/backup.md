# Backup

To backup a database, you can perform the following steps:

```js
/**
 *
 * @param {string} database Database selected
 * @param {object | null} to defalut new current connection
 */
const backup = await new DB().backup({
    database: 'try-to-backup',  // clone current database to this database
    to ?: {
        host: 'localhost',
        port : 3306,
        username: 'username',
        password: 'password',
    }
})
/**
 *
 * @param {string} database Database selected
 * @param {string} filePath file path
 * @param {object | null} conection defalut current connection
 */
const backupToFile = await new DB().backupToFile({
    database: 'try-to-backup',
    filePath: 'backup.sql',
    connection ?: {
        host: 'localhost',
        port : 3306,
        database: 'database'
        username: 'username',
        password: 'password',
    }
})
// backupToFile => backup.sql

/**
 *
 * @param {string} database new db name
 */
await new DB().cloneDB('try-to-clone')

```

<div class="page-nav-cards">
  <a href="#/condition" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> Condition </div>
  </a>

  <a href="#/injection" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title"> Injection </div>
  </a>
</div>