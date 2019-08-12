class noomitest{

    constructor(port){
        this.fs = require('fs');
        // 路由map
        this.routeTree = new Map();

        const http = require('http');
        // this.url = require('url');
        // this.path = require('path');
        console.log('ddd');
        this.server = http.createServer((req,res)=>{
            let path = url.parse(req.url).pathname;
            console.log(__dirname);
            path = __dirname + path;
            this.fs.readFile(path,'binary',(err,file)=>{
                if(err){
                    console.log('not found')
                }else{
                    res.writeHead(200,{
                        'Content-type':'html'
                    });
                    res.write(file,'binary');
                    res.end();
                }
            });
        }).listen(port);
        console.log(this.server);
    }

    parseRoute(path:string){

    }

    /**
     * 获取数据
     * @param path  string 请求路径 
     * @param callback function 回调函数 
     */
    get(path,callback){

    }


}
exports.noomitest = noomitest;
