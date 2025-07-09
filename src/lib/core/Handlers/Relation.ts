import pluralize     from "pluralize";
import { Model }     from "../Model";
import { Blueprint } from "../Blueprint";
import type { 
    TRelationOptions, 
    TRelationQueryOptions 
} from "../../types";

class RelationHandler  {

    private $model : Model
    private $constants : Function
    private $logger : { 
        get: Function; 
        set: (value: string) => void; 
        reset: () => void; 
        check: (value: string) => boolean; 
    };

    constructor(model : Model) {
        this.$model = model
        this.$constants = this.$model["$constants"]
        this.$logger = this.$model["$logger"]
    }

    async load (parents: Record<string,any>[] , relation: TRelationOptions) {

        const relationIsBelongsToMany = relation.relation === this.$constants('RELATIONSHIP').belongsToMany

        if(relationIsBelongsToMany) {
            return await this._belongsToMany(parents , relation)
        }

        if(!Object.keys(relation)?.length) return []

        const { localKey, foreignKey } = this._valueInRelation(relation)    

        let parentIds: number[] = parents
        .map((parent: Record<string,any>) => {
            const key = parent[localKey]
            
            if(key === undefined) {
                throw this._assertError(
                    `This relationship lacks a primary or foreign key in the '${relation?.name}' relation. Please review the query to identify whether the key '${localKey}' or '${foreignKey}' is missing.`
                )
            }

            return key
        })
        .filter(d => d != null)

        parentIds = Array.from(new Set(parentIds))
      
        const query = relation.query as Model

        if(query == null) {
            throw this._assertError(`The callback query '${relation.name}' is unknown.`)
        }

        if(relation.count) {

            const childs :  Record<string,any>[] = await query
            .meta('SUBORDINATE')
            .whereIn(foreignKey,parentIds)
            .select(foreignKey)
            .selectRaw(`${this.$constants('COUNT')}(\`${foreignKey}\`) ${this.$constants('AS')} \`aggregate\``)
            .debug(this.$model['$state'].get('DEBUG'))
            .when(relation.trashed, (query : Model) => query.onlyTrashed())
            .when(relation.all, (query : Model) => query.disableSoftDelete())
            .bind(this.$model['$pool'].get())
            .groupBy(foreignKey)
            .get() 

            return this._relationMapData({ 
                parents , 
                childs , 
                relation 
            })
        }

        const childs = await query
        .meta('SUBORDINATE')
        .whereIn(foreignKey,parentIds)
        .debug(this.$model['$state'].get('DEBUG'))
        .when(relation.trashed, (query : Model) => query.onlyTrashed())
        .when(relation.all, (query : Model) => query.disableSoftDelete())
        .bind(this.$model['$pool'].get())
        .get()

        if(this.$model['$state'].get('DEBUG')) {
            this.$model['$state'].set('QUERIES',[
                ...this.$model['$state'].get('QUERIES'),
                query.toString()
            ])
        }
     
        return this._relationMapData({
            parents, 
            childs, 
            relation 
        })
    }

