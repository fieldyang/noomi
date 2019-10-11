import { NoomiError } from "../errorfactory";
import { resolve } from "dns";

interface RedisCfg{
    name?:string,
    host:string,
    port:string,
    options?:any
}

/**
 * redis项
 */
interface RedisItem{
    key:string;         //键
    subKey?:string;     //子键
    value?:any,         //值
    timeout?:number;    //超时时间
}
/**
 * redis 工厂
 */
class RedisFactory{
    static clientMap:Map<string,any> = new Map();
    /**
     * 添加redis client
     * @param cfg 
     */
    static addClient(cfg:RedisCfg){
        const redis = require('redis');
        this.clientMap.set(cfg.name,redis.createClient(cfg.port,cfg.host,cfg.options));
    }

    /**
     * 获得redis client
     * @param name      client name，默认default
     * @return          client
     */
    static getClient(name:string){
        name = name || 'default';
        if(this.clientMap.has(name)){
            return this.clientMap.get(name);
        }
        return null;
    }

    /**
     * 设置值
     * @param clientName    client name
     * @param item          redis item
     */
    static async set(clientName:string,item:RedisItem){
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        if(item.subKey){
            await new Promise((resolve,reject)=>{
                client.hset(item.key,item.subKey,item.value,(err,v)=>{
                    resolve(v);
                });
            })
        }else{
            if(typeof item.value === 'object'){//对象用set存储
                await new Promise((resolve,reject)=>{
                    client.hmset(item.key,item.value,(err,v)=>{
                        resolve(v);
                    });
                });
                
            }else{
                await new Promise((resolve,reject)=>{
                    client.set(item.key,item.value,(err,v)=>{
                        resolve(v);
                    });
                });
            }
        }
        //设置超时
        if(item.timeout>0){
            client.expire(item.key,item.timeout);
        }
    }

    /**
     * 获取值
     * @param clientName    client name
     * @param item          redis item
     * @return              item value
     */
    static async get(clientName:string,item:RedisItem):Promise<string>{
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        
        let retValue;
        if(item.subKey){
            retValue = await new Promise((resolve,reject)=>{
                client.hget(item.key,item.subKey,(err,value)=>{
                    if(!err){
                        resolve(value);
                    }
                });  
            }); 
        }else{
            retValue = await new Promise((resolve,reject)=>{
                client.get(item.key,(err,value)=>{
                    if(err){
                        throw err;
                    }
                    resolve(value);
                });  
            });
        }

        //修改过期时间
        if(item.timeout && item.timeout>0){
            client.expire(item.key,item.timeout);
        }
        return retValue;
    }

    /**
     * 获取map数据
     * @param clientName    client name
     * @param key           key
     */
    static async getMap(clientName:string,key:string){
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        return new Promise((resolve,reject)=>{
            client.hgetall(key,(err,value)=>{
                if(!err){
                    resolve(value);
                }
            });  
        });
    }

    /**
     * 删除项
     * @param key       键 
     * @param subKey    子键
     */
    static del(clientName:string,key:string,subKey?:string){
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        if(subKey!==undefined){
            client.hdel(key,subKey);
        }else{
            client.del(key);
        }
    }

    /**
     * 解析配置文件
     * @param path 
     */
    static parseFile(path:string){
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let json:any = null;
        try{
            let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
            json = JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2600");
        }
        //可以为数组，也可以为单个对象
        if(Array.isArray(json)){
            let index = 0;
            for(let jo of json){
                //设置名字
                if(!jo.name){
                    if(index === 0){
                        jo.name = 'default';
                    }else{
                        jo.name = 'default' + index;
                    }
                    index++;
                }
                this.addClient(jo);
            }
        }else{
            if(!json.name){
                json.name = 'default'
            }
            this.addClient(json);
        }
    }
}

export {RedisFactory}