const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const staticPath = __dirname + '../../';
const server = http.createServer((req,res)=>{
    let path = url.parse(req.url).pathname;
    path = staticPath + path;
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
    });
});
server.listen(3000);
