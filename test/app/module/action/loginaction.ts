import { BaseAction } from "../../../../core/ts/baseaction";
import { OrmFactory } from "../../../../core/ts/ormfactory";
import { User } from "../dao/pojo/user";
import { SecurityFactory } from "../../../../core/ts/securityfactory";
import { GroupUser } from "../dao/pojo/groupuser";
import { Group } from "../dao/pojo/group";
import { RedisFactory } from "../../../../core/ts/redisfactory";

export class LoginAction extends BaseAction{
    toPage:string = '/pages/loginsuccess.html';
    async login(){
        let un = this.model.userName;
        let pwd = this.model.pwd;
        let conn = await OrmFactory.getConnection();
        const user = await conn
                .getRepository(User)
                .createQueryBuilder("u")
                .where("u.userName = :name && u.userPwd = :pwd", {name:un, pwd:pwd})
                .getOne();
        let result;
        if(user){
            let gus = await conn.getRepository(GroupUser)
                .createQueryBuilder("gu")
                .where("gu.user.userId = :id", { id: parseInt(user.userId) })
                .getMany();
            
            let groupRepository = conn.getRepository(Group);
            let groups = await groupRepository.createQueryBuilder("group")
                        .leftJoinAndSelect("group.groupUsers","groupUser")
                        .where("groupUser.user.userId=:id",{id:user.userId})
                        .getMany();
            let ga = [];
            for(let  g of groups){
                ga.push(g.groupId);
            }
            //添加到securityfactory
            SecurityFactory.addUserGroups(user.userId,ga,this.request);
            this.toPage = await SecurityFactory.getPreLoginPage(this.request.getSession());
        }else{
            this.toPage = '/pages/loginfail.html';
        }
        // NoomiHttp.writeDataToClient(this.response,{data:result});
    }
}