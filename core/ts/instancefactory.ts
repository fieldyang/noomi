import { AopFactory} from "./aopfactory";
import { NoomiError } from "../errorfactory";

/**
 * 实例工厂
 */
interface Argument{
    index:number;   //参数索引
    value:any;      //参数置
}
interface InstanceCfg{
    name:string;            //实例名
    class_name:string;      //类名
    path?:string;           //模块路径（相对noomi.ini配置的modulepath），与instance二选一
    instance?:any;          //实例与path 二选一
    singleton?:boolean;     //单例模式
    params?:Array<any>;     //参数列表
}

/**
 * 实例对象
 */
interface InstanceObj{
    instance:object;            //实例对象
    class:any;                  //类引用
    singleton:boolean;          //单例标志
    params:Array<any>;          //构造器参数
}

class InstanceFactory{
    static factory:any = new Map();
    static mdlBasePath:string;
    static injectList:Array<any> = [];

    static init(path:string,mdlPath?:string){
        this.parseFile(path,mdlPath);
        //延迟注入
        process.nextTick(()=>{
            InstanceFactory.finishInject();
        });
    }
    /**
     * 添加单例到工厂
     * @param cfg 实例配置
     */
    static addInstance(cfg:InstanceCfg){
        if(this.factory.has(cfg.name)){
            throw new NoomiError("1002",cfg.name);
        }
        const pathMdl = require('path');
        let insObj;
        let path;
        //从路径加载模块
        if(cfg.path && typeof cfg.path === 'string' && (path=cfg.path.trim()) !== ''){  
            let mdl = require(pathMdl.join(process.cwd(),this.mdlBasePath,path));
            //支持ts 和js ，ts编译后为{className:***},node 直接输出为 class
            if(typeof mdl === 'object'){
                mdl = mdl[cfg.class_name];
            }
            // class
            if(mdl.constructor !== Function){
                throw new NoomiError("1003");
            }
            //默认true
            let singleton = cfg.singleton!==undefined?cfg.singleton:true;
            
            insObj={
                class:mdl,
                singleton:singleton
            };

            if(singleton){      //单例，需要实例化
                //参数怎么传递
                insObj.instance = new mdl(cfg.params);
            }else{              //非单例，不需要实例化
                insObj.params = cfg.params;
            }
        }else{ //传入模块，不用创建
            insObj = {
                singleton:true,
                instance:cfg.instance
            }
        }
        this.factory.set(cfg.name,insObj);
    }

    /**
     * 添加inject
     * @param instance      实例对象 
     * @param propName      属性名
     * @param injectName    注入的实例名
     * 
     */
    static addInject(instance:any,propName:string,injectName:string){
        this.injectList.push({
            instance:instance,
            propName:propName,
            injectName:injectName
        });
    }

    /**
     * 完成注入列表的注入操作
     */
    static finishInject(){
        for(let item of this.injectList){
            let instance = InstanceFactory.getInstance(item.injectName);
            //实例不存在
            if(!instance){
                throw new NoomiError('1001',item.injectName);
            }
            Reflect.set(item.instance,item.propName,instance); 
        }
    }
    /**
     * 获取实例
     * @param name  实例名
     * @return      实例化的对象  
     */
    static getInstance(name:string){
        let ins:InstanceObj = this.factory.get(name);
        if(!ins){
            return null;
        }
        if(ins.singleton){
            return ins.instance;
        }else{
            let mdl = ins.class;
            return new mdl(ins.params);
        }
    }

    /**
     * 获取instance object
     * @param name instance name
     */
    static getInstanceObj(name:string):InstanceObj{
        return this.factory.get(name);
    }

    /**
     * 执行方法
     * @param instancee     实例名或实例对象 
     * @param methodName    方法名
     * @param params        参数数组
     * @param func          方法(与methodName二选一)
     */
    
    static exec(instance:any,methodName:string,params:Array<any>,func?:any){
        //实例名，需要得到实例对象
        let instanceName = '';
        if(instance && typeof instance === 'string'){
            instanceName = instance; 
            instance = this.getInstance(instance);
        }
        //实例不存在
        if(!instance){
            throw new NoomiError("1001",instanceName);
        }
        func = func || instance[methodName];
        //方法不存在
        if(!func){
            throw new NoomiError("1010",methodName);
        }
        return func.apply(instance,params); 
    }

    /**
     * 解析实例配置文件
     * @param path 文件路径
     */
    static parseFile(path:string,mdlPath?:string){
        interface InstanceJSON{
            files:Array<string>;        //引入文件
            instances:Array<any>;       //实例配置数组
        }
        const pathTool = require('path');
        const fs = require("fs");
        this.mdlBasePath = mdlPath || './';
        //读取文件
        let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
        let json:InstanceJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("1000");
        }

        if(Array.isArray(json.files)){
            json.files.forEach((item)=>{
                this.parseFile(pathTool.join(pathTool.dirname(path),item),this.mdlBasePath);
            });
        }

        if(Array.isArray(json.instances)){
            json.instances.forEach((item)=>{
                this.addInstance(item);
            });
        }
    }

    /**
     * 获取instance工厂
     */
    static getFactory(){
        return this.factory;
    }
}

export {InstanceFactory};
