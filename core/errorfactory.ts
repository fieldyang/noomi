class ErrorFactory{
    static errMap:Map<string,string> = new Map();

    /**
     * 获取异常
     * @param errNo     异常码
     */
    static getError(errNo:string,param?:Array<any>){
        //默认为未知错误
        if(!this.errMap.has(errNo)){
            errNo = "0000";   
        }
        let msg = this.errMap.get(errNo);
        let reg = /\$\{.+?\}/g;
        let r;
        //处理消息中的参数
        while((r=reg.exec(msg)) !== null){
            let index = r[0].substring(2,r[0].length-1).trim();
            if(index && index !== ''){
                index = parseInt(index);
            }
            msg = msg.replace(r[0],param[index]);
        }
        return {
            errCode:errNo,
            message:msg
        }
    }
    /**
     * 异常文件解析
     * @param path 
     */
    static parseFile(path:string){

    }
}

export {ErrorFactory}