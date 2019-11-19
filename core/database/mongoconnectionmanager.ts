import { TransactionManager } from "./transactionmanager";
import { ConnectionManager } from "./connectionmanager";


/**
 * 连接管理器
 */
class MongoConnectionManager implements ConnectionManager{
    pool:any;
    usePool:boolean;
    connection:any;
    options:object;
    dbMdl:any;
    constructor(cfg){
        this.dbMdl = require('mongodb');
        this.options = cfg;
    }

    /**
     * 获取连接
     */
    async getConnection(){
        let conn = TransactionManager.getConnection();
        if(conn){
            return conn;
        }
        const client = new this.dbMdl.MongoClient(this.options['url']); 
        await client.connect();
        return client;
    }

    /**
     * 释放连接
     * @param conn 
     */
    async release(conn:any){
        if(!conn){
            return;
        }
        conn.close();
    }
}


export{MongoConnectionManager}