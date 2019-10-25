import { ConnectionManager } from "../../../../core/ts/connectionmanager";

/**
 * 连接管理器
 */
class MysqlConnectionManager extends ConnectionManager{
    pool:any;
    async getConnection(){
        let conn = this.getTransactionConnection();
        if(conn){
            return conn;
        }
        if(!this.pool){
            const db = require('mysql');
            this.pool = db.createPool({
                connectionLimit:10,
                host:'localhost',
                user:'root',
                password:'field',
                database:'codement'
            });
        }
        
        return new Promise((resolve,reject)=>{
            this.pool.getConnection((err,conn)=>{
                if(err){
                    reject(err);
                }
                resolve(conn);
            });
        });
    }
}


export{MysqlConnectionManager}