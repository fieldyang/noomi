import { RedisFactory } from "../../core/ts/redisfactory";


    // RedisFactory.addClient({
    //     name:'default',
    //     host:'localhost',
    //     port:'6379',
    //     // options:{
    //     //     password:'field'
    //     // }
    // });
    
    // let client = RedisFactory.getClient('default');
    // client.hmset('xxx',{
    //     'aaa':'1',
    //     "bbb":'y'
    // });
    // client.hgetall('xxx',(e,r)=>{
    //     console.log(r);
    // })

    // RedisFactory.set('default',{
    //     key:'xxxx',
    //     value:{
    //         'aaa':'1',
    //         "bbb":'y'
    //     }
    // });


// // client.expire('xxx',5);
// client.hget('xxx','name',(err,value)=>{
//     if(err){throw err};
//     console.log(value)
// });

// setTimeout(()=>{
//     client.hget('xxx','name',(err,value)=>{
//         if(err){throw err};
//         console.log(value)
//     });
// },6000);
// client.hmset('xxx', {
//     age: 2,
//     sex: 'F',
//     yyy:{
//         u:'yang'
//     }
//   },(err,obj)=>{
//     console.log(err);
// });
// client.hdel('xxx','yyy');
// // client.hset('xxx','yyy',{
// //     u:'lei'
// // });
// client.hget('xxx','yyy',(err,value)=>{
//     console.log(value.u);
// })


// RedisFactory.get('default','aaa','name').then(value=>{
//     console.log(value);
// });

// let path = require('path');
// console.log(path.resolve('./config/database.json'));
// DBFactory.parseFile('./config/database.json');
// async function foo(){
//     let conn = await DBFactory.getConnection();
//     let o = conn.beginTransaction(async (err)=>{
//         if(err){
//             throw err;
//         }
//         let conn1 = await DBFactory.getConnection();
//         conn1.query(`insert into t_resource(resource_id,url) values(11,'/testroute1')`);
        
//         conn.commit();
//         conn.release();
//         console.log(conn);
//     });
//     console.log(o);
// }

// foo();
