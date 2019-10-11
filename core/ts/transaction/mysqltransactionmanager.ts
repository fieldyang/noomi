import { Transaction } from "./transaction";

/**
 * mysql tranaction manager
 * mysql事务管理器
 */

export class MysqlTransactionManager{
    moduleDb:NodeModule;
    transactions:Array<Transaction> = [];
    
    constructor(){
        this.moduleDb = require('mysql');
    }

    getTransaction():Transaction{

        return null;
    }

}