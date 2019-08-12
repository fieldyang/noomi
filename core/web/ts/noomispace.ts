namespace noomispace{
    export class http{
        static public req(){
            let server = http.createServer((req,res)=>{
                let path = url.parse(req.url).pathname;
                console.log(__dirname);
                path = __dirname + path;
                fs.readFile(path,'binary',(err,file)=>{
                    if(err){
                        console.log('not found')
                    }else{
                        res.writeHead(200,{
                            'Content-type':'html'
                        });
                        res.write(file,'binary');
                        res.end();
                    }
                }
            );
        }
    }
}

export class noomi{
    constructor(){
        import filesystem = require('fs');
    }
}