import { Transaction } from "./transaction";
import { getConnection } from "./connectionmanager";
/**
 * mysql 事务类
 */
class SequelizeTransaction extends Transaction{
    // tr:any; //sequelize transaction
    async begin():Promise<void>{
        // if(!this.connection){
        //     this.connection = await getConnection();
        // }
        // if(!this.tr){
        //     this.tr = await new Promise((resolve,reject)=>{
        //         this.connection.transaction(t=>{
        //             resolve(t);
        //         });
        //     });
        // }
    }

    async commit():Promise<void>{
        // if(!this.tr){
        //     return;
        // }
        // await this.tr.commit();
    }

    async rollback():Promise<void>{
        // if(!this.tr){
        //     return;
        // }
        // await this.tr.rollback();
    }
}

export {SequelizeTransaction};