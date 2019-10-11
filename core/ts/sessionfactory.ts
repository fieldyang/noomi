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
        let cTime = new Date().getTime();
        let expTime = cTime + this.timeout * 60000;
        let session: Session;
        //未传入sessionId
        if(!id){
            id = this.genSessionId();
            session = new Session(this.type,id);
            //存在内存
            if(this.type === 0){
                //设置默认过期时间
                if(this.timeout > 0){
                    session.expires =  expTime;
                }
                this.sessions.set(id, session);
            }
        }else{
            if(this.type === 0){
                let session: Session = SessionFactory.sessions.get(id);
                //session过期，清空数据
                if(this.timeout > 0 && session.expires > cTime){
                    session.clear();
                    session.expires = expTime;
                }
            }else{
                session = new Session(this.type,id);
            }
        }
    
        //设置cookie sessionid和过期时间
        let cookie = req.response.cookie;
        cookie.set(this.sessionName,id);
        cookie.set('Expires',new Date(expTime).toUTCString());

        return session;
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
     * 清理过期session(内存中的)
     * @param sessions 
     */
    static cleanUp(){
        if(this.type !== 0){
            return;
        }
        let d = new Date().getTime();
        this.sessions.forEach((session,id)=>{
            if(session.expires<d){
                this.sessions.delete(id);
            }
        });
    }
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
     * 清空数据
     */
    clear(){
        this.data.clear();
    }
    /**
     * 获取session值
     * @param key   键
     * @return      值或null
     */
    get(key:string) {
        if(SessionFactory.type === 0){
            if(this.data.has(key)){
                return this.data.get(key);
            }
            return null;
        }else{ //redis
            return RedisFactory.get(SessionFactory.redis,{
                key:"SESSION:"+this.id,
                subKey:key,
                timeout:SessionFactory.timeout*60
            });
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
        if(SessionFactory.type === 0){//内存中
            //转换成string
            if(typeof value !== 'string'){
                value = value + '';
            }
            this.data.set(key, value);
        }else{  //redis
            RedisFactory.set(SessionFactory.redis,{
                key:"SESSION:"+this.id,
                subKey:key,
                value:value,
                timeout:SessionFactory.timeout*60  //分钟转为秒
            });
        }
    }
}
export { SessionFactory,Session};
