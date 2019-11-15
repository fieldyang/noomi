import { BaseAction } from "../../../../core/main/route/baseaction";
import { User } from "../dao/pojo/user";
import { SecurityFactory } from "../../../../core/tools/securityfactory";
import { GroupUser } from "../dao/pojo/groupuser";
import { Group } from "../dao/pojo/group";
import { OrmFactory } from "../dao/impl/ormfactory";
import { Instance, Router, Route } from "../../../../core/tools/decorator";
import { getConnection, closeConnection } from "../../../../core/database/connectionmanager";


@Router({
    namespace:'/user'
})
export class LoginAction extends BaseAction{
    toPage:string;
    @Route({
        "path":"/login",
        "results":[{
            "type":"redirect",
            "url":"${toPage}"
        }]
    })
    async login(){
        let un = this.model.userName;
        let pwd = this.model.pwd;
        let conn = await getConnection();
        
        try{
            let rows:any = await new Promise((res,rej)=>{
                conn.query('select user_id from t_user where user_name=? and user_pwd=? limit 1',[un,pwd],(err,r)=>{
                    if(err){
                        rej(err);
                    }
                    res(r);
                });
            });
            let user:number;
            if(rows.length !== 0){
                user = rows[0].user_id;
            }
            
            if(user){
                rows = await new Promise((res,rej)=>{
                    conn.query('select group_id from t_group_user where user_id=?',[user],(err,r)=>{
                        if(err){
                            rej(err);
                        }
                        res(r);
                    });
                }); 
                let gids:Array<number> = [];
                for(let r of rows){
                    gids.push(r.group_id);
                }
                
                //添加到securityfactory
                await SecurityFactory.addUserGroups(user,gids,this.request);
                this.toPage = await SecurityFactory.getPreLoginInfo(this.request);
                if(!this.toPage){
                    this.toPage = '/pages/loginsuccess.html';
                }
            }else{
                this.toPage = '/pages/loginfail.html';
            }
        }catch(e){
            console.log(e);
        }finally{
            closeConnection(conn);
        }
    }
}