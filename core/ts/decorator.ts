/**
 * 装饰器（注解类）
 */
import{InstanceFactory} from './instancefactory';
import { ErrorFactory, NoomiError } from '../errorfactory';
import { AopFactory } from './aopfactory';

/**
 * IoC注入装饰器
 * @param instanceName  实例名
 */
function Inject(instanceName:string){
    return function(target:any,propertyName:string){
        let instance = InstanceFactory.getInstance(instanceName);
        if(!instance){
            throw new NoomiError("1000");
        }
        Reflect.set(target,propertyName,instance);
    }
}

/**
 * 切面装饰器
 */
function Aspect(target:any){
    target.isAspect = true;
}

/**
 * 切点装饰器
 */
function Pointcut(expressions:Array<string>){
    return function(target:any,name:string){
        AopFactory.addPointcut(name+'()',expressions);
    }
}

/**
 * 通知装饰器 before
 * @param pointcutId    切点id
 */
function Before(pointcutId:string){
    return function(target:any,name:string,desc:any){
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
    return function(target:any,name:string,desc:any){
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
    return function(target:any,name:string,desc:any){
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
    return function(target:any,name:string,desc:any){
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
    return function(target:any,name:string,desc:any){
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after-throw',
            instance:target,
            method:name
        });
    }
}

export {Inject,Aspect,Pointcut,Before,After,Around,AfterReturn,AfterThrow}