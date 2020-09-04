import { Instance, WebFilter, Inject } from "../../../../core/tools/decorator";
import { UserService } from "../service/userservice";

@Instance({
    name:'pathFilter'
})
class PathFilter{
    @Inject("userService")
    us:UserService;
    @WebFilter('/user/*',1000)
    do2(request,response){
        console.log(request,response);
        this.us.sayHello();
        const url = require("url");
        let path = url.parse(request.url).pathname;
        console.log('pathfilter',path);
        return true;
    }
}

export{PathFilter};