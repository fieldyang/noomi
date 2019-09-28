import { Inject } from "../../../../core/ts/decorator";
import { UserService } from "../service/userservice";
import { BaseAction } from "../../../../core/ts/baseaction";

/**
 * 测试用户
 */
class UserAction extends BaseAction{
    userName:string;
    @Inject("userService")
    userService:UserService;
    
    
    getUserName(){
        return this.userName;
    }
    getinfo(params){
        if(params.type==1){
            this.userName = 'aaa';
            return 1;
        }else if(params.type==2){
            this.userName = 'bbb';
            return 2;
        }
        let ui = this.userService.getInfo(params);
        return {
            success:true,
            result:ui
        }
    }

    showinfo(params){
        return new Promise((resolve,reject)=>{
            if(params.userName === 'aaa'){
                resolve(1);
                return;
            }
            resolve({
                success:true,
                result:params.userName
            });
        });
    }

    last(params){
        return params.type;
        // return {
        //     info:"this is the last info"
        // }
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