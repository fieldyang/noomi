import { DateHandler } from "../common/datehandler";
import { Inject } from "../../../../core/ts/decorator";
class UserService{
    @Inject("dateHandler")
    dateHandler:DateHandler;

    constructor(params:Object){
        
    }
    /**
     * 获取用户信息
     */
    getInfo(){
        
        return {
            success:true,
            result:{
                userId:1,
                userName:'yang',
                date:this.dateHandler.tickerToDTString((new Date()).valueOf())
            }
        }
    }
}

export {UserService};