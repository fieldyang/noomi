import { NCache } from "./ncache";
import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";
import { Stats } from "fs";
import { App } from "./application";

interface ResCfg{
    etag:string;            //ETag
    lastModified:string;    //最后修改时间
    data?:any;           //数据
}
/**
 * web 缓存类
 */
class WebCache{
    static cache:NCache;                //缓存
    static maxAge:number;               //cache-control max-age 值
    static isPublic:boolean;            //cache-control public
    static isPrivate:boolean;           //cache-control privite
    static noCache:boolean;             //cache-control no cache
    static noStore:boolean;             //cache-control no store
    static mustRevalidation:boolean;    //cache-control must revalidation
    static proxyRevalidation:boolean;   //cache-control proxy revalidation
    static expires:number;              //expires
    static fileTypes:Array<string>;     //缓存文件类型
    /**
     * 初始化
     */
    static async init(cfg:any){
        this.maxAge = cfg.max_age|0;
        this.fileTypes = cfg.file_type || ['*'];
        this.noCache = cfg.no_cache || false;
        this.noStore = cfg.no_store || false;
        this.isPublic = cfg.public || false;
        this.isPrivate = cfg.private || false;
        this.mustRevalidation = cfg.must_revalidation || false;
        this.proxyRevalidation = cfg.proxy_revalidation || false;
        this.expires = cfg.expires || 0;

        //创建cache
        this.cache = new NCache({
            name:'NWEBCACHE',
            maxSize:cfg.max_size || 0,
            saveType:cfg.save_type,
            redis:cfg.redis
        });
    }

    /**
     * 添加资源
     * @param url   url 请求url
     * @param path  url对应路径
     * @param data  path对应数据
     */
    static async add(url:string,path:string,data:any,response?:HttpResponse){
        const fs = App.fs;
        const pathMdl = App.path;
        let addFlag:boolean = false;

        //获取lastmodified
        let stat:Stats = await new Promise((resolve,reject)=>{
            fs.stat(path,(err,data)=>{
                resolve(data);
            });
        });

        let lastModified:string = stat.mtime.toUTCString();
        //计算hash
        
        const hash = App.crypto.createHash('md5');
        hash.update(data,'utf8');
        let etag:string = hash.digest('hex');

        //非全部类型，需要进行类型判断
        if(this.fileTypes[0] === '*'){
            addFlag = true;
        }else{
            let extName = pathMdl.extname(url);
            if(this.fileTypes.includes(extName)){
                addFlag = true;
            }
        }
        if(addFlag){
            await this.cache.set({
                key:url,
                value:{
                    etag:etag,
                    lastModified:lastModified,
                    data:data
                }
            });
        }
        if(response){
            this.writeCacheToClient(response,etag,lastModified);
        }
    }

    /**
     * 加载资源
     * @param request   request
     * @param response  response
     * @param url       url
     * @return          0不用回写数据 或 数据
     */
    static async load(request:HttpRequest,response:HttpResponse,url:string):Promise<any>{
        let rCheck:number = await this.check(request,url);
        switch(rCheck){
            case 0:
                return 0;
            case 1:
                //从缓存获取
                let map = await this.cache.getMap(url);
                if(map !== null && map.data && map.data !== ''){
                    this.writeCacheToClient(response,map.etag,map.lastModified);
                    return map.data;
                }
        }
    }

    /**
     * 写cache到客户端
     * @param response          httpresponse
     * @param etag              etag
     * @param lastModified      lasmodified
     */
    static writeCacheToClient(response:HttpResponse,etag:string,lastModified:string){
        //设置etag
        response.setHeader('Etag',etag);
        //设置lastmodified
        response.setHeader('Last-Modified',lastModified);
        //设置expire
        if(this.expires && this.expires>0){
            response.setHeader('Expires',new Date(new Date().getTime() + this.expires*1000).toUTCString());
        }
        //设置cache-control
        let cc:Array<string> = [];
        this.isPublic?cc.push('public'):'';
        this.isPrivate?cc.push('private'):'';
        this.noCache?cc.push('no-cache'):'';
        this.noStore?cc.push('no-store'):'';
        this.maxAge>0?cc.push('max-age=' + this.maxAge):'';
        this.mustRevalidation?cc.push('must-revalidation'):'';
        this.proxyRevalidation?cc.push('proxy-revalidation'):'';
        response.setHeader('Cache-Control',cc.join(','));
    }

    /**
     * 资源check，如果需要更改，则从服务器获取
     * @param request
     * @return          0从浏览器获取 1已更新 2资源不在缓存
     */
    static async check(request:HttpRequest,url:string):Promise<number>{
        let exist = await this.cache.has(url);
        if(!exist){
            return 2;
        }
        //检测 lastmodified
        let modiSince:string = request.getHeader('if-modified-since');
        let r:boolean = false;
        if(modiSince){
            let result = await this.cache.get(url,'lastModified');
            r = (modiSince === result);
            if(!r){
                return 1;
            }
        }
        //检测etag
        let etag = request.getHeader('if-none-match');
        if(etag){
            let result = await this.cache.get(url,'etag');
            r = (result === etag);
            if(!r){
                return 1;
            }
        }
        return r?0:1;
    }
}

export{WebCache}