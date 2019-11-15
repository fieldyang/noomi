import { Instance, WebFilter } from "../../../../core/tools/decorator";

@Instance({
    name:'pathFilter'
})
class PathFilter{
    @WebFilter('/*',2)
    do2(request,response){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        console.log('pathfilter',path);
        return true;
    }
}

export{PathFilter};