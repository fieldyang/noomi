import { InstanceFactory } from "./instancefactory";

/**
 * Aop 代理类工厂
 */
class AopProxy{
    static invoke(instanceName,methodName,foo){
        return function(params){
            return InstanceFactory.exec({
                func:foo,
                instanceName:instanceName,
                methodName:methodName,
                params:params
            });
        }
    }
}

export {AopProxy};