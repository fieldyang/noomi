import { InstanceFactory } from "./instancefactory";
import { getConnection } from "./connectionmanager";
import { AopFactory } from "./aopfactory";
import { TransactionAdvice } from "./transactionadvice";
import { NoomiError } from "./errorfactory";

class TransactionManager{
    static transactionMap:Map<number,Transaction> = new Map();  //transaction map
    static transactionMdl:string;                               //transaction 实例名
    static expressions:Array<string>;                           //纳入事务的过滤串
    static init(cfg:any){
        this.transactionMdl = cfg.transaction;
        //添加Aspect
        //初始化security filter
        let adviceInstance = InstanceFactory.addInstance({
            name:'NoomiTransactionAdvice',           //实例名
            instance:new TransactionAdvice(),
            class_name:'TransactionAdvice'
        });

        //切点名
        const pointcutId = "Noomi_TX_PointCut";
        //增加pointcut
        if(cfg.pointcut){
            AopFactory.addPointcut(pointcutId,cfg.pointcut);
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
    }


    /**
     * 获取transaction
     * @param id        asyncid
     * @param parentId  父id
     * @param type      transaction type
     * @return          transacton
     */
    static async get(id?:number,parentId?:number,type?:TransactionType):Promise<Transaction>{
        if(!id){
            let hooks = require('async_hooks');
            id = hooks.executionAsyncId();
            parentId = hooks.triggerAsyncId();
        }
        let tr:Transaction;
        if(parentId && this.transactionMap.has(parentId)){ //父对象有transaction 则直接用父亲对象的
            tr = this.transactionMap.get(parentId);
            tr.asyncIds.push(id);
            this.transactionMap.set(id,tr);
        }else{          //父亲对象不存在，则新建
            let conn = await getConnection();
            tr = InstanceFactory.getInstance(this.transactionMdl,[id,conn]);
            this.transactionMap.set(id,tr);
        }
        return tr;
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
            id = require('async_hooks').executionAsyncId();
        }
        if(!this.transactionMap.has(id)){
            return null;
        }
        let tr:Transaction = this.transactionMap.get(id);
        return tr.connection;
    }

    /**
     * 设置connection
     * @param id        transaction id
     * @param conn      connection
     */
    static setConnection(id:number,conn:any){
        if(!this.transactionMap.has(id)){
            return;
        }
        let tr:Transaction = this.transactionMap.get(id);
        tr.connection = conn;
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


class Transaction{
    id:number;
    connection:any;
    src:TransactionSource;
    type:TransactionType;
    isBegin:boolean;
    asyncIds:Array<number>=[];     //绑定的的async id
    constructor(id:number,connection?:any,type?:TransactionType){
        this.id = id; 
        this.connection = connection;
        this.type = type || TransactionType.NESTED;
        this.asyncIds.push(id);
    }
    begin():void{
        this.isBegin = true;
    }
    commit():void{}
    rollback():void{}
}

enum TransactionType {
    NESTED,         //嵌套（默认）
    NEW             //新建
}

enum TransactionSource{
    MYSQL='mysql',
    ORACLE='oracle',
    MSSQL='mssql',
    MONGODB='mongodb',
    SEQUALIZE='sequalize',
    TYPEORM='typeorm'
}

export {TransactionManager,Transaction,TransactionType}