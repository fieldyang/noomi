import { NoomiError } from "../errorfactory";
import { MysqlConnectionManager } from "./mysqlconnectionmanager";
import { InstanceFactory } from "../instancefactory";
import { TransactionManager } from "./transactionmanager";
import { SequelizeConnectionManager } from "./sequelizeconnectionmanager";
import { App } from "../application";
import { OracleConnectionManager } from "./oracleconnectionmanager";
import { MssqlConnectionManager } from "./mssqlconnectionmanager";


class DBManager{
    static connectionManagerName:string;    //连接管理器名
    static transactionName:string;          //事务类名
    static product:string;                  //数据库类型
    
    static init(cfg:any){
        //数据库默认mysql
        let product:string = cfg.product||'mysql';
        
        this.product = product;
        //connection manager配置
        let cm:any;
        let cmName:string = cfg.connection_manager || 'noomi_connection_manager';
        //先查询是否有自定义的connection manager
        if(cfg.connection_manager){
            cm = InstanceFactory.getInstance(cmName);
        }
        //新建connection manager
        if(!cm && product){
            let opt = cfg.options;
            opt.usePool = cfg.use_pool;
            //设置是否使用transaction标志
            opt.useTransaction = cfg.transaction?true:false;
        
            switch(product){
                case "mysql":
                    cm = new MysqlConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cmName,
                        instance:cm,
                        class:MysqlConnectionManager
                    });
                    break;
                case "mssql":
                    cm = new MssqlConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cmName,
                        instance:cm,
                        class:MssqlConnectionManager
                    });
                    break;
                case "oracle":
                    cm = new OracleConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cmName,
                        instance:cm,
                        class:OracleConnectionManager
                    });
                    break;
                case "mongodb":
                    
                    break;
                case "sequelize":
                    cm = new SequelizeConnectionManager(opt);
                    InstanceFactory.addInstance({
                        name:cfg.cmName,
                        instance:cm,
                        class:SequelizeConnectionManager,
                        singleton:true
                    });
                    break;
                case "typeorm":

                    break;
            }
        }
        this.connectionManagerName = cmName;
        //事务配置
        if(cfg.transaction){
            let opt = cfg.transaction;
            opt.product = product;
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
        //读取文件
        let json:any = null;
        try{
            let jsonStr:string = App.fs.readFileSync(App.path.posix.join(process.cwd(),path),'utf-8');
            json = App.JSON.parse(jsonStr);
            this.init(json);    
        }catch(e){
            throw new NoomiError("2800") + '\n' + e;
        }
    }
}

export{DBManager}