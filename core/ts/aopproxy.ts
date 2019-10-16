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
        return params=>{
            if(params){
                params = [params];
            }
            
            let aopParams:Array<any> = [{
                instanceName:instanceName,
                methodName:methodName,
                params:params  
            }];
            //aop获取
            let aop:any;
            if(AopFactory){
                aop = AopFactory.getAdvices(instanceName,methodName);
            }
            
            let result:any;
            
            //before aop执行
            if(aop !== null){
                for(let item of aop.before){
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
                        if(aop !== null){
                            for(let item of aop.return){
                                //instance可能为实例对象，也可能是实例名
                                InstanceFactory.exec(item.instance,item.method,aopParams);
                            }
                        }        
                    }).catch((e)=>{
                        //throw aop执行
                        aopParams[0].throwValue = e;
                        if(aop !== null){
                            for(let item of aop.throw){
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
                    if(aop !== null){
                        for(let item of aop.return){
                            //instance可能为实例对象，也可能是实例名
                            InstanceFactory.exec(item.instance,item.method,aopParams);
                        }
                    }
                }
            }catch(e){
                aopParams[0].throwValue = e;
                //异常aop执行
                if(aop !== null){
                    for(let item of aop.throw){
                        //instance可能为实例对象，也可能是实例名
                        InstanceFactory.exec(item.instance,item.method,aopParams);
                    }
                }
                result = e;
            }

            // after aop 调用
            if(aop !== null && aop.after.length>0){
                if(util.types.isPromise(result)){  //返回promise
                    result.then(re=>{
                        for(let item of aop.after){
                            InstanceFactory.exec(item.instance,item.method,aopParams);
                        }
                    });
                }else{
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