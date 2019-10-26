import { InstanceFactory } from "../instancefactory";
import { getConnection, ConnectionManager } from "./connectionmanager";
import { AopFactory } from "../aopfactory";
import { TransactionAdvice } from "./transactionadvice";
import { NoomiError } from "../errorfactory";
import { App } from "../application";
import { MysqlTransaction } from "./mysqltransaction";
import { DBManager } from "./dbmanager";
import { Transaction } from "./transaction";

class TransactionManager{
    static transactionMap:Map<number,Transaction> = new Map();  //transaction map
    static transactionMdl:string;                               //transaction 实例名
    static expressions:Array<string>;                           //纳入事务的过滤串
    static connectionManager:ConnectionManager;                 //连接管理器
    static init(cfg:any){
        this.transactionMdl = cfg.transaction;
        //添加Aspect
        let adviceInstance = InstanceFactory.addInstance({
            name:'NoomiTransactionAdvice',           //实例名
            instance:new TransactionAdvice(),
            class:'TransactionAdvice'
        });

        //切点名
        const pointcutId = "NOOMI_TX_PointCut";
        //增加pointcut
        if(cfg.expressions){
            AopFactory.addPointcut(pointcutId,cfg.expressions);
        }

        //增加advice
        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'before',
            method:'before',
            instance:adviceInstance
        });

        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after-return',
            method:'afterReturn',
            instance:adviceInstance
        });

        AopFactory.addAdvice({
            pointcut_id:pointcutId,
            type:'after-throw',
            method:'afterThrow',
            instance:adviceInstance
        });

        //添加transaction到实例工厂，已存在则不再添加
        let tn:string = cfg.transaction;
        if(tn){
            let ins = InstanceFactory.getInstance(tn);
            if(ins === null){
                switch(cfg.db){
                    case "mysql":
                    InstanceFactory.addInstance({
                        name:tn,
                        class:MysqlTransaction,
                        singleton:false
                    });
                    break;
                    case "mssql":

                        break;
                    case "oracle":

                        break;
                    case "mongodb":
                        
                        break;
                    case "sequalize":

                        break;
                    case "typeorm":

                        break;
                }
            }
        }
        
        this.connectionManager = DBManager.getConnectionManager();
    }


    /**
     * 获取transaction
     * @param id        asyncid
     * @param newOne    如果不存在，是否新建
     * @return          transacton
     */
    static get(id?:number,newOne?:boolean):Transaction{
        let tr:Transaction;
        
        if(this.transactionMap.has(id)){
            tr = this.transactionMap.get(id);
        }else if(newOne){          //父亲对象不存在，则新建
            tr = InstanceFactory.getInstance(this.transactionMdl,[id]);
            this.transactionMap.set(id,tr);
        }
        return tr;
    }

    /**
     * 获取transaction
     * @param id        asyncid
     * @param parentId  父id
     * @return          transacton
     */
    static bindTransaction(id:number,parentId:number):void{
        if(!parentId || !this.transactionMap.has(parentId)){
            return;
        }
        let tr:Transaction = this.transactionMap.get(parentId);
        tr.asyncIds.push(id);
        this.transactionMap.set(id,tr);
    }

    /**
     * 删除事务
     * @param tranId 
     */
    static del(tr:Transaction){
        for(let id of tr.asyncIds){
            this.transactionMap.delete(id);
        }
    }

    /**
     * 获取connection
     */
    static getConnection(id?:number){
        if(!id){
            id = App.asyncHooks.executionAsyncId();
        }
        if(!this.transactionMap.has(id)){
            return null;
        }
        let tr:Transaction = this.transactionMap.get(id);
        return tr.connection;
    }

    /**
     * 释放连接
     * @param tr 
     */
    static releaseConnection(tr:Transaction){
        this.connectionManager.release(tr.connection);
    }

    /**
     * 解析实例配置文件
     * @param path      文件路径
     * @param mdlPath   模型路径
     */
    static parseFile(path:string){
        interface InstanceJSON{
            files:Array<string>;        //引入文件
            instances:Array<any>;       //实例配置数组
        }
        const pathTool = require('path');
        //读取文件
        let jsonStr:string = require("fs").readFileSync(pathTool.join(process.cwd(),path),'utf-8');
        let json:InstanceJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2800");
        }
        this.init(json);
    }
}

export {TransactionManager}