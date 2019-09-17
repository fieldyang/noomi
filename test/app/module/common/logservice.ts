class LogService{
    static logPath:string = null;
    static writeLog(content){
        if(this.logPath === null){
            const path = require('path');
            this.logPath = path.resolve(process.cwd(),'log.out');
        }
        
    }
}