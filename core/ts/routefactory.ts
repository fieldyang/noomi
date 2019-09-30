/**
 * route 管理
 */
import {InstanceFactory} from "./instancefactory";
import { HttpRequest } from "./httprequest";
import { ServerResponse } from "http";
import { NoomiHttp } from "./noomihttp";
interface RouteCfg{
    path:string;
    reg:RegExp;
    instanceName:string;
    method:string;
    results?:Array<RouteResult>;
}

/**
 * route 结果
 */
interface RouteResult{
    type?:string;           //类型 redirect重定向，chain路由链（和redirect不同，url不变），json ajax json数据，默认json
    value?:any;             //返回值
    url?:string;            //路径，type 为redirect 和 url时，必须设置
    params?:Array<string>   //参数名数组
}
/**
 * 路由对象
 */
interface Route{
    instance:any;                   //实例
    method:string;                  //方法名
    results?:Array<RouteResult>;    //返回结果
}

class RouteFactory{
    static routes:RouteCfg[] = new Array();
    /**
     * 添加路由
     * @param path      路由路径，支持通配符*，需要method支持
     * @param clazz     对应类
     * @param method    方法，支持{n}
     */
    static addRoute(path:string,clazz:string,method:string,results?:Array<RouteResult>){
        //替换*
        let path1 = path.replace(/\*/g,".*");
        if(results && results.length>0){
            for(let r of results){
                if((r.type === 'jump' || r.type === 'redirect') && (!r.url || typeof r.url !=='string' || (r.url = r.url.trim())=== '')){
                    throw "route配置：result 类型为jump和redirect时，url不能为空";
                }
            }
        }
        let r:RouteCfg = {
            path:path,
            reg:new RegExp('^' + path1 + '$'),
            instanceName:clazz.trim(),
            method:method.trim(),
            results:results
        };
        this.routes.push(r);
    }

    /**
     * 根据路径获取路由
     * @param path      url path
     * @return          {instance:**,method:**,results?:**}
     */
    static getRoute(path:string):Route{
        for(let i=0;i<this.routes.length;i++){
            let item = this.routes[i];
            //路径测试通过
            if(item.reg.test(path)){
                let method = item.method;
                let index = item.path.indexOf("*");
                //通配符处理
                if(index !== -1){
                    //通配符方法
                    method = path.substr(index);
                }
                let instance = InstanceFactory.getInstance(item.instanceName);
                if(instance && method && typeof instance[method] === 'function'){
                    return {instance:instance,method:method,results:item.results};
                }    
                break;
            }
        }
        return null;
    }
    
    /**
     * 处理路径
     * @param pathOrRoute   路径或路由参数
     * @param params        调用参数
     * @param req           httprequest
     * @param res           response
     */
    static handleRoute(pathOrRoute:any,params:object,req:HttpRequest,res:ServerResponse){
        let route:Route;
        if(typeof pathOrRoute === 'string'){
            route = this.getRoute(pathOrRoute);
        }else{
            route = pathOrRoute;
        }
        
        //设置request
        if(typeof route.instance.setRequest === 'function'){
            route.instance.setRequest(req);
        }

        //设置response
        if(typeof route.instance.setResponse === 'function'){
            route.instance.setResponse(res);
        }

        //设置response
        if(typeof route.instance.setModel === 'function'){
            route.instance.setModel(params);
        }
        const util = require('util');
        try{
            let re = route.instance[route.method](params);
            if(util.types.isPromise(re)){  //返回promise
                re.then((data)=>{
                    this.handleResult(res,data,route.instance,route.results);
                }).catch((e)=>{
                    this.handleException(res,e);
                });
            }else{      //直接返回
                this.handleResult(res,re,route.instance,route.results);
            }
        }catch(e){
            this.handleException(res,e);
        }
    }

