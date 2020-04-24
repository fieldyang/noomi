import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Route, Router } from "../../../../core/tools/decorator";

@Router()
class UploadAction extends BaseRoute{
    @Route('/upload')
    upload(data){
        console.log(this.model);
        // return this.model;
    }
}

export {UploadAction}