import { Model } from '../Model'
abstract class AbstractView<TS extends Record<string, any> = any,TR = unknown> extends Model<TS,TR> {
    protected abstract createView ({ name, expression, synchronize }: { 
        name?: string; 
        expression: string;  
        synchronize?: boolean
    }): void
}

export { AbstractView }
export default AbstractView
