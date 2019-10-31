import { DBManager } from "./dbmanager";
import { InstanceFactory } from "../instancefactory";
import { TransactionManager } from "./transactionmanager";
import { AopFactory } from "../aopfactory";
import { getConnection } from "./connectionmanager";


class TransactionProxy{
    /**
     *  
     * @param instanceName  实例名
     * @param methodName    方法名
     * @param func          执行函数  
     * @param instance      实例
     */
    static invoke(instanceName:string,methodName:string,func:Function,instance:any):any{
        return async (params)=>{
            if(!Array.isArray(params)){
                params = [params];
            }
            let retValue;
            switch(DBManager.product){
                case 'sequelize':
                    retValue = await new Promise(async (resolve,reject)=>{
                        TransactionManager.namespace.run(async ()=>{
                            let v = await doSequelize();
                            resolve(v);
                        });
                    });
                    break;
                default:  //datasource
                    retValue = await new Promise((resolve,reject)=>{
                        TransactionManager.namespace.run(async ()=>{
                            let v = await doDataScource();
                            resolve(v);
                        });
                    });
            }
            if(retValue instanceof Error){
                throw retValue;
            }
            return retValue;
           
            /**
             * 数据源处理
             */
            async function doDataScource(){
                if(!TransactionManager.getIdLocal()){
                    //保存transaction id
                    TransactionManager.setIdToLocal();
                }
                //advices获取
                let advices:any;
                if(AopFactory){
                    advices = AopFactory.getAdvices(instanceName,methodName);
                }
                
                let result:any;
                //before aop执行
                if(advices !== null){
                    for(let item of advices.before){
                        await item.instance[item.method]();
                    }
                }
                try{
                    result = await func.apply(instance,params);
                    //return aop执行
                    if(advices !== null){
                        for(let item of advices.return){
                            await item.instance[item.method]();
                        }
                    }
                }catch(e){
                    //异常aop执行
                    if(advices !== null){
                        for(let item of advices.throw){
                            await item.instance[item.method]();
                        }
                    }
                    result = e;
                }
                return result;
            }

            /**
             * sequelize 处理
             */
            async function doSequelize(){
                let result:any;
                if(!TransactionManager.getIdLocal()){
                    //保存transaction id
                    TransactionManager.setIdToLocal();
                    let sequelize = await getConnection();
                    result = await new Promise((res,rej)=>{
                        sequelize.transaction(async (t)=>{
                            console.log(TransactionManager.namespace);
                            let v = await func.apply(instance,params);
                            res(v);
                        }).catch((e)=>{
                            res(e);
                        });
                    });
                }else{
                    try{
                        result = await func.apply(instance,params);
                    }catch(e){
                        result = e;
                    }
                }
                return result;
            }
        }
    }
}

export {TransactionProxy}