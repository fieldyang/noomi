import { ConnectionManager } from "./connectionmanager";
import { Db } from "typeorm";

/**
 * 连接管理器
 */
class MysqlConnectionManager extends ConnectionManager{
    pool:any;
    connection:any;
    options:object;
    dbMdl:any;
    constructor(cfg){
        super(cfg);
        this.dbMdl = require('mysql');
        if(cfg.usepool){
            delete cfg.usepool;
            this.pool = this.dbMdl.createPool(cfg);
        }
        delete cfg.usepool;
        this.options = cfg;
    }

    /**
     * 获取连接
     */
    async getConnection(){
        let conn = this.getTransactionConnection();
        if(conn){
            return conn;
        }
        if(this.pool){
            return new Promise((resolve,reject)=>{
                this.pool.getConnection((err,conn)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(conn);
                });
            });
        }else{
            return  await this.dbMdl.createConnection(this.options);
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
            conn.end(err=>{
                console.log(err);
            });
        }
    }
}


export{MysqlConnectionManager}