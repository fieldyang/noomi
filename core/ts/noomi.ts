import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticResource} from "./staticresource";
import { AopFactory } from "./aopfactory";
import { FilterFactory } from "./filterfactory";
import { PageFactory } from "./pagefactory";
import { SessionFactory } from "./sessionfactory";
import { UploadTool } from "./uploadtool";
import { HttpRequest } from "./httprequest";
import { Server } from "net";
import { OrmFactory } from "./ormfactory";
import { SecurityFactory } from "./securityfactory";
import { HttpResponse } from "./httpresponse";
import { IncomingMessage, ServerResponse } from "http";
import { RedisFactory } from "./redisfactory";
class noomi{
    port:number=3000;
    server:Server;
    constructor(port:number,pre?:Function){
        if(pre && pre instanceof Function){
            pre.call(this);
        }
        if(typeof port === 'number'){
            this.port = port;
        }
        this.init('config');
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
            let iniStr = fs.readFileSync(path.join(process.cwd(),basePath,'noomi.ini'),'utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw e;
        }

        //session工厂初始化
        if(iniJson.hasOwnProperty('session')){
            SessionFactory.init(iniJson['session']);    
        }
        
        //系统参数初始化
        if(iniJson.hasOwnProperty('upload')){
            UploadTool.init(iniJson['upload']);
        }

        //模块路径加入staticresource的禁止访问路径,/开头
        let mdlPath:string = iniJson['module_path'];

        //添加模块路径为静态资源禁止访问路径
        StaticResource.addPath(mdlPath.charAt(0) === '/'?mdlPath:'/' + mdlPath);
        
        //上下文初始化
        if(iniJson.hasOwnProperty('context_path')){
            console.log('实例工厂初始化...');
            let ctxPath = iniJson['context_path'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(path.join(basePath,ctxPath),iniJson['module_path']);
            }
            console.log('实例工厂初始化完成！');
        }
        

        //filter初始化
        if(iniJson.hasOwnProperty('filter_path')){
            console.log('过滤器初始化...');
            let rPath = iniJson['filter_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadFilter(path.join(basePath,rPath));
            }
            console.log('过滤器初始化完成！');
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route_path')){
            console.log('路由工厂初始化...');
            let rPath = iniJson['route_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(path.join(basePath,rPath));
            }
            console.log('路由工厂初始化完成！');
        }

        //aop初始化
        if(iniJson.hasOwnProperty('aop_path')){
            console.log('aop初始化...');
            let rPath = iniJson['aop_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadAop(path.join(basePath,rPath));
            }
            console.log('aop初始化完成！');
        }

        //orm初始化
        if(iniJson.hasOwnProperty('orm_path')){
            console.log('orm初始化...');
            let rPath = iniJson['orm_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadOrm(path.join(basePath,rPath));
            }
            console.log('orm初始化完成！');
        }

        //security初始化
        if(iniJson.hasOwnProperty('security_path')){
            console.log('security初始化...');
            let rPath = iniJson['security_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadSecurity(path.join(basePath,rPath));
            }
            console.log('security初始化完成！');
        }

        //orm初始化
        if(iniJson.hasOwnProperty('redis_path')){
            console.log('redis初始化...');
            let rPath = iniJson['redis_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRedis(path.join(basePath,rPath));
            }
            console.log('redis初始化完成！');
        }
        //errorPage
        if(iniJson.hasOwnProperty('error_page')){
            this.setErrorPages(iniJson['error_page']);
        }
        
        const http = require("http");
        this.server = http.createServer((req:IncomingMessage,res:ServerResponse)=>{
            this.resVisit(new HttpRequest(req,res));
        }).listen(this.port,(e)=>{
            console.log(`服务启动成功，端口${this.port}已监听！！！`);
        }).on('error',(err)=>{
            if (err.code === 'EADDRINUSE') {
                console.log('地址正被使用，重试中...');
                //1秒后重试
                setTimeout(() => {
                  this.server.close();
                  this.server.listen(this.port);
                }, 1000);
            }
        }).on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });;
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
     * 加载orm配置文件
     * @param path  文件路径
     */
    loadOrm(path:string){
        OrmFactory.parseFile(path);
    }

    /**
     * 过滤器文件加载
     * @param path  文件路径
     */
    loadFilter(path:string){
        FilterFactory.parseFile(path);
    }

     /**
     * 加载security配置文件
     * @param path  文件路径
     */
    loadSecurity(path:string){
        SecurityFactory.parseFile(path);
    }

    /**
     * 加载redis配置文件
     * @param path  文件路径
     */
    loadRedis(path:string){
        RedisFactory.parseFile(path);
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
     * @param request   request
     * @param path      url路径
     */
    resVisit(request:HttpRequest){
        let path = require('url').parse(request.url).pathname;
        if(path === ''){
            return;
        }
        //获得路由，可能没有，则归属于静态资源
        let route = RouteFactory.getRoute(path);
        //路由资源
        if(route !== null){
            //参数
            request.init().then((params)=>{
                //过滤器执行
                //过滤器
                this.handleFilter(path,request,request.response).then((r)=>{
                    if(r){
                        //路由调用
                        RouteFactory.handleRoute(route,params,request,request.response);
                    }
                });
            });    
        }else{ //静态资源
            new Promise((resolve,reject)=>{
                StaticResource.load(path,resolve,reject);
            }).catch((err)=>{
                return Promise.reject(err);
            }).then((re:any)=>{
                request.response.writeToClient({
                    data:re.file,
                    type:re.type
                });
            },(errCode)=>{
                //存在异常页，直接跳转，否则回传404
                let page = PageFactory.getErrorPage(errCode);
                if(page){
                    request.response.redirect(page);
                }else{
                    request.response.writeToClient({
                        statusCode:errCode
                    });
                }
            });
        }
    }

    /**
     * 添加应用初始化之前执行的方法
     */
    addPreInit(foo:Function){
        foo.call(this);
    }
}

export {noomi};
