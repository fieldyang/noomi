import { BaseModel } from "../../../../core/tools/model";
import { DataType, DataValidator } from "../../../../core/tools/decorator";

export class MBase extends BaseModel{
    /**
     * id串 1,2,3
     */
    ids:string;

    /**
     * 页号
     */
    @DataType('int')
    page:number;

    /**
     * 页面大小
     */
    @DataType('int')
    rows: number;
    
    /**
     * 排序
     */
    // TODO 验证排序格式{field: userNo, type: desc}
    orders: object;

    @DataValidator({
        in:[['F','M']]
    })
    sexy:string;
}