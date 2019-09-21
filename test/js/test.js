// const cls = require("./tclass.js");
// const cls = require("./tclass.mjs");
// console.log(typeof cls);
// new cls();
// const fs = require('fs');
// const mime = require('mime');
// // const MimeLookup = require('mime-lookup');
// // const mime = new MimeLookup(require('mime-db'));

// let path = '/Users/leiyang/develop/codework/jswork/noomi/test/js/tclass.js';
// fs.readFile(path,'binary',(err,file)=>{
//     if(err){
//         console.log('not found');
//     }else{
//         console.log(mime.getType(path));
//     }
// });
// const tclass = require('./tclass');
// // console.log(tclass.tclass);
// console.log(tclass.tclass);

// // let t = tclass.tclass.prototype.constructor.apply(null,['hello']);
// let t = new tclass.tclass('aaaa');
// let t1 = t.constructor;

// console.log(t1);
// t.sayHello();
// t.constructor.apply(t,['hello1']);
// t.sayHello();

// for(let ite=map.values();ite.hasNext();){
//     console.log(ite.next().value);
// }

/*let pro = new Promise((resolve,reject)=>{
    throw '就是异常';
})
.catch((err)=>{
    return Promise.reject(err);
})
.then((txt)=>{
    console.log(txt);
    return Promise.resolve(txt);
},(err)=>{
    console.log('reject',err);
});*/
/*.then(()=>{
    console.log('last');
});*/

// pro.then(function(txt){
//     console.log('resolve');
//     console.log(txt);
// },function(){
//     console.log('reject');
// });
// new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         console.log(1);
//         resolve();
//     },500);
// }).then(()=>{
//     setTimeout(()=>{
//         console.log(2);
//     },400);
// }).then(()=>{
//     console.log(3);
    
// });

const fs = require('fs');
const asyncHook = require('async_hooks');


function writeLog(data){
    const logFile = __dirname + '/log.out';
    fs.writeFileSync(logFile,data,{
        flag:'a'
    });
}
/*const async_hooks = asyncHook.createHook({
    init(asyncId, type, triggerAsyncId) {
        writeLog('init\n');
        // const eid = async_hooks.executionAsyncId();
        // const indentStr = ' '.repeat(indent);
        // fs.writeSync(
        //   1,
        //   `${indentStr}${type}(${asyncId}):` +
        //   ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
      },
      before(asyncId) {

        // const indentStr = ' '.repeat(indent);
        // fs.writeFileSync('log.out',
        //                  `${indentStr}before:  ${asyncId}\n`, { flag: 'a' });
        // indent += 2;
        writeLog('before\n');
      },
      after(asyncId) {
        // indent -= 2;
        // const indentStr = ' '.repeat(indent);
        // fs.writeFileSync('log.out',
        //                  `${indentStr}after:  ${asyncId}\n`, { flag: 'a' });
        writeLog('after\n');
      },
      destroy(asyncId) {
        // const indentStr = ' '.repeat(indent);
        // fs.writeFileSync('log.out',
        //                  `${indentStr}destroy:  ${asyncId}\n`, { flag: 'a' });
        writeLog('destroy\n');
      }
}).enable();*/

function sleep(second,param){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log(second);
            resolve(++param);
        },second);
    });
}

// function read(path){
//     const fs = require('fs');
//     return new Promise(resolve,reject)=>{
//         fs.readFile('/etc/passwd',(err,data)=>{
            
//         });
//     })
    
// }

function foo(n){
    console.log('foo',n);
}

