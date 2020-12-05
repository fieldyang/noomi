import { BaseModel } from "../../../../core/tools/model";
import { DataType, DataValidator} from "../../../../core/tools/decorator";

export class MUser extends BaseModel{

    @DataType('int')
    @DataValidator({
        min:1
    })
    userId:number;

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

}