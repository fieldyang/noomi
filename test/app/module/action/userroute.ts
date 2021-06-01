import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Instance, Router, Route, DataModel, NullCheck, Inject } from "../../../../core/tools/decorator";
import { MUser } from "../model/muser";
import { UserService } from "../service/userservice";
import { RBase } from "./rbase";


@Router({
    namespace:'/user/op',
    path:'/'
})

@DataModel(MUser)
export class UserRoute extends RBase{
    @Inject('userService')
    userService:UserService;
    // @NullCheck(['userName'])
    async add(){
        // try{
        //     console.log(this.model);
        //     const fs = require('fs');
        //     let pathMdl = require('path');
        //     let path = pathMdl.resolve('log.out');
        //     await this.userService.addUser1();
        //     return{success:true};
        // }catch(e){
        //     console.log(e);
        //     return{success:false,result:e};
        // }
    }
}