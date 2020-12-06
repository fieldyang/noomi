import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Instance, Router, Route, DataModel, NullCheck } from "../../../../core/tools/decorator";
import { MUser } from "../model/muser";


@Router({
    namespace:'/user/op',
    path:'/'
})

@DataModel(MUser)
export class UserRoute extends BaseRoute{
    @NullCheck(['userName'])
    add(){
        console.log(this.model);
        return {success:true};
    }
}