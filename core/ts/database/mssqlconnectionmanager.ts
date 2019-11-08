import { ConnectionManager } from "./connectionmanager";
import { TransactionManager } from "./transactionmanager";
/**
 * 连接管理器
 */
class MssqlConnectionManager implements ConnectionManager{
    pool:any;
    connection:any;
    options:object;
    dbMdl:any;
    usePool:boolean;
    poolAlias:string;       //pool别名
    constructor(cfg){
        this.dbMdl = require('mssql');
        this.usePool = cfg.usePool || false;
        //设置自动提交为false
        // if(cfg.useTransaction){
        //     this.dbMdl.autoCommit = false;
        // }
        delete cfg.useTransaction;
        delete cfg.usePool;
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

        if(this.usePool){
            if(!this.pool){
                this.pool = new this.dbMdl.ConnectionPool(this.options);
            }
            try{
                return await this.pool.connect();
            }catch(e){
                console.log(e);
            }
            
        }else{
            return await this.dbMdl.connect(this.options);
        }
    }

    /**
     * 释放连接
     * @param conn 
     */
    async release(conn:any){
        if(!conn){
            return;
        }
        if(this.pool){
            conn.close({drop:false});
        }else{
            try{
                await conn.close();
            }catch(e){
                console.log(e);
            }
        }
    }
}


export{MssqlConnectionManager}