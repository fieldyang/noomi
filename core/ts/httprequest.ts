import { IncomingMessage } from "http";
import { resolve } from "path";

class HttpRequest extends IncomingMessage{
    req:IncomingMessage;
    parameters:any = new Object();           //参数
    constructor(req:IncomingMessage){
        super(req.socket);
        this.req = req;
    }

    init(req:IncomingMessage):Promise<any>{
        this.initHeader(req);
        this.initQueryString();
        //非 post
        if(this.getHeader('method') !== 'POST'){
            return Promise.resolve(this.parameters);
        }

        return this.initFormData(req).then(obj=>{
            if(obj){
                Object.getOwnPropertyNames(obj).forEach(key=>{
                    //已存在该key，需要做成数组
                    if(this.parameters.hasOwnProperty(key)){
                        if(!Array.isArray(this.parameters[key])){
                            this.parameters[key] = [this.parameters[key]];
                        }
                        this.parameters[key].push(obj[key]);
                    }else{
                        this.parameters[key] = obj[key];
                    }
                });
            }
            return Promise.resolve(this.parameters);                
        });
    }

    /**
     * 初始化header
     * @param req 
     */
    initHeader(req:IncomingMessage){
        this.headers['method'] = req.method;
        this.headers['url'] = req.url;
        //headers
        Object.getOwnPropertyNames(req.headers).forEach(item=>{
            this.headers[item] = req.headers[item];
        });
    }
    /**
     * 获取header信息
     * @param key       header参数 name
     */
    getHeader(key:string):any{
        return this.headers[key];
    }
    
    /**
     * 
     * @param name 
     */
    setParameter(name:string,value:string){
        this.parameters[name] = value;
    }

    /**
     * 获取参数
     * @param name 
     */
    getParameter(name:string):any{
        return this.parameters[name];
    }

    initQueryString(){
        const urlMdl = require("url");
        let paramStr = urlMdl.parse(this.headers['url']).query;
        if(paramStr === null){
            return;
        }
        paramStr.split('&').forEach(item=>{
            let arr = item.split('=');
            if(arr.length === 2){
                this.parameters[arr[0]] = arr[1];
            }
        });
    }
    
    /**
     * 处理表单数据
     * @param req   request
     * @return      Promise {inputname:value,....}
     */
    initFormData(req:IncomingMessage):Promise<any>{
        if(this.getHeader('method') !== 'POST'){
            Promise.resolve();
        }
        //不能大于10M
        if(parseInt(this.getHeader('content-length')) > 10000000){
            throw "上传内容大小超出限制";
        }

        return new Promise((resolve,reject)=>{
            let chunks:Array<Buffer> = [];
            let num:number = 0;
            //数据项分割位置
            let dispositions:Array<number> = [];
            //行结束位置
            let rowEnds:Array<number> = [];
            
            req.on("data",chunk=>{
                chunks.push(chunk);
                num += chunk.length;
                let ind = -1;
                //字段分隔符
                let reg:RegExp = /Content-Disposition/g;
                let re:RegExpExecArray;
                while((re=reg.exec(chunk)) !== null){
                    dispositions.push(re.index);
                }
                
                //换行符
                for(let i=0;i<chunk.length-1;i++){
                    if (chunk[i]==13&&chunk[i+1]==10) {
                        rowEnds.push(i);
                    }
                }
            });
            //数据传输结束
            req.on("end",()=>{
                let returnObj:any = new Object();;
                //从缓存文件
                let buffer=Buffer.concat(chunks,num);
                let jIndex:number = 0;      //rowEnds 的开始对比序号
                console.log(buffer.toString());    
                for(let i=0;i<dispositions.length;i++){
                    let st:number = dispositions[i];
                    let dataKey:string;         //键
                    for(let j=jIndex;j<rowEnds.length;j++){
                        //分隔符行
                        if(rowEnds[j] > st+10){
                            let tmpStr:string = buffer.toString('utf8',st,rowEnds[j]);
                            let arr:Array<string> = tmpStr.split(';');
                            //数据项
                            dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                            dataKey = dataKey.substring(2,dataKey.length-1);
                            let value:any;
                            if(arr.length === 2){  //文件判断
                                value = buffer.toString('utf8',rowEnds[j+1],rowEnds[j+2]).trim();
                                //值转换为数组
                                if(returnObj.hasOwnProperty(dataKey)){
                                    //新建数组
                                    if(!Array.isArray(returnObj[dataKey])){
                                        returnObj[dataKey] = [returnObj[dataKey]];
                                    }
                                    //新值入数组
                                    returnObj[dataKey].push(value);
                                }else{
                                    returnObj[dataKey] = value;
                                }
                                jIndex = j+2;
                            }
                            break;
                        }
                    }
                }
                resolve(returnObj);
            });

            req.on('error',err=>{

            });
        });
        
    }
}

export{HttpRequest};