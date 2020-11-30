import { NoomiTransaction, TransactionType } from "./noomitransaction";
import { DBManager } from "./dbmanager";
import { Transaction, Connection ,getConnection } from "relaen";
/**
 * relaen 事务类
 */
class RelaenTransaction extends NoomiTransaction{
    private tr:Transaction;
    constructor(id:number,connection?:any,type?:TransactionType){
        super(id,connection,type);
        
    }
    
    async begin(){
        if(!this.tr){
            let cm:Connection = await getConnection();
            this.tr = cm.createTransaction();
        }
        this.tr.begin();
    }

    async commit(){
        if(!this.tr){
            return;
        }
        this.tr.commit();
    }

    async rollback(){
        if(!this.tr){
            return;
        }
        this.tr.rollback();
    }
}

export {RelaenTransaction};