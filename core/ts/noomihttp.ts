/**
 * http 服务
 */
interface WriteCfg{
    data:any;
    charset:string;       
}
class NoomiHttp{
    
    /**
     * 回写到浏览器端
     * @param response  response 对象
     * @param data      待写数据 
     * @param charset   字符集
     */
    static writeDataToClient(response:any,config:WriteCfg):void{
        let data:any = config.data;
        if(typeof data === 'object'){
            data = JSON.stringify(data);
        }
        let charset = config.charset || 'utf8';
        response.writeHead(200, { 'Content-Type': 'text/html',
                'Content-Length':Buffer.byteLength(data)});
        response.write(data,charset);
        response.end();
    }

    /**
     * 回写文件到浏览器端
     * @param response      ServerResponse
     * @param path          文件路径 
     */
    static writeFileToClient(response:any,path:string){
        const mime = require('mime');
        const fs = require('fs');
        fs.readFile(path,'binary',(err,file)=>{
            if(err){
                console.log('not found')
            }else{
                response.writeHead(200,{
                    'Content-type':mime.getType(path)
                });
                response.write(file,'binary');
                response.end();
            }
        });
    }
}

export {NoomiHttp};