    loadExists () : string {

        const relations = this.$model['$state'].get('RELATIONS')

        for(const index in relations) {

            const relation = relations[index]

            if(!Object.keys(relation)?.length) continue

            if(relation.exists == null && relation.notExists == null) continue

            const { localKey, foreignKey , pivot , modelPivot } = this._valueInRelation(relation)   
            
            const query = relation.query as Model

            if(query == null) {
                throw this._assertError(`The callback query '${relation.name}' is unknown.`)
            }
          
            const clone = new Model().clone(query)

            const cloneRelations = clone['$state'].get('RELATIONS')

            if(cloneRelations.length) {

                for(const r of cloneRelations) {

                    if(r.query == null) continue

                    if(r.exists == null && r.notExists) continue

                    const sql = clone['$relation']?._handleRelationExists(r)

                    if(sql == null || sql === '') continue

                    if(r.notExists) {
                        clone.whereNotExists(sql)
                        continue
                    }

                    clone.whereExists(sql)
                }
            }
            
            if(relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {

                const thisPivot =  modelPivot
                ? new modelPivot as Model
                : new Model().table(String(pivot))
             
                const sql = clone
                .bind(this.$model['$pool'].get())
                .select1()
                .whereReference(
                    `\`${query.getTableName()}\`.\`${foreignKey}\``,
                    `\`${thisPivot.getTableName()}\`.\`${localKey}\``
                )
                .toString()

                if(relation.notExists) {
                    thisPivot.whereNotExists(sql)
                } else {
                    thisPivot.whereExists(sql)
                }

                const sqlPivot = thisPivot
                .bind(this.$model['$pool'].get())
                .select1()
                .whereReference(
                    `\`${this.$model['getTableName']()}\`.\`${foreignKey}\``,
                    `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize.singular(this.$model['getTableName']()),foreignKey].join("_"))}\``
                )
                .toString()

                if(relation.notExists) {
                    this.$model['whereNotExists'](sqlPivot)
                    continue
                }

                this.$model['whereExists'](sqlPivot)

                continue
                
            }

            const sql = clone
            .bind(this.$model['$pool'].get())
            .select1()
            .whereReference(
                `\`${this.$model.getTableName()}\`.\`${localKey}\``,
                `\`${query.getTableName()}\`.\`${foreignKey}\``
            )
            .unset({
                orderBy : true,
                limit   : true
            })
            .toString()

            if(relation.notExists) {
                this.$model['whereNotExists'](sql)
                continue
            }

            this.$model['whereExists'](sql)
        }

        const sql = this.$model['_queryBuilder']().select()

        return sql
    }

    apply (nameRelations : any[] , type : 'all' | 'exists' | 'notExists' | 'trashed' | 'count' | 'default') : TRelationOptions[] {

        const relations =  nameRelations.map((name: string) => {

            const relation : TRelationOptions = this.$model['$state'].get('RELATION')?.find((data: { name: string }) => data.name === name)

            if(relation == null) {
                throw this._assertError(
                    `This name relation '${name}' not be register in Model '${this.$model.constructor?.name}.'`
                )
            }

            const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation)

            if(!relationHasExists) {
                throw  this._assertError(
                    `The relationship '${relation.relation}' is unknown.`
                )
            }

            if(relation.model == null) {
                throw this._assertError(`Model for the relationship is unknown.`)
            }

            relation.query = relation.query == null ? new relation.model() : relation.query

            return relation
        })

        for(const relation of relations) {
            if(type === 'default') break
            relation[type] = true
        }
       
        return this.$model['$state'].get('RELATIONS').length 
        ? [...relations.map((w: { name : string }) => {
            const exists = this.$model['$state'].get('RELATIONS').find((r : { name : string}) =>  r.name === w.name)
                if(exists) return null
                return w
            }).filter((d) => d != null), 
            ...this.$model['$state'].get('RELATIONS')]
        : relations    
    }

    callback (nameRelation: string , cb : Function) {
        
        const relation : TRelationOptions = this.$model['$state'].get('RELATIONS').find((data: { name: string }) => data.name === nameRelation)

        if(relation == null) {
            throw this._assertError(
                `This name relation '${nameRelation}' not be register in Model '${this.$model.constructor?.name}.'`
            )
        }

        const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation)

        if(!relationHasExists) {
            throw  this._assertError(
                `The relationship '${relation.relation}' is unknown.`
            )
        }

        if(relation.model == null) {
            throw this._assertError(`Model for the relationship is unknown.`)
        }

        relation.query = cb(relation.query == null ? new relation.model() : relation.query)

