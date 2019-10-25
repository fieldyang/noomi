import { Transaction } from "../../../../core/ts/transactionmanager";
import { getConnection } from "../../../../core/ts/connectionmanager";

class MysqlTransaction extends Transaction{
    async begin():Promise<void>{
        if(this.isBegin){
            return;
        }
        this.isBegin = true;
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

    async commit(){
        if(!this.isBegin){
            return;
        }
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

    async rollback(){
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