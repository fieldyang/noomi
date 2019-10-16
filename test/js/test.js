
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
let os = require('os');
let r = os.arch();
// console.log(r);
// r = os.constants.signals.SIGXCPU;
console.log(process.cpuUsage());