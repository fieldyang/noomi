
class FileTool{
    /**
     * 写文件
     * @param pathOrHandler 文件路径或文件句柄         
     * @param data          数据    
     * @param encoding      编码格式，默认 utf8
     * @return              promise
     */
    static writeFile(pathOrHandler:any,data:any,encoding?:string){
        const fs = require('fs');
        encoding = encoding || 'utf8';
        let type = typeof pathOrHandler;
        if(type === 'string'){
            return new Promise((resolve,reject)=>{
                fs.writeFile(pathOrHandler,data,encoding,(err)=>{
                    if(err){
                        throw err;
                    }
                    resolve();
                });
            });
        }else if(type === 'number'){
            return new Promise((resolve,reject)=>{
                fs.write(pathOrHandler,data,encoding,(err)=>{
                    if(err){
                        throw err;
                    }
                    resolve();
                });
            });
        }
    }
}

export{FileTool};