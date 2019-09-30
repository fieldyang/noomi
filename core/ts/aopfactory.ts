import { InstanceFactory } from "./instancefactory";
import { AopProxy } from "./aopproxy";
import { UserService } from "../../test/app/module/service/userservice";

/**
 * AOP 工厂
 */

/**
 * 连接点
 */
interface Aop{
    //切点
    pointcut_id:string;
    //类型 (before,after,return,throw,around)
    type:string;
    //切面对应的方法
    method:string;
    //切面对应的实例名
    instance:string; 
}

/**
 * 切面
 */
interface AopAspect{
    instance:string;
    //切点
    pointcuts:Array<AopPointcut>;
    //连接点
    aops:Array<Aop>;
}

 /**
  * aop 切点
  */
class AopPointcut{
    id:string;
    //表达式数组（正则表达式）
    expressions:Array<RegExp> = [];
    aops:Array<Aop> = [];

    constructor(id:string,expressions:Array<string>){
        this.id = id;
        if(!Array.isArray(expressions) || expressions.length === 0){
            throw "pointcut的expressions参数配置错误";
        }
        expressions.forEach((item)=>{
            if(typeof item !== 'string'){
                throw "pointcut的expressions参数配置错误";
            }
            // 转字符串为正则表达式并加入到数组
            let reg = new RegExp(item);
            this.expressions.push(reg);
            
            //遍历instance factory设置aop代理
            let insFac = InstanceFactory.getFactory();
            const util = require('util');
            

            for(let insName of insFac.keys()){
                //先检测instanceName
                if(reg.test(insName+'./')){
                    let instance = InstanceFactory.getInstance(insName);
                    if(instance){
                        Object.getOwnPropertyNames(instance.__proto__).forEach(key=>{
                            //给方法设置代理，constructor 不需要代理
                            if(key === 'constructor' || typeof(instance[key]) !== 'function'){
                                return;
                            }
                            
                            //实例名+方法符合aop正则表达式
                            if(reg.test(insName + '.' + key)){
                                instance[key] = AopProxy.invoke(insName,key,instance[key],instance);
                            }
                        });
                    }
                }
            }
        });
    }
    /**
     * 匹配方法是否满足表达式
     * @param instanceName  实例名
     * @param methodName    待检测方法 
     * @return              true/false
     */
    match(instanceName:string,methodName:string):boolean{
        for(let i=0;i<this.expressions.length;i++){
            if(this.expressions[i].test(instanceName + '.' + methodName)){
                return true;
            }
        }
        return false;
    }

    /**
     * 添加连接点
     * @param aop 
     */
    addAop(aop:Aop){
        this.aops.push(aop);
    }
}



class AopFactory{
    static aspects:any = new Map();
    static pointcuts:any = new Map();
    /**
     * 添加切面
     */
    static addAspect(cfg:AopAspect){
        if(this.aspects.has(cfg.instance)){
            throw "该advice已经在切面中存在"; 
        }
        //连接点
        if(Array.isArray(cfg.aops)){
            cfg.aops.forEach((item)=>{
                if(!this.pointcuts.has(item.pointcut_id)){
                    throw "pointcut不存在";
                }
                //设置实例名
                item.instance = cfg.instance;
                //添加到pointcut的aop数组(是否需要重复检测，待考虑)
                this.pointcuts.get(item.pointcut_id).addAop(item);
            });
        }
        this.aspects.set(cfg.instance,cfg);
    }

    /**
     * 添加切点
     * @param id            切点id 
     * @param expressions   方法匹配表达式数组
     */
    static addPointcut(id:string,expressions:Array<string>){
        //切点
        if(this.pointcuts.has(id)){
            throw "pointcut id重复定义";
        }
        this.pointcuts.set(id,new AopPointcut(id,expressions));

    }

    /**
     * 解析文件
     * @param path          文件路径 
     */
    static parseFile(path:string){
        //切点json数据
        interface PointcutJson{
            id:string;
            expressions:Array<string>;
        }
        //数据json
        interface DataJson{
            files:Array<string>;            //引入文件
            pointcuts:Array<PointcutJson>;   //切点
            aspects:Array<AopAspect>;       //切面
        }
        

        const fs = require("fs");
        const pathTool = require('path');
        //读取文件
        let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
        let json:DataJson = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw "实例文件配置错误"!
        }

        if(Array.isArray(json.pointcuts)){
            json.pointcuts.forEach((item:PointcutJson)=>{
                this.addPointcut(item.id,item.expressions);
            });
        }

        if(Array.isArray(json.aspects)){
            json.aspects.forEach((item:AopAspect)=>{
                this.addAspect(item);
            });
        }
    }

    /**
     * 获取切点
     * @param instanceName  实例名 
     * @param methodName    方法名
     */
    static getPointcut(instanceName:string,methodName:string):AopPointcut{
        // 遍历iterator
        let ite = this.pointcuts.values();
        for(let p of ite){
            if(p.match(instanceName,methodName)){
                return p; 
            }
        }
        return null;
    }

    /**
     * 执行方法
     * @param instanceName  实例名
     * @param methodName    方法名
     * @return              {
     *                          before:[{instance:切面实例,method:切面方法},...]
     *                          after:[{instance:切面实例,method:切面方法},...]
     *                          return:[{instance:切面实例,method:切面方法},...]
     *                          throw:[{instance:切面实例,method:切面方法},...]
     *                      }
     */
    static getAops(instanceName:string,methodName:string):object{
        let pointcut = this.getPointcut(instanceName,methodName);
        if(pointcut === null){
            return null;
        }

        let beforeArr:Array<object> = [];
        let afterArr:Array<object> = [];
        let throwArr:Array<object> = [];
        let returnArr:Array<object> = [];

        pointcut.aops.forEach(aop=>{
            switch(aop.type){
                case 'before':
                    beforeArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
                    return;
                case 'after':
                    afterArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
                    return;
                case 'around':
                    beforeArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
                    afterArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
                    return;
                case 'return':
                    returnArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
                    return;
                case 'throw':
                    throwArr.push({
                        instance:aop.instance,
                        method:aop.method
                    });
            }
        });
        return {
            before:beforeArr,
            after:afterArr,
            throw:throwArr,
            return:returnArr
        }
    }
}

export{AopFactory};