import { InstanceFactory } from "./instancefactory";
import { AopFactory } from "./aopfactory";

/**
 * Aop 代理类工厂
 */
class AopProxy{
    /**
     *  
     * @param instanceName  实例名
     * @param methodName    方法名
     * @param func          执行函数  
     */
    static invoke(instanceName,methodName,func,instance){
        return function(params){
            if(params){
                params = [params];
            }
            
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
                aop.before.forEach(item=>{
                    InstanceFactory.exec(item.instance,item.method,params);
                });
            }
            
            // return new Promise((resolve,reject)=>{
            //     let finish = true;
            //     let result;
                try{
                    result = func.apply(instance,params);
                    //return aop执行
                    if(aop !== null){
                        aop.return.forEach(item=>{
                            InstanceFactory.exec(item.instance,item.method,params);
                        });
                    }
                    
                }catch(e){
                    //异常aop执行
                    if(aop !== null){
                        aop.throw.forEach(item=>{
                            InstanceFactory.exec(item.instance,item.method,params);
                        });
                    }
                    finish = false;
                    result = e;
                }

                //after aop执行
                if(aop !== null){
                    if(aop !== null){
                        aop.after.forEach(item=>{
                            InstanceFactory.exec(item.instance,item.method,params);
                        });
                    }
                }

                return result;
                // if(finish){
                //     return result;
                // }

            //     if(finish){
            //         resolve(result);
            //     }else{
            //         reject(result);
            //     }
            // });
        }
    }
}

export {AopProxy};