import { BaseModel } from "../../../../core/tools/model";
import { DataType, DataValidator} from "../../../../core/tools/decorator";

export class MUserType extends BaseModel{

    @DataType('int')
    userTypeId:number;

    @DataType('string')
    @DataValidator({
        betweenLength:[2,20]
    })
    userTypeName:string;

    
}