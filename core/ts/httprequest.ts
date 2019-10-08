import { IncomingMessage, ServerResponse, ClientRequest } from "http";
import { UploadTool } from "./uploadtool";
import { SessionFactory, Session } from "./sessionfactory";
import { HttpResponse } from "./httpresponse";

class HttpRequest extends IncomingMessage{
    srcReq:IncomingMessage;             //源request
    response:HttpResponse;            //response
    parameters:any = new Object();      //参数
    
    constructor(req:IncomingMessage,res:ServerResponse){
        super(req.socket);
        this.srcReq = req;
        //response 初始化
        this.response = new HttpResponse(req);
        this.response.init(this,res);

        this.url = req.url;
        this.method = req.method;
        this.initQueryString();
    }

    /**
     * 初始化
     * @return     promise
     */
    async init(){
        //非 post
        if(this.method !== 'POST'){
            return this.parameters;
        }
        let obj = await UploadTool.formHandle(this.srcReq);;
        if(typeof obj === 'object'){
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
        return this.parameters;
    }

    /**
     * 获取header信息
     * @param key       header参数 name
     */
    getHeader(key:string):any{
        return this.srcReq.headers[key];
    }

    /**
     * 获取请求方法
     */
    getMethod():string{
        return this.srcReq.method;
    }

    /**
     * 获取来源url路径
     */
    getUrl():string{
        return this.srcReq.url;
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
     * 获取所有paramter
     * @return          parameter object
     */
    getAllParameter():any{
        return this.parameters;
    }

    /**
     * 初始化url查询串
     */
    initQueryString(){
        this.parameters = require('querystring').parse(require("url").parse(this.url).query);
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

export{HttpRequest}