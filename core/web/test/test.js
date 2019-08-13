
// let s1 = "/xxx/yyy/user*get*";
// let reg = new RegExp(s1);
// let reg1 = new RegExp("\\*","g");
// let s2 = "/xxx/yyy/usergetinfo";

// let r=null;
// while((r=reg1.exec(s1)) !== null){
//     console.log(r);
// }
// // console.log(reg1.exec(s1));
const fs = require("fs");
let re = fs.readFileSync(new URL("file://" + __dirname + '/noomitest.js'),'utf-8');
console.log(re);
// fs.open(__dirname + '/noomitest.js', 'r', (err, fd) => {
//     if (err){
//         throw err;
//         // if (err.code === 'ENOENT') {
//         //     throw path + '不存在';
//         // }
//         // throw err;
//     }

//     console.log(fd);
    
// });