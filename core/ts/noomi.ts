import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticLoader} from "./staticloader";
import {NoomiHttp} from "./noomihttp";
import { AopFactory } from "./aopfactory";
class noomi{
    constructor(port){
        const mdlPath = require('path');
        this.init(mdlPath.join(process.cwd(),'config'));
        const http = require("http");
        const url = require("url");
        const querystring = require("querystring");
        http.createServer((req,res)=>{
            let path = url.parse(req.url).pathname;
            const paramstr = url.parse(req.url).query;
            const params = querystring.parse(paramstr);
            let re = RouteFactory.handleRoute(path,params);
            if(re){
                re.then((result)=>{ //正常返回
                    NoomiHttp.writeDataToClient(res,{
                        data:result,
                        charset:'utf8'
                    });        
                },(err)=>{  //异常返回
                    NoomiHttp.writeDataToClient(res,{
                        data:{success:false,msg:err},
                        charset:'utf8'
                    });
                });
            }else{ //静态资源判断
                //判断是否在static包含目录中
                
            }
        }).listen(port);
    }

    /**
     * 初始化
     */
    init(basePath:string){
        const fs = require('fs');
        let iniJson:object = null;
        const path = require('path');
        try{
            let iniStr = fs.readFileSync(path.resolve('config','noomi.ini'),'utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw e;
        }
        
        //上下文初始化
        if(iniJson.hasOwnProperty('contextpath')){
            let ctxPath = iniJson['contextpath'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(path.resolve('config',ctxPath),iniJson['modulepath']);
            }
        }

        //路由初始化
        if(iniJson.hasOwnProperty('routepath')){
            let rPath = iniJson['routepath'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(path.resolve('config',rPath));
            }
        }

        //aop初始化
        if(iniJson.hasOwnProperty('aoppath')){
            let rPath = iniJson['aoppath'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadAop(path.resolve('config',rPath));
            }
        }
    }

    /**
     * 加载context
     * @param path 
     */
    loadCtx(path:string,mdlPath:string){
        InstanceFactory.parseFile(path,mdlPath);
    }

    /**
     * 加载路由
     * @param path 
     */
    loadRoute(path:string){
        RouteFactory.parseFile(path);
    }

    loadAop(path:string){
        AopFactory.parseFile(path);
    }
}

export {noomi};
