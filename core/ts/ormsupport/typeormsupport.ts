import { Connection,createConnection,ConnectionManager,getConnection} from "typeorm";


class TypeormSupport implements OrmSupport{
    connection:Connection;
    connManager:ConnectionManager; //连接管理器
    constructor(cfg:any){
        this.connManager = new ConnectionManager();
        this.connManager.create({
            "type":"mysql",
            "host":"localhost",
            "port":3306,
            "username":"root",
            "password":"field",
            "database":"codement",
            "entities": [
                "build/test/app/module/dao/pojo/*.js"
            ],
            "logging":true,
            "extra":{
                "connectionLimit":10
            }
        });
    }

    async getConnection(name){
        let conn;
        
        if(typeof name === 'string'){
            conn = this.connManager.get(name);
        }else{
            conn = this.connManager.get();
        }
        if(!conn.isConnected){  //未连接，则先连接
            await conn.connect();
        }
        return conn;
    }
}

export{TypeormSupport}