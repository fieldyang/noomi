import { HttpRequest } from "./httprequest";


interface SessionCfg{
    name:string;
    timeout:number;
}

/**
 * session 工厂类
 */
class SessionFactory {
    cleanTime: number;
    static sessions:Map<string,Session> = new Map();
    static sessionName:string = "NOOMISESSIONID";   //cookie中的session name
    static timeout:number = 30;                     //过期时间(默认30分钟)
    static MAXCOUNT = 10000000;                     //最大计数器(id) 
    static currentCount = 0;                        //当前技术值(id)
    
    /**
     * 参数初始化
     * @param cfg 
     */
    static init(cfg:SessionCfg){
        //设置session name
        if(typeof cfg.name === 'string'){
            let n = cfg.name.trim();
            if(n !== ''){
                this.sessionName = n;
            }
        }

        //设置timeout
        if(typeof cfg.timeout === 'number'){
            this.timeout = cfg.timeout;
        }
    }

    /**
     * 获取session  
     * @param req   request
     * @param res   response
     */    
    static getSession(req: any, res: any) {
        //session存在
        let id:string = this.getSessionId(req);
        if (id) {
            let session: Session = SessionFactory.sessions.get(id);
            //判断是否过期
            if (session.expires < new Date().getTime()) {
                this.initSession(req, res);
            }
            //重置过期时间
            session.expires = new Date().getTime() + 60 * 1000;
            console.log("更新过期时间: " + session.expires);
            return session;
        } else {
            return this.initSession(req, res);
        }
    }

    /**
     * 初始化session
     * @param req   request
     * @param res   response
     */
    static initSession(req: any, res: any) {
        //创建session
        if(++this.currentCount > this.MAXCOUNT){
            this.currentCount = 1;
        }
        let id = new Date().getTime() + '' + this.currentCount;
        let ses: Session = new Session();
        //设置默认过期时间
        ses.expires = this.timeout * 60000; 
        this.sessions.set(id, ses);
        console.log("初始过期时间:" + this.sessions.get(id).expires);
       
        this.setCookie(res, id, ses.expires);
        return ses;
    }

    /**
     * 获取当前sessionId
     * @param req   request
     */
    static getSessionId(req: HttpRequest): string {
        let cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(parms => {
            let parts = parms.split('=');
            cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
        
        if (cookies['NOOMISESSIONID']) {
            return cookies['NOOMISESSIONID'];
        }
    }

    /**
     * 清理session
     * @param sessions 
     */
    static cleanUp(){
        let d = new Date().getTime();
        this.sessions.forEach((session,id)=>{
            if(session.expires<d){
                this.sessions.delete(id);
            }
        })
    }

    /**
     * 设置Cookie头
     * @param res       response
     * @param id        session id       
     * @param expires   超时时间
     */
    static setCookie(res: any, id: string, expires: number) {
        res.setHeader(
            'Set-Cookie', 'NOOMISESSIONID=' + id + ';Expires=' + new Date(expires).toUTCString() + ';'
        );
    };

}

/**
 * session 类
 */
class Session {
    id: number;
    data: any = new Map();
    expires: number;

    //获取session
    get(name) {
        if (this.data.has(name)) {
            return this.data.get(name);
        } else {
            throw '没有找到' + name + '对应的值';
        }
    }
    //设置session
    set(name, value) {
        this.data.set(name, value);
    }
}
export { SessionFactory,Session};
