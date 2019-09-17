import { Inject } from "../../../../core/ts/decorator";
import { UserService } from "../service/userservice";
import { BaseAction } from "../../../../core/ts/baseaction";

/**
 * 测试用户
 */
class UserAction extends BaseAction{
    @Inject("userService")
    userService:UserService;
    
    getinfo(params){
        try{
            let data = this.userService.getInfo(params);
            return {success:true,result:data};
        }catch(e){
            return {success:false,result:e};
        }
    }

    async getfile(){
        let re = await this.userService.getFile();
        re.next();
        /*try{
            let re = this.userService.getFile();
            return re;
        }catch(e){
            return {success:false,result:e};
        }*/
    }
}

export {UserAction};