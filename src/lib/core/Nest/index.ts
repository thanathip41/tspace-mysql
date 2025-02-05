import { Model, Repository, TypeOfRepository } from "..";

const nameOfModel = <M extends Model>(model : new () => M): string  => {
  
  return `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}@Repository`
}

export type NestRepository<M extends Model> =  ReturnType<typeof Repository<M>>

export const NestInject = < M extends Model>( model : string | (new () => M)) => {
  return typeof model === 'string' 
    ? model 
    : nameOfModel(model)
}

export const NestProvider = <M extends Model>(model : new () => M) => {
  return { 
    provide: nameOfModel(model), 
    useValue:  Repository<M>(model) as unknown
  }
}