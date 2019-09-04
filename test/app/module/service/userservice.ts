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
    getInfo(data:any){
        return {
            userId:data.id,
            userName:data.name,
            date:this.dateHandler.tickerToDTString((new Date()).valueOf())
        }
    }
}

export {UserService};