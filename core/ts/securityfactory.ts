import { HttpRequest } from "./httprequest";
import { InstanceFactory } from "./instancefactory";
import { SecurityFilter } from "./filter/securityfilter";
import { Session } from "./sessionfactory";
import { NoomiError } from "../errorfactory";
import { RedisFactory } from "./redisfactory";

/**
 * 安全工厂
 */
interface ResourceObj{
    url:string;                //url
    auths:Array<number>;       //组id列表
}

class SecurityFactory{
    static sessionName:string = 'NOOMI_SECURITY_OBJECT';
    static dbOptions:any;
    static authType:number = 0;     //认证类型 0 session 1 token
    static saveType:number = 0;     //数据存储类型，0内存 1redis    默认0
    static redis:string='default';  //redis名，在redis.json中已定义
    static securityPages:Map<string,string> = new Map();
    //资源列表
    static resources:Map<number,ResourceObj> = new Map();
    //用户
    static users:Map<number,Array<number>> = new Map(); 
    //组
    static groups:Map<number,Array<number>> = new Map();
    
    static redisUserKey:string = "NOOMI_SECURITY_USERS";            //users在redis的key
    static redisGroupKey:string = "NOOMI_SECURITY_GROUPS";          //groups在redis的key
    static redisResourceKey:string = "NOOMI_SECURITY_RESOURCES";    //resource在redis的key
    /**
     * 初始化配置
     */
    static async init(){
        //初始化security filter
        InstanceFactory.addInstance({
            name:'securityFilter',           //实例名
            instance:new SecurityFilter(),
            class_name:'SecurityFilter'
        });
        //redis需要初始化对象
        if(this.saveType === 1){
            //判断是否建立组，未建立，则新建
            let client = RedisFactory.getClient(this.redis);
            let r = await client.exists(this.redisGroupKey);
            if(!r){
                await RedisFactory.set(this.redis,{
                    key:this.redisGroupKey,
                    value:{}
                });
            }

            //判断是否建立用户，未建立，则新建
            r = await client.exists(this.redisUserKey);
            if(!r){
                await RedisFactory.set(this.redis,{
                    key:this.redisUserKey,
                    value:{noomi:1}
                });
            }

            //判断是否建立resources，未建立，则新建
            r = await client.exists(this.redisResourceKey);
            if(!r){
                await RedisFactory.set(this.redis,{
                    key:this.redisResourceKey,
                    value:{}
                });
            }
        }
        


        //初始化表名和字段名
        let tresource:string = "t_resource";
        let tgroupauth:string="t_group_authority";
        let tresourceauth:string = "t_resource_authority";
        let authId:string = "authority_id";
        let groupId:string = "group_id";
        let resourceId:string = "resource_id";
        let resourceUrl:string = "url";
        if(this.dbOptions.tables){
            tresource = this.dbOptions.tables['resource'] || tresource;
            tgroupauth = this.dbOptions.tables['groupAuthority'] || tgroupauth;
            tresourceauth = this.dbOptions.tables['resourceAuthority'] || tresourceauth; 
        }

        if(this.dbOptions.columns){
            authId = this.dbOptions.columns['authorityId'] || authId;
            groupId = this.dbOptions.columns['groupId'] || groupId;
            resourceId = this.dbOptions.columns['resourceId'] || resourceId;
            resourceUrl = this.dbOptions.columns['resourceUrl'] || resourceUrl;
        }

        let ids = {
            tgroupauth:tgroupauth,
            tresource:tresource,
            tresourceauth:tresourceauth,
            authId:authId,
            groupId:groupId,
            resourceId:resourceId,
            resourceUrl:resourceUrl
        }

        
        //从表中加载数据
        switch(this.dbOptions.product){
            case "mysql":
                await handleMysql.call(this,this.dbOptions,ids);
                break;
            case "mssql":
                await handleMssql.call(this,this.dbOptions,ids);
                break;
            case "oracle":
                await handleOracle.call(this,this.dbOptions,ids);
                break;
            case "mangodb":
                await handleMongo.call(this,this.dbOptions,ids);
                break;
        }

        /**
         * 处理mysql
         * @param cfg 
         */
        async function handleMysql(cfg:any,ids:any){
            const db = require('mysql');
            const port = cfg.port || 3306;
            let conn = db.createConnection({
                host: cfg.host,
                port: port,
                user: cfg.user,
                password: cfg.pwd,
                database: cfg.schema
            });
            try{
                conn.connect();
                //组权限
                await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth,
                    (error,results,fields)=>{
                        for(let r of results){
                            this.addGroupAuthority(r[ids.groupId],r[ids.authId]);
                        }
                        resolve();
                    });
                });