        return
    }

    callbackPivot (nameRelation: string , cb : Function) {
        
        const relation : TRelationOptions = this.$model['$state'].get('RELATIONS').find((data: { name: string }) => data.name === nameRelation)

        if(relation == null) {
            throw this._assertError(
                `This name relation '${nameRelation}' not be register in Model '${this.$model.constructor?.name}'`
            )
        }
    
        const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation)

        if(!relationHasExists) {
            throw  this._assertError(
                `The relationship '${relation.relation}' is unknown.`
            )
        }
    
        if(relation.relation !== this.$constants('RELATIONSHIP').belongsToMany) {
            throw  this._assertError(
                `The pivot options support 'belongsToMany' relations exclusively.`
            )
        }

        if(relation.modelPivot == null) {
            throw this._assertError(`Model pivot for the relationship is unknown`)
        }

        relation.queryPivot = cb(relation.queryPivot == null ? new relation.modelPivot() : relation.queryPivot)

        return
    }

    returnCallback (nameRelation: string) {
        
        const relation : TRelationOptions = this.$model['$state'].get('RELATION').find((data: { name: string }) => data.name === nameRelation)

        if(relation == null) return null
    
        const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation)

        if(!relationHasExists) {
            throw  this._assertError(
                `The relationship '${relation.relation}' is unknown.`
            )
        }

        return relation.query == null ? new relation.model() : relation.query
    }

    hasOne ({ name , as , model  , localKey , foreignKey , freezeTable } : TRelationOptions ) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }
        return  this.$model['$state'].set('RELATION', [...this.$model['$state'].get('RELATION') , relation])
    }

    hasMany ({ name , as , model  , localKey , foreignKey , freezeTable } : TRelationOptions ) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }
        return  this.$model['$state'].set('RELATION', [...this.$model['$state'].get('RELATION') , relation])
    }

    belongsTo ({ name , as , model  , localKey , foreignKey , freezeTable } : TRelationOptions ) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }

        return  this.$model['$state']
        .set('RELATION', [
            ...this.$model['$state'].get('RELATION') , 
            relation
        ])
    }

    belongsToMany({ name , as , model  , localKey , foreignKey , freezeTable , pivot , oldVersion, modelPivot } : TRelationOptions ) {
        
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            query : null,
            modelPivot
        }

        return this.$model['$state']
        .set('RELATION', [
            ...this.$model['$state'].get('RELATION'),
            relation
        ])
    }

    manyToMany({ name , as , model  , localKey , foreignKey , freezeTable , pivot , oldVersion, modelPivot } : TRelationOptions ) {
        
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            query : null,
            modelPivot
        }

        return this.$model['$state']
        .set('RELATION', [
            ...this.$model['$state'].get('RELATION'),
            relation
        ])
    }

    hasOneBuilder ({ 
        name, 
        as, 
        model, 
        localKey, 
        foreignKey, 
        freezeTable,
    } : TRelationQueryOptions , callback ?: Function) {

        const nameRelation = name == null 
            ? this._functionTRelationOptionsName() 
            : String(name)

        const relation = {
            name : nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }

        const r = this._relationBuilder(nameRelation , relation)

        if(callback == null) {
            r.query = new r.model()
            return this
        }
       
        r.query = callback(new r.model())

        return

    }

    hasManyBuilder ({ 
        name, 
        as, 
        model, 
        localKey, 
        foreignKey, 
        freezeTable,
    } : TRelationQueryOptions , callback ?: Function) {

        const nameRelation = name == null 
            ? this._functionTRelationOptionsName() 
            : String(name)

        const relation = {
            name : nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }

        const r = this._relationBuilder(nameRelation , relation)

        if(callback == null) {
            r.query = new r.model()
            return this
        }
       
        r.query = callback(new r.model())

        return

    }

    belongsToBuilder ({ 
        name, 
        as, 
        model, 
        localKey, 
        foreignKey, 
        freezeTable,
    } : TRelationQueryOptions , callback ?: Function) {

        const nameRelation = name == null 
            ? this._functionTRelationOptionsName() 
            : String(name)

        const relation = {
            name : nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query : null
        }

        const r = this._relationBuilder(nameRelation , relation)

        if(callback == null) {
            r.query = new r.model()
            return this
        }
       
        r.query = callback(new r.model())

        return

    }

    belongsToManyBuilder ({ 
        name, 
        as, 
        model, 
        localKey, 
        foreignKey, 
        freezeTable,
        pivot
    } : TRelationQueryOptions , callback ?: Function) {

        const nameRelation = name == null 
            ? this._functionTRelationOptionsName() 
            : String(name)

        const relation = {
            name : nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            query : null
        }

        const r = this._relationBuilder(nameRelation , relation)

        if(callback == null) {
            r.query = new r.model()
            return this
        }
       
        r.query = callback(new r.model())

        return

    }

    private _handleRelationExists (relation : TRelationOptions) : string {

        if(!Object.keys(relation)?.length) {
            throw this._assertError(`Unknown the relation`)
        }

        if(relation.exists == null && relation.notExists == null) return ''
       
        const { localKey, foreignKey } = this._valueInRelation(relation)    

        const query = relation.query as Model

        if(query == null) {
            throw this._assertError(`Unknown callback query in the relation name : '${relation.name}']`)
        }

        const clone = new Model().clone(query)

        const cloneRelations = clone['$state'].get('RELATIONS')

        if(cloneRelations.length) {

            for(const r of cloneRelations) {

                if(r.exists == null && r.notExists == null) continue

                if(r.query == null) continue

                if(r.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                    
                    const data = clone['$relation']?._valueInRelation(r)

                    if(data == null) continue

                    const { modelPivot , pivot, foreignKey } = data
                    
                    const thisPivot =  modelPivot == null && pivot == null
                    ?   new Model().table(
                            this._valuePattern([
                                    pluralize.singular(clone.getTableName()),
                                    pluralize.singular(this.$model['getTableName']())
                                ].join("_")
                            )
                        )
                    :  modelPivot != null 
                        ? new modelPivot as Model 
                        : new Model().table(`${pivot}`)

                    const sqlPivot = thisPivot
                    .bind(this.$model['$pool'].get())
                    .select1()
                    .whereReference(
                        `\`${this.$model['getTableName']()}\`.\`${foreignKey}\``,
                        `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize.singular(this.$model['getTableName']()),foreignKey].join("_"))}\``
                    )
                    .unset({
                        orderBy : true,
                        limit   : true
                    })
                    .toString()

                    clone.whereExists(sqlPivot)

                    if(r.notExists) {
                        thisPivot.whereNotExists(sqlPivot)
                    } else {
                        thisPivot.whereExists(sqlPivot)
                    }
    
                    continue
                }

                const sql =  clone['$relation']?._handleRelationExists(r) ?? null

                if(sql == null || sql === '') continue

                if(r.notExists) {
                    clone.whereNotExists(sql)
                    continue
                }

                clone.whereExists(sql)
            }
        }

        if(relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {
              
            const data = clone['$relation']?._valueInRelation(relation)

            if(data != null) {

                const { modelPivot , pivot, foreignKey } = data
            
                const thisPivot =  modelPivot == null && pivot == null
                ?   new Model().table(
                        this._valuePattern([
                            pluralize.singular(clone.getTableName()),
                            pluralize.singular(this.$model['getTableName']())
                            ].join("_")
                        )
                    )
                :  modelPivot != null 
                    ? new modelPivot as Model 
                    : new Model().table(`${pivot}`)
    
                const sql = clone
                .bind(this.$model['$pool'].get())
                .select1()
                .whereReference(
                    `\`${clone['getTableName']()}\`.\`${foreignKey}\``,
                    `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize.singular(clone['getTableName']()),foreignKey].join("_"))}\``
                )
                .unset({
                    orderBy : true,
                    limit   : true
                })
                .toString()

                if(relation.notExists) {
                    thisPivot.whereNotExists(sql)
                } else {
                    thisPivot.whereExists(sql)
                }
                
                const sqlPivot = thisPivot
                .bind(this.$model['$pool'].get())
                .select1()
                .whereReference(
                    `\`${this.$model['getTableName']()}\`.\`${foreignKey}\``,
                    `\`${thisPivot.getTableName()}\`.\`${this._valuePattern([pluralize.singular(this.$model['getTableName']()),foreignKey].join("_"))}\``
                )
                .unset({
                    orderBy : true,
                    limit   : true
                })
                .toString()

                if(relation.notExists) {
                    clone.whereNotExists(sqlPivot)
                } else {
                    clone.whereExists(sqlPivot)
                }

                return sqlPivot
   
            }
        }

         if(relation.exists == null && relation.notExists == null) return ''

        const sql = clone
        .bind(this.$model['$pool'].get())
        .select1()
        .whereReference(
            `\`${this.$model['getTableName']()}\`.\`${localKey}\``,
            `\`${clone.getTableName()}\`.\`${foreignKey}\``
        )
        .unset({
            orderBy : true,
            limit   : true
        })
        .toString()

        return sql
    }

    private _relationBuilder (nameRelation:string , relation : TRelationOptions) : TRelationOptions {

        this.$model['$state'].set('RELATION' , [...this.$model['$state'].get('RELATION') , relation])

        this.$model['with'](nameRelation)

        const r : TRelationOptions = this.$model['$state'].get('RELATIONS').find((data: { name: string }) => data.name === nameRelation)

        this._assertError(relation == null , `The relation '${nameRelation}' is not registered in the model '${this.$model.constructor?.name}'.`)

        return r
    }

    private _functionTRelationOptionsName () : string {
        const functionName = [...this.$logger.get()][this.$logger.get().length - 2]

        return functionName.replace(/([A-Z])/g, (str:string) => `_${str.toLowerCase()}`)
    }

    private _relationMapData  ({ parents , childs , relation } :{ parents: any[] , childs:any[] , relation:TRelationOptions }) {

        const { 
            name, 
            as, 
            relation : relationName, 
            localKey, 
            foreignKey
        } = this._valueInRelation(relation)  
        
        const alias = as ?? name

        const relationIsHasOneOrBelongsTo = [
            this.$constants('RELATIONSHIP').hasOne, 
            this.$constants('RELATIONSHIP').belongsTo
        ].some(r => r ===  relationName)

        const relationIsHasManyOrBelongsToMany = [
            this.$constants('RELATIONSHIP').hasMany, 
            this.$constants('RELATIONSHIP').belongsToMany
        ].some(r => r ===  relationName)
        
        const children : Record<string , { values : Record<string,any>[] }> = [...childs]
        .reduce((prev, curr) => {

            const key = +curr[foreignKey]

            if (!prev[key]) {
              prev[key] = { [foreignKey]: key, values: [] }
            }

            prev[key].values.push({ ...curr })

            return prev
        }, {})
 
        for(const parent of parents) {

            if(relationIsHasOneOrBelongsTo) parent[alias] = relation.count ? 0 : null 
            
            if(relationIsHasManyOrBelongsToMany) parent[alias] = relation.count ? 0 : []
           
            const match = children[+parent[localKey]]
            
            if(match == null) continue
            
            const childrens = match?.values ?? []

            if(relation.count) {
                if(parent[alias] == 0) {
                    const count = Number(childrens[0]?.aggregate ?? 0)
                    parent[alias] = relationIsHasOneOrBelongsTo 
                    ? count > 1 ? 1 : count
                    : count 
                }
                continue
            }

            if(relationIsHasOneOrBelongsTo) {
                if(parent[alias] == null) {
                    parent[alias] = childrens[0] ?? null
                }
                continue
            } 

            parent[alias] = childrens

        }

        if(this.$model['$state'].get('HIDDEN').length) this.$model['_hiddenColumnModel'](parents)

        return parents
    }

    private async _belongsToMany (parents: Record<string,any>[], relation:TRelationOptions) {

        let { name, foreignKey, localKey , pivot , oldVersion , modelPivot , queryPivot , as } = this._valueInRelation(relation)

        const localKeyId = parents.map((parent : Record<string,any>) => {
            
            const data = parent[foreignKey]

            if(data === undefined) {
                throw this._assertError(
                    `This relationship lacks a primary or foreign key in the '${relation?.name}' relation. Please review the query to identify whether the key '${localKey}' or '${foreignKey}' is missing.`
                )
            }

            return data
           
        }).filter((d) => d != null)

        const mainResultIds : number[] = Array.from(new Set(localKeyId))

        const modelRelation : Model = relation.query == null ? new relation.model() : relation.query
 
        const relationColumn : string = this.$model['_classToTableName'](modelRelation.constructor.name , { singular : true })

        const mainlocalKey : string = 'id'

        const relationForeignKey : string = this._valuePattern(`${relationColumn}Id`)

        const localKeyPivotTable = this._valuePattern([pluralize.singular(this.$model['getTableName']()),foreignKey].join("_"))

        const pivotTable : string = String((relation.pivot ?? pivot))

        const sqlPivotExists : string = new Model()
        .copyModel(modelRelation)
        .select1()
        .whereReference(
            `\`${modelRelation.getTableName()}\`.\`${foreignKey}\``,
            `\`${pivotTable}\`.\`${localKey}\``
        )
        .toString()

        queryPivot = queryPivot == null 
        ? modelPivot 
            ? new modelPivot() as Model 
            : new Model().table(pivotTable)
        : queryPivot

        if(relation.count) {

            const pivotResults : Record<string,any>[] = await queryPivot
            .meta('SUBORDINATE')
            .whereIn(localKeyPivotTable,mainResultIds)
            .select(localKeyPivotTable)
            .selectRaw(`${this.$constants('COUNT')}(${localKeyPivotTable}) ${this.$constants('AS')} \`aggregate\``)
            .when(relation.exists, (query : Model) => query.whereExists(sqlPivotExists))
            .when(relation.trashed, (query : Model) => query.onlyTrashed())
            .when(relation.all, (query : Model) => query.disableSoftDelete())
            .groupBy(localKeyPivotTable)
            .bind(this.$model['$pool'].get())
            .debug(this.$model['$state'].get('DEBUG'))
            .get()

            for(const parent of parents) {
                if(parent[name] == null) parent[name] = 0
                for(const pivotResult of pivotResults) {
                    if(pivotResult[localKeyPivotTable] !== parent[foreignKey]) continue    
                    parent[name] = Number(pivotResult.aggregate ?? 0)
                }
            }

            if(this.$model['$state'].get('HIDDEN').length) this.$model['_hiddenColumnModel'](parents)

            return parents
        }

        const pivotResults: Record<string,any>[] = await queryPivot
        .meta('SUBORDINATE')
        .whereIn(localKeyPivotTable,mainResultIds)
        .when(relation.query != null , (query : Model) => query.select(localKeyPivotTable,localKey))
        .when(relation.exists, (query : Model) => query.whereExists(sqlPivotExists))
        .when(relation.trashed, (query : Model) => query.onlyTrashed())
        .when(relation.all, (query : Model) => query.disableSoftDelete())
        .bind(this.$model['$pool'].get())
        .debug(this.$model['$state'].get('DEBUG'))
        .get()

        const relationIds: number[] = Array.from(
            new Set(
                pivotResults
                .map((pivotResult: Record<string,any>) => pivotResult[relationForeignKey])
                .filter((d) => d != null)
            )
        )

        const relationResults: Record<string,any>[] = await modelRelation
        .meta('SUBORDINATE')
        .whereIn(mainlocalKey ,relationIds)
        .when(relation.trashed , (query : Model) => query.disableSoftDelete())
        .bind(this.$model['$pool'].get())
        .debug(this.$model['$state'].get('DEBUG'))
        .get()

        const alias = as ?? name
        
        if(oldVersion) {
            for(const pivotResult of pivotResults) {
                for(const relationResult of relationResults) {
                    if(relationResult[mainlocalKey] !== pivotResult[relationForeignKey]) continue
                    pivotResult[relationColumn] = relationResult
                }
            }
    
            for(const parent of parents) {
                if(parent[alias] == null) parent[alias] = []
                for(const pivotResult of pivotResults) {
                    if(pivotResult[localKeyPivotTable] !== parent[foreignKey]) continue                  
                    parent[alias].push(pivotResult)
                }
            }
           
            if(this.$model['$state'].get('HIDDEN').length) this.$model['_hiddenColumnModel'](parents)

            return parents
        }

        const children : Record<string , { values : Record<string,any>[] }> = [...pivotResults].reduce((prev, curr) => {

            const key = curr[localKeyPivotTable]

            if (!prev[key]) {
              prev[key] = { [localKeyPivotTable]: key, values: [] }
            }

            prev[key].values.push({ ...curr })

            return prev
        }, {})

        for(const parent of parents) {

            if(parent[alias] == null) parent[alias] = []

            const match = children[`${parent[foreignKey]}`]

            if(match == null) continue

            const childrens = match?.values ?? []

            for(const children of childrens) {

                const data = relationResults.find(relationResult => relationResult[foreignKey] === children[localKey])  

                if(data == null) continue
             
                parent[name].push(data)
            }
        }

        if(this.$model['$state'].get('HIDDEN').length) {
            this.$model['_hiddenColumnModel'](parents)
        }

        return parents
    } 

    private _valueInRelation (relationModel: TRelationOptions ) {

        this._assertError(
            relationModel?.query instanceof Promise, 
            'The Promise method does not support nested relations.'
        )

        this._assertError(
            !(relationModel?.query instanceof Model), 
            'The callback function only supports instances of the Model class.'
        )

        const relation = relationModel.relation
        const model = relationModel.model
        const modelPivot = relationModel.modelPivot
        const oldVersion = relationModel.oldVersion
        const query = relationModel?.query
        const queryPivot = relationModel?.queryPivot
        const table = relationModel.freezeTable 
            ? relationModel.freezeTable 
            : relationModel.query?.getTableName()

        let pivot = null
  
        const name = relationModel.name
        const as = relationModel.as

        this._assertError(!model || model == null ,'Model not found.' )

        let localKey = this._valuePattern(
            relationModel.localKey 
            ? relationModel.localKey 
            : this.$model['$state'].get('PRIMARY_KEY')
        )

        let foreignKey = relationModel.foreignKey 
            ? relationModel.foreignKey 
            : this._valuePattern([
                `${pluralize.singular(this.$model['getTableName']())}`,
                `${this.$model['$state'].get('PRIMARY_KEY')}`
            ].join('_'))

        const checkTRelationOptionsIsBelongsTo = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation ===  this.$constants('RELATIONSHIP').belongsTo 
        ].every(r => r)
     
        if(checkTRelationOptionsIsBelongsTo) {
            foreignKey = this._valuePattern(localKey)
            localKey =  this._valuePattern([
                `${pluralize.singular(table ?? '')}`,
                `${this.$model['$state'].get('PRIMARY_KEY')}`
            ].join('_'))
        }

        const checkTRelationOptionsIsBelongsToMany = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsToMany
        ].every(r => r)

        if(checkTRelationOptionsIsBelongsToMany) {
            localKey = this._valuePattern([
                `${pluralize.singular(table ?? '')}`,
                `${this.$model['$state'].get('PRIMARY_KEY')}`
            ].join('_'))

            foreignKey = 'id'

            const query = relationModel.query as Model

            const defaultPivot = this._valuePattern([
                pluralize.singular(this.$model['getTableName']()),
                pluralize.singular(query.getTableName())
            ].sort().join('_'))

            pivot = relationModel.pivot || (modelPivot ? new modelPivot().getTableName() : defaultPivot);

        }

        return { 
            name, 
            as, 
            relation, 
            table, 
            localKey, 
            foreignKey, 
            model,
            query, 
            queryPivot,
            pivot , 
            oldVersion,
            modelPivot
        }
    }

    protected _valuePattern (value : string) : string{
        
        const schema : Record<string,Blueprint> | null = this.$model['$state'].get('SCHEMA_TABLE')

        const snakeCase = (str : string) => str.replace(/([A-Z])/g, (v) => `_${v.toLowerCase()}`)

        const camelCase = (str : string) => str.replace(/(.(_|-|\s)+.)/g, (v) => `${v[0]}${v[v.length-1].toUpperCase()}`)

        switch (this.$model['$state'].get('PATTERN')) {

            case this.$constants('PATTERN').snake_case : {

                if(schema == null) {
                    return snakeCase(value)
                }

                const find = schema[value]

                if(find == null || find.column == null ) {
                    return snakeCase(value)
                }

                return find.column
            }

            case this.$constants('PATTERN').camelCase : {

                if(schema == null) {
                    return camelCase(value)
                }

                const find = schema[value]

                if(find == null || find.column == null ) {
                    return camelCase(value)
                }

                return find.column
                
            }

            default : return value
        }
    }

    private _assertError(condition : boolean | string = true , message : string = 'error') : void {

        if(typeof condition === 'string') {
            throw new Error(condition)
        }

        if(condition) throw new Error(message)

        return
    }
}

export { RelationHandler }
export default RelationHandler