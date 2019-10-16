import { DateHandler } from "../common/datehandler";
import { Inject} from "../../../../core/ts/decorator";

class UserService{
    @Inject("dateHandler")
    dateHandler:DateHandler;

    /**
     * 获取用户信息
     */
    getInfo(data:any){
        let d = {
            userId:data.id,
            userName:data.name,
            date:this.dateHandler.tickerToDTString((new Date()).valueOf())
        }
        return d;
    }

    public getFile():Promise<any>{
        const fs = require('fs');
        const path = require('path');
        return new Promise((resolve,reject)=>{
            let p:string = path.resolve(__dirname,'../filter/pathfilter.js');
            fs.readFile(p, {flag:'r',encoding:'utf8'},(err, data) => {
                if (err) 
                    reject(err);
                resolve(data);
            });
        }); 
    }

    foo1(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(1);
            },20000);
        });
    }

    foo2(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(2);
            },0);
        });
    }
}

export {UserService};