import "reflect-metadata";

import { Model, Repository } from "..";

const nameOfModel = <M extends Model>(model : new () => M): string  => {
  
  return `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}@Repository`
}

const Inject = < M extends Model>( model : string | (new () => M)) => {
  return typeof model === 'string' 
    ? model 
    : nameOfModel(model)
}

/**
 * Factory function for creating a provider definition for a given model.
 *
 * This utility helps register either a repository instance or a model instance
 * with a dependency injection system (e.g. NestJS). It returns an object
 * compatible with DI containers expecting `{ provide, useValue }`.
 *
 * @template M - The type of the model extending `Model`.
 * @param {Model} model - The constructor function of the model to provide.
 * @param {{ pattern?: 'repository' | 'model' }} [options={ pattern: 'repository' }]
 * The provider options:
 * - `pattern: 'repository'` (default) → provide a repository wrapper for the model.
 * - `pattern: 'model'` → provide a direct model instance.
 *
 * @returns {{ provide: string; useValue: unknown }}
 * The provider definition object containing:
 * - `provide`: The injection token, derived from the model name.
 * - `useValue`: The repository or model instance.
 *
 * @example
 * ```ts
 * // src/app.module.ts;
 * 
 * import { Module } from '@nestjs/common';
 * import { AppController } from './app.controller';
 * import { AppService } from './app.service';
 * import { Provider } from 'tspace-mysql';
 * import { User } from './entities/user.entity'
 *
 * @Module({
 *   controllers: [AppController],
 *   providers: [AppService, Provider(User)] // register this
 * })
 * 
 * export class AppModule {}
 * ```
 *
 * @remarks
 * - Uses `nameOfModel(model)` as the provider token.
 * - If `pattern` is `'repository'`, wraps the model with `Repository<M>(model)`.
 * - If `pattern` is `'model'`, creates a new instance of the model.
 */
export const Provider = <M extends Model>(
  model : new () => M,  
  options: { 
    pattern ?: 'repository' | 'model' 
  } = { pattern: 'repository' }
): { provide: string; useValue: unknown; } => {
  return { 
    provide: nameOfModel(model), 
    useValue: options.pattern === 'repository'
      ? Repository<M>(model) as unknown
      : new Model()
  }
}

/**
 * Parameter decorator factory for injecting a repository of a given model.
 *
 * This decorator is designed to work with dependency injection systems (e.g. NestJS).
 * It records metadata about constructor parameter dependencies so they can later
 * be resolved and injected automatically.
 *
 * @template M - The type of the model extending `Model`.
 * @param {Model} model - The constructor function of the model to inject.
 * @returns {Function} 
 * A parameter decorator function that attaches repository injection metadata.
 *
 * @example
 * ```ts
 * import { InjectRepository, T } from 'tspace-mysql'
 * class User extends Model {}
 *
 * class UserService {
 *   constructor(
 *      @InjectRepository(User) 
 *      private readonly userRepo: T.Repository<User>
 *   ) {}
 * }
 * ```
 *
 * @remarks
 * - Uses `Reflect.getMetadata` and `Reflect.defineMetadata` under the key `'self:paramtypes'`.
 * - Wraps the `NestInject` of the model to generate the injection parameter metadata.
 */
export const InjectRepository = <M extends Model>(model: new () => M): Function => {
  return (target: object, _: unknown, index: number) => {
    const meta = Reflect.getMetadata('self:paramtypes', target) || [];
    const param = Inject(model);
    const dependencies = [...meta, { index, param }];
    Reflect.defineMetadata('self:paramtypes', dependencies, target);
  };
};