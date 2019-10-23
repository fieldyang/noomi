import { Transaction } from "../../../../core/ts/transactionmanager";

class MysqlTransaction extends Transaction{
    async begin(){
        if(this.isBegin){
            return;
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
            this.connection.commit((err)=>{
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