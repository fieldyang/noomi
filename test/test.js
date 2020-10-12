async function foo(){
    return new Promise((res,rej)=>{
        rej(1);
    }).catch(e=>{
        console.log('error:',e);
    });
}

async function f1(){
    return await foo();
}



(async ()=>{
    let r = await foo();
    console.log(r);
})()


// require('zlib').gzip(require('v8').serialize(o),(err,r)=>{
//     console.log(err,r);
// })