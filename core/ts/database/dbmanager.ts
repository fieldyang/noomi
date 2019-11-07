import { NoomiError } from "../errorfactory";
import { ConnectionManager } from "./connectionmanager";
import { MysqlConnectionManager } from "./mysqlconnectionmanager";
import { InstanceFactory } from "../instancefactory";
import { TransactionManager } from "./transactionmanager";
import { SequelizeConnectionManager } from "./sequelizeconnectionmanager";


class DBManager{
    static connectionManagerName:string;    //连接管理器名
    static transactionName:string;          //事务类名
    static product:string;                       //数据库类型
    static init(cfg:any){
        //数据库默认mysql
        let product:string = cfg.product||'mysql';
        this.product = product;
        //connection manager配置
        let cm:any;
        //先查询是否有自定义的connection manager
        if(cfg.connection_manager){
            cm = InstanceFactory.getInstance(cfg.connection_manager);
        }
        //新建connection manager
        if(!cm && product){
            let opt = cfg.options;
            opt.usePool = cfg.use_pool;
            switch(product){
                case "mysql":
                    cm = new MysqlConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cfg.connection_manager,
                        instance:cm,
                        class:MysqlConnectionManager,
                        singleton:true
                    });
                    break;
                case "mssql":

                    break;
                case "oracle":

                    break;
                case "mongodb":
                    
                    break;
                case "sequelize":
                    cm = new SequelizeConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cfg.connection_manager,
                        instance:cm,
                        class:SequelizeConnectionManager,
                        singleton:true
                    });
                    break;
                case "typeorm":

                    break;
            }
        }
        this.connectionManagerName = cfg.connection_manager;
        //事务配置
        if(cfg.transaction){
            let opt = cfg.transaction;
            opt.product = product;
            opt.connection_manager = cfg.connection_manager;
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
            throw new NoomiError("2800") + e;
        }
    }
}

export{DBManager}