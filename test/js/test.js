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

class a{
    constructor(){
        this.msg = 'hello';
    }
    f1(){
        console.log(this.msg);
    }
}

let a1 = new a();
console.log(Reflect.ownKeys(a1.__proto__));

