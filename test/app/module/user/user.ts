import { DateHandler } from "../common/datehandler";

/**
 * 测试用户
 */
class UserQuery{
    dateHandler:DateHandler;
    constructor(params:Object){
        console.log(params);
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
                // date:this.dateHandler.tickerToDTString((new Date()).valueOf())
            }
        }
    }
}

export {UserQuery};