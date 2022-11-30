declare const utils: {
    consoleDebug: (debug?: string) => void;
    faker: (value: string) => string | number | boolean;
    columnRelation: (name: string) => string;
    timestamp: () => string;
    date: () => string;
    escape: (str: any) => any;
    escapeSubQuery: (str: any) => any;
    generateUUID: () => string;
    covertBooleanToNumber: (data: any) => any;
    snakeCase: (obj: any) => any;
    camelCase: (obj: any) => any;
};
export { utils };
export default utils;
