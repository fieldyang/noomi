import { createConnection, Connection } from "typeorm";

export class OrmFactory{
    
    static async getConnection():Promise<Connection>{
        return await createConnection({
            name:'default',
            type:'mysql',
            host:'localhost',
            port:3306,
            username:'root',
            password:'field',
            database:'codement'
        });
    }
}