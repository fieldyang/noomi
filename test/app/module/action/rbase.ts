import { BaseRoute } from "../../../../core/main/route/baseroute";
import { DataModel } from "../../../../core/tools/decorator";

export class RBase extends BaseRoute{
    public getPage(){
        return this.model['page'];
    }
}