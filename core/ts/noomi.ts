import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
class noomi{
    constructor(port){
        const http = require("http");
        const url = require("url");
        const querystring = require("querystring");
        http.createServer((req,res)=>{
            let path = url.parse(req.url).pathname;
            const paramstr = url.parse(req.url).query;
            const params = querystring.parse(paramstr);
            console.log(params);
            RouteFactory.handleRoute(path,params);
            /*console.log(__dirname);
            path = __dirname + path;
            noomifs.readFile(path,'binary',(err,file)=>{
                if(err){
                    console.log('not found')
                }else{
                    res.writeHead(200,{
                        'Content-type':'html'
                    });
                    res.write(file,'binary');
                    res.end();
                }
            }*/
        }).listen(port);
    }

    /**
     * 初始化
     */
    init(basePath:string){
        const fs = require('fs');
        let iniJson:object = null;
        try{
            let iniStr = fs.readFileSync(basePath + '/config/noomi.ini','utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw e;
        }

        //上下文初始化
        if(iniJson.hasOwnProperty('contextpath')){
            let ctxPath = iniJson['contextpath'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(basePath + '/' + ctxPath);
            }
        }

        //路由初始化
        if(iniJson.hasOwnProperty('routepath')){
            let rPath = iniJson['routepath'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(basePath + '/' + rPath);
            }
        }
    }

    /**
     * 加载context
     * @param path 
     */
    loadCtx(path:string){
        InstanceFactory.parseFile(path);
    }

    /**
     * 加载路由
     * @param path 
     */
    loadRoute(path:string){
        RouteFactory.parseFile(path);
    }
}

export {noomi};
