import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticResource} from "./staticresource";
import {NoomiHttp} from "./noomihttp";
import { AopFactory } from "./aopfactory";
import { FilterFactory } from "./filterfactory";
import { PageFactory } from "./pagefactory";
import { SessionFactory } from "./sessionfactory";
import { UploadTool } from "./uploadtool";
import { Http2ServerRequest } from "http2";
import { HttpRequest } from "./httprequest";
class noomi{
    constructor(port){
        const mdlPath = require('path');
        this.init(mdlPath.join(process.cwd(),'config'));
        const http = require("http");
        const url = require("url");
        http.createServer((req,res)=>{
            let path = url.parse(req.url).pathname;
            let request = new HttpRequest(req);
            // this.handleUpload(req,res);
            request.init(req).then((params)=>{
                //过滤器执行
                this.handleFilter(path,request,res).then((r)=>{
                    if(r){
                        this.resVisit(req,res,path,params);
                    }
                });
                
            });  
        }).listen(port);
    }

    /**
     * 初始化
     */
    init(basePath:string){
        console.log('服务启动中...');
        const fs = require('fs');
        let iniJson:object = null;
        const path = require('path');

        try{
            let iniStr = fs.readFileSync(path.resolve('config','noomi.ini'),'utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw e;
        }

        //系统参数初始化
        if(iniJson.hasOwnProperty('sys_cfg')){
            UploadTool.init(iniJson['sys_cfg']);
        }

        //模块路径加入staticresource的禁止访问路径,/开头
        let mdlPath:string = iniJson['module_path'];

        //添加模块路径为静态资源禁止访问路径
        StaticResource.addPath(mdlPath.charAt(0) === '/'?mdlPath:'/' + mdlPath);
        
        //session工厂初始化
        if(iniJson.hasOwnProperty('session')){
            SessionFactory.init(iniJson['session']);    
        }
        
        //上下文初始化
        if(iniJson.hasOwnProperty('context_path')){
            console.log('实例工厂初始化...');
            let ctxPath = iniJson['context_path'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(path.resolve('config',ctxPath),iniJson['module_path']);
            }
            console.log('实例工厂初始化完成！');
        }
        

        //filter初始化
        if(iniJson.hasOwnProperty('filter_path')){
            console.log('过滤器初始化...');
            let rPath = iniJson['filter_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadFilter(path.resolve('config',rPath));
            }
            console.log('过滤器初始化完成！');
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route_path')){
            console.log('路由工厂初始化...');
            let rPath = iniJson['route_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(path.resolve('config',rPath));
            }
            console.log('路由工厂初始化完成！');
        }

        //aop初始化
        if(iniJson.hasOwnProperty('aop_path')){
            console.log('aop初始化...');
            let rPath = iniJson['aop_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadAop(path.resolve('config',rPath));
            }
            console.log('aop初始化完成！');
        }

        //errorPage
        if(iniJson.hasOwnProperty('error_page')){
            this.setErrorPages(iniJson['error_page']);
        }

        console.log('服务启动成功！！！');
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
     * 设置异常提示页面
     * @param pages page配置（json数组）
     */
    setErrorPages(pages:Array<any>){
        if(Array.isArray(pages)){
            const fs = require('fs');
            const path = require('path');
            pages.forEach((item)=>{
                //需要判断文件是否存在
                if(fs.existsSync(path.join(process.cwd(),item.location))){
                    PageFactory.addErrorPage(item.code,item.location);
                }
            });
        }
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
    handleFilter(url:string,request:any,response:any):Promise<boolean>{
        return FilterFactory.doChain(url,request,response);
    }

    /**
     * 资源访问
     * @param req       request
     * @param res       response 
     * @param path      url路径
     * @param params    参数
     */
    resVisit(req:any,res:any,path:string,params:object){
        let routeFlag = false;
        //先进行路由处理
        try{
            const util = require('util');
            let re = RouteFactory.handleRoute(path,params,req,res);
            if(re !== undefined){
                routeFlag = true;
                if(util.types.isPromise(re)){ //是否是promise对象
                    re.then((txt)=>{
                        NoomiHttp.writeDataToClient(res,{
                            data:txt
                        });
                    },(err)=>{
                        NoomiHttp.writeDataToClient(res,{
                            data:err
                        });    
                    });
                }else{
                    NoomiHttp.writeDataToClient(res,{
                        data:re
                    });
                }
            }
            
        }catch(e){
            if(e === '1000' || e === '1001'){  //实例或方法不存在
                routeFlag = false;
            }else{
                NoomiHttp.writeDataToClient(res,{
                    data:e
                });
            }
        }
        //路由处理失败,静态资源判断
        if(!routeFlag){
            new Promise((resolve,reject)=>{
                StaticResource.load(path,resolve,reject);
            }).catch((err)=>{
                return Promise.reject(err);
            }).then((re:any)=>{
                NoomiHttp.writeDataToClient(res,{
                    data:re.file,
                    type:re.type
                });
            },(errCode)=>{
                //存在异常页，直接跳转，否则回传404
                let page = PageFactory.getErrorPage(errCode);
                if(page){
                    NoomiHttp.redirect(res,page);
                }else{
                    NoomiHttp.writeDataToClient(res,{
                        statusCode:errCode
                    });
                }
            });
        }
    }
}

export {noomi};
