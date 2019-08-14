/**
 * 静态资源加载器
 */
class StaticLoader{
    /**
     * 
     * @param path 路径
     * @returns [content,type] //返回数组 content:内容，type:类型
     */
    static load(path){
        // const http = require('http');
        // const url = require('url');
        // const path = require('path');
        const fs = require("fs");
        let type="html";
        
        fs.readFile(path,'binary',(err,file)=>{
            //
            if(err){
                console.log('not found')
            }else{
                return [file,type];
                // res.writeHead(200,{
                //     'Content-type':'html'
                // });
                // res.write(file,'binary');
                // res.end();
            }
        });
    }
}

export {StaticLoader};
