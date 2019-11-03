import { Inject, Instance } from "../../../../core/ts/decorator";
import { UserService } from "../service/userservice";
import { BaseAction } from "../../../../core/ts/baseaction";
import { DataImpl } from "../service/dataimpl";

/**
 * 测试用户
 */
@Instance({
    name:'userAction',
    singleton:true
})
class UserAction extends BaseAction{
    userName:string;
    // @Inject("userService")
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
    getinfo(params){
        // if(params.type==1){
        //     this.userName = 'aaa';
        //     return 1;
        // }else if(params.type==2){
        //     this.userName = 'bbb';
        //     return 2;
        // }
        let ui = this.userService.getInfo(params);
        return {
            success:true,
            result:ui
        }
    }

    async showinfo(params){
        await new Promise((resolve,reject)=>{
            if(params.userName === 'aaa'){
                resolve(1);
                return;
            }
            resolve({
                success:true,
                result:params.userName
            });
        });
    }

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