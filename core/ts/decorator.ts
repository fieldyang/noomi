/**
 * 装饰器（注解类）
 */
import{InstanceFactory} from './instancefactory';

/**
 * IoC注入装饰器
 * @param instanceName  实例名 
 */
function Inject(instanceName:string){
    return function(target:any,propertyName:string){
        let instance = InstanceFactory.getInstance(instanceName);
        if(!instance){
            throw "1000";
        }
        Reflect.set(target,propertyName,instance);
    }
}

export {Inject};