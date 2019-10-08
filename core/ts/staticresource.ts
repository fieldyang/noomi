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
    static load(path:string,resolve:any,reject:any){
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

        //禁止访问路径，直接返回404
        if(finded){
            reject(404);
        }else{
            const fs = require("fs");
            const mime = require('mime');
            const pathMdl = require('path');
            let filePath = pathMdl.join(process.cwd(),path);
            fs.readFile(filePath,'utf8',(err,file)=>{
                if(err){
                    reject(404);
                }else{
                    resolve({
                        file:file,
                        type:mime.getType(path)
                    });
                }
            });
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
