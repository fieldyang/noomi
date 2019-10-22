import { HttpResponse } from "./httpresponse";
import { PageFactory } from "./pagefactory";
import { WebCache } from "./webcache";
import { WebConfig } from "./webconfig";
import { HttpRequest } from "./httprequest";

/**
 * 静态资源加载器
 */
class StaticResource{
    static forbiddenMap:Map<string,RegExp> = new Map(); //forbidden path map
    /**
     * 
     * @param path      文件路径
     * @param request   request
     * @param response  response
     */
    static async load(request:HttpRequest,response:HttpResponse,path:string):Promise<void>{
        //config 为默认路径
        if(this.forbiddenMap.size === 0){
            this.addPath('/config');
        }
        let finded:boolean = false;
        
        //检测是否在forbidden map中
        for(let p of this.forbiddenMap){
            if(p[1].test(path)){
                finded = true;
                break;
            }
        }

        let errCode;
        //禁止访问路径，直接返回404
        if(finded){
            errCode = 404;
        }else{
            const fs = require("fs");
            const pathMdl = require('path');
            let filePath = pathMdl.join(process.cwd(),path);
            if(!fs.existsSync(filePath)){
                errCode = 404;
            }else{
                let data;
                if(WebConfig.useServerCache){ //从缓存取
                    data = await WebCache.load(request,response,filePath);
                }else{ //从文件读
                    data = await new Promise((resolve,reject)=>{
                        fs.readFile(path,'utf8',(err,v)=>{
                            if(err){
                                resolve();
                            }
                            resolve(v);
                        });
                    });
                }
                //无数据，取文件
                if(data === undefined){
                    errCode = 404;
                }else{
                    //写到浏览器
                    await response.writeToClient({
                        data:data
                    });
                    return;
                }
            }
        }
        //出现异常
        if(errCode !== undefined){
            let page = PageFactory.getErrorPage(errCode);
            if(page){
                response.redirect(page);
            }else{
                response.writeToClient({
                    statusCode:errCode
                });
            }
        }
    }

    /**
     * 添加静态路径
     * @param dirPath   待添加的目录 
     */
    static addPath(dirPath:string){
        const fs = require('fs');
        if(this.forbiddenMap.has(dirPath)){
            const pathMdl = require('path');
            if(fs.existsSync(pathMdl.join(process.cwd(),dirPath))){
                this.forbiddenMap.set(dirPath,new RegExp('^' + dirPath));
            }
        }
    }


}

export {StaticResource};
