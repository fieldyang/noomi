import { HttpRequest } from "../httprequest";
import { HttpResponse } from "../httpresponse";
import { SecurityFactory } from "../securityfactory";
import { Session } from "../sessionfactory";

export class SecurityFilter{
    do(request:HttpRequest,response:HttpResponse){
        let session:Session = request.getSession();
        let page:string;
        let result = SecurityFactory.check(request.url,session);
        switch(result){
            case 0:
                return true;
            case 1:
                //未登录
                page = SecurityFactory.getSecurityPage('login_url');
                //保存登录前页面
                SecurityFactory.setSession(session,'prelogin',request.url);
                break;
            case 2:
                // 无权限
                page = SecurityFactory.getSecurityPage('auth_fail_url');
                break;
        }
        if(page){
            response.redirect(page);
        }
        return false;
    }
}