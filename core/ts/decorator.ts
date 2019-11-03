/**
 * 装饰器（注解类）
 */
import{InstanceFactory} from './instancefactory';
import { AopFactory } from './aopfactory';
import { FilterFactory } from './filterfactory';
import { TransactionManager } from './database/transactionmanager';


/**
 * instance装饰器（添加到实例工厂）
 * @param cfg
 *              name:       实例名
 *              singleton:  是否单例
 */
function Instance(cfg){
    return (target) =>{
        InstanceFactory.addInstance({
            name:cfg.name,  //实例名
            class:target,
            singleton:cfg.singleton 
        });
    }
}

/**
 * IoC注入装饰器
 * @param instanceName  实例名
 */
function Inject(instanceName:string){
    return (target:any,propertyName:string)=>{
        InstanceFactory.addInject(target,propertyName,instanceName);
    }
}

/**
 * web过滤器
 * @param pattern   过滤正则表达式串，可以为数组
 */
function WebFilter(pattern?:any){
    return function(target:any,name:string){
        FilterFactory.addFilter({
            instance:target,
            method_name:name,
            url_pattern:pattern
        });
    } 
}

/**
 * 切面装饰器
 */
function Aspect(target:any){
    target.isAspect = true;
    target.prototype.isAspect = true;
}

/**
 * 切点装饰器
 */
function Pointcut(expressions:any){
    return (target:any,name:string)=>{
        AopFactory.addPointcut(name+'()',expressions);
    }
}

/**
 * 通知装饰器 before
 * @param pointcutId    切点id
 */
function Before(pointcutId:string){
    return (target:any,name:string,desc:any)=>{
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'before',
            instance:target,
            method:name
        });
    }
}

/**
 * 通知装饰器 after
 * @param pointcutId    切点id
 */
function After(pointcutId:string){
    return (target:any,name:string,desc:any)=>{
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after',
            instance:target,
            method:name
        });
    }
}

/**
 * 通知装饰器 around
 * @param pointcutId    切点id
 */
function Around(pointcutId:string){
    return (target:any,name:string,desc:any)=>{
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'around',
            instance:target,
            method:name
        });
    }
}
/**
 * 通知装饰器 after return
 * @param pointcutId    切点id
 */
function AfterReturn(pointcutId:string){
    return (target:any,name:string,desc:any)=>{
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after-return',
            instance:target,
            method:name
        });
    }
}

/**
 * 通知装饰器 after throw
 * @param pointcutId    切点id
 */
function AfterThrow(pointcutId:string){
    return (target:any,name:string,desc:any)=>{
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after-throw',
            instance:target,
            method:name
        });
    }
}


/**
 * 事务装饰器
 */ 
function Transaction(instanceName:string){
    return (target:any,name:string,desc:any)=>{
        TransactionManager.addTransaction(instanceName,target,name);    
    }
}
export {Instance,WebFilter,Inject,Aspect,Pointcut,Before,After,Around,AfterReturn,AfterThrow,Transaction}