function foo1(){
    const fs = require('fs');
    const path = require('path');
    return new Promise((resolve,reject)=>{
        let p = path.resolve(__dirname,'./tclass1.js');
        throw "1001";
        fs.readFile(p, {flag:'r',encoding:'utf8'},(err, data) => {
            if (err) 
                reject(err);
            resolve(data);
        });
    })
}
class t1{
    static async test(){
        let cnt = 0;
        let data;
        /*console.log(await sleep(200,cnt));
        console.log(await sleep(100,cnt));
        console.log(await sleep(50,cnt));*/
        // await sleep(200,cnt);
        try{
            data = await foo1();
        }catch(e){
            return Promise.reject(e);
        }
        // console.log(data);
        // await foo(cnt);
        // await Promise.all([
        //     await sleep(200,cnt),
        //     await sleep(100,cnt)
        // ]);
        return data;
    }
}
class t2{
    constructor(x,y){
        this.x = x;
        this.y = y;
        console.log(x);
    }
    async test(){
        return new Promise((resolve,reject)=>{
            const fs = requilre('fs');
            let p = path.resolve(__dirname,'./tclass1.js');
            fs.readFile(p, {flag:'r',encoding:'utf8'},(err, data) => {
                if (err) 
                    reject(err);
                resolve(data);
            });
        });
    }
}


function f1(data){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            data++;
            resolve(data);
        },200);
    });
    
    
}

async function f2(){
    
    let r = await f1(1);
    console.log(r);
}

// console.log(f2());

async function readTest(path){
    const readLine = require('readline');
    const fs = require('fs');

    const stream = fs.createReadStream(path);

    const rl = readLine.createInterface({
        input:stream,
        crlfDelay:Infinity
    });
    
    const fsMdl = require('fs');
    const pathMdl = require('path');
    const uuidMdl = require('uuid');

    let dispLineNo = 0; //字段分割行号，共三行
    let isFile = false;         //是否文件字段
    let dataKey;
    let value;
    let dispLine;
    let startField = false;
    let returnObj = {};
    let fileHandler;
    
    return new Promise((res,rej)=>{
        rl.on('line',handleLine);

        rl.on('close',()=>{
            console.log(returnObj);
            res(returnObj);    
        });

    });    
    
    async function handleLine(line){
         //第一行，设置分割线
         if(!dispLine){
            dispLine = line;
            startField = true;
            dispLineNo = 1;
            return;
        }
        if(dispLine === line || dispLine + '--' === line){  //新字段或结束
            if(returnObj.hasOwnProperty(dataKey)){
                //新建数组
                if(!Array.isArray(returnObj[dataKey])){
                    returnObj[dataKey] = [returnObj[dataKey]];
                }
                //新值入数组
                returnObj[dataKey].push(value);
            }else{
                returnObj[dataKey] = value;
            }
            startField = true;
            dispLineNo = 1;
            isFile = false;
            value = '';

            // if(dispLine + '--' === line){ //结束
            //     rl.close();
            // }
            return;
        }


        if(startField){
            //第一行
            switch(dispLineNo){
                case 1:  //第一行
                    dispLineNo = 2;
                    let arr = line.split(';');  
                    //数据项
                    dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                    dataKey = dataKey.substring(2,dataKey.length-1);
                    if(arr.length === 3){  //文件
                        let a1 = arr[2].split('=');
                        let fn = a1[1].trim();
                        let fn1 = fn.substring(1,fn.length-1);
                        let fn2 = uuidMdl.v1().replace(/\-/g,'') + fn1.substr(fn1.lastIndexOf('.'));
                        filePath = pathMdl.resolve(process.cwd(),'upload/tmp',fn2);
                        value = {
                            fileName:fn1,
                            path:filePath
                        };
                        fileHandler = fsMdl.openSync(filePath,'a');
                        isFile = true;  
                    }
                    return;
                case 2: //第二行（空或者文件类型）
                    if(isFile){  //文件字段
                        value.fileType = line.substr(line.indexOf(':')).trim();
                    }
                    dispLineNo = 3;
                    return;
                case 3: //第三行（字段值或者空）
                    if(!isFile){
                        value = line; 
                    }
                    startField = false;
                    return;
            }
        }    

        if(isFile){  //写文件
            await write(fsMdl,fileHandler,line);
        }else{  //普通字段（textarea可能有换行符）
            value += line;
        }
    }
}

function write(fsMdl,fileHandler,data){
    return new Promise((res,rej)=>{
        fs.write(fileHandler,data,'binary',()=>{
            res();
        });
    });
}

readTest('log-edge.out').then((re)=>{
    console.log(re);
})




