import { Model, Repository } from "..";

export type NestRepository<M extends Model> =  ReturnType<typeof Repository<M>>

export const NestInject =< M extends Model>(model : string | (new () => M)) => {
  return (target: object, key: string) => {
     
    const type = typeof model === 'string' 
      ? model 
      : `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}Inject` 

    const getMeta = Reflect.getMetadata('self:properties_metadata', target.constructor) ?? []

    const properties = [...getMeta, { key, type }]

    Reflect.defineMetadata(
      'self:properties_metadata',
      properties,
      target.constructor,
    )
  }
}

export const NestProvider = <M extends Model>(model : new () => M) => {
  return { 
    provide: `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}Repository`, 
    useValue:  Repository<M>(model) as any
  }
}