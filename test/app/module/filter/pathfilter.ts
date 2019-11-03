import { Instance } from "../../../../core/ts/decorator";

@Instance({
    name:'pathFilter'
})
class PathFilter{
    do2(request,response){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        console.log('pathfilter',path);
        return true;
    }
}

export{PathFilter};