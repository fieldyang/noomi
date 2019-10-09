import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";
import { RedisFactory } from "./redisfactory";


interface SessionCfg{
    name:string;
    timeout:number;
    type?:number;
    redis?:string;
}

/**
 * session 工厂类
 */
class SessionFactory {
    cleanTime: number;
    static sessions:Map<string,Session> = new Map();
    static sessionName:string = "NOOMISESSIONID";   //cookie中的session name
    static timeout:number = 30;                     //过期时间(默认30分钟)
    static type:number=0;                           //session存储类型 0内存 1redis，默认0
    static redis:string='default';                  //redis名，type为1时需要设置，默认为default
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
        //session类型
        this.type = cfg.type || 0;
        //设置session name
        if(this.type === 1 && typeof cfg.redis === 'string'){
            let n = cfg.redis.trim();
            if(n !== ''){
                this.redis = n;
            }
        }
    }

    /**
     * 获取session  
     * @param req   request
     * @param res   response
     */    
    static getSession(req:HttpRequest) {
        //session存在
        let id:string = this.getSessionId(req);
        if (id) {
            if(this.type === 0){
                let session: Session = SessionFactory.sessions.get(id);
                //判断是否过期
                if (session === undefined){
                    session = this.initSession(req);
                } else if(session.expires < new Date().getTime()) {
                    this.initSession(req);
                }
                //重置过期时间
                session.expires = new Date().getTime() + 60 * 1000;
                return session;
            }else{
                return new Session(this.type,id);    
            }
        } else {
            return this.initSession(req);
        }
    }

    /**
     * 创建sessionid
     */
    static genSessionId(){
        //创建session
        if(++this.currentCount > this.MAXCOUNT){
            this.currentCount = 1;
        }
        return new Date().getTime() + '' + this.currentCount;
        
    }

    /**
     * 初始化session
     * @param req   request
     */
    static initSession(req: HttpRequest) {
        //创建session
        if(++this.currentCount > this.MAXCOUNT){
            this.currentCount = 1;
        }
        let cTime = new Date().getTime();
        let id = cTime + '' + this.currentCount;
        let ses: Session = new Session(this.type,id);
        
        //存在内存
        if(this.type === 0){
            //设置默认过期时间
            if(this.timeout > 0){
                ses.expires = cTime + this.timeout * 60000;
            }
            this.sessions.set(id, ses);
        }
        
        this.setCookie(req.response, id, ses.expires);
        return ses;
    }

    /**
     * 获取当前sessionId
     * @param req   request
     */
    static getSessionId(req: HttpRequest): string {
        let cookies = {};
        let cook = req.getHeader('cookie');
        cook && cook.split(';').forEach(parms => {
            let parts = parms.split(':');
            cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
        return cookies[this.sessionName];
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
    static setCookie(res:HttpResponse, id: string, expires: number) {
        res.cookie.set('NOOMISESSIONID',id);
        res.cookie.set('Expires',new Date(expires).toUTCString());
    };

}

/**
 * session 类
 */
class Session {
    id: string;             //session id
    data: any = new Map();
    type:number=0;          //类型 0内存 1redis
    expires: number;

    constructor(type?:number,id?:string,expires?:number){
        this.type = type;
        this.id = id;
        this.expires = expires;
    }
    /**
     * 获取session值
     * @param key  键
     */
    get(key:string) {
        if(SessionFactory.type === 0){
            return this.data.get(key);
        }else{ //redis
            return RedisFactory.get(SessionFactory.redis,this.id,key);
        }
    }
    /**
     * 设置session
     * @param key   键 
     * @param value 值
     */
    set(key:string, value:any) {
        if(value === undefined){
            return;
        }
        if(SessionFactory.type === 0){
            this.data.set(key, value.tostring());
        }else{  //redis
            RedisFactory.set(SessionFactory.redis,{
                key:this.id,
                subKey:key,
                value:value,
                timeout:SessionFactory.timeout
            });
        }
    }
}
export { SessionFactory,Session};
