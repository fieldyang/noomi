import { Connection,ConnectionManager,getConnection} from "typeorm";

class TypeormSupport implements OrmSupport{
    connection:Connection;
    connManager:ConnectionManager; //连接管理器
    constructor(cfg:any){
        this.connManager = new ConnectionManager();
        this.connManager.create(cfg);
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