import { Inject, Instance, Router, Route, DataModel } from "../../../../core/tools/decorator";
import { BaseRoute } from "../../../../core/main/route/baseroute";
import { MUserType } from "../model/musertype";

/**
 * 测试用户
 */
@Router({
    namespace:'/user/info/type',
    path:'/'
})
@DataModel(MUserType)
class UserType extends BaseRoute{
    gettype(){
        return {'userType':1};
    }
}

export {UserType};