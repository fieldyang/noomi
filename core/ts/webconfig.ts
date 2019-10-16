/**
 * web 配置
 */
export class WebConfig{
    static config:any;

    static get(name:string){
        return this.config[name];
    }

    static init(config){
        this.config = config;
    }
}