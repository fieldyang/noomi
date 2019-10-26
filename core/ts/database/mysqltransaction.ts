import { Transaction } from "./transaction";
import { getConnection } from "./connectionmanager";
/**
 * mysql 事务类
 */
class MysqlTransaction extends Transaction{
    async begin():Promise<void>{
        if(!this.connection){
            this.connection = await getConnection();
        }
        
        return new Promise((resolve,reject)=>{
            this.connection.beginTransaction((err,conn)=>{
                if(err){
                    reject(err);
                }
                this.isBegin = true;
                resolve();
            });
        });
    }

    async commit():Promise<void>{
        return new Promise((resolve,reject)=>{
            this.connection.commit((err)=>{
                if(err){
                    reject(err);
                }
                this.isBegin = false;
                resolve();
            });
        });
    }

    async rollback():Promise<void>{
        if(!this.isBegin){
            return;
        }
        return new Promise((resolve,reject)=>{
            this.connection.rollback((err)=>{
                if(!err){
                    reject(err);
                }
                this.isBegin = false;
                resolve();
            });
        });
    }
}

export {MysqlTransaction};