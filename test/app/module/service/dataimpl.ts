import { Resource } from "../dao/pojosequelize/resource";
import { ResourceAuthority } from "../dao/pojosequelize/resourceauthority";
import { TransactionManager } from "../../../../core/ts/database/transactionmanager";
import { Transaction } from "../../../../core/ts/decorator";
import { getConnection } from "../../../../core/ts/database/connectionmanager";

// @Instance({
//     name:'dataImpl',
//     singleton:true
// })
class DataImpl{
    @Transaction()
    async addRes(url:string){
        //mysql
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
        


        //sequelize
            
        // const res = new Resource({
        //     resourceId:13,
        //     url:'/test/test'
        // })
        // let r1 = await res.save();
        return 2;
        
    }
    @Transaction()
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

        //sequelize
        // const res = new ResourceAuthority({
        //     resourceId:13,
        //     authorityId:2
        // })
        // let r1 = await res.save();
        return 1;
    }
    
    @Transaction()
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