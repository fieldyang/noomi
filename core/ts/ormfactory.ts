import { TypeormSupport } from "./ormsupport/typeormsupport";

/**
 * orm 管理器
 */
class OrmFactory{
    static connection:any;
    static product:string;
    static ormObject:any;
    /**
     * 初始化
     * @param cfg 
     */
    static init(cfg:any){
        this.product = cfg.product;
        switch(cfg.product){
            case "typeorm":
                this.ormObject = new TypeormSupport(cfg.options);
                break;
        }
    }

    /**
     * 获取connection
     * @param name  connection name
     * @return      connection 或 undefined
     */
    static getConnection(name:string){
        switch(this.product){
            case 'typeorm':
                return this.ormObject.getConnection(name);
        }
    }
}

export {OrmFactory}