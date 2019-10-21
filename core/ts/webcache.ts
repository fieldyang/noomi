import { NCache } from "./ncache";
import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";
import { Stats } from "fs";

interface ResCfg{
    etag:string;            //ETag
    lastModified:string;    //最后修改时间
    data?:string;           //数据
}
/**
 * web 缓存类
 */
class WebCache{
    static cache:NCache;                    //缓存
    static maxAge:number;                   //cache-control max-age 值
    static fileTypes:Array<string>;         //缓存文件类型
    /**
     * 初始化
     */
    static async init(cfg:any){
        this.maxAge = cfg.max_age|0;
        this.fileTypes = cfg.file_type || ['*'];
        //创建cache
        this.cache = new NCache({
            name:'NWEBCACHE',
            maxSize:cfg.max_size,
            saveType:cfg.save_type,
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
        let addFlag:boolean = true;
        //非全部类型，需要进行类型判断
        if(this.fileTypes[0] !== '*'){
            let extName = pathMdl.extName(url);
            for(let t of this.fileTypes){
                if(t === extName){
                    addFlag = true;
                    break;
                }
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
     * @param url 
     */
    static async load(request:HttpRequest,response:HttpResponse){
        let url = require('url').parse(request.getUrl()).pathname;
        let rCheck:number = await this.check(request,url);
        let needReadFile:boolean = false;
        switch(rCheck){
            case 0:
                //回写没修改
                response.writeToClient({
                    statusCode:304
                });
                break;
            case 1:
                //从缓存获取
                let value = await this.cache.get(url,'data');
                if(value !== null){
                    return value;
                }
                needReadFile = true;
                break;
            case 2:
                //读文件
                needReadFile = true;
                break;
        }

        if(needReadFile){
            let fs = require('fs');
            let path = require('path').posix.join(process.cwd(),url);
            //读文件
            fs.readFile(path,'utf8',(err,data)=>{
                if(!err){
                    //404异常
                    response.writeToClient({
                        statusCode:404
                    });
                }else{ //加入cache
                    //计算hash
                    const crypto = require('crypto');
                    const hash = crypto.createHash('sha256');
                    hash.update(data);
                    let etag:string = hash.disest('hex');
                    //获取lastmodified
                    let stat:Stats = fs.stat(path);
                    let lastModified:string = stat.mtime.toUTCString();
                    //添加到cache
                    this.add(url,{
                        etag:etag,
                        lastModified:lastModified,
                        data:data
                    });
                    //写到浏览器
                }
            });
            
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
        let result:string;
        if(modiSince){
            result = await this.cache.get(url,'lastModified');
            return result === modiSince?0:1;
        }
        
        //检测etag
        let etag = request.getHeader('ETag');
        if(etag){
            result = await this.cache.get(url,'etag');
            return etag === result?0:1;
        }
        return 1;
    }
}

export{WebCache}