declare const utils: {
    consoleDebug: (debug?: string) => void;
    faker: (value: string) => string | number | boolean;
    columnRelation: (name: string) => string;
    timestamp: () => string;
    date: () => string;
    escape: (str: any) => any;
    isSubQuery: (subQuery: string) => boolean;
    generateUUID: () => string;
    covertBooleanToNumber: (data: any) => any;
    snakeCase: (data: any) => any;
    camelCase: (data: any) => any;
    randomString: (length?: number) => string;
    hookHandle: (hooks: Function[], result: any[] | null) => Promise<void>;
};
export { utils };
export default utils;
