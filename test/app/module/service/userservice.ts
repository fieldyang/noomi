import { Transactioner, Instance } from "../../../../core/tools/decorator";
import { getConnection } from "../../../..";
import { WebConfig } from "../../../../core/web/webconfig";

//Transactioner注解器把UserService类的所有方法注册为事务方法
@Transactioner()
@Instance('userService')
export class UserService{
    constructor(){
        console.log(WebConfig.cors);
    }

    sayHello(){
        console.log('hello');
    }
    async addUser(
        name:string,
        age:string,
        mobile:string):Promise<number>{
        let conn:any = await getConnection();
        let r:any = await new Promise((resolve,reject)=>{
            conn.query('insert into t_user(name,age,mobile) values(?,?,?)',
            [name,age,mobile],
            (err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
        return r.insertId;
    }
    async addUserWithId(
        id:string,
        name:string,
        age:string,
        mobile:string):Promise<number>{
        let conn:any = await getConnection();
        let r:any = await new Promise((resolve,reject)=>{
            conn.query('insert into t_user(id,name,age,mobile) values(?,?,?,?)',
            [id,name,age,mobile],
            (err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
        return r.insertId;
    }
    async addTwoUser(id:string,
        name:string,
        age:string,
        mobile:string):Promise<any>{
        //如果传入的主键id在数据表中已经存在，则会回滚事务，
        // 否则添加两条name age mobile相同，id不同的数据记录
        await this.addUser(name,age,mobile);
        await this.addUserWithId(id,name,age,mobile);
    }
}