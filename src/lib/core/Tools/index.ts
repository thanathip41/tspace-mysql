class Tools {
    static import(name : string) {
        try {
            return require(name)
        }
        catch (err) {
            throw new Error(`The package '${name}' does not exist. Please try installing the package using : npm install ${name} --save`)
        }
    }
}

export { Tools }
export default Tools