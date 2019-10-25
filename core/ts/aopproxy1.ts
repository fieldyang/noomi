import { InstanceFactory } from "./instancefactory";
import { AopFactory } from "./aopfactory";
/**
 * Aop 代理类
 */
class AopProxy{
    /**
     *  
     * @param instanceName  实例名
     * @param methodName    方法名
     * @param func          执行函数  
     * @param instance      实例
     */
    static invoke(instanceName:string,methodName:string,func:Function,instance:any):any{
        const util = require('util');
        /**
         * 异步方法
         */
        if(func && util.types.isAsyncFunction(func)){
            return async (params)=>{
                if(params){
                    params = [params];
                }
                
                //参数1为实例名，2是方法名，3是被代理方法自带参数(数组)
                let aopParams:Array<any> = [{
                    instanceName:instanceName,
                    methodName:methodName,
                    params:params  
                }];
    
                //advices获取
                let advices:any;
                if(AopFactory){
                    advices = AopFactory.getAdvices(instanceName,methodName);
                }
                
                let result:any;
                
                //before aop执行
                if(advices !== null){
                    for(let item of advices.before){
                        //instance可能为实例对象，也可能是实例名
                        await item.instance[item.method](aopParams);
                        // await InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
                try{
                    // result = await InstanceFactory.exec(instance,null,params,func);
                    result = await func(params);
                    //带入参数
                    aopParams[0].returnValue = result;
                    //return aop执行
                    if(advices !== null){
                        for(let item of advices.return){
                            //instance可能为实例对象，也可能是实例名
                            // await InstanceFactory.exec(item.instance,item.method,aopParams);
                            await item.instance[item.method](aopParams);
                        }
                    }        
                }catch(e){
                    aopParams[0].throwValue = e;
                    //异常aop执行
                    if(advices !== null){
                        for(let item of advices.throw){
                            //instance可能为实例对象，也可能是实例名
                            // await InstanceFactory.exec(item.instance,item.method,aopParams);
                            await item.instance[item.method](aopParams);
                        }
                    }
                    result = e;
                }
    
                // after aop 调用
                if(advices !== null && advices.after.length>0){
                    for(let item of advices.after){
                        // await InstanceFactory.exec(item.instance,item.method,aopParams);
                        await item.instance[item.method](aopParams);
                    }
                }
                return result;
            }
        }
        //非async 拦截
        return (params)=>{
            if(params){
                params = [params];
            }
            
            //参数1为实例名，2是方法名，3是被代理方法自带参数(数组)
            let aopParams:Array<any> = [{
                instanceName:instanceName,
                methodName:methodName,
                params:params  
            }];

            //advices获取
            let advices:any;
            if(AopFactory){
                advices = AopFactory.getAdvices(instanceName,methodName);
            }
            
            let result:any;
            
            //before aop执行
            if(advices !== null){
                for(let item of advices.before){
                    //instance可能为实例对象，也可能是实例名
                    InstanceFactory.exec(item.instance,item.method,aopParams);
                }
            }
            try{
                result = InstanceFactory.exec(instance,null,params,func);
                if(util.types.isPromise(result)){  //返回promise调用
                    result.then(re=>{
                        //带入参数
                        aopParams[0].returnValue = re;
                        //return aop执行
                        if(advices !== null){
                            for(let item of advices.return){
                                //instance可能为实例对象，也可能是实例名
                                InstanceFactory.exec(item.instance,item.method,aopParams);
                            }
                        }        
                    }).catch((e)=>{
                        //throw aop执行
                        aopParams[0].throwValue = e;
                        if(advices !== null){
                            for(let item of advices.throw){
                                //instance可能为实例对象，也可能是实例名
                                InstanceFactory.exec(item.instance,item.method,aopParams);
                            }
                        }
                        result = Promise.reject(e);
                    });
                }else{  //普通调用
                    //带入参数
                    aopParams[0].returnValue = result;
                    //return aop执行
                    if(advices !== null){
                        for(let item of advices.return){
                            //instance可能为实例对象，也可能是实例名
                            InstanceFactory.exec(item.instance,item.method,aopParams);
                        }
                    }
                }
            }catch(e){
                aopParams[0].throwValue = e;
                //异常aop执行
                if(advices !== null){
                    for(let item of advices.throw){
                        //instance可能为实例对象，也可能是实例名
                        InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
                result = e;
            }

            // after aop 调用
            if(advices !== null && advices.after.length>0){
                if(util.types.isPromise(result)){  //返回promise
                    result.then(re=>{
                        for(let item of advices.after){
                            InstanceFactory.exec(item.instance,item.method,aopParams);
                        }
                    });
                }else{
                    for(let item of advices.after){
                        InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
            }
            return result;
        }
    }
}

export {AopProxy};