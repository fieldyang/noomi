import { Inject } from "../../../../core/ts/decorator";
import { UserService } from "../service/userservice";

/**
 * 测试用户
 */
class UserAction{
    
    @Inject("userService")
    userService:UserService;

    getinfo(){
        return this.userService.getInfo();
    }
}

export {UserAction};