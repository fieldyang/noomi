
const fs = require('fs');
let mime = require('mime');
// var bitmap = fs.readFileSync('../imgs/homebg.png');
var bitmap = fs.readFileSync('./nodomui.js');
let buf1 = Buffer.from(bitmap,'base64');
fs.writeFileSync('./jpg1',buf1);

const zip = require('zlib');
let s1 = zip.deflateSync(buf1);
console.log(s1.length,buf1.length); 

// console.log(s1.toString('hex'));
// let s2 = zip
//创建压缩管道
// await pipeline(fs.createReadStream(path),zipTool,App.fs.createWriteStream(tmpFn));
// let buf = Buffer.from(s,'ascii');
// let s1 = buf.toString('ascii');
// let buf1 = Buffer.from(s1,'ascii')
// for(let i=0;i<buf.length;i++){
//     if(buf[i] !== buf1[i]){
//         console.log(i);
//     }
// }