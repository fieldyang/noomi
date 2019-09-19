import { IncomingMessage } from "http";

class HttpRequest extends IncomingMessage{
    req:IncomingMessage;
    parameters:Map<string,any> = new Map();
    
    
    /**
     * 处理参数
     */
    handleParameters(){

    }

    /**
     * 获取参数
     * @param name 
     */
    getParameter(name:string){
        return this.parameters[name];
    }

    /**
     * 处理表单数据
     */
    handleFormData(){
        let num = 0;
        let chunks = [];
        if(this.headers['method'] !== 'POST'){
            return;
        }
        
    }
}