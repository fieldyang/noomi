import { IncomingMessage } from "http";
import { resolve } from "path";
import { UploadTool } from "./uploadtool";

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
    async initFormData(req:IncomingMessage):Promise<any>{
        const MAXBUFFER:number = 50000000;            //最大form缓冲去大小
        if(this.getHeader('method') !== 'POST'){
            Promise.resolve();
        }
        //不能大于max size
        let contentLen:number = parseInt(this.getHeader('content-length'));
        if(contentLen > UploadTool.maxSize){
            return Promise.reject( "上传内容大小超出限制");
        }

        return UploadTool.handleStream(req);

        /*return new Promise((resolve,reject)=>{
            const type = this.getHeader('content-type');
            //是否上传标志（根据浏览器form元素配置，也可能没上传文件）
            let saveToFile:boolean = contentLen > MAXBUFFER;
            const fsMdl = require('fs');
            const pathMdl = require('path');
            const uuidMdl = require('uuid');
            
            //文件路径
            let filePath:string;
            let fileHandler:number;
            let chunks:Array<Buffer>;
            
            if(saveToFile){
                filePath = pathMdl.resolve(process.cwd(),UploadTool.tmpDir,uuidMdl.v1());
                fileHandler = fsMdl.openSync(filePath,'a');
            }else{
                chunks = new Array();
            }
            
            
            
            let num:number = 0;
            //数据项分割位置
            let dispositions:Array<number> = [];
            //行结束位置
            let rowEnds:Array<number> = [];
            let index = 0;
            const fs = require('fs');
            const path = require('path');
            
            req.on("data",async chunk=>{
                //文件存储
                if(saveToFile){
                    await FileTool.writeFile(fileHandler,chunk,'binary');
                }else{
                    chunks.push(chunk);
                    num += chunk.length;
                }
            });
            //数据传输结束
            req.on('end',()=>{
                if(saveToFile){

                }else{
                    UploadTool.handleBuffer(Buffer.concat(chunks,num));
                }
            });
            req.on('error',err=>{

            });
        });*/
        
    }

    
}

export{HttpRequest};