import { createConnection, Connection } from "typeorm";

export class OrmFactory{
    
    static async getConnection():Promise<Connection>{
        return await createConnection({
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
            "extra":{
                "connectionLimit":10
            }
        });
    }
}