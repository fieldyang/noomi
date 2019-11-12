import { NCache } from "../../core/ncache";
import { RedisFactory } from "../../core/redisfactory";

RedisFactory.init([{
    "name":"default",
    "host":"localhost",
    "port":"6379"
}]);

let cache = new NCache({
    name:'cache1',
    redis:'default',
    saveType:0,
    maxSize:200000
});

async function foo(){
    // await cache.set({
    //     key:'k1',
    //     value:{k2:'aaa'}
    // });
    await cache.set({
        key:'k1',
        subKey:'k2',
        value:'hello'
    });

    await cache.set({
        key:'k1',
        subKey:'k3',
        value:'1232'
    });

    await cache.set({
        key:'k1',
        value:{a:1,b:2}
    });
    await cache.set({
        key:'k1',
        subKey:'c',
        value:{a:1,b:2}
    });
    console.log(await cache.get('k1','k2'));
    console.log(await cache.get('k1','a'));
    console.log(await cache.get('k1','k3'));
    console.log(await cache.get('k1','c'));
}

foo();
