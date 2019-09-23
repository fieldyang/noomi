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
    static invoke(instanceName,methodName,func,instance){
        const util = require('util');
        if(util.types.isAsyncFunction(func)){
            return async (params)=>{
                return foo(params);
            };
        }else{
            return foo;
        }
        
        async function foo(params){
            if(params){
                params = [params];
            }
            
            let aopParams = [instanceName,methodName].concat(params);
            //aop获取
            let aop:any;
            if(AopFactory){
                aop = AopFactory.getAops(instanceName,methodName);
            }
            let result:any;
            //正常执行结束标志
            let finish:boolean = false;
            //before aop执行
            if(aop !== null){
                for(let item of aop.before){
                    await InstanceFactory.exec(item.instance,item.method,aopParams);
                }
            }
            try{
                result = await InstanceFactory.exec(null,null,params,instance,func);
                //return aop执行
                if(aop !== null){
                    for(let item of aop.return){
                        await InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
            }catch(e){
                //异常aop执行
                if(aop !== null){
                    for(let item of aop.throw){
                        InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
                finish = false;
                result = e;
            }

            //after aop执行
            if(aop !== null){
                if(aop !== null){
                    for(let item of aop.after){
                        InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
            }
            return result;
        }
    }
}

export {AopProxy};