/**
 * route 管理
 */
import {InstanceFactory} from "./instancefactory";
interface RouteCfg{
    path:string;
    reg:RegExp;
    instanceName:string;
    method:string;
}
class RouteFactory{
    static routes:RouteCfg[] = new Array();
    /**
     * 添加路由
     * @param path      路由路径，支持通配符*，需要method支持
     * @param clazz     对应类
     * @param method    方法，支持{n}
     */
    static addRoute(path:string,clazz:string,method:string){
        //替换*
        let path1 = path.replace(/\*/g,".*");
        this.routes.push({
            path:path,
            reg:new RegExp(path1),
            instanceName:clazz.trim(),
            method:method.trim()
        });
    }

    /**
     * 处理路径
     * @param path      路径
     * @param params    调用参数
     */
    static handleRoute(path:string,params:object){
        path = path.trim();
        let isMatch:boolean = false;
        let instance:object = null;
        let method:string = "";
        for(let i=0;i<this.routes.length;i++){
            let item = this.routes[i];
            //路径测试通过
            if(item.reg.test(path)){
                method = item.method;
                let index = item.path.indexOf("*");
                //通配符处理
                if(index !== -1){
                    //*通配符方法
                    method = path.substr(index);
                }
                return InstanceFactory.exec({
                    instanceName:item.instanceName,
                    methodName:method,
                    params:params
                });
                // //看是否存在对应的类和方法，如果存在，置找到标志
                // //从工厂找到实例
                // instance = InstanceFactory.getInstance(item.className);
                // if(instance === undefined){
                //     throw "未找到实例，请检查实例配置文件";
                // }
                // if(instance[method] !== undefined && typeof instance[method] === 'function'){
                //     //设置找到标志
                //     isMatch = true;
                // }
                // break;
            }
        }
        //未找到，跳转到404，可能处理404，再考虑
        // if(!isMatch){
        //     return null;
        // }else{
        //     return new Promise((resolve,reject)=>{
        //         try{
        //             //调用方法
        //             let re = instance[method](params);
        //             resolve(re);
        //         }catch(e){
        //             reject(e);
        //         }
        //     });
        // }
    }

    /**
     * 解析路由文件
     * @param path  文件路径
     * @param ns    命名空间，默认 /
     */
    static parseFile(path:string,ns?:string){
        interface RouteJSON{
            files:Array<string>;        //引入文件
            routes:Array<any>;       //实例配置数组
        }
        //设置默认命名空间
        ns = ns||'/';
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let jsonStr:string = fs.readFileSync(new URL("file://" + path),'utf-8');
        let json:RouteJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw e;
        }

        if(json.files !== undefined && json.files.length>0){
            json.files.forEach((item)=>{
                this.parseFile(pathTool.resolve(pathTool.dirname(path), item),ns);
            });
        }

        if(json.routes && json.routes.length>0){
            json.routes.forEach((item)=>{
                let p = ns + '/' + item.path;
                //变'//'为'/'
                p = p.replace(/\/\//g,'/');
                this.addRoute(p,item.instanceName,item.method);
            });
        }
    }
}

export {RouteFactory};

