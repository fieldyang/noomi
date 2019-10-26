import { TransactionManager } from "./transactionmanager";
import { App } from "../application";
import { getConnection } from "./connectionmanager";
import { Transaction } from "./transaction";

export class TransactionAdvice{
    /**
     * 事务方法调用前
     */
    async before(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id,true);
        //connection 未初始化，初始化connection
        if(!tr.connection){
            tr.connection = await getConnection();
        }
        tr.trIds.push(id);
        if(tr.isBegin){
            return;
        }
        tr.isBegin = true;
        tr.begin();
    }

    /**
     * 事务方法返回时
     */
    async afterReturn(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id);
        if(!tr || !tr.isBegin){
            return;
        }
        
        tr.trIds.pop();
        //当前id为事务头，进行提交
        if(tr.trIds.length===0){
            tr.commit();
            //删除事务
            TransactionManager.del(tr);
            //释放连接
            TransactionManager.releaseConnection(tr);
        }
    }


    /**
     * 事务方法抛出异常时
     */
    async afterThrow(){
        let id = App.asyncHooks.executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id);
        if(!tr || tr.isBegin){
            return;
        }
        if(tr){
            tr.trIds.pop();
            tr.rollback();
            TransactionManager.del(tr);
            //释放连接
            TransactionManager.releaseConnection(tr);
        }
    }
}