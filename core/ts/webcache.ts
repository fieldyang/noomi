import { NCache } from "./ncache";
import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";
import { Stats } from "fs";

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
            saveType:cfg.save_type || 1,
            redis:cfg.redis
        });
    }

    /**
     * 添加资源
     * @param url   url
     * @param cfg   res config
     */
    static async add(url:string,cfg:ResCfg){
        let pathMdl = require('path');
        let addFlag:boolean = false;
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
                value:cfg
            });
        }
    }

    /**
     * 加载资源
     * @param request   request
     * @param response  response
     * @param url       url
     * @return          404 或 数据
     */
    static async load(request:HttpRequest,response:HttpResponse,url:string):Promise<any>{
        let rCheck:number = await this.check(request,url);
        let needReadFile:boolean = false;
        let data:any;
        let lastModified:string;
        let etag:string;
        switch(rCheck){
            case 0:
                //回写没修改
                response.writeToClient({
                    statusCode:304
                });
                return;
            case 1:
                //从缓存获取
                let map = await this.cache.getMap(url);
                if(map === null || !map.data || map.data === ''){
                    needReadFile = true;
                }else{
                    data = map.data;
                    etag = map.etag;
                    lastModified = map.lastModified
                }
                break;
            case 2:
                //读文件
                needReadFile = true;
                break;
        }

        if(needReadFile){
            let fs = require('fs');
            let path = require('path').posix.join(url);
            //读文件
            data = await new Promise((resolve,reject)=>{
                fs.readFile(path,'utf8',(err,v)=>{
                    if(err){
                        resolve();
                    }
                    resolve(v);
                });
            });

            //获取lastmodified
            let stat:Stats = await new Promise((resolve,reject)=>{
                fs.stat(path,(err,data)=>{
                    resolve(data);
                });
            });
            lastModified = stat.mtime.toUTCString();
            //计算hash
            const crypto = require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(data,'utf8');
            etag = hash.digest('hex');
            
            //添加到cache
            this.add(url,{
                etag:etag,
                lastModified:lastModified,
                data:data
            });
            
        }

        if(data){
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
            response.setHeader('cache-control',cc.join(','));
            
            return data;
        }
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
        let modiSince:string = request.getHeader('If-Modified_Since');
        let r:boolean = false;
        if(modiSince){
            let result = await this.cache.get(url,'lastModified');
            r = (modiSince === result);
            if(!r){
                return 1;
            }
        }
        //检测etag
        let etag = request.getHeader('If-None-Match');
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