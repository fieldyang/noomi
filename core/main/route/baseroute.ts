import { HttpRequest} from "../../web/httprequest";
import { HttpResponse } from "../../web/httpresponse";
import { BaseModel } from "../../tools/model";
/**
 * 路由基类
 * 可自动为路由类生成model(传入参数对象)，自带request和response对象
 * 建议所有路由继承此基类
 */
class BaseRoute{
    /**
     * 模型类
     */
    __modelClass:any;
    /**
     * 数据对象
     */
    model:any;
    /**
     * request对象
     */
    request:HttpRequest;
    /**
     * response对象
     */
    response:HttpResponse;

    /**
     * 为model设置值
     * @param data  数据对象(由浏览器/客户端传入的数据参数)
     * @returns     无异常null，否则返回异常字段集
     */
    setModel(data:any){
        if(this.__modelClass){
            let m:BaseModel = Reflect.construct(this.__modelClass,[]);
            Object.getOwnPropertyNames(data).forEach((item)=>{
                m[item] = data[item];
            });
            //数据转换和校验
            let r = m.__handle();
            this.model = m;
            return r;
        }else{
            this.model = data;
        }
        return null;
    }

    /**
     * 设置request对象
     * @param req   request对象
     */
    setRequest(req:HttpRequest):void{
        this.request = req;
    }

    /**
     * 设置reponse对象
     * @param res   response对象
     */
    setResponse(res:HttpResponse):void{
        this.response = res;
    }
}

export{BaseRoute};