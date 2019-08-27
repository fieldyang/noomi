/**
 * 实例工厂
 */
interface Argument{
    index:number;   //参数索引
    value:any;      //参数置
}
interface InstanceCfg{
    name:string;            //实例名
    path:string;
    className:string;       //类名
    args:Array<Argument>;   //参数列表
}

class InstanceFactory{
    static factory:any = new Map();
    static mdlBasePath:string;
    /**
     * 添加单例到工厂
     * @param cfg 实例配置
     */
    static addInstance(cfg:InstanceCfg){
        // if(this.factory.has(cfg.name)){
        //     throw "该实例名已存在";
        // }
        // let path = this.mdlBasePath + "/" + cfg.path;
        // //替换//为/
        // path = path.replace(/\/\//g,'/');
        const path = require('path');
        // console.log(process.cwd())
        let mdl = require(path.resolve(this.mdlBasePath,cfg.path));
        //支持ts 和js ，ts编译后为{className:***},node 直接输出为 class
        if(typeof mdl === 'object'){
            mdl = mdl[cfg.className];
        }
        // class
        if(typeof mdl !== 'function'){
            throw "模块必须为class";
        }
        this.factory.set(cfg.className,new mdl(cfg.args)); 
    }

    /**
     * 获取实例
     * @param name 类名  
     */
    static getInstance(name:string){
        let fs = require("fs");
        if(!this.factory.has(name)){
            throw "实例不存在";
        }
        return this.factory.get(name);
    }

    /**
     * 执行方法
     * @param className     类名 
     * @param method        方法名
     */
    static exec(className:string,method:string):any{
        //获取实例
        let instance = this.factory.get(className);
        if(!instance || !instance[method]){
            throw "实例或方法不存在！";
        }

        //前置aop检查
        

        //后置aop检查
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
        let jsonStr:string = fs.readFileSync(new URL("file://" + path),'utf-8');
        let json:InstanceJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw "实例文件配置错误"!
        }

        if(json.files !== undefined && json.files.length>0){
            json.files.forEach((item)=>{
                this.parseFile(pathTool.resolve(pathTool.dirname(path),item),this.mdlBasePath);
            });
        }

        if(json.instances && json.instances.length>0){
            json.instances.forEach((item)=>{
                this.addInstance(item);
            });
        }
    }
}

export {InstanceFactory};
