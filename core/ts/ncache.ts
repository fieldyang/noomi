import { NoomiError } from "../errorfactory";
import { RedisFactory } from "./redisfactory";

/**
 * cache类
 */
interface CacheItem{
    expire:number;      //超时时间
    lastUse:number;     //最后使用时间
    value:string;       //值
    size:number;        //memory大小
}

export class NCache{
    redis:string;                                   //redis名，saveType为1时（redis需要）
    name:string;                                    //名字（redis需要）
    maxSize:number;                                 //最大 memorysize，默认0
    size:number;                                    //当前map memory size
    cleanNum:number;                                //单次清理个数(默认10)
    map:Map<string,CacheItem> = new Map();          //cache map
    extraSize:number;                               //存储单元额外size
    saveType:number;                                //存储类型 0内存 1redis     默认0
    redisSizeName:string = 'NOOMI_CACHE_SIZE';      //redis存储的size名字
    redisPreName:string = 'NOOMI_CACHE_';           //redis存储前缀
    /**
     * 
     * @param name 
     * @param saveType 
     * @param maxSize 
     * @param cleanNum 
     */
    constructor(cfg:any){
        this.saveType = cfg.saveType || 0;
        this.name = cfg.name;
        this.redis = cfg.redis;
        this.maxSize = cfg.maxSize || 0;
        this.cleanNum = cfg.cleanNum || 10;     
        this.extraSize = 8;

        if(this.saveType === 0){
            this.size = 0;
        }else{
            this.setCacheParamToRedis();
        }
    }

    /**
     * 添加到cache
     * @param key       键
     * @param value     值
     * @param timeout   超时时间(秒)         
     */
    async add(key:string,value:string,timeout?:number){
        let size = this.getRealSize(value) + this.extraSize;
        
        //获取当前缓存size
        if(this.saveType === 1){
            await this.getCacheParamFromRedis();
        }

        if(this.maxSize>0 && size + this.size>this.maxSize){
            this.cleanup(size + this.size - this.maxSize);
            if(size + this.size > this.maxSize){
                throw new NoomiError("存入值超过缓存最大值");
            }
        }

        let ct = new Date().getTime();
        if(this.saveType === 0){ //存内存
            this.map.set(key,{
                value:value,
                lastUse:ct,
                expire:timeout&&timeout>0?ct+timeout*1000:0,
                size:size
            });    
        }
       
        //修改size
        this.size += size;
    }

    /**
     * 获取值
     * @param key           键
     * @param changeExpire  是否更新过期时间
     * @return              value或null
     */
    async get(key:string,changeExpire?:boolean){
        if(this.saveType === 0){
            if(this.map.has(key)){
                let ci:CacheItem = this.map.get(key);
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
                return ci.value;
            }
        }else{
            let ci = await this.getFromRedis(key);
        }
        
        return null;
    }

    /**
     * 删除
     * @param key 键
     */
    async del(key:string){
        if(this.saveType === 0){
            let ci:CacheItem = this.map.get(key);
            if(ci){
                this.size -= ci.size;
                this.map.delete(key);
                ci = null;
            }
        }else{
            let ci = await this.getFromRedis(key);
            if(ci !== null){
                this.size -= ci.size;
                await RedisFactory.del(this.redis,this.redis,key);
                this.setCacheParamToRedis();
            }
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
     * @param key           key
     * @param changeExpire  是否修改expire
     */
    private async getFromRedis(key:string,changeExpire?:boolean):Promise<any>{
        let value:string = await RedisFactory.get(this.redis,{
            key:this.name,
            subKey:this.redisPreName + key + '_VALUE'
        });

        let timeout=0;
        //修改超时时间
        if(changeExpire){
            let v:string = await RedisFactory.get(this.redis,{
                key:this.name,
                subKey:this.redisPreName + key + '_EXPIRE'
            });
            if(v!== null){
                let expire = parseInt(v);
                if(expire > 0){
                    v = await RedisFactory.get(this.redis,{
                        key:this.name,
                        subKey:this.redisPreName + key + '_LASTUSE'
                    });
                    if(v !== null){
                        timeout = expire - parseInt(v);
                    }    
                }
            }
        }
        let ct = new Date().getTime();
        let data:Array<any> = [this.redisPreName + key + '_LASTUSE',ct];
        if(timeout > 0){ //修改expire
            data.push(this.redisPreName + key + '_EXPIRE');
            data.push(ct+timeout);
        }
        
        await RedisFactory.set(this.redis,{
            key:this.name,
            value:data
        });
        return value;
    }

    /**
     * 存到redis
     * @param key 
     * @param ci        cacheitem 
     * @param timeout 
     */
    private async addToRedis(key:string,ci:CacheItem,timeout:number){
        let key1:string = this.redisPreName + key + '_';
        // size,lastuse,expire,value分开存
        RedisFactory.set(
            this.redis,
            {
                key:this.name,
                value:[
                    key1+'SIZE',
                    ci.size,
                    key1+'LASTUSE',
                    ci.lastUse,
                    key1 + 'EXPIRE',
                    ci.expire,
                    key1+'VALUE',
                    ci.value
                ]
            }
        );
    }

    /**
     * 获取cache参数
     */
    private async getCacheParamFromRedis(){
        let s:string = await RedisFactory.get(this.redis,{
            key:this.name,
            subKey:this.redisSizeName
        });
        this.size = s!==null?parseInt(s):0;
    }

    /**
     * 设置cache 参数 到redis
     */
    private async setCacheParamToRedis(){
        await RedisFactory.get(this.redis,{
            key:this.name,
            subKey:this.redisSizeName,
            value:this.size
        });
    }

    private async cleanRedis(size:number){

    }

    /**
     * 获取内容实际size utf8
     * @param value     待检测值
     * @return          size
     */
    getRealSize(value:string):number{
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