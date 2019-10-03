import{createConnection, getConnectionManager, getConnection, getRepository} from "typeorm";
import { User } from "../app/module/dao/pojo/user";
import { Group } from "../app/module/dao/pojo/group";
import { GroupUser } from "../app/module/dao/pojo/groupuser";

(async function(){
    const manager = getConnectionManager();

    const conn = manager.create({
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
        // "logger":"all",
        "extra":{
            "connectionLimit":10
        }
    });
    if(!conn.isConnected)
        await conn.connect();
    // let lst = await conn.manager.find(Group);
    // let group:Group = await conn.getRepository(Group).findOne(1);
    let lst = await conn.getRepository(GroupUser).find();
    
    console.log(lst);
}());
