import { ConnectionManager } from "./connectionmanager";
import { TransactionManager } from "./transactionmanager";
import { MssqlTransaction } from "./mssqltransaction";
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
        if(this.usePool){
            this.pool = new this.dbMdl.ConnectionPool(this.options);
        }
    }

    /**
     * 获取连接
     */
    async getConnection(){
        let conn = TransactionManager.getConnection();
        if(conn){
            return conn;
        }

        let tr:any = TransactionManager.get(false);
        let co;
        if(this.usePool){
            if(tr){
                co = new this.dbMdl.Request(tr.tr);
            }else{
                let c = await this.pool.connect();
                co = c.request();
            }
            
        }else{
            if(tr){
                co = new this.dbMdl.Request(tr.tr);
            }else{
                let c = await this.dbMdl.connect(this.options);
                co = c.request();
            }
        }
        return co;
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
            conn._currentRequest.connection.close({drop:false});
        }else{
            try{
                await conn._currentRequest.connection.close();
            }catch(e){
                console.log(e);
            }
        }
    }
}


export{MssqlConnectionManager}