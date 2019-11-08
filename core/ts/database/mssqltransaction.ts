import { Transaction } from "./transaction";
import { getConnection } from "./connectionmanager";

/**
 * oracle 事务类
 */
class MssqlTransaction extends Transaction{
    tr:any;
    async begin():Promise<void>{
        if(!this.connection){
            this.connection = await getConnection();
        }
        this.tr = await this.connection.transaction();
    }

    async commit():Promise<void>{
        await this.tr.commit();
    }

    async rollback():Promise<void>{
        await this.tr.rollback();
    }
}


export {MssqlTransaction};