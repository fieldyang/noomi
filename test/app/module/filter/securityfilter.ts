import { ServerResponse } from "http";
import { HttpRequest } from "../../../../core/ts/httprequest";
import { Session } from "../../../../core/ts/sessionfactory";
import { SecurityFactory } from "../../../../core/ts/securityfactory";
import { NoomiHttp } from "../../../../core/ts/noomihttp";



export class SecurityFilter{
    do(request:HttpRequest,response:ServerResponse){
        let session:Session = request.getSession();
        let uid = session.get('userId');
        let page:string;
        let result = SecurityFactory.check(request.url,session.get('userId'));
        switch(result){
            case 0:
                return true;
            case 1:
                //未登录
                page = SecurityFactory.getSecurityPage('login_url');
                break;
            case 2:
                // 无权限
                page = SecurityFactory.getSecurityPage('auth_fail_url');
                break;
        }
        if(page){
            NoomiHttp.redirect(request.response,page);
        }
        return false;
    }
}