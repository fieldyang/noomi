import { Inject, Instance, Router, Route } from "../../../../core/decorator";
import { UserService } from "../service/userservice";
import { BaseAction } from "../../../../core/baseaction";
import { DataImpl } from "../service/dataimpl";

/**
 * 测试用户
 */
@Router({
    namespace:'/user',
    // path:'/'
})

class UserAction extends BaseAction{
    userName:string;
    @Inject("userService")
    userService:UserService;
    @Inject("dataImpl")
    dataImpl:DataImpl;
    
    async addres(){
        try{
            let r = await this.dataImpl.add();
            return{
                success:true,
                result:r
            }
        }catch(e){
            return {success:false,result:e};
        }
    }
    getUserName(){
        return this.userName;
    }

    @Route({
        path:'/getinfo',
        results:[{
            "value":1,
            "type":"redirect",
            "url":"/user/showinfo",
            "params":["userName"]
        },{
            "value":2,
            "type":"chain",
            "url":"/user/last",
            "params":["type"]
        }]
    })
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

    @Route('/showinfo')
    async showinfo(params){
        return await new Promise((resolve,reject)=>{
            if(params.userName === 'aaa'){
                resolve({
                    success:true,
                    result:1
                });
            }else{
                resolve({
                    success:true,
                    result:params.userName
                });
            }
        });
    }

    @Route('/last')
    last(params){
        return params.type;
        // return {
        //     info:"this is the last info"
        // }
    }

    async foo1(){
        let v = await this.userService.foo1();
        console.log(v);
    }

    async foo2(){
        let v = await this.userService.foo2();
        console.log(v);
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