# tspace-mysql - CLI Tools Guide

## Overview

tspace-mysql includes a Command Line Interface (CLI) for managing models, migrations, and database operations. The CLI helps streamline development workflows.

## Available Commands

Run `npx tspace-mysql lists` or `npx tspace-mysql help` to see all available commands.

```bash
tspace-mysql make:model User --m --dir=app/Models  
tspace-mysql make:migration users --dir=app/Models/Migrations
tspace-mysql migrate --dir=App/Models/Migrations --type=js
tspace-mysql query "SELECT * FROM users" --env=development
tspace-mysql generate:models --dir=app/Models --env=development
tspace-mysql generate:models --dir=app/Models --env=development --decorators
tspace-mysql dump:db "database" --dir=app/db --v --env=development
tspace-mysql dump:table "table" --dir=app/table --v --env=development
tspace-mysql migrations:models --dir=migrations --models=src/models --generate
tspace-mysql migrations:models --dir=migrations --models=src/models --push
tspace-mysql migrations:db --dir=migrations --generate --db=new-db
tspace-mysql migrations:db --dir=migrations --push
```

## Commands Reference

### make:model

Generate a new model class:

```bash
# Basic model
npx tspace-mysql make:model User

# With migration
npx tspace-mysql make:model User --m

# With custom directory
npx tspace-mysql make:model User --dir=app/Models

# With migration and directory
npx tspace-mysql make:model User --m --dir=app/Models
```

### make:migration

Create a new migration file for a table:

```bash
# Create migration for table
npx tspace-mysql make:migration users --dir=app/Models/Migrations
```

### migrate

Run pending migrations:

```bash
# Run migrations
npx tspace-mysql migrate --dir=App/Models/Migrations --type=js

# With environment
npx tspace-mysql migrate --dir=App/Models/Migrations --type=ts --env=production
```

### generate:models

Generate models from existing database tables:

```bash
# Generate all models
npx tspace-mysql generate:models --dir=app/Models --env=development

# With decorators
npx tspace-mysql generate:models --dir=app/Models --env=development --decorators
```

### query

Execute raw SQL queries:

```bash
# Execute query
npx tspace-mysql query "SELECT * FROM users LIMIT 10" --env=development

# With environment
npx tspace-mysql query "SELECT COUNT(*) FROM orders" --env=production
```

### dump:db

Export entire database:

```bash
# Dump database
npx tspace-mysql dump:db "mydb" --dir=app/db --env=development

# With values (data)
npx tspace-mysql dump:db "mydb" --dir=app/db --v --env=development
```

### dump:table

Export specific table:

```bash
# Dump single table
npx tspace-mysql dump:table "users" --dir=app/tables --env=development

# With values (data)
npx tspace-mysql dump:table "users" --dir=app/tables --v --env=development
```

### migrations:models

Sync models with migrations:

```bash
# Generate migrations from models
npx tspace-mysql migrations:models --dir=migrations --models=src/models --generate

# Push migrations to database
npx tspace-mysql migrations:models --dir=migrations --models=src/models --push
```

### migrations:db

Database migration operations:

```bash
# Generate database migrations
npx tspace-mysql migrations:db --dir=migrations --generate --db=new-db

# Push database changes
npx tspace-mysql migrations:db --dir=migrations --push
```

## CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--dir=` | Output directory | `--dir=app/Models` |
| `--env=` | Environment | `--env=development` |
| `--type=` | File type (.ts or .js) | `--type=ts` |
| `--m` | Create migration | `--m` |
| `--models=` | Models directory | `--models=src/models` |
| `--db=` | Database name | `--db=mydb` |
| `--table=` | Table name | `--table=users` |
| `--filename=` | Custom filename | `--filename=custom` |
| `--values` or `--v` | Include data values | `--v` |
| `--decorator` | Use decorators | `--decorators` |
| `--push` | Push to database | `--push` |
| `--generate` | Generate files | `--generate` |

## Usage Examples

### Create a new model with migration

```bash
npx tspace-mysql make:model User --m --dir=src/models
```

### Generate models from existing database

```bash
npx tspace-mysql generate:models --dir=src/models --env=development --decorators
```

### Run migrations

```bash
npx tspace-mysql migrate --dir=src/migrations --type=ts --env=development
```

### Export database backup

```bash
npx tspace-mysql dump:db "myapp" --dir=backups --v --env=production
```

### Execute SQL query

```bash
npx tspace-mysql query "SELECT * FROM users WHERE active = 1" --env=development
```

## Package.json Scripts

```json
{
  "scripts": {
    "model": "tspace-mysql make:model",
    "migrate": "tspace-mysql migrate --dir=src/migrations --type=ts",
    "gen:models": "tspace-mysql generate:models --dir=src/models",
    "dump": "tspace-mysql dump:db mydb --dir=backups --v",
    "query": "tspace-mysql query"
  }
}
```

## Notes

- All commands support `--env=` to specify environment (development, production)
- Use `--dir=` to specify output directories
- The `--v` or `--values` flag includes data in dumps
- The `--decorators` flag generates decorator-style models
- Use `--push` to apply changes directly to database
- Use `--generate` to create migration files

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `07-transactions.md` - Database transactions
- `99-quickstart.md` - Complete example
