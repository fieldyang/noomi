import { DBManager } from "./dbmanager";

interface ConnectionManager{
    //获取连接
    getConnection():Promise<any>;
    //释放连接
    release(conn:any):Promise<any>;
}

/**
 * 获取数据库或数据源连接
 * @return          promise connection
 */
async function getConnection():Promise<any>{
    let instance = DBManager.getConnectionManager();
    if(instance && typeof instance.getConnection === 'function'){
        let conn = await instance.getConnection();
        return conn;
    }
    return null;
};



export{ConnectionManager,getConnection}