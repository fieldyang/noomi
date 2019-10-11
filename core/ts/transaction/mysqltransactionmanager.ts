import { Transaction } from "./transaction";

/**
 * mysql tranaction manager
 * mysql事务管理器
 */

export class MysqlTransactionManager{
    //mysql module
    moduleDb:NodeModule;
    //事务map，存放transaction
    transactionMap:Map<string,Transaction>;
    
    constructor(){
        this.moduleDb = require('mysql');
        this.transactionMap = new Map();
    }

    getTransaction():Transaction{
        
        return null;
    }
}