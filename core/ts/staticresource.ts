import { HttpResponse } from "./httpresponse";
import { PageFactory } from "./pagefactory";

/**
 * 静态资源加载器
 */
class StaticResource{
    static forbiddenMap:Map<string,RegExp> = new Map(); //forbidden path map
    /**
     * 
     * @param path 文件路径
     * @returns {file:文件数据,type:文件类型} 
     */
    static async load(response:HttpResponse,path:string){
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
            }
            errCode = await response.writeFileToClient({
                path:filePath
            });
        }
        //出现异常
        if(errCode !== undefined){
            //存在异常页，直接跳转，否则回传404
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
