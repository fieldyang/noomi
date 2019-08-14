import { RouteFactory } from "./routefactory";
class noomi {
    constructor(port) {
        const http = require("http");
        const url = require("url");
        const querystring = require("querystring");
        http.createServer((req, res) => {
            let path = url.parse(req.url).pathname;
            const paramstr = url.parse(req.url).query;
            const params = querystring.parse(paramstr);
            console.log(params);
            RouteFactory.handleRoute(path, params);
            /*console.log(__dirname);
            path = __dirname + path;
            noomifs.readFile(path,'binary',(err,file)=>{
                if(err){
                    console.log('not found')
                }else{
                    res.writeHead(200,{
                        'Content-type':'html'
                    });
                    res.write(file,'binary');
                    res.end();
                }
            }*/
        }).listen(port);
    }
    /**
     * 初始化
     */
    init() {
        let basePath = __dirname;
    }
    /**
     * 加载context
     * @param path
     */
    loadCtx(path) {
    }
    /**
     * 加载路由
     * @param path
     */
    loadRoute(path) {
    }
}
export { noomi };
//# sourceMappingURL=noomi.js.map