import { WebCache } from "./webcache";
import { createGunzip } from "zlib";

/**
 * web 配置
 */
export class WebConfig{
    static config:any;
    static useServerCache:boolean = false;
    static get(name:string){
        return this.config[name];
    }

    static init(config){
        this.config = config;
        //cache
        if(config.cache === true){
            let cfg = config.cache_option;
            WebConfig.useServerCache = true;
            WebCache.init({
                max_age:cfg.max_age,
                max_size:cfg.max_size,
                public:cfg.public,
                no_cache:cfg.no_cache,
                no_store:cfg.no_store,
                file_type:cfg.file_type
            });
        }
    }
}