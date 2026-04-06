class Package {
    static import(name : string) {
        try {
            return require(name)
        }
        catch (err:any) {
            throw new Error(`The package '${name}' caused by '${err.message}'. Please try installing the package using : npm install ${name} --save`)
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

        } catch (err:any) {
            
            throw new Error(`The package 'dotenv' caused by '${err.message}'. Please try installing the package using : npm install dotenv --save`)
        }
    }

    static get redis () {
        try {

            const redis = require('redis') // redis@5.6.0+

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
}

export { Package }
export default Package