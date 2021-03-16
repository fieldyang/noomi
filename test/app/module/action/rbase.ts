import { BaseRoute } from "../../../../core/main/route/baseroute";
import { DataModel } from "../../../../core/tools/decorator";

export class RBase extends BaseRoute{
    timestamp = {
        createdFeild: 'createdAt',
        updatedFeild: 'updatedAt'
     };
  
     constructor() {
        super();
  
     }
    public getPage(){
        return this.model['page'];
    }
}