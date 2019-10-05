import { HttpRequest } from "../httprequest";
import { ServerResponse } from "http";
import { SecurityFactory } from "../securityfactory";
import { Session } from "../sessionfactory";
import { NoomiHttp } from "../noomihttp";


export class SecurityFilter{
    do(request:HttpRequest,response:ServerResponse){
        let session:Session = request.getSession();
        let uid = session.get('userId');
        if(!SecurityFactory.check(request.url,uid)){
            //跳到鉴权失败页面
            let page = SecurityFactory.getSecurityPage('auth_fail_url');
            if(page){
                NoomiHttp.redirect(request.response,page);
            }
            return false;
        }
        return true;
    }
}