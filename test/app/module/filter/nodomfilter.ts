import { NoomiHttp } from "../../../../core/ts/noomihttp";

class NodomFilter{
    do(request,response){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        
        if(path.indexOf('/test/router') === 0){
            console.log('nodom filter wrong',path);
        } else{
            console.log('nodom filter',path);
        }
        
        
        return true;
    }
}

export{NodomFilter};