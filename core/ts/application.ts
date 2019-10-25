class App{
    static asyncHooks = require('async_hooks');
    static getHook(){
        return this.asyncHooks;
    }
}

export{App}