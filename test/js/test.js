// const cls = require("./tclass.js");
// const cls = require("./tclass.mjs");
// console.log(typeof cls);
// new cls();
const fs = require('fs');
const mime = require('mime');
// const MimeLookup = require('mime-lookup');
// const mime = new MimeLookup(require('mime-db'));

let path = '/Users/leiyang/develop/codework/jswork/noomi/test/js/tclass.js';
fs.readFile(path,'binary',(err,file)=>{
    if(err){
        console.log('not found');
    }else{
        console.log(mime.getType(path));
    }
});
