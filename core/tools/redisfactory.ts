import { NoomiError } from "./errorfactory";
import { App } from "./application";

/**
 * redis 配置项
 */
interface RedisCfg{
    /**
     * redis名
     */
    name?:string,
    /**
     * 主机地址
     */
    host:string,
    /**
     * 端口号
     */
    port:string,
    /**
     * 其它配置，请参考npm redis
     */
    options?:any
}

/**
 * redis存储项
 */
interface RedisItem{
    /**
     * 键
     */
    key:string;
    /**
     * pre key,与pre+key作为真正的key
     */
    pre?:string;   
    /**
     * 子键
     */      
    subKey?:string;
    /**
     * 值
     */
    value?:any, 
    /**
     * 超时时间
     */
    timeout?:number;
}
/**
 * redis 工厂
 */
class RedisFactory{
    /**
     * 存储所有的redis对象
     */
    static clientMap:Map<string,any> = new Map();
    /**
     * 添加redis client到clientMap
     * @param cfg   redis配置项
     */
    static addClient(cfg:RedisCfg){
        let client = App.redis.createClient(cfg.port,cfg.host,cfg.options);
        client.on('error',err=>{
            throw err;
        });
        this.clientMap.set(cfg.name,client);
    }

    /**
     * 获得redis client
     * @param name      client name，默认default
     * @return          redis client
     */
    static getClient(name:string){
        name = name || 'default';
        if(this.clientMap.has(name)){
            return this.clientMap.get(name);
        }
        return null;
    }

    /**
     * 把值存入redis中
     * @param clientName    client name
     * @param item          redis item
     */
    static async set(clientName:string,item:RedisItem){
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        //合并pre
        let key:string=item.pre?item.pre+item.key:item.key;
        
        if(item.subKey){
            await new Promise((resolve,reject)=>{
                client.hset(key,item.subKey,item.value,(err,v)=>{
                    resolve(v);
                });
            })
        }else{
            if(Array.isArray(item.value)){//多个键，值组成的数组
                await new Promise((resolve,reject)=>{
                    client.hmset.apply(client,[key].concat(item.value),(err,v)=>{
                        resolve(v);
                    });
                });
            }else if(typeof item.value === 'object'){//对象用set存储
                await new Promise((resolve,reject)=>{
                    client.hmset(key,item.value,(err,v)=>{
                        resolve(v);
                    });
                });
            }else{
                await new Promise((resolve,reject)=>{
                    client.set(key,item.value,(err,v)=>{
                        resolve(v);
                    });
                });
            }
        }
        this.setTimeout(client,key,item.timeout);
    }

    /**
     * 从redis 中取值
     * @param clientName    client name
     * @param item          redis item
     * @return              item value
     */
    static async get(clientName:string,item:RedisItem):Promise<string>{
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        //合并pre
        let key:string=item.pre?item.pre+item.key:item.key;

        let retValue:any;
        //有subKey
        if(item.subKey){
            retValue = await new Promise((resolve,reject)=>{
                client.hget(key,item.subKey,(err,value)=>{
                    if(!err){
                        resolve(value);
                    }
                });  
            }); 
        }else{
            retValue = await new Promise((resolve,reject)=>{
                client.get(key,(err,value)=>{
                    if(err){
                        console.log(err);
                        // throw err;
                    }
                    resolve(value);
                });  
            });
        }
        this.setTimeout(client,key,item.timeout);
        return retValue;
    }

    /**
     * 是否存在某个key
     * @param clientName    redis name
     * @param key           key
     * @return              存在则返回true，否则返回false
     */
    static async has(clientName:string,key:string):Promise<boolean>{
        let client = this.getClient(clientName);
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        let re = await new Promise(resolve=>{
            client.exists(key,(err,v)=>{
                resolve(v);
            });
        });
        if(re === 1){
            return true;
        }
        return false;
    }

    /**
     * 设置超时时间
     * @param client    client name 
     * @param key       键
     * @param timeout   超时时间
     */
    static async setTimeout(client:any,key:string,timeout:number){
        if(typeof timeout !== 'number' || timeout <= 0){
            return;
        }
        let cn;
        if(typeof client === 'string'){
            cn = client;
            client = this.getClient(client);
        }
        
        if(client === null){
            throw new NoomiError("2601",cn);
        }
        client.expire(key,timeout);
    }

    /**
     * 获取map数据
     * @param clientName    client name
     * @param item          RedisItem
     * @returns             object或null
     */
    static async getMap(clientName:string,item:RedisItem){
        let client = this.getClient(clientName);
        let key:string = item.pre?item.pre+item.key:item.key;
        if(client === null){
            throw new NoomiError("2601",clientName);
        }
        let r = new Promise((resolve,reject)=>{
            client.hgetall(key,(err,value)=>{
                if(!err){
                    resolve(value);
                }
            }); 
        });
        
        if(item.timeout && item.timeout>0){
            this.setTimeout(clientName,item.key,item.timeout);
        }
        return r;
    }

    /**
     * 删除项
     * @clientName      client name
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
     * @param path  redis配置文件路径
     */
    static parseFile(path:string){
        //读取文件
        let json:any = null;
        try{
            let jsonStr:string = App.fs.readFileSync(path,'utf-8');
            json = App.JSON.parse(jsonStr);
        }catch(e){
            throw new NoomiError("2600") + '\n' + e;
        }
        this.init(json);
    }

    /**
     * 初始化
     * @param config    redis配置 
     */
    static init(config){
        //可以为数组，也可以为单个对象
        if(Array.isArray(config)){
            let index = 0;
            for(let jo of config){
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
            if(!config.name){
                config.name = 'default'
            }
            this.addClient(config);
        }
    }
}

export {RedisFactory}