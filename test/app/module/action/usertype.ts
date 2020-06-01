import { Inject, Instance, Router, Route } from "../../../../core/tools/decorator";
import { BaseRoute } from "../../../../core/main/route/baseroute";

/**
 * 测试用户
 */
@Router({
    namespace:'/user/info/type',
    path:'/'
})

class UserType extends BaseRoute{
    gettype(){
        return {'userType':1};
    }
}

export {UserType};