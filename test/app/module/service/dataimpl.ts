import { getConnection } from "../../../../core/database/connectionmanager";
import { Transactional, Instance, Transactioner } from "../../../../core/decorator";

@Transactioner()
@Instance('dataImpl')
class DataImpl{
    // @Transactional()
    async addRes(url:string){
        //mysql
        let sql:string = "insert into t_resource(resource_id,url) values(15,'"+url+"')";
        let r = await new Promise(async (resolve,reject)=>{
            let conn = await getConnection();
            conn.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        }); 
        
        //oracle
        // let sql:string = "insert into t_resource(resource_id,url) values(13,'"+url+"')";
        // let conn = await getConnection();
        // let r = await conn.execute(sql);
        
        //mssql
        // let sql:string = "insert into t_resource(resource_id,url) values(14,'"+url+"')";
        // let conn = await getConnection();
        // let r = await conn.query(sql);


        //sequelize
            
        // const res = new Resource({
        //     resourceId:13,
        //     url:'/test/test'
        // })
        // let r1 = await res.save();
        return 2;
        
    }
    // @Transactional()
    async addResAuth(){
        //mysql
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

        //oracle
        // let sql:string = "insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values(2,3,4)";
        // let conn = await getConnection();
        // let r = await conn.execute(sql);
        
        //mssql
        // let sql:string = "insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values(2,3,4)";
        // let conn = await getConnection();
        // try{
        //     let r = await conn.query(sql);
        // }catch(e){
        //     console.log(e);
        // }
        
        //sequelize
        // const res = new ResourceAuthority({
        //     resourceId:13,
        //     authorityId:2
        // })
        // let r1 = await res.save();
        return 1;
    }
    
    // @Transactional()
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