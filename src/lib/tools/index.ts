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
            
            throw new Error(`The package 'dotenv' is either not supported or not found. Please ensure you are running in a Node.js environment or try installing it with : npm install dotenv --save`)
        }
    }
}

export { Tool }
export default Tool