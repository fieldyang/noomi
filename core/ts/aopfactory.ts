import { InstanceFactory } from "./instancefactory";
import { AopProxy } from "./aopproxy";
import { NoomiError } from "./errorfactory";

/**
 * AOP 工厂
 */

/**
 * 通知
 */
interface AopAdvice{
    //切点
    pointcut_id?:string;
    //类型 (before,after,return,throw,around)
    type:string;
    //切面对应的方法
    method:string;
    //切面对应的实例名或实例对象
    instance:any; 
}

/**
 * 切面
 */
interface AopAspect{
    instance:string;
    //切点
    pointcuts:Array<AopPointcut>;
    //通知
    advices:Array<AopAdvice>;
}

 /**
  * aop 切点
  */
class AopPointcut{
    id:string;
    proxyClass:any;             //代理类
    //表达式数组（正则表达式）
    expressions:Array<RegExp> = [];
    advices:Array<AopAdvice> = [];

    constructor(id:string,expressions:Array<string>,proxyClass?:any){
        this.id = id;
        this.proxyClass = proxyClass || AopProxy;
        if(!expressions){
            throw new NoomiError("2001");
        }

        if(!Array.isArray(expressions)){
            expressions = [expressions];
        }
        
        expressions.forEach((item)=>{
            if(typeof item !== 'string'){
                throw new NoomiError("2001");
            }
            // 转字符串为正则表达式并加入到数组
            let reg = new RegExp(item);
            this.expressions.push(reg);
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
     * 给切点添加通知
     * @param advice 
     */
    addAdvice(advice:AopAdvice){
        this.advices.push(advice);
    }
}

/**
 * aop factory
 */
class AopFactory{
    static aspects:any = new Map();
    static pointcuts:any = new Map();
    /**
     * 添加切面
     */
    static addAspect(cfg:AopAspect):void{
        if(this.aspects.has(cfg.instance)){
            throw new NoomiError("2005",cfg.instance); 
        }
        //连接点
        if(Array.isArray(cfg.advices)){
            cfg.advices.forEach((item)=>{
                if(!this.pointcuts.has(item.pointcut_id)){
                    throw new NoomiError("2002",item.pointcut_id);
                }
                //设置实例名
                item.instance = cfg.instance;
                //添加到pointcut的aop数组(是否需要重复检测，待考虑)
                this.addAdvice(item);
            });
        }
        this.aspects.set(cfg.instance,cfg);
    }

    /**
     * 添加切点
     * @param id            切点id 
     * @param expressions   方法匹配表达式数组
     * @param proxyClass   特定代理类
     */
    static addPointcut(id:string,expressions:Array<string>,proxyClass?:any):void{
        //切点
        if(this.pointcuts.has(id)){
            throw new NoomiError("2003",id);
        }
        this.pointcuts.set(id,new AopPointcut(id,expressions,proxyClass));
    }

    /**
     * 添加通知
     * @param advice 通知配置
     */
    static addAdvice(advice:AopAdvice):void{
        let pc:AopPointcut = AopFactory.getPointcutById(advice.pointcut_id);
        if(!pc){
            throw new NoomiError("2002",advice.pointcut_id);
        }
        pc.addAdvice(advice);
    }

    /**
     * 解析文件
     * @param path  文件路径 
     */
    static parseFile(path:string):void{
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
        //延迟处理method aop代理，避免某些实例尚未加载
        process.nextTick(()=>AopFactory.updMethodProxy.call(AopFactory));

        //读取文件
        let jsonStr:string = require("fs").readFileSync(require('path').join(process.cwd(),path),'utf-8');
        let json:DataJson = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2000");
        }

        //切点数组
        if(Array.isArray(json.pointcuts)){
            json.pointcuts.forEach((item:PointcutJson)=>{
                this.addPointcut(item.id,item.expressions);
            });
        }

        //切面数组
        if(Array.isArray(json.aspects)){
            json.aspects.forEach((item:AopAspect)=>{
                this.addAspect(item);
            });
        }
    }

    /**
     * 更新aop匹配的方法代理，为所有aop匹配的方法设置代理
     */
    static updMethodProxy():void{
        //遍历instance factory设置aop代理
        let insFac = InstanceFactory.getFactory();
        //处理过的实例名数组
        let instances:Array<string> = [];
        //遍历pointcut
        let pc:AopPointcut;
        for(pc of this.pointcuts.values()){
            let reg:RegExp;
            //遍历expression
            for(reg of pc.expressions){
                for(let insName of insFac.keys()){
                    //该实例处理过，不再处理
                    if(instances.includes(insName)){
                        continue;
                    }
                    //先检测instanceName
                    let instance = InstanceFactory.getInstance(insName);
                    if(instance){
                        Object.getOwnPropertyNames(instance.__proto__).forEach(key=>{
                            //给方法设置代理，constructor 不需要代理
                            if(key === 'constructor' || typeof(instance[key]) !== 'function'){
                                return;
                            }
                            //实例名+方法符合aop正则表达式
                            if(reg.test(insName + '.' + key)){
                                // instance[key] = Reflect.apply('invoke',pc.proxyClass,[insName,key,instance[key],instance]);
                                instance[key] = pc.proxyClass.invoke(insName,key,instance[key],instance);
                                instances.push(insName);
                            }
                        });
                    }
                }
            }
        }
    }
    /**
     * 获取切点
     * @param instanceName  实例名 
     * @param methodName    方法名
     * @return              pointcut array
     */
    static getPointcut(instanceName:string,methodName:string):Array<AopPointcut>{
        // 遍历iterator
        let a:Array<AopPointcut> = [];
    
        for(let p of this.pointcuts.values()){
            if(p.match(instanceName,methodName)){
                a.push(p); 
            }
        }
        return a;
    }

    /**
     * 根据id获取切点
     * @param pointcutId    pointcut id
     * @return              pointcut
     */
    static getPointcutById(pointcutId:string):AopPointcut{
        return this.pointcuts.get(pointcutId);
    }

    /**
     * 获取advices
     * @param instanceName  实例名
     * @param methodName    方法名
     * @return              {
     *                          before:[{instance:切面实例,method:切面方法},...]
     *                          after:[{instance:切面实例,method:切面方法},...]
     *                          return:[{instance:切面实例,method:切面方法},...]
     *                          throw:[{instance:切面实例,method:切面方法},...]
     *                      }
     */
    static getAdvices(instanceName:string,methodName:string):object{
        let pointcuts:Array<AopPointcut> = this.getPointcut(instanceName,methodName);
        if(pointcuts.length === 0){
            return null;
        }
        
        let beforeArr:Array<object> = [];
        let afterArr:Array<object> = [];
        let throwArr:Array<object> = [];
        let returnArr:Array<object> = [];

        let pointcut:AopPointcut;
        for(pointcut of pointcuts){
            pointcut.advices.forEach(aop=>{
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
                    case 'after-return':
                        returnArr.push({
                            instance:aop.instance,
                            method:aop.method
                        });
                        return;
                    case 'after-throw':
                        throwArr.push({
                            instance:aop.instance,
                            method:aop.method
                        });
                }
            });
        }
        
        return {
            before:beforeArr,
            after:afterArr,
            throw:throwArr,
            return:returnArr
        }
    }

}

export{AopFactory};