
let s1 = "/xxx/yyy/user*get*";
let reg = new RegExp(s1);
let reg1 = new RegExp("\\*","g");
let s2 = "/xxx/yyy/usergetinfo";

let r=null;
while((r=reg1.exec(s1)) !== null){
    console.log(r);
}
// console.log(reg1.exec(s1));