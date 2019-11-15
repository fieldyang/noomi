import { BaseAction } from "../../../../core/main/route/baseaction";
import { Route, Router } from "../../../../core/tools/decorator";

@Router()
class UploadAction extends BaseAction{
    @Route('/upload')
    upload(data){
        return this.model;
    }
}

export {UploadAction}