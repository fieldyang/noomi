/**
 * 静态资源加载器
 */
class StaticResource{
    static forbiddenPaths:Array<string> = ['/config'];    //禁止加载路径，默认包括config、module基础路径
    /**
     * 
     * @param path 文件路径
     * @returns {file:文件数据,type:文件类型} 
     */
    static load(path:string,resolve:any,reject:any){
        let finded:boolean = false;
        
        //检测是否在paths中
        for(let p of this.forbiddenPaths){
            if(path.indexOf(p) === 0){
                finded = true;
                break;        
            }
        }

        if(finded){
            reject(403);
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
        if(this.forbiddenPaths.indexOf(dirPath) === -1){
            const pathMdl = require('path');
            if(fs.existsSync(pathMdl.join(process.cwd(),dirPath))){
                this.forbiddenPaths.push(dirPath);
            }
        }
    }
}

export {StaticResource};
