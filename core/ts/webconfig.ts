import { WebCache } from "./webcache";
import { NoomiError } from "./errorfactory";
import { SessionFactory } from "./sessionfactory";

/**
 * web 配置
 */
export class WebConfig{
    static config:any;
    static useServerCache:boolean = false;
    
    /**
     * 获取参数
     * @param name 
     */
    static get(name:string){
        if(!this.config || !this.config.hasOwnProperty(name)){
            return null;
        }
        return this.config[name];
    }

    static init(config:any){
        if(config.hasOwnProperty('web_config')){
            let cfg:any = config['web_config'];
            this.config = cfg;
            //cache
            if(cfg.cache === true){
                let opt = cfg.cache_option;
                WebConfig.useServerCache = true;
                WebCache.init({
                    save_type:opt.save_type,
                    max_age:opt.max_age,
                    max_size:opt.max_size,
                    public:opt.public,
                    no_cache:opt.no_cache,
                    no_store:opt.no_store,
                    file_type:opt.file_type
                });
            }
        }

        if(config.hasOwnProperty('session')){
            SessionFactory.init(config['session']);    
        }
    }

    /**
     * 解析路由文件
     * @param path  文件路径
     * @param ns    命名空间，默认 /
     */
    static parseFile(path:string){
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let json:any;
        try{
            let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2100") + e;
        }
        this.init(json);
    }
}