import { Filter } from "./filter";
import { NoomiHttp } from "./noomihttp";

class FilterChain{
    chain:Array<string> = [];  //过滤器名
    
    /**
     * 过滤器链继续执行过滤器
     * @param request 
     * @param response 
     * @param path          url
     */
    doFilter(request:any,response:any,path:string){
        if(path.indexOf('/test/test') === -1){
            NoomiHttp.writeDataToClient(
                response,{
                statusCode:403
            });
        }
    }
}

export{FilterChain};