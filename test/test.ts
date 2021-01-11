import { RelaenThreadLocal as tl1} from "relaen";
import { NoomiThreadLocal } from "../core/tools/threadlocal";

async function f1(){
    let id = NoomiThreadLocal.newThreadId();
    log('noomi id:' + id);
    await f2();
    await f3();
}

async function f2(){
    log('f2');
    await f3();
}

async function f3(){
    log('f3');
    let id = tl1.getThreadId();
    log("relaen id:" + id);
    if(!id){
        tl1.newThreadId();
    }
}

async function f4(){
    log('f4');
    await f1();
}

async function f5(){
    await f4();
    await f2();
    await f3();
}

f5();

function log(info){
    // require('fs').writeFileSync('log.out',info + '\r\n',{flag:'a+'});
    console.log(info);
}
log("relaen out id:" + tl1.getThreadId())
log("noomi out id:" + NoomiThreadLocal.getThreadId());