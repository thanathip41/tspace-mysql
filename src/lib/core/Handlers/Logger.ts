class LoggerHandler {

  private SELF : Record<string,any>
  private PROP : string = ''
  constructor(self: Record<string,any> , prop : string ) {
    this.SELF = self
    this.PROP = prop
    return this.initialize()
  }

  private initialize () {
    
    if(this.SELF == null) return

    const runing = this.SELF[this.PROP]
  
    if(runing == null) return
  
    const _function = typeof runing
  
    if(_function !== 'function')  return
  
    if(this.SELF.$logger == null) return
  
    const ignores = [
      'table',
      'hasOne',
      'belongsTo',    
      'hasMany', 
      'belongsToMany',
      'constructor',
      'boot',
      'define'
    ]
  
    const _use = this.PROP.substring(0,3) !== 'use'
  
    const _private = this.PROP.charAt(0) !== '_'
  
    const _setter = this.PROP.charAt(0) !== '$'
  
    const _ignore = ignores.indexOf(this.PROP) === -1
  
    const conditions = [
      _use, 
      _private, 
      _ignore, 
      _setter
    ].every((data : boolean) => data === true)
    
    if(!conditions) return
  
    return this.SELF.$logger?.set(this.PROP)
  }
}

export { LoggerHandler }
export default LoggerHandler