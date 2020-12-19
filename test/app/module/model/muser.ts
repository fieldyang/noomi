import { BaseModel } from "../../../../core/tools/model";
import { DataType, DataValidator} from "../../../../core/tools/decorator";

export class MUser extends BaseModel{

    @DataType('int')
    @DataValidator({
        between:[1,150]
    })
    age:number;

    @DataType('string')
    @DataValidator({
        betweenLength:[2,20]
    })
    userName:string;

    @DataType('string')
    @DataValidator({
        betweenLength:[6,20]
    })
    pwd:string;

    @DataType('string')
    @DataValidator({
        mobile:[]   
    })
    myMobile:string;

    @DataType('string')
    @DataValidator({
        email:[]   
    })
    myEmail:string;

    @DataType('string')
    @DataValidator({
        url:[]   
    })
    myHome:string;

    @DataType('string')
    @DataValidator({
        betweenLength:[6,20],
        checkPwd:[]
    })
    pwd2:string;

    @DataType('int')
    userTypeId:number;

    /**
     * 自定义验证
     * @param value 
     */
    checkPwd(value){
        if(this['pwd'] === value){
            return null;
        }
        return "密码和验证密码不一致";
    }
}