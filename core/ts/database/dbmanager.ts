import { NoomiError } from "../errorfactory";
import { ConnectionManager } from "./connectionmanager";
import { MysqlConnectionManager } from "./mysqlconnectionmanager";
import { InstanceFactory } from "../instancefactory";
import { TransactionManager } from "./transactionmanager";
import { MysqlTransaction } from "./mysqltransaction";


class DBManager{
    static connectionManagerName:string;    //连接管理器名
    static transactionName:string;          //事务类名
    static init(cfg:any){
        //数据库默认mysql
        let db:string = cfg.db||'mysql';
        //connection manager配置
        let cm:ConnectionManager;
        //先查询是否有自定义的connection manager
        if(cfg.connectionmanager){
            cm = InstanceFactory.getInstance(cfg.connectionmanager);
        }
        //新建connection manager
        if(!cm && db){
            let opt = cfg.options;
            opt.usepool = cfg.usepool;
            switch(db){
                case "mysql":
                    cm = new MysqlConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cfg.connectionmanager,
                        instance:cm,
                        singleton:true
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
        this.connectionManagerName = cfg.connectionmanager;
        //事务配置
        if(cfg.transaction){
            let opt = cfg.transaction;
            opt.db = db;
            TransactionManager.init(opt);
        }
    }

    /**
     * 获取connection manager
     */
    static getConnectionManager(){
        return InstanceFactory.getInstance(this.connectionManagerName);
    }
    static parseFile(path:string){
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let json:any = null;
        try{
            let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
            json = JSON.parse(jsonStr);
            this.init(json);    
        }catch(e){
            throw new NoomiError("2800");
        }
    }
}

export{DBManager}