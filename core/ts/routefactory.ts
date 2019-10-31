/**
 * route 管理
 */
import {InstanceFactory} from "./instancefactory";
import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";
import { NoomiError } from "./errorfactory";
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
                    throw new NoomiError("2101");
                }
            }
        }
        if(method){
            method = method.trim();
        }
        let r:RouteCfg = {
            path:path,
            reg:new RegExp('^' + path1 + '$'),
            instanceName:clazz.trim(),
            method:method,
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
    static handleRoute(pathOrRoute:any,params:object,req:HttpRequest,res:HttpResponse){
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

        let func = route.instance[route.method]; 
        if(typeof func !== 'function'){
            throw new NoomiError("1010");
        }
        const util = require('util');
        try{
            
            let re = func.call(route.instance,params);
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
    static handleResult(res:HttpResponse,data:any,instance:any,results:Array<RouteResult>):void{
        if(results && results.length > 0){
            //单个结果，不判断返回值
            if(results.length === 1){
                this.handleOneResult(res,results[0],data,instance);
                return;
            }else{
                let r:RouteResult;
                for(r of results){
                    //result不带value，或找到返回值匹配，则处理
                    if(r.value === undefined || data && data == r.value){
                        this.handleOneResult(res,r,data,instance);
                        return;
                    }
                }
            }
        }
        //默认回写json
        this.handleOneResult(res,{},data);
    }

    /**
     * 处理一个结果
     * @param res           response
     * @param result        route result
     * @param data          数据
     * @param instance      实例
     */
    private static handleOneResult(res:HttpResponse,result:RouteResult,data:any,instance?:any):void{
        let url:string;
        switch(result.type){
            case "redirect": //重定向
                url = handleParamUrl(instance,result.url);
                let pa = [];
                //参数属性
                if(result.params && Array.isArray(result.params) && result.params.length>0){
                    for(let pn of result.params){
                        let v = getValue(instance,pn);
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
                res.redirect(url);
                return;
            case "chain": //路由器链
                let urlMdl = require("url");
                url = handleParamUrl(instance,result.url);
                let url1 = urlMdl.parse(url).pathname;
                let params = require('querystring').parse(urlMdl.parse(url).query);
                
                //参数处理
                if(result.params && Array.isArray(result.params) && result.params.length>0){
                    for(let pn of result.params){
                        let v = getValue(instance,pn);
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
            default: //json
                res.writeToClient({
                    data:data,
                    type:'application/json'
                });
        }
        
        /**
         * 处理带参数的url
         * @param url   源url，以${propName}出现
         * @return      处理后的url
         */
        function handleParamUrl(instance:any,url:string):string{
            let reg:RegExp = /\$\{.*?\}/g;
            let r:RegExpExecArray;
            //处理带参数url
            while((r=reg.exec(url)) !== null){
                let pn = r[0].substring(2,r[0].length-1);
                url = url.replace(r[0],getValue(instance,pn));
            }
            return url;
        }

        /**
         * 获取属性值
         * @param instance  实例 
         * @param pn        属性名
         * @return          属性值
         */
        function getValue(instance:any,pn:string):any{
            if(instance[pn] !== undefined){
                return instance[pn];
            }else if(instance.model && instance.model[pn] !== undefined){
                return instance.model[pn];
            }
        }
    }


    /**
     * 处理异常信息
     * @param res   response
     * @param e     异常
     */
    static handleException(res:HttpResponse,e:any){
        let msg = e.getMessage() || e;
        res.writeToClient({
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
        let json:RouteJSON = null;
        try{
            let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2100");
        }
        let ns1 = json.namespace? json.namespace.trim():'';
        //设置命名空间，如果是子文件，需要连接上级文件
        ns = ns?pathTool.posix.join(ns,ns1):ns1;
        
        //处理本级路由
        if(Array.isArray(json.routes)){
            json.routes.forEach((item)=>{
                //增加namespce前缀
                let p = pathTool.posix.join(ns,item.path);
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

