import { TransactionManager } from "./transactionmanager";
import { InstanceFactory } from "./instancefactory";


class ConnectionManager{
    getConnection():any{};      //获取连接
    static currentManager:any;  //当前manager
    
    /**
     * 返回asyncId，triggerId
     */
    getIds(){
        let hooks = require('async_hooks');
        return[hooks.executionAsyncId(),hooks.triggerAsyncId()];
    }

    /**
     * 获取transaction 自带的connection
     * @param id 
     */
    getTransactionConnection(){
        return TransactionManager.getConnection();
    }

    static setManager(instanceName:string){
        let instance = InstanceFactory.getInstance(instanceName);
        if(instance){
            this.currentManager = instance;
        }
    }
}

let getConnection = async ()=>{
    let instance = InstanceFactory.getInstance('NoomiConnectionManager');
    if(instance && typeof instance.getConnection === 'function'){
        let conn = await instance.getConnection();
        return conn;
    }
    return null;
};

export{ConnectionManager,getConnection}