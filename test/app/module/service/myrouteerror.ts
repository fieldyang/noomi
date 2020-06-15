import { RouteErrorHandler } from "../../../../core/main/route/routeerrorhandler";
import { HttpResponse } from "../../../../core/web/httpresponse";
import { Instance } from "../../../../core/tools/decorator";

@Instance('myRouteError')
class MyRouteError extends RouteErrorHandler{
    handle(res:HttpResponse,e:Error){
        res.writeToClient({data:e.message});
    }
}