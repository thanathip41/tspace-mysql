
# Cli

To get started, let's install tspace-mysql
you may use a basic cli :

```sh
npm install tspace-mysql -g

```

## Make Model

The command will be placed Model in the specific directory.

```sh

/**
  *
  * @make Model
  * @options
  * @arg --m  => created scheme table for migrate. short cut migration table like Make Migration
  * @arg --dir=directory => created model in directory. default root directory
  * @arg --type=js // extension js. default ts
  */
tspace-mysql make:model <model name> --m  --dir=.... --type=....

tspace-mysql make:model User --m --dir=app/Models
/**
  *
  * @Ex directory
  */
- node_modules
- app
  - Models
     User.ts
```

## Make Migration

The command will be placed Migration in the specific directory.

```sh
/**
  *
  * @make Migration Table
  * @options
  * @arg --dir=directory => created scheme table in directory. default root directory
  * @arg --type=js // extension js default ts
  */
tspace-mysql make:migration <table name> --type=... --dir=....

tspace-mysql make:migration users --dir=app/Models/Migrations
/**
 *
 * @Ex directory
 */
- node_modules
- app
  - Models
    - Migrations
      create_users_table.ts
    User.ts
```

## Migrate

```sh
/**
  *
  * @run Migrate table
  * @options
  * @arg --dir=directory => find migrate in directory. default find in root folder
  * @arg --type=js // extension js default ts
  */
tspace-mysql migrate <folder> --type=<type file js or ts> --dir=<directory for migrate>

tspace-mysql migrate --dir=app/Models/Migrations --type=js

/**
 *
 * @Ex directory
 */
- node_modules
- app
  - Models
    - Migrations
      create_users_table.ts
      create_posts_table.ts
    User.ts
    Post.ts
// => migrate all schemas in folder <Migrations>. created into database
```

# Query

The command will execute a query.

```sh
tspace-mysql query "SELECT * FROM users"

```

# Dump

The command will dump the database or table into a file.

```sh
tspace-mysql dump:db --dir=<folder for dump> --values // backup with values in the tables

tspace-mysql dump:table "table_name" --dir=<folder for dump> --values // backup with values in the table

```

# Generate Models

The command will generate models from tables in the database.

```sh
tspace-mysql generate:models --dir=<folder for creating>

tspace-mysql generate:models --dir=app/Models --env=development --decorators

```

# Migration Models

The command will generate migrations based on the schema in your models to a .sql file, 
can also push the migration files to the database.

```sh
/**
  *
  * @arg --push will push the migration files to the database
  * @arg --generate will generate the migration files
  */
tspace-mysql migrations:models --dir=<path-to-migration> --models=<path to your models> --generate
tspace-mysql migrations:models --dir=<path-to-migration> --push

tspace-mysql migrations:models --models=src/app/models --dir=migrations  --generate
tspace-mysql migrations:models --dir=migrations --push

```

# Migration DB

The command will generate migrations based on the schema in your database to a .sql file, 
can also push the migration files to the database.

```sh
/**
  *
  * @arg --push will push the migration files to the database
  * @arg --generate will generate the migration files
  */
tspace-mysql migrations:db --dir=<path-to-migration> --generate --env=<YOUR_ENV> -filename=<YOUR_FILENAME>
tspace-mysql migrations:db --dir=<path-to-migration> --push

tspace-mysql migrations:db --dir=migrations --generate --filename=dump.sql --env=development
tspace-mysql migrations:db --dir=migrations --push --filename=dump.sql --env=development

```

<div class="page-nav-cards">
  <a href="#/blueprint" class="prev-card" >
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Blueprint </div>
  </a>
  <a href="#/" class="next-card">
      <div class="nav-label">
          Next
          <span class="page-nav-arrow">→</span>
      </div>
      <div class="nav-title"> Getting Started </div>
    </a>
</div>