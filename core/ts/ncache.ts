import { NoomiError } from "./errorfactory";
import { RedisFactory } from "./redisfactory";
import { runInThisContext } from "vm";

/**
 * cache类
 */
interface CacheItem{
    expire:number;      //超时时间
    lastUse:number;     //最后使用时间
    value:any;          //值
    size:number;        //memory大小
    timeout?:number;    //超时时间(秒)
}

/**
 * redis 存储项
 */
interface RedisItem{
    key:string;         //键
    subKey?:string;     //子键
    value:any;          //值
}

interface CacheCfg{
    name:string;        //cache 名
    saveType:number;    //存储类型 0内存，1redis，默认1
    redis?:string;       //redis名
    maxSize?:number;     //最大空间，默认为0，如果saveType=1，设置无效
    cleanNum?:number;   //单次清除最大数量，默认100，如果saveType=1，设置无效
}

export class NCache{
    redis:string;                                   //redis名，saveType为1时（redis需要）
    name:string;                                    //名字（redis需要）
    maxSize:number;                                 //最大 memorysize，默认0
    size:number;                                    //当前map memory size
    cleanNum:number=100;                            //单次清理个数(默认10)
    map:Map<string,CacheItem> = new Map();          //cache map
    extraSize:number;                               //存储单元额外size
    saveType:number;                                //存储类型 0内存 1redis     默认0
    redisSizeName:string = 'NCACHE_SIZE_';          //redis存储的cache size名字前缀
    redisPreName:string = 'NCACHE_';                //redis存储前缀
    redisTimeout:string = 'NCACHE_TIMEOUT_';        //timeout 前缀

    /**
     * 
     * @param name 
     * @param saveType 
     * @param maxSize 
     * @param cleanNum 
     */
    constructor(cfg:CacheCfg){
        this.saveType = cfg.saveType || 0;
        this.name = cfg.name;
        this.redis = cfg.redis;
        this.maxSize = cfg.maxSize || 0;
        this.cleanNum = cfg.cleanNum || 100;     
        this.extraSize = 8;

        if(this.saveType === 0){
            this.size = 0;
        }else{
            this.redisPreName += this.name + '_';
            this.redisTimeout += this.name + '_';
            this.redisSizeName += this.name;
        }
    }

    /**
     * 添加到cache
     * @param key       键
     * @param value     值
     * @param extra     附加信息
     * @param timeout   超时时间(秒)         
     */
    async set(item:RedisItem,timeout?:number){
        //存到内存才需要清理，redis会采用LRU算法清理
        if(this.saveType === 0){
            let size:number = this.getRealSize(item.value);
            if(this.maxSize>0 && size + this.size>this.maxSize){
                this.cleanup(size + this.size - this.maxSize);
                if(size + this.size > this.maxSize){
                    throw new NoomiError("存入值超过缓存最大值");
                }
            }
            let ci:CacheItem = this.map.get(item.key);

            if(item.subKey){//子键
                if(!ci || typeof ci.value !== 'object'){
                    return;
                }
                //保留原size
                let si = ci.size;
                if(ci.value[item.subKey]){
                    let s = this.getRealSize(ci.value[item.subKey]);
                    ci.size -= s;
                }
                ci.value[item.subKey] = item.value;
                let s1 = this.getRealSize(item.value);
                ci.size += s1;
                //更新cache size
                this.size += ci.size - si;
            }else{
                
                if(ci !== undefined){
                    this.size -= this.getRealSize(ci);
                }
                let ct = new Date().getTime();
                ci = {
                    value:item.value,
                    lastUse:ct,
                    expire:timeout&&timeout>0?ct+timeout*1000:0,
                    size:size
                };
                this.map.set(item.key,ci);
                this.size += this.getRealSize(ci);
            }
        }else{//数据存到redis
            await this.addToRedis(item,timeout);
        }
    }

    /**
     * 获取值
     * @param key           键
     * @param changeExpire  是否更新过期时间
     * @return              value或null
     */
    async get(key:string,subKey?:string,changeExpire?:boolean){
        let ci:CacheItem = null;
        if(this.saveType === 0){
            if(this.map.has(key)){
                ci = this.map.get(key);
                const ct:number = new Date().getTime();
                if(ci.expire > 0 && ci.expire < ct){
                    this.map.delete(key);
                    this.size -= ci.size;
                    ci = null;
                    return null;
                }
                //修改过期时间
                if(changeExpire){
                    ci.expire += ct - ci.lastUse;
                }
                ci.lastUse = ct;
                if(subKey && typeof ci.value === 'object'){
                    return ci.value[subKey];
                }
            }
        }else{
            return await this.getFromRedis(key,subKey,changeExpire);
        }
        return null;
    }

    /**
     * 获取值
     * @param key           键
     * @param changeExpire  是否更新过期时间
     * @return              value或null
     */
    async getMap(key:string,changeExpire?:boolean){
        let ci:CacheItem = null;
        if(this.saveType === 0){
            if(this.map.has(key)){
                ci = this.map.get(key);
                const ct:number = new Date().getTime();
                if(ci.expire > 0 && ci.expire < ct){
                    this.map.delete(key);
                    this.size -= ci.size;
                    ci = null;
                    return null;
                }
                //修改过期时间
                if(changeExpire){
                    ci.expire += ct - ci.lastUse;
                }
                ci.lastUse = ct;
                
            }
        }else{
            return await this.getMapFromRedis(key);
        }
        return null;
    }

