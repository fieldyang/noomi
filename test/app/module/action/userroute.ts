import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Instance, Router, Route, DataModel } from "../../../../core/tools/decorator";
import { MUser } from "../model/muser";


@Router({
    namespace:'/userop',
    path:'/'
})

@DataModel(MUser)
export class UserRoute extends BaseRoute{
    add(){
        console.log(this.model);
    }
    
}