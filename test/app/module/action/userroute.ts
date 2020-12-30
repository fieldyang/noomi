import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Instance, Router, Route, DataModel, NullCheck, Inject } from "../../../../core/tools/decorator";
import { MUser } from "../model/muser";
import { UserService } from "../service/userservice";


@Router({
    namespace:'/user/op',
    path:'/'
})

@DataModel(MUser)
export class UserRoute extends BaseRoute{
    @Inject('userService')
    userService:UserService;
    // @NullCheck(['userName'])
    async add(){
        try{
            const fs = require('fs');
            let pathMdl = require('path');
            let path = pathMdl.resolve('log.out');
            let st = new Date().getTime();
            for(let i=0;i<100;i++){
                await this.userService.addUser1();
            }

            fs.writeFileSync(path,(new Date().getTime()-st).toString());
            return{success:true};
        }catch(e){
            console.log(e);
            return{success:false,result:e};
        }
    }
}