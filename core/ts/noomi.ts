import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticResource} from "./staticresource";
import { AopFactory } from "./aopfactory";
import { FilterFactory } from "./filterfactory";
import { HttpRequest } from "./httprequest";
import { Server } from "net";
import { SecurityFactory } from "./securityfactory";
import { IncomingMessage, ServerResponse } from "http";
import { RedisFactory } from "./redisfactory";
import { NoomiError,ErrorFactory } from "./errorfactory";
import { WebConfig } from "./webconfig";
import { RequestQueue } from "./requestqueue";
import { DBManager } from "./database/dbmanager";
import { App } from "./application";


class Noomi{
    port:number=3000;
    server:Server;
    constructor(port?:number,configPath?:string){
        this.port = port || 8255;
        configPath = configPath || '/config';
        this.init(configPath);
    }

    /**
     * 初始化
     */
    async init(basePath:string){
        console.log('服务启动中...');
        let iniJson:object = null;
        try{
            let iniStr = App.fs.readFileSync(App.path.join(process.cwd(),basePath,'noomi.ini'),'utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw new NoomiError("1001") + e;
        }

        if(iniJson === null){
            throw new NoomiError("1001");
        }

        //异常
        ErrorFactory.language = iniJson['language'] || 'zh';  //默认中文
        ErrorFactory.init();


        //redis初始化
        if(iniJson.hasOwnProperty('redis_path')){
            console.log('redis初始化...');
            let rPath = iniJson['redis_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                RedisFactory.parseFile(App.path.join(basePath,rPath));
            }
            console.log('redis初始化完成！');
        }
        
        //forbidden path
        if(iniJson.hasOwnProperty('forbidden_path')){
            StaticResource.addPath(iniJson['forbidden_path']);
        }

        //web config
        if(iniJson.hasOwnProperty('web_path')){
            console.log('web初始化...');
            let rPath = iniJson['web_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                WebConfig.parseFile(App.path.join(basePath,rPath));
            }
            console.log('web初始化完成！');
        }

        //实例初始化
        if(iniJson.hasOwnProperty('instance_path')){
            console.log('实例工厂初始化...');
            let ctxPath = iniJson['instance_path'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                InstanceFactory.init(App.path.join(basePath,ctxPath));
            }
            console.log('实例工厂初始化完成！');
        }

        //filter初始化
        if(iniJson.hasOwnProperty('filter_path')){
            console.log('过滤器初始化...');
            let rPath = iniJson['filter_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                FilterFactory.parseFile(App.path.join(basePath,rPath));
            }
            console.log('过滤器初始化完成！');
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route_path')){
            console.log('路由工厂初始化...');
            let rPath = iniJson['route_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                RouteFactory.parseFile(App.path.join(basePath,rPath));
            }
            console.log('路由工厂初始化完成！');
        }

        //数据源初始化
        if(iniJson.hasOwnProperty('db_path')){
            console.log('数据源初始化...');
            let rPath = iniJson['db_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                DBManager.parseFile(App.path.join(basePath,rPath));
            }
            console.log('数据源初始化完成！');
        }
        
        //aop初始化
        if(iniJson.hasOwnProperty('aop_path')){
            console.log('aop初始化...');
            let rPath = iniJson['aop_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                AopFactory.parseFile(App.path.join(basePath,rPath));
            }
            console.log('aop初始化完成！');
        }

        //security初始化
        if(iniJson.hasOwnProperty('security_path')){
            console.log('security初始化...');
            let rPath = iniJson['security_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                await SecurityFactory.parseFile(App.path.join(basePath,rPath));
            }
            console.log('security初始化完成！');
        }

        //超过cpu最大使用效率时处理
        process.on('SIGXCPU',()=>{
            //请求队列置false
            RequestQueue.setCanHandle(false);
        });
        
        //创建server
        this.server = App.http.createServer((req:IncomingMessage,res:ServerResponse)=>{
            // RequestQueue.add(new HttpRequest(req,res));
            RequestQueue.handleOne(new HttpRequest(req,res));
        }).listen(this.port,(e)=>{
            console.log(`服务启动成功，端口${this.port}已监听！！！`);
            //启动队列执行
            // RequestQueue.handle();
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
        });
    }
}

function noomi(port?:number,contextPath?:string){
    new Noomi(port,contextPath);
}
export {noomi};
