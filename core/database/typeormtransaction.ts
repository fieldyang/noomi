import { Transaction } from "./transaction";
/**
 * mysql 事务类
 */
class TypeormTransaction extends Transaction{
    manager:any;
    
    async begin():Promise<void>{}

    async commit():Promise<void>{}

    async rollback():Promise<void>{}
}

export {TypeormTransaction};