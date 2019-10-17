import { HttpRequest } from "../httprequest";
import { HttpResponse } from "../httpresponse";
import { SecurityFactory } from "../securityfactory";
import { Session } from "../sessionfactory";
import { WebFilter } from "../decorator";

export class SecurityFilter{
    @WebFilter()
    do1(request:HttpRequest,response:HttpResponse){
        let session:Session = request.getSession();
        return SecurityFactory.check(request.url,session).then((result)=>{
            let page:string;
            switch(result){
                case 0:
                    return Promise.resolve(true);
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
            return Promise.resolve(false);
        });
    }
}