import DB from './DB';
import Model from './Model';
import Schema from './Schema';
import Blueprint from './Blueprint';
import Pool from '../connection';
export { DB };
export { Model };
export { Schema };
export { Blueprint };
export { Pool };
export * from './Decorator';
declare const _default: {
    DB: typeof DB;
    Model: typeof Model;
    Schema: typeof Schema;
    Blueprint: typeof Blueprint;
    Pool: import("../Interface").Connection;
};
export default _default;
