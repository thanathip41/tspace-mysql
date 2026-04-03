class Tool {
    static import(name : string) {
        try {
            return require(name)
        }
        catch (err) {
            throw new Error(`The package '${name}' does not exist. Please try installing the package using : npm install ${name} --save`)
        }
    }

    static get fs () {
        try {

            const fs = require('fs')

            return {
                existsSync : (v : string) => fs.existsSync(v),
                writeFileSync: (path: string , data : string , options : Record<string,any> = {}) => fs.writeFileSync(path, data, options),
                readdirSync : (path : string , options = { withFileTypes: false }) : any[] => fs.readdirSync(path, options ),
                readFileSync : (path : string , encoding : string) => fs.readFileSync(path, encoding)
            }

        } catch (err) {
            throw new Error(`The package 'fs' is not supported. Please ensure you are running in a Node.js environment.`)
        }
    }

    static get path () {
        try {

            const path = require('path')

            return {
                join    : (...paths: string[]) => path.join(...paths),
                resolve : (...paths: string[]) => {
                    return paths == null || !paths.length 
                    ? path.resolve()
                    : path.resolve(...paths)
                }
            }

        } catch (err) {
            throw new Error(`The package 'path' is not supported. Please ensure you are running in a Node.js environment.`)
        }
    }

    static get dotenv () {
        try {

            const dotenv = require('dotenv')

            return {
                config  : (options : Record<string,any> = {}) => dotenv.config(options), 
            }

        } catch (err) {
            
            throw new Error(Tool._errorMessage('dotenv'));
        }
    }

    static get redis () {
        try {

            const redis = require('redis')

            return {
                createClient: ({ url, socket } : { 
                    url : string, 
                    socket?: {
                        reconnectStrategy: () => boolean
                    }
                }) => {
                    return redis.createClient({ url, socket })
                }
            }

        } catch (err:any) {
            throw new Error(`The package 'redis' caused by '${err.message}'. Please try installing the package using : npm install redis@5.6.0 --save`)
        }
    }

    static get zod() {
        try {
            //@ts-ignore
            return this.import("zod") as typeof import("zod");

        } catch (err) {

            throw new Error(Tool._errorMessage('zod'))
        }
    }

    static get typebox() {
        try {
            //@ts-ignore
            return this.import("@sinclair/typebox") as typeof import("@sinclair/typebox");

        } catch (err) {

            throw new Error(Tool._errorMessage('@sinclair/typebox'))
        }
    }

    private static _errorMessage(lib : string) {
        return [
            `The package '${lib}' is either not supported or not found.`, 
            `Please ensure installing it with : npm install ${lib} --save`
        ].join(' ')
    }
}

export { Tool }
export default Tool