    /**
     * 处理结果
     * @param res       response
     * @param data      返回值
     * @param instance  路由对应实例
     * @param results   route结果数组    
     */
    static handleResult(res:ServerResponse,data:any,instance:any,results:Array<RouteResult>){
        let find:boolean = false;
        
        if(results && results.length > 0){
            for(let r of results){
                //找到返回值匹配，则不在对比
                if(data && data == r.value){
                    find = true;
                    switch(r.type){
                        case "redirect": //重定向
                            let url = r.url;
                            let pa = [];
                            //参数属性
                            if(r.params && Array.isArray(r.params) && r.params.length>0){
                                for(let pn of r.params){
                                    let v;
                                    if(instance[pn] !== undefined){
                                        v = instance[pn];
                                    }else if(instance.model && instance.model[pn] !== undefined){
                                        v = instance.model.pn;
                                    }
                                    if(v !== undefined){
                                        pa.push(pn+'=' + v);
                                    }
                                    
                                }
                            }
                            let pas:string = pa.join('&');
                            if(pas !== ''){
                                if(url.indexOf('?') === -1){
                                    url += '?' + pas;
                                }else{
                                    url += '&' + pas;
                                }
                            }
                            NoomiHttp.redirect(res,url);
                            return;
                        case "chain": //路由器链
                            let urlMdl = require("url");
                            let url1 = urlMdl.parse(r.url).pathname;
                            let params = require('querystring').parse(urlMdl.parse(r.url).query);
                            
                            //参数处理
                            if(r.params && Array.isArray(r.params) && r.params.length>0){
                                for(let pn of r.params){
                                    let v;
                                    if(instance[pn] !== undefined){
                                        v = instance[pn];
                                    }else if(instance.model && instance.model[pn] !== undefined){
                                        v = instance.model[pn];
                                    }
                                    if(v !== undefined){
                                        params[pn] = v;
                                    }
                                }
                            }
                            const route = this.getRoute(url1);
                            if(route !== null){
                                const util = require('util');
                                //调用
                                try{
                                    let re = route.instance[route.method](params);
                                    if(util.types.isPromise(re)){
                                        re.then(data=>{
                                            this.handleResult(res,data,route.instance,route.results);
                                        }).catch(e=>{
                                            this.handleException(res,e);
                                        });
                                    }else{
                                        this.handleResult(res,re,route.instance,route.results);
                                    }
                                }catch(e){
                                    this.handleException(res,e);
                                }
                            }
                            return;
                    }
                    break;
                }
            }    
        }

        //默认回写json
        if(!find){
            NoomiHttp.writeDataToClient(res,{
                data:data,
                type:'application/json'
            });
        }
    }

    /**
     * 处理异常信息
     * @param res   response
     * @param e     异常
     */
    static handleException(res:ServerResponse,e:any){
        let msg = e.getMessage() || e;
        NoomiHttp.writeDataToClient(res,{
            data:"<h1>route access error!</h1><h3>Error Message:" + msg + "</h3>"
        });
    }
    /**
     * 解析路由文件
     * @param path  文件路径
     * @param ns    命名空间，默认 /
     */
    static parseFile(path:string,ns?:string){
        interface RouteJSON{
            namespace:string;       //命名空间
            files:Array<string>;    //引入文件
            routes:Array<any>;      //实例配置数组
        }
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
        let json:RouteJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw e;
        }
        let ns1 = json.namespace? json.namespace.trim():'';
        //设置命名空间，如果是子文件，需要连接上级文件
        ns = ns?pathTool.jon(ns,ns1):ns1;
        
        //处理本级路由
        if(Array.isArray(json.routes)){
            json.routes.forEach((item)=>{
                //增加namespce前缀
                let p = pathTool.join(ns,item.path);
                this.addRoute(p,item.instance_name,item.method,item.results);
            });
        }

        //处理子路径路由
        if(Array.isArray(json.files)){
            json.files.forEach((item)=>{
                this.parseFile(pathTool.join(pathTool.dirname(path), item),ns);
            });
        }
    }
}

export {RouteFactory};

