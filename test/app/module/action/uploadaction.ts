import { BaseRoute } from "../../../../core/main/route/baseroute";
import { Route, Router } from "../../../../core/tools/decorator";
import { App } from "../../../../core/tools/application";

@Router()
class UploadAction extends BaseRoute{
    @Route('/upload')
    upload(data){
        let rows = this.model.file;
        let path = App.path.resolve('');
        if(Array.isArray(rows)){
            let ra = [];
            let i=1;
            for(let r of rows){
                let relPath = r.path.substr(path.length);
                ra.push({
                    id:i++,
                    url:'http://localhost:3000' + relPath,
                    fileName:r.fileName
                });
            }
            return{
                rows:ra
            }
        }else{
            let relPath = rows.path.substr(path.length);
            return {
                id:(Math.random() * 20)|0,
                url:'http://localhost:3000' + relPath,
                fileName:rows.fileName
            };
        }
    }
}

export {UploadAction}