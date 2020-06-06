import { Instance, Inject } from "../../../../core/tools/decorator";
import { UserService } from "./userservice";

@Instance("testHook")
export class TestHook{
    haha(firstName:string,show:boolean){
        if(show){
            console.log('hahaha"' + firstName + '"');
        }else{
            console.log('hahaha');
        }
        
    }
}