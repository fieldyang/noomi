import { BaseModel } from "../../../../core/tools/model";
import { DataType, DataValidator} from "../../../../core/tools/decorator";
import { MBase } from "./mbase";

export class MUserType extends MBase{

    @DataType('int')
    userTypeId:number;

    @DataType('string')
    @DataValidator({
        betweenLength:[2,20]
    })
    userTypeName:string;

    @DataType('string')
    url:string;

    @DataValidator({
        in:[['X','Y']]
    })
    sexy:string;
}