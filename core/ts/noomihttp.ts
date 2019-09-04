/**
 * http 服务
 */
interface WriteCfg{
    data?:any;               //数据
    charset?:string;         //字符集
    type?:string;            //数据类型
    statusCode?:number;      //http 异常码
}
class NoomiHttp{
    
    /**
     * 回写到浏览器端
     * @param response  response 对象
     * @param data      待写数据 
     * @param charset   字符集
     * @param type      数据类型
     */
    static writeDataToClient(response:any,config:WriteCfg):void{
        let data:any = config.data || '';
        if(typeof data === 'object'){
            data = JSON.stringify(data);
        }
        let charset = config.charset || 'utf8';
        let status = config.statusCode || 200;
        let type = config.type || 'text/html';
        response.writeHead(status, 
            { 
                'Content-Type': type + ';charset=' + charset,
                'Content-Length':Buffer.byteLength(data)
            }
        );
        response.write(data,charset);
        response.end();
    }

    /**
     * 回写文件到浏览器端
     * @param response      ServerResponse
     * @param file          文件 
     */
    static writeFileToClient(response:any,file:any,type:string){
        response.writeHead(200,{
            'Content-type':type
        });
        response.write(file,'binary');
        response.end();
    }

    /**
     * 重定向
     * @param response      
     * @param page          跳转路径 
     */
    static redirect(response:any,page:string){
        response.writeHead(
            302,
            {
                'Location':page,
                'Content-Type':'text/html'
            }
        );
        response.end();
    }
}

export {NoomiHttp};