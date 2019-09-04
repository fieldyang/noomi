import { Inject } from "../../../../core/ts/decorator";
import { UserService } from "../service/userservice";
import { BaseAction } from "../../../../core/ts/baseaction";

/**
 * 测试用户
 */
class UserAction extends BaseAction{
    @Inject("userService")
    userService:UserService;
    
    getinfo(){
        try{
            let data = this.userService.getInfo(this.model);
            return {success:true,result:data};
        }catch(e){
            return {success:false,result:e};
        }
    }
}

export {UserAction};