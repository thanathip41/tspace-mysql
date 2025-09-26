import "reflect-metadata";
import { Model, Repository } from "..";
export class Nest {
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
   * import { Nest } from 'tspace-mysql';
   * import { User } from './entities/user.entity'
   *
   * @Module({
   *   controllers: [AppController],
   *   providers: [AppService, Nest.Provider(User)] // register this
   * })
   * 
   * export class AppModule {}
   * ```
   */
  public static Provider = <M extends Model>(
    model : new () => M,  
    options: { 
      pattern ?: 'repository' | 'model' 
    } = { pattern: 'repository' }
  ): { provide: string; useValue: unknown; } => {
    return { 
      provide: this._paramToken(model), 
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
   * import { Nest, T } from 'tspace-mysql'
   * class User extends Model {}
   *
   * class UserService {
   *   constructor(
   *      @Nest.InjectRepository(User) 
   *      private readonly userRepo: T.Repository<User>
   *   ) {}
   * }
   * ```
   */
  public static InjectRepository = <M extends Model>(model: new () => M): Function => {
    return (target: object, _: unknown, index: number) => {
      const meta = Reflect.getMetadata('self:paramtypes', target) || [];
      const param = this._paramToken(model);
      const dependencies = [...meta, { index, param }];
      Reflect.defineMetadata('self:paramtypes', dependencies, target);
    };
  };

  private static _nameOfModel = <M extends Model>(model : new () => M): string  => {
    return `${new model().constructor?.name ?? Math.random().toString(36).slice(2)}@Repository`
  }

  private static _paramToken = < M extends Model>( model : string | (new () => M)) => {
    return typeof model === 'string' 
      ? model 
      : this._nameOfModel(model)
  }
}