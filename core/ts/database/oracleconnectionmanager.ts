import { ConnectionManager } from "./connectionmanager";
/**
 * 连接管理器
 */
class MysqlConnectionManager implements ConnectionManager{
    pool:any;
    connection:any;
    options:object;
    dbMdl:any;
    usePool:boolean;
    poolAlias:string;       //pool别名
    constructor(cfg){
        this.dbMdl = require('oracledb');
        this.usePool = cfg.use_pool || false;
        this.poolAlias = cfg.cfg.poolAlias;
        delete cfg.usepool;
        this.options = cfg;
    }

    /**
     * 获取连接
     */
    async getConnection(){
        // let conn = this.getTransactionConnection();
        let conn;
        if(conn){
            return conn;
        }

        if(this.usePool){
            if(!this.pool){
                this.pool = await this.dbMdl.createPool(this.options);
            }
            return await this.dbMdl.getPool(this.poolAlias).getConnection();
        }else{
            await this.dbMdl.createConnection(this.options);
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
            conn.release();
        }else{
            try{
                await conn.close();
            }catch(e){
                console.log(e);
            }
        }
    }
}


export{MysqlConnectionManager}