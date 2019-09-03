import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticResource} from "./staticresource";
import {NoomiHttp} from "./noomihttp";
import { AopFactory } from "./aopfactory";
import { rejects } from "assert";
import { FilterFactory } from "./filterfactory";
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
            this.handleFilter(path,req,res).then(
                //过滤器链正常结束
                (result)=>{  
                    this.resVisit(res,path,params);
                },
                //非正常结束
                (err)=>{

                }
            )
            
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

        //模块路径加入staticresource的禁止访问路径,/开头
        let mdlPath:string = iniJson['module_path'];
        StaticResource.addPath(mdlPath.charAt(0) === '/'?mdlPath:'/' + mdlPath);
        
        //上下文初始化
        if(iniJson.hasOwnProperty('context_path')){
            let ctxPath = iniJson['context_path'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(path.resolve('config',ctxPath),iniJson['module_path']);
            }
        }

        //filter初始化
        if(iniJson.hasOwnProperty('filter_path')){
            let rPath = iniJson['filter_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadAop(path.resolve('config',rPath));
            }
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route_path')){
            let rPath = iniJson['route_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(path.resolve('config',rPath));
            }
        }

        //aop初始化
        if(iniJson.hasOwnProperty('aop_path')){
            let rPath = iniJson['aop_path'];
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

    /**
     * 加载aop配置文件
     * @param path  文件路径
     */
    loadAop(path:string){
        AopFactory.parseFile(path);
    }

    /**
     * 过滤器文件加载
     * @param path  文件路径
     */
    loadFilter(path:string){
        FilterFactory.parseFile(path);
    }

    /**
     * 设置禁止访问路径（静态资源）
     * @param dirPath 
     */
    setForbiddenPath(dirPath:string){
        StaticResource.addPath(dirPath);
    }

    /**
     * 过滤器处理
     */
    handleFilter(url:string,request:any,response:any):any{
        let arr:Array<string> = FilterFactory.getFilterChain(url);
        if(arr.length === 0){
            Promise.resolve();
            return;
        }
        let filters:Array<any> = [];
        //根据过滤器名找到过滤器实例
        arr.forEach(item=>{
            let filter = InstanceFactory.getInstance(item);
            if(filter !== null){
                filters.push(filter);
            }
        });

        //链式执行
        
    }

    /**
     * 资源访问
     * @param res       response 
     * @param path      url路径
     * @param params    参数
     */
    resVisit(res:any,path:string,params:object){
        let re = RouteFactory.handleRoute(path,params);
        if(re){
            re.then((result)=>{ //正常返回
                NoomiHttp.writeDataToClient(res,{
                    data:result,
                    charset:'utf8',
                    statusCode:200,
                    type:'text/html'
                });        
            },(err)=>{  //异常返回
                NoomiHttp.writeDataToClient(res,{
                    data:{success:false,msg:err},
                    charset:'utf8',
                    statusCode:200,
                    type:'text/html'
                });
            });
        }else{ //静态资源判断
            new Promise((resolve,reject)=>{
                StaticResource.load(path,resolve,reject);
            }).catch((err)=>{
                return Promise.reject(err);
                
            }).then((re:any)=>{
                // NoomiHttp.writeFileToClient(res,re.file,re.type);
                NoomiHttp.writeDataToClient(res,{
                    data:re.file,
                    type:re.type,
                    charset:'utf8',
                    statusCode:200
                });
            },(errCode)=>{
                NoomiHttp.writeDataToClient(res,{
                    data:'',
                    charset:'utf8',
                    type:'text/html',
                    statusCode:errCode
                });
            });
        }
    }
}

export {noomi};
