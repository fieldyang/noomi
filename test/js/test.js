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
// new tclass.tclass().sayHello();

let map = new Map();
map.set(1,"aaa");
map.set(2,"bbb");
map.set(3,"ccc");
map.set(4,"ddd");
for(let o of map.values()){
    console.log(o);
}
// for(let ite=map.values();ite.hasNext();){
//     console.log(ite.next().value);
// }
