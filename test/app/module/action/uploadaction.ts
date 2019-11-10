import { BaseAction } from "../../../../core/baseaction";
import { Route, Router } from "../../../../core/decorator";

@Router()
class UploadAction extends BaseAction{
    @Route('/upload')
    upload(data){
        return this.model;
    }
}

export {UploadAction}