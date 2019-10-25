import { Transaction, TransactionManager } from "./transactionmanager";
import { App } from "./application";
import { getConnection } from "./connectionmanager";


export class TransactionAdvice{
    /**
     * 事务方法调用前
     */
    async before(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id,true);
        if(!tr.connection){
            tr.connection = await getConnection();
        }
        tr.begin();
    }

    /**
     * 事务方法返回时
     */
    async afterReturn(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id);
        //当前id为事务头，进行提交
        if(tr && id === tr.id){
            tr.commit();
            //删除事务
            TransactionManager.del(tr);
        }
    }


    /**
     * 事务方法抛出异常时
     */
    async afterThrow(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id);
        if(tr){
            tr.rollback();
            TransactionManager.del(tr);
        }
        
    }
}