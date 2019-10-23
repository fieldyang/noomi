import { Transaction, TransactionManager } from "./transactionmanager";
import { Aspect } from "./decorator";

export class TransactionAdvice{
    /**
     * 事务方法调用前
     */
    async before(){
        let tr:Transaction = await TransactionManager.get();
        tr.begin();
    }

    /**
     * 事务方法返回时
     */
    async afterReturn(){
        let id = require('async_hooks').executionAsyncId();
        let tr:Transaction = await TransactionManager.get(id);
        //当前id为事务头，进行提交
        if(id === tr.asyncIds[0]){
            tr.commit();
        }
        //删除事务
        TransactionManager.del(tr);
    }


    /**
     * 事务方法抛出异常时
     */
    async afterThrow(){
        let id = require('async_hooks').executionAsyncId();
        let tr:Transaction = await TransactionManager.get();
        tr.rollback();
        TransactionManager.del(tr);
    }
}