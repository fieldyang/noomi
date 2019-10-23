import { getConnection } from "../../../../core/ts/connectionmanager";
class DataImpl{
    async addRes(url:string){
        let sql:string = "insert into t_resource(resource_id,url) values(12,'"+url+"')";
        let r = await new Promise(async (resolve,reject)=>{
            let conn = await getConnection();
            conn.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        }); 
    }

    async addResAuth(){
        let sql:string = "insert into t_resource_authority(resource_id,authority_id) values(3,4)";
        let r = await new Promise(async (resolve,reject)=>{
            let conn = await getConnection();
            conn.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    

    async add(){
        await this.addResAuth();
        await this.addRes('/testtran');
    }
}

export{DataImpl}