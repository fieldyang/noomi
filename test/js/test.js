
const typeorm = require('typeorm');
createConnection({
    "type":"mysql",
    "host":"localhost",
    "port":3306,
    "username":"root",
    "password":"field",
    "database":"codement",
    "entities": [
        "build/test/app/module/dao/pojo/*.js"
    ],
    "logging":true,
    "logger":"all",
    "extra":{
        "connectionLimit":10
    }
}).then(()=>{
    let lst = t_user.find();
    console.log(lst);
});
