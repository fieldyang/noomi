import { DataValidator } from "./validator";
import { NoomiModelTip } from "../locales/modeltip";
import { App } from './application';
/**
 * 模型驱动 模型接口
 */
interface IModel{
    __props:Map<string,IModelCfg>;
}

/**
 * 
 */
interface IModelCfg{
    /**
     * 数据类型
     */
    type:string;

    /**
     * 校验器 {name:参数数组}
     */
    validators:object;
}
/**
 * 基础模型
 */
class BaseModel implements IModel{

    __props:Map<string,any>;

    constructor(){
        this.__props = new Map();
    }

    /**
     * 验证
     * @param name  属性名
     * @returns     null或字符串(表示验证异常)
     */
    __valid(name:string){
        let cfg:IModelCfg = this.__props.get(name);
        if(!cfg || !cfg.validators){
            return true;
        }
        let value = this[name];
        for(let vn of Object.getOwnPropertyNames(cfg.validators)){
            let vld = cfg.validators[vn];
            //
            if(DataValidator.hasValidator(vn)){
                if(DataValidator.valid(vn,value,cfg.validators[vn])){
                    return null;
                }
                return NoomiModelTip[App.language][vn];
            }else if(this[vn] && typeof this[vn] === 'function'){ //模型自定义校验器
                return this[vn](value);
            }
        }
    }

    /**
     * 数据格式转换
     * @param name  属性名
     * @returns     true 转换成功 false转换失败
     */
    __transform(name:string):boolean{
        let cfg:IModelCfg = this.__props.get(name);
        if(!cfg || !cfg.type || this[name] === undefined || this[name] === null){
            return;
        }
        let v = this[name];
        switch(cfg.type){
            case 'number':      //数字
                if(/^\d+$/.test(v)){
                    v = parseInt(v);
                }else if(/^\d+(\.?\d+)?$/.test(v)){
                    v = parseFloat(v);
                }else{
                    return false;
                }
                break;
            case 'boolean':     //bool
                if(v === 'true'){
                    v = true;
                }else if(v === 'false'){
                    v = false;
                }else{
                    return false;
                }
                break;
            case 'array':       //数组类型
                try{
                    v = eval(v);
                    if(!Array.isArray(v)){
                        return false;
                    }
                }catch(e){
                    return false;
                }
                break;
            default: //字符串，不处理
        }
        this[name] = v;
        return true;
    }

    /**
     * 设置校验器
     * @param name          属性名
     * @param validators    验证器
     */
    __setValidator(name:string,validators:object){
        let cfg:IModelCfg = this.__props.get(name);
        if(!cfg){
            cfg = {
                type:null,
                validators:validators
            }
            this.__props.set(name,cfg);
        }else{
            cfg.validators = validators;
        }
    }

    /**
     * 设置数据类型
     * @param name      属性名
     * @param type      属性类型
     */
    __setType(name:string,type:string){
        let cfg:IModelCfg = this.__props.get(name);
        if(!cfg){
            cfg = {
                type:type,
                validators:null
            }
            this.__props.set(name,cfg);
        }else{
            cfg.type=type;
        }
    }

}

export{IModel,BaseModel}