#!/usr/bin/env node
import fs from 'fs'
import makeModel from './models/make'
import makeTable from './tables/make'
import makeMigrate from './migrate/make'
import generateModel from './generate/make'
import migrationModel from './migrations/make-model'
import migrationDB from './migrations/make-db'
import query from './query'
import dumpDB from './dump/db'
import dumpTable from './dump/table'


const help = () => {
console.log(`
\x1b[31m
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
\x1b[0m
`)
console.log(`Read more https://www.npmjs.com/package/tspace-mysql`)
}

const commands : Record< string , Function >= {
    'query'             : query,
    'make:model'        : makeModel,
    'make:table'        : makeTable,
    'make:migration'    : makeTable,
    'migrate'           : makeMigrate,
    'generate:models'   : generateModel,
    'gen:models'        : generateModel,
    'dump:db'           : dumpDB,
    'dump:table'        : dumpTable,
    'migrations:models' : migrationModel,
    'migrations:db'     : migrationDB,
    'help'              : () => help(),
    'lists'             : () => help()
}

try {
    const name = process.argv.slice(2)?.find(data => {
        return data?.includes('--name=')
    })?.replace('--name=','') ?? null

    const sql = process.argv.slice(3)[0] ?? ''

    const migrate = process.argv.slice(2)?.includes('--m') ?? false

    const dir =  process.argv.slice(2)?.find(data => {
        return data?.includes('--dir=')
    })?.replace('--dir=','/') ?? null

    const models =  process.argv.slice(2)?.find(data => {
        return data?.includes('--models=')
    })?.replace('--models=','/') ?? null

    const db = process.argv.slice(2)?.find(data => {
        return data?.includes('--db=')
    })?.replace('--db=','') ?? null

    const table = process.argv.slice(2)?.find(data => {
        return data?.includes('--table=')
    })?.replace('--table=','') ?? null

    const filename = process.argv.slice(2)?.find(data => {
        return data?.includes('--filename=')
    })?.replace('--filename=','') ?? null

    let type = (process.argv.slice(2)?.find(data => {
        return data?.includes('--type=')
    })?.replace('--type=','.') ?? '.ts')

    type = ['.js','.ts'].includes(type) ? type : '.ts'

    const file = process.argv.slice(3)[0] ?? ''

    const env = process.argv.slice(2)?.find(data => {
        return data?.includes('--env=')
    })?.replace('--env=','') ?? null

    const values = (process.argv.slice(2)?.includes('--values') || process.argv.slice(2)?.includes('--v')) ?? false

    const decorator = (process.argv.slice(2)?.includes('--decorator') || process.argv.slice(2)?.includes('--decorators')) ?? false

    const push = process.argv.slice(2)?.includes('--push') ?? false

    const generate = process.argv.slice(2)?.includes('--generate') ?? false

    if(env != null) process.env.NODE_ENV = env

    const cmd = {
        name,
        file,
        dir,
        models,
        migrate,
        type,
        cwd: process.cwd(),
        fs,
        sql,
        db,
        table,
        values,
        decorator,
        env,
        push,
        generate,
        filename,
        npm : 'tspace-mysql'
    };
      
    commands[process.argv[2]](cmd)
    
} catch (err) {

    console.log(err)
    console.log('##############################################################')
    console.log("The input command failed. Please try again using 'tspace-mysql lists'")
}