    /**
     * 删除
     * @param key 键
     */
    async del(key:string,subKey?:string){
        if(this.saveType === 0){
            let ci:CacheItem = this.map.get(key);
            if(ci){
                this.size -= ci.size;
                this.map.delete(key);
                ci = null;
            }
        }else{
            await RedisFactory.del(this.redis,this.redisPreName + key,subKey);
        }
    }

    /**
     * 获取键
     * @param key   键，可以带通配符 
     */
    async getKeys(key:string):Promise<Array<string>>{
        if(this.saveType === 0){

        }else{
            let client = RedisFactory.getClient(this.redis);
            if(client === null){
                throw new NoomiError("2601",this.redis);
            }
            let arr = client.keys(this.redisPreName + key);
            //把前缀去掉
            arr.forEach((item,i)=>{
                arr[i] = item.substr(this.redisPreName.length);
            })
            return arr;
        }
        return null;
    }
    /**
     * 是否拥有key
     * @param key 
     * @return   true/false
     */
    async has(key:string):Promise<boolean>{
        if(this.saveType === 0){

        }else{
            return await RedisFactory.has(this.redis,this.redisPreName + key);
        }
    }
    /**
     * 清理缓存
     * @param size  清理大小，为0仅清除超时元素
     */
    cleanup(size:number){
        //无可清理对象
        if(this.map.size === 0){
            return;
        }
        let ct = new Date().getTime();
        let unUseList:Array<any> = [];
        let sizeOk:boolean = false;
        let removeSize:number = 0; //已移除size
        for(let item of this.map){
            let key:string = item[0];
            let ci:CacheItem = item[1];
            //清理超时的
            if(ci.expire>0 && ci.expire<ct){
                this.map.delete(key);
                this.size -= ci.size;
                removeSize += ci.size;
                //空间已够
                if(removeSize>size){
                    sizeOk = true;
                    unUseList = null;
                }
                ci = null;
            }else if(size>0 && !sizeOk){  //sizeok 不再处理最近未使用数组
                let o = {
                    key:key,
                    lastUser:ci.lastUse,
                    size:ci.size
                };
                if(unUseList.length < this.cleanNum){
                    unUseList.push(o);
                }else{ //直接替换最后一个，因为它lastUse时间最大
                    unUseList[this.cleanNum-1] = o;
                }

                //按最近使用时间排序
                if(unUseList.length>0){
                    unUseList.sort((a,b)=>{
                        return a.lastUse - b.lastUse;
                    });
                }
            }
        }

        if(size>0 && !sizeOk){
            unUseList.forEach((item)=>{
                this.map.delete(item.key);
                this.size -= item.size;
                removeSize += item.size;
            });
        }

        //空间不够，继续清理
        if(removeSize<size){
            this.cleanup(size-removeSize);
        }
    }

    /**
     * 从redis获取值
     * @param key           键
     * @apram subKey        子键
     * @param changeExpire  是否修改expire
     */
    private async getFromRedis(key:string,subKey?:string,changeExpire?:boolean):Promise<any>{
        let timeout:number = 0;
        if(changeExpire){
            let ts:string = await RedisFactory.get(this.redis,{
                pre:this.redisTimeout,
                key:key
            });
            if(ts !== null){
                timeout = parseInt(ts);
            }
        }
        
        let value = await RedisFactory.get(this.redis,{
            pre:this.redisPreName,
            key:key,
            subKey:subKey,
            timeout:timeout
        });
        return value||null;
    }

    /**
     * 从redis获取值
     * @param key           键
     * @apram subKey        子键
     * @param changeExpire  是否修改expire
     */
    private async getMapFromRedis(key:string,changeExpire?:boolean):Promise<any>{
        let timeout:number = 0;
        //超时修改expire
        if(changeExpire){
            let ts:string = await RedisFactory.get(this.redis,{
                pre:this.redisTimeout,
                key:key
            });
            if(ts !== null){
                timeout = parseInt(ts);
            }
        }
        
        let value = await RedisFactory.getMap(this.redis,{
            key:key,
            pre:this.redisPreName,
            timeout:timeout
        });
        return value||null;
    }

    /**
     * 存到redis
     * @param item      Redis item
     * @param timeout   超时
     */
    private async addToRedis(item:RedisItem,timeout?:number){
        //存储timeout
        if(typeof timeout==='number' && timeout>0){
            await RedisFactory.set(
                this.redis,
                {
                    pre:this.redisTimeout,
                    key:item.key,
                    value:timeout
                }
            );
        }
        //存储值
        await RedisFactory.set(
            this.redis,
            {
                pre:this.redisPreName,
                key:item.key,
                subKey:item.subKey,
                value:item.value,
                timeout:timeout
            }
        );
    }

    /**
     * 获取内容实际size utf8
     * @param value     待检测值
     * @return          size
     */
    getRealSize(value:any):number{
        let totalLength:number = 0;
        for (let i = 0; i < value.length; i++) {
            let charCode = value.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength = totalLength + 1;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            }
        }
        return totalLength;
    }
}