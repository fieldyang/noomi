let a = {
    b:{
        c:{
            d:{
                e:{
                    f:1,
                    g:2
                }
            }
        },
        ii:{
            jj:'hello'
        }
    }
}

const v8 = require('v8');
let buf = v8.serialize(a);
let x = v8.deserialize(buf);
console.log(x.b.c.d);