                //资源
                await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource,
                    (error,results,fields)=>{
                        for(let r of results){
                            this.addResource(r[ids.resourceId],r[ids.resourceUrl]);
                        }
                        resolve();
                    });
                });

                //资源权限
                await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth,
                    (error,results,fields)=>{
                        for(let r of results){
                            this.addResourceAuth(r[ids.resourceId],r[ids.authId]);
                        }
                        resolve();
                    });
                });
            }catch(e){
                throw e;
            }finally{
                //关闭连接
                if (conn) {
                    try {
                        conn.end();
                    } catch (err) {
                        throw err;
                    }
                }
            }
        }

        /**
         * 处理mssql
         * @param cfg 
         * @param ids 
         */
        async function handleMssql(cfg:any,ids:any){
            const db = require('mssql');
            const port = cfg.port || 1433;
            let conn;
            try{
                conn = await db.connect({
                    host: cfg.host,
                    port: port,
                    user: cfg.user,
                    password: cfg.pwd,
                    database: cfg.schema
                });
                
                //组权限
                let results = await conn.request().query("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth);
                for(let r of results){
                    await this.addGroupAuthority(r[ids.groupId],r[ids.authId]);
                }
                
                //资源
                results = await conn.request().query("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource);
                for(let r of results){
                    await this.addResource(r[ids.resourceId],r[ids.resourceUrl]);
                }

                //资源权限
                results = await conn.request().query("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth);
                for(let r of results){
                    await this.addResourceAuth(r[ids.resourceId],r[ids.authId]);
                }
            }catch(e){
                throw e;
            }finally{
                //关闭连接
                if (conn) {
                    try {
                        conn.close();
                    } catch (err) {
                        throw err;
                    }
                }
            }
        }

        /**
         * 处理oracle
         * @param cfg 
         * @param ids 
         */
        async function handleOracle(cfg:any,ids:any){
            const db = require('oracledb');
            const port = cfg.port || 1521;
            let conn;
            try{
                conn = await db.getConnection({
                    host: cfg.host,
                    port: port,
                    user: cfg.user,
                    password: cfg.pwd,
                    database: cfg.schema
                });
                
                //组权限
                let results = await conn.execute("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth);
                for(let r of results){
                    await this.addGroupAuthority(r[ids.groupId],r[ids.authId]);
                }
                
                //资源
                results = await conn.execute("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource);
                for(let r of results){
                    await this.addResource(r[ids.resourceId],r[ids.resourceUrl]);
                }

                //资源权限
                results = await conn.execute("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth);
                for(let r of results){
                    await this.addResourceAuth(r[ids.resourceId],r[ids.authId]);
                }
            }catch(e){
                throw e;
            }finally{
                //关闭连接
                if (conn) {
                    try {
                        await conn.close();
                    } catch (err) {
                        throw err;
                    }
                }
            }
        }

        /**
         * 处理mongo
         * @param cfg 
         * @param ids 
         */
        async function handleMongo(cfg:any,ids:any){
            const db = require('mongodb').MongoClient;
            let dbUrl = 'mongodb://';
            if(cfg.user && cfg.pwd){
                dbUrl += cfg.user + ':' + cfg.pwd
            }
            dbUrl += cfg.host;
            if(cfg.port){
                dbUrl += ':' + cfg.port;
            }
            dbUrl += '/' + cfg.database;

            db.connect(dbUrl,async (err,client)=>{
                if(err){
                    throw err;
                }
                let db1 = client.db(cfg.database);
                let coll = db1.collection(ids.tgroupauth);
                await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        for(let r of results){
                            await this.addGroupAuthority(r[ids.groupId],r[ids.authId]);
                        }
                        resolve();
                    });
                });

                //资源
                coll = db1.collection(ids.tresource);
                await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        for(let r of results){
                            await this.addResource(r[ids.resourceId],r[ids.resourceUrl]);
                        }
                        resolve();
                    });
                });

                //资源权限
                coll = db1.collection(ids.tresourceauth);
                await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        for(let r of results){
                            await this.addResourceAuth(r[ids.resourceId],r[ids.authId]);
                        }
                        resolve();
                    });
                });

                client.close();
            });
        }
    }

    /**
     * 添加用户组
     * @param userId    用户id
     * @param groupId   组id
     */
    static async addUserGroup(userId:number,groupId:number){
        if(this.saveType === 0){
            let arr:Array<any> = this.users.get(userId);
            if(!arr){
                arr = [];
                this.users.set(userId,arr);
            }
            if(arr.includes(groupId)){
                return;
            }
            arr.push(groupId);
        }else{
            let user:string = await RedisFactory.get(this.redis,{
                key:this.redisUserKey,
                subKey:userId+''
            });
            let groupArr;
            //group未创建
            if(user === null){
                groupArr = [userId];
            }else{
                groupArr = JSON.parse(user);
                if(groupArr.length>0 && groupArr.includes(groupId)){
                    return;
                }
                groupArr.push(groupId);
            }

            //写回redis
            await RedisFactory.set(this.redis,{
                key:this.redisUserKey,
                subKey:userId+'',
                value:JSON.stringify(groupArr)
            });
        }      
        
    }

    /**
     * 添加用户组(多个组)
     * @param userId    用户id
     * @param groups    组id 数组
     */
    static addUserGroups(userId:number,groups:Array<number>,request?:HttpRequest){
        //保存userId 到security session object
        if(request){
            this.setSession(request.getSession(),'userId',userId);
        }
        for(let gid of groups){
            this.addUserGroup(userId,gid);
        }
    }
    /**
     * 添加组权限
     * @param groupId   组id
     * @param authId    权限id
     */
    static async addGroupAuthority(groupId:number,authId:number){
        if(this.saveType === 0){ //存内存
            let arr:Array<any> = this.groups.get(groupId);
            if(!arr){
                arr = [];
                this.groups.set(groupId,arr);
            }
            if(arr.includes(authId)){
                return;
            }
            arr.push(authId);
        }else{ //存redis
            let group:string = await RedisFactory.get(this.redis,{
                key:this.redisGroupKey,
                subKey:groupId+''
            });
            let authArr;
            //group未创建
            if(group === null){
                authArr = [authId];
            }else{
                authArr = JSON.parse(group);
                if(authArr.length>0 && authArr.includes(authId)){
                    return;
                }
                authArr.push(authId);
            }

            //写回redis
            await RedisFactory.set(this.redis,{
                key:this.redisGroupKey,
                subKey:groupId+'',
                value:JSON.stringify(authArr)
            });
        }
    }

    /**
     * 
     * @param id    资源id
     * @param url   资源路径，可以是正则式
     */
    static async addResource(id:number,url:string){
        if(this.saveType === 0){
            let ro:ResourceObj = {
                url:url,
                auths:[]
            };
            this.resources.set(id,ro);
        }else{ //存redis
            let resource:string = await RedisFactory.get(this.redis,{
                key:this.redisResourceKey,
                subKey:id+''
            });
            
            //resource未创建
            if(resource === null){
                let au = {url:url,auths:[]};
                //写回redis
                await RedisFactory.set(this.redis,{
                    key:this.redisResourceKey,
                    subKey:id+'',
                    value:JSON.stringify(au)
                });
            }
        }
    }

    /**
     * 添加资源权限
     * @param resourceId    资源id
     * @param authId        资源id
     */
    static async addResourceAuth(resourceId:number,authId:number){
        if(this.saveType === 0){
            let ro:ResourceObj = this.resources.get(resourceId);
            if(!ro || ro.auths.includes(authId)){
                return;
            }
            ro.auths.push(authId);

        }else{ //存redis
            let resource:string = await RedisFactory.get(this.redis,{
                key:this.redisResourceKey,
                subKey:resourceId+''
            });
            let resObj = JSON.parse(resource);
            let authArr = resObj.auths;
            if(authArr.length>0 && authArr.includes(authId)){
                return;
            }
            authArr.push(authId);
            //写回redis
            await RedisFactory.set(this.redis,{
                key:this.redisResourceKey,
                subKey:resourceId+'',
                value:JSON.stringify(resObj)
            });
        }
    }

    /**
     * 删除用户     用户id
     * @param userId 
     */
    static async deleteUser(userId:number){
        if(this.saveType === 0){
            this.users.delete(userId);
        }else{
            await RedisFactory.del(this.redis,this.redisUserKey,userId+'');
        }
    }

    /**
     * 删除用户组
     * @param userId    用户id 
     * @param groupId   组id
     */
    static async deleteUserGroup(userId:number,groupId:number){
        if(this.saveType === 0){
            if(!this.users.has(userId)){
                return;
            }
            let a = this.users.get(userId);
            if(!a.includes(groupId)){
                return;
            }
            //从数组移除
            a.splice(a.indexOf(groupId),1);
            
        }else{
            let astr:string = await RedisFactory.get(this.redis,{
                key:this.redisUserKey,
                subKey:userId+''
            });
            let a:Array<number> = JSON.parse(astr);
            if(!a.includes(groupId)){
                return;
            }
            a.splice(a.indexOf(groupId),1);
            
            await RedisFactory.set(this.redis,{
                key:this.redisUserKey,
                subKey:userId+'',
                value:JSON.stringify(a)
            });
        }
    }

    /**
     * 删除组     
     * @param groupId   组id 
     */
    static async deleteGroup(groupId:number){
        if(this.saveType === 0){
            this.groups.delete(groupId);
        }else{
            await RedisFactory.del(this.redis,this.redisGroupKey,groupId+'');
        }
    }

    /**
     * 删除组权限
     * @param groupId   组id 
     * @param authId    权限id
     */
    static async deleteGroupAuthority(groupId:number,authId:number){
        if(this.saveType === 0){
            if(!this.groups.has(groupId)){
                return;
            }
            let a = this.groups.get(groupId);
            if(!a.includes(authId)){
                return;
            }
            //从数组移除
            a.splice(a.indexOf(authId),1);
        }else{
            let astr:string = await RedisFactory.get(this.redis,{
                key:this.redisGroupKey,
                subKey:groupId+''
            });
            let a:Array<number> = JSON.parse(astr);
            if(!a.includes(authId)){
                return;
            }
            a.splice(a.indexOf(authId),1);
            
            await RedisFactory.set(this.redis,{
                key:this.redisGroupKey,
                subKey:groupId+'',
                value:JSON.stringify(a)
            });
        }
    }

    /**
     * 删除资源     
     * @param resourceId   资源id 
     */
    static async deleteResource(resourceId:number){
        if(this.saveType === 0){
            this.resources.delete(resourceId);
        }else{
            await RedisFactory.del(this.redis,this.redisResourceKey,resourceId+'');
        }
    }

    /**
     * 删除资源权限
     * @param resourceId     资源id 
     * @param authId    权限id
     */
    static async deleteResourceAuthority(resourceId:number,authId:number){
        if(this.saveType === 0){
            if(!this.resources.has(resourceId)){
                return;
            }
            let a = this.resources.get(resourceId).auths;
            if(!a.includes(authId)){
                return;
            }
            //从数组移除
            a.splice(a.indexOf(authId),1);
        }else{
            let astr:string = await RedisFactory.get(this.redis,{
                key:this.redisResourceKey,
                subKey:resourceId+''
            });
            let obj = JSON.parse(astr);
            let a:Array<number> = obj.auths;
            if(!a.includes(authId)){
                return;
            }
            a.splice(a.indexOf(authId),1);
            
            await RedisFactory.set(this.redis,{
                key:this.redisGroupKey,
                subKey:resourceId+'',
                value:JSON.stringify(obj)
            });
        }
    }

    /**
     * 删除权限
     * @param authId    权限Id
     */
    static deleteAuthority(authId:number){
        // 删除资源权限
        for(let res of this.resources){
            let a:Array<number> = res[1].auths;
            if(a.includes(authId)){
                //移除资源auth
                a.splice(a.indexOf(authId),1);
                //如果没有auth，则该资源不再需要鉴权，删除资源
                if(a.length === 0){
                    this.resources.delete(res[0]);
                }
            }
        }

        //删除组权限
        for(let grp of this.groups){
            let a:Array<number> = grp[1];
            if(a.includes(authId)){
                //移除资源auth
                a.splice(a.indexOf(authId),1);
                //如果没有auth，则删除该组
                if(a.length === 0){
                    this.groups.delete(grp[0]);
                    //删除用户组
                    for(let user of this.users){
                        let a1:Array<number> = user[1];
                        if(a1.includes(grp[0])){
                            a1.splice(a1.indexOf(grp[0]),1);
                        }
                    }
                }
            }
        }
    }

    /**
     * 鉴权
     * @param url       资源
     * @param session   session
     * @return          0 通过 1未登录 2无权限
     */
    static async check(url:string,session:Session):Promise<number>{
        //获取路径
        url = require('url').parse(url).pathname;
        let resAuthArr:Array<number>;
        let res:Map<number,ResourceObj>;
        if(this.saveType === 0){
            res = this.resources;
        }else{
            let res1 = await RedisFactory.getMap(this.redis,this.redisResourceKey);
            res = new Map();
            for(let p of Object.getOwnPropertyNames(res1)){
                res.set(parseInt(p),JSON.parse(res1[p]));
            }
        }
        for(let item of res){
            let it = item[1];
            //redis 转换问题
            if(typeof it === 'string'){
                it = JSON.parse(it);
            }
            let reg = new RegExp('^' + it.url + '$');
            //进行资源匹配
            if(reg.test(url)){
                resAuthArr = it.auths;
                break;
            }
        }
        //资源不存在，则直接返回true
        if(resAuthArr === undefined || resAuthArr.length === 0){
            return 0;
        }
        
        let userId = await this.getSession(session,'userId');        
        if(userId === undefined){
            return 1;
        }
        if(typeof userId === 'string'){
            userId = parseInt(userId);
        }

        //用户所在组
        let groupIds;
        if(this.saveType === 0){
            groupIds = this.users.get(userId);
        }else{
            let gids:string = await RedisFactory.get(this.redis,{
                key:this.redisUserKey,
                subKey:userId+''
            });
            groupIds = JSON.parse(gids);
        }
         
        //用户无权限
        if(!groupIds){
            return 2;
        }
        //用户权限
        let authArr = [];
        //组权限数组
        for(let id of groupIds){
            //组对应权限
            let a;
            if(this.saveType === 0){
                a = this.groups.get(id);
            }else{
                let ids:string = await RedisFactory.get(this.redis,{
                    key:this.redisGroupKey,
                    subKey:id+''
                });
                a = JSON.parse(ids);
            }
            
            if(Array.isArray(a) && a.length > 0){
                authArr = authArr.concat(a);
            }
        }
        if(authArr.length === 0){
            return 2;
        }
        
        //资源权限包含用户组权限
        for(let au of authArr){
            if(resAuthArr.includes(au)){
                return 0;
            }
        }
        return 2;
    }

    
    /**
     * 获取安全配置页面
     * @param name      配置项名
     * @return          页面url
     */
    static getSecurityPage(name:string){
        return this.securityPages.get(name);
    }

    /**
     * 设置security session 值
     * @param session   session
     * @param key   键
     * @param value 值
     */
    static async setSession(session:Session,key:string,value:any){
        if(!session){
            return;
        }
        let secObj:any = await session.get(this.sessionName);
        
        //不存在
        if(!secObj){
            secObj = {};
        }else{
            //返回为字符串，需要解析城json
            secObj = JSON.parse(secObj);
        }
        secObj[key] = value;
        session.set(this.sessionName,JSON.stringify(secObj));
    }

    /**
     * 获取security session值
     * @param session   session
     * @param key       键
     */
    static async getSession(session:Session,key:string):Promise<any>{
        if(!session){
            return;
        }
        let secObj:any = await session.get(this.sessionName);
        if(secObj){
            //session存储为字符串
            secObj = JSON.parse(secObj);
            return secObj[key];
        }
    }

    /**
     * 获取登录前页面
     * @param session   session
     * @return          page url
     */
    static async getPreLoginPage(session:Session):Promise<string>{
        return this.getSession(session,'prelogin');
    }
    
    static async parseFile(path){
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let json:any = null;
        try{
            let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
            json = JSON.parse(jsonStr);
            
        }catch(e){
            throw new NoomiError("2700");
        }
        //鉴权失败页面
        if(json.hasOwnProperty('auth_fail_url')){
            this.securityPages.set('auth_fail_url',json['auth_fail_url']);
        }

        //登录页面
        if(json.hasOwnProperty('login_url')){
            this.securityPages.set('login_url',json['login_url']);
        }

        if(json.hasOwnProperty('auth_type')){
            this.authType = json['auth_type'];
        }

        if(json.hasOwnProperty('save_type')){
            this.saveType = json['save_type'];
        }

        if(json.hasOwnProperty('redis')){
            this.redis = json['redis'];
        }

        //数据库解析
        if(json.hasOwnProperty('dboption')){
            this.dbOptions = json.dboption;
        }

        await this.init();
    }
}

export{SecurityFactory}