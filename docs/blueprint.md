# Blueprint

Blueprint is a tool used for defining database schemas programmatically. 
It allows developers to describe the structure of their database tables using a simple and intuitive syntax rather than writing SQL queries directly., you may use the:

```js
import { Schema , Blueprint , DB } from 'tspace-mysql'
(async () => {
    await new Schema().table('users', {
        id           : Blueprint.int().notNull().primary().autoIncrement(),
        // or id     : Blueprint.serial().primary(),
        uuid         : Blueprint.varchar(120).null()
        name         : Blueprint.varchar(120).default('name'),
        email        : Blueprint.varchar(255).unique().notNull(),
        email_verify : Blueprint.tinyInt(),
        password     : Blueprint.varchar(255),
        json         : Blueprint.json(),
        created_at   : Blueprint.null().timestamp(),
        updated_at   : Blueprint.null().timestamp(),
        deleted_at   : Blueprint.null().timestamp()
    })
    /**
     *
     *  @Faker fake data 5 raw
     *  await new DB().table('users').faker(5)
    */
})()

/**
 * To add types of the schema to the database
 * @Types
 *
*/
int (number)
tinyInt (number)
bigInt (number)
double ()
float ()
json ()
varchar (number)
char (number)
longText()
mediumText()
tinyText()
text()
enum(...n)
date()
dateTime()
timestamp ()

/**
 * To add attributes of the schema to the database
 * @Attrbuites
 *
*/
unsigned()
unique()
null()
notNull()
primary()
default(string)
defaultTimestamp()
autoIncrement()

/**
 *  To add a foreign key to the column
 *  @ForeginKey
 */
foreign({ references : ${COLUMN} , on : ${TABLE-NAME OR MODEL CLASSES} })

/**
 *  To add a index key to the column
 *  @indexKey
 */
index()
```

<div class="page-nav-cards">
  <a href="#/stored-procedure" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Stored Procedure </div>
  </a>

  <a href="#/cli" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Cli </div>
  </a>
</div>