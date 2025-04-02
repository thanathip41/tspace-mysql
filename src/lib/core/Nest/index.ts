import { Model, Repository } from "..";

const nameOfModel = <M extends Model>(model : new () => M): string  => {
  
  return `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}@Repository`
}

export type NestRepository<M extends Model> =  ReturnType<typeof Repository<M>>

export const NestInject = < M extends Model>( model : string | (new () => M)) => {
  return typeof model === 'string' 
    ? model 
    : nameOfModel(model)
}

export const NestProvider = <M extends Model>(
  model : new () => M,  
  options: { 
    pattern ?: 'repository' | 'model' 
  } = { pattern: 'repository' }
) => {
  return { 
    provide: nameOfModel(model), 
    useValue: options.pattern === 'repository'
      ? Repository<M>(model) as unknown
      : new Model()
  }
}