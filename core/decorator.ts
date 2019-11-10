/**
 * 装饰器（注解类）
 */
import{InstanceFactory} from './instancefactory';
import { AopFactory } from './aopfactory';
import { FilterFactory } from './filterfactory';
import { TransactionManager } from './database/transactionmanager';
import { RouteFactory } from './routefactory';
import { Util } from './util';


/**
 * instance装饰器（添加到实例工厂）
 * @param cfg
 *              name:       实例名
 *              singleton:  是否单例
 */
function Instance(cfg){
    return (target) =>{
        //设置实例名
        target.prototype.__instanceName = cfg.name;
        InstanceFactory.addInstance({
            name:cfg.name,  //实例名
            class:target,
            params:cfg.params,
            singleton:cfg.singleton || true
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
 * route config 路由类
 * @param cfg 
 */
function Router(cfg?:any){
    return (target)=>{
        let instanceName:string = '_nroute_' + target.name;
        let namespace = cfg&&cfg.namespace?cfg.namespace:''; 
        target.prototype.__routeconfig = {
            namespace:namespace
        }
        target.prototype.__instanceName = instanceName;
        //追加到instancefactory
        InstanceFactory.addInstance({
            name:instanceName,  //实例名
            class:target,
            singleton:false
        });

        //如果配置了path，则追加到路由，对所有方法有效
        if(cfg && cfg.path){
            let path:string = cfg.path;
            if(typeof path==='string' && (path=path.trim()) !== ''){
                setImmediate(()=>{
                    //延迟到Route注解后，便于先处理非*的路由
                    RouteFactory.addRoute(namespace + path+'*',instanceName,null,cfg.results);
                });
            }
        }
    }
}

/**
 * 路由方法
 * @param cfg 
 */
function Route(cfg:any){
    return (target:any,propertyName:string)=>{
        setImmediate(()=>{
            let ns = target.__routeconfig?target.__routeconfig.namespace:'';
            RouteFactory.addRoute(ns + cfg.path,target.__instanceName,propertyName,cfg.results);
        });
        
    }
}
/**
 * web过滤器
 * @param pattern   过滤正则表达式串，可以为数组
 * @param order     优先级，默认1000
 */
function WebFilter(pattern?:any,order?:number){
    return function(target:any,name:string){
        FilterFactory.addFilter({
            instance:target,
            method_name:name,
            url_pattern:pattern,
            order:order
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
 * 事务类装饰器
 * 该装饰器必须放在Instance装饰器之前使用
 * 把符合条件的方法装饰为事务方法
 * @param methodReg 数组或字符串，方法名表达式，可以使用*通配符，默认为*，表示所有方法
 */
function Transactioner(methodReg?:any){
    return (target)=>{
        if(!methodReg){ //默认所有方法
            methodReg = ['*'];
        }else if(!Array.isArray(methodReg)){
            methodReg = [methodReg];
        }
        let methods:Array<string> = Object.getOwnPropertyNames(target.prototype);
        for(let mn of methodReg){
            if(typeof mn !== 'string'){
                continue;
            }
            let reg:RegExp = Util.toReg(mn);
            for(let m of methods){
                if(m === 'constructor' || typeof target.prototype[m] !== 'function'){
                    continue;
                }
                //符合的方法加入事务管理器
                if(reg.test(m)){
                    TransactionManager.addTransaction(target.prototype.__instanceName,m);
                }
            }
        }
    }
}
/**
 * 事务装饰器
 */ 
function Transaction(){
    return (target:any,name:string,desc:any)=>{
        TransactionManager.addTransaction(target,name);    
    }
}
export {Instance,Router,Route,WebFilter,Inject,Aspect,Pointcut,Before,After,Around,AfterReturn,AfterThrow,Transactioner,Transaction}