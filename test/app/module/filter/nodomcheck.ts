import { Filter } from "../../../../core/ts/filter";
import { NoomiHttp } from "../../../../core/ts/noomihttp";

class NodomCheck implements Filter{
    doFilter(request,response){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        if(path.indexOf('/test/router') === 0){
            NoomiHttp.writeDataToClient(response,{
                data:'',
                statusCode:403
            });
            return false;
        } 
        return true;
    }
}

export{NodomCheck};