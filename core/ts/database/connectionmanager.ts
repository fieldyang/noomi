import { TransactionManager } from "./transactionmanager";
import { InstanceFactory } from "../instancefactory";
import { DBManager } from "./dbmanager";


class ConnectionManager{
    constructor(cfg:any){

    }
    /**
     * 获取连接
     */
    async getConnection():Promise<any>{};
    async release(conn:any):Promise<any>{};
    /**
     * 获取transaction 自带的connection
     * @param id 
     */
    getTransactionConnection(){
        return TransactionManager.getConnection();
    }
}

/**
 * 获取数据库或数据源连接
 * @return          promise connection
 */
async function getConnection():Promise<any>{
    let instance = DBManager.getConnectionManager();
    if(instance && typeof instance.getConnection === 'function'){
        let conn = await instance.getConnection();
        return conn;
    }
    return null;
};



export{ConnectionManager,getConnection}