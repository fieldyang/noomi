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
        this.port = port || 3000;
        configPath = configPath || '/config';
        App.configPath = configPath;
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
            iniJson = App.JSON.parse(iniStr);
        }catch(e){
            throw new NoomiError("1001") +'\n' +  e;
        }

        if(iniJson === null){
            throw new NoomiError("1001");
        }

        //异常
        ErrorFactory.language = iniJson['language'] || 'zh';  //默认中文
        ErrorFactory.init();

        //redis初始化
        if(iniJson.hasOwnProperty('redis')){
            console.log('redis初始化...');
            let cfg = iniJson['redis'];
            if(typeof cfg === 'object'){  //配置为对象
                RedisFactory.init(cfg);    
            }else{          //配置为路径
                RedisFactory.parseFile(App.path.join(basePath,cfg));
            }
            console.log('redis初始化完成！');
        }
        
        //web config
        if(iniJson.hasOwnProperty('web')){
            console.log('web初始化...');
            let cfg = iniJson['web'];
            if(typeof cfg === 'object'){  //配置为对象
                WebConfig.init(cfg);    
            }else{          //配置为路径
                WebConfig.parseFile(App.path.join(basePath,cfg));
            }
            console.log('web初始化完成！');
        }

        //实例初始化
        if(iniJson.hasOwnProperty('instance')){
            console.log('实例工厂初始化...');
            let cfg = iniJson['instance'];
            InstanceFactory.init(App.path.join(basePath,cfg));
            console.log('实例工厂初始化完成！');
        }

        //filter初始化
        if(iniJson.hasOwnProperty('filter')){
            console.log('过滤器初始化...');
            let cfg = iniJson['filter'];

            if(typeof cfg === 'object'){  //配置为对象
                FilterFactory.init(cfg);    
            }else{          //配置为路径
                FilterFactory.parseFile(App.path.join(basePath,cfg));
            }
            console.log('过滤器初始化完成！');
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route')){
            console.log('路由工厂初始化...');
            let cfg = iniJson['route'];
            if(typeof cfg === 'object'){  //配置为对象
                RouteFactory.init(cfg);    
            }else{          //配置为路径
                RouteFactory.parseFile(App.path.join(basePath,cfg));
            }
            
            console.log('路由工厂初始化完成！');
        }

        //数据源初始化
        if(iniJson.hasOwnProperty('database')){
            console.log('数据源初始化...');
            let cfg = iniJson['database'];

            if(typeof cfg === 'object'){  //配置为对象
                DBManager.init(cfg);    
            }else{          //配置为路径
                DBManager.parseFile(App.path.join(basePath,cfg));
            }
            
            console.log('数据源初始化完成！');
        }
        
        //aop初始化
        if(iniJson.hasOwnProperty('aop')){
            console.log('aop初始化...');
            let cfg = iniJson['aop'];
            if(typeof cfg === 'object'){  //配置为对象
                AopFactory.init(cfg);    
            }else{          //配置为路径
                AopFactory.parseFile(App.path.join(basePath,cfg));
            }
            
            console.log('aop初始化完成！');
        }

        //security初始化
        if(iniJson.hasOwnProperty('security')){
            console.log('security初始化...');
            let cfg = iniJson['security'];
            if(typeof cfg === 'object'){  //配置为对象
                await SecurityFactory.init(cfg);    
            }else{          //配置为路径
                await SecurityFactory.parseFile(App.path.join(basePath,cfg));
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
    return new Noomi(port,contextPath);
}
export {noomi};
