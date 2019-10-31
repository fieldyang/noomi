
// const typeorm = require('typeorm');
// createConnection({
//     "type":"mysql",
//     "host":"localhost",
//     "port":3306,
//     "username":"root",
//     "password":"field",
//     "database":"codement",
//     "entities": [
//         "build/test/app/module/dao/pojo/*.js"
//     ],
//     "logging":true,
//     "logger":"all",
//     "extra":{
//         "connectionLimit":10
//     }
// }).then(()=>{
//     let lst = t_user.find();
//     console.log(lst);
// });
 
// let reg = /[A-Za-z].*[0-9&~\$\+_]+.*|[0-9].*[\w&~\$\+]+.*/;
// let r;
// let s = '2+&';
// console.log(reg.test(s));
// let os = require('os');
// let r = os.arch();
// console.log(r);
// r = os.constants.signals.SIGXCPU;
// async function foo(){
//     let fs = require('fs');
//     let crypto = require('crypto');
//     let stat = await new Promise((resolve,reject)=>{
//         fs.stat('test/js/tclass.js',(err,v)=>{
//             resolve(v);
//         });
//     })
    

//     let data = await new Promise((resolve,reject)=>{
//         fs.readFile('test/js/tclass1.js','utf8',(err,data)=>{
//             if(err){
//                 // response.writeToClient({
//                 //     statusCode:404
//                 // });
//                 reject(404);
//             }
//             resolve(data);    
//         });
//     }).catch((e)=>{
//         console.log(e);
//     });
//     console.log(data);
// }

// foo();

async function f1(){
    throw "error";
}

async function f2(){
    return 1;
}

async function f3(){
    let a = await f1();
    let b = await f2();
    console.log(a,b);
    return b;    
}

async function f4(){
    try{
        let v = await f3();
        console.log(v); 
    }catch(e){
        console.log(e);
    }
    
    
}

f4();