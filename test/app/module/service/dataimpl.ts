import { getConnection } from "../../../../core/ts/connectionmanager";
class DataImpl{
    async addRes(url:string){
        let sql:string = "insert into t_resource(resource_id,url) values(13,'"+url+"')";
        let r = await new Promise(async (resolve,reject)=>{
            let conn = await getConnection();
            conn.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        }); 
        return 2;
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
        return 1;
    }
    

    async add(){
        let r1 = await this.addResAuth();
        let r2 = await this.addRes('/testtran');
        
        if(r1 === 1 && r2 === 2){
            return true;
        }else{
            return false;
        }
    }
}

export{DataImpl}