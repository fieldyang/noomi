import { IncomingMessage, ServerResponse } from "http";
import { resolve } from "path";
import { UploadTool } from "./uploadtool";
import { WriteStream } from "tty";
import { SessionFactory, Session } from "./sessionfactory";

class HttpRequest extends IncomingMessage{
    req:IncomingMessage;
    response:ServerResponse;
    parameters:any = new Object();           //参数
    
    constructor(req:IncomingMessage,res:ServerResponse){
        super(req.socket);
        this.req = req;
        this.response = res;
        this.url = req.url;
        this.method = req.method;
    }

    init(req:IncomingMessage):Promise<any>{
        this.initHeader(req);
        this.initQueryString();
        //非 post
        if(this.method !== 'POST'){
            return Promise.resolve(this.parameters);
        }

        return this.initFormData(req).then(obj=>{
            if(obj){
                Object.getOwnPropertyNames(obj).forEach(key=>{
                    //已存在该key，需要做成数组
                    if(this.parameters[key]){
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
        //headers
        // Object.getOwnPropertyNames(req.headers).forEach(item=>{
        //     this.headers[item] = req.headers[item];
        // });
        this.headers = req.headers;
    }
    /**
     * 获取header信息
     * @param key       header参数 name
     */
    getHeader(key:string):any{
        return this.headers[key];
    }
    
    /**
     * 设置参数
     * @param name      参数名
     * @param value     参数值
     */
    setParameter(name:string,value:string){
        this.parameters[name] = value;
    }

    /**
     * 获取参数
     * @param name      参数名
     * @return          参数值
     */
    getParameter(name:string):any{
        return this.parameters[name];
    }

    /**
     * 初始化url查询串
     */
    initQueryString(){
        this.parameters = require('querystring').parse(require("url").parse(this.url).query);
    }
    
    /**
     * 处理表单数据
     * @param req   request
     * @return      Promise {inputname:value,....}
     */
    async initFormData(req:IncomingMessage):Promise<any>{
        const MAXBUFFER:number = 50000000;            //最大form缓冲去大小
        if(this.getHeader('method') !== 'POST'){
            Promise.resolve();
        }
        
        return UploadTool.formHandle(req);
    } 

    /**
     * 获取session
     * @param request   httprequest
     * @return          session
     */
    getSession():Session{
        return SessionFactory.getSession(this);
    }
}

export{HttpRequest};