import { HttpRequest } from "./httprequest";
import { InstanceFactory } from "./instancefactory";
import { SecurityFilter } from "./filter/securityfilter";
import { Session } from "./sessionfactory";
import { NoomiError } from "../errorfactory";
import { NCache } from "./ncache";
import { SessionFactory } from "./sessionfactory";

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
    static cache:NCache;            //cache
    static securityPages:Map<string,string> = new Map();
    
    //资源列表
    static resources:Map<number,ResourceObj> = new Map();
    //用户
    static users:Map<number,Array<number>> = new Map(); 
    //组
    static groups:Map<number,Array<number>> = new Map();
    static USERKEY:string = 'USER';
    static GROUPKEY:string = 'GROUP';
    static RESKEY:string = 'RESOURCE';
    static USERID:string='NSECURITY_USERID';                        //userid在session中的名字
    static PRELOGIN:string='NSECURITY_PRELOGIN';                    //prelogin在session中的名字
    static redisUserKey:string = "NOOMI_SECURITY_USERS";            //users在redis的key
    static redisGroupKey:string = "NOOMI_SECURITY_GROUPS";          //groups在redis的key
    static redisResourceKey:string = "NOOMI_SECURITY_RESOURCES";    //resource在redis的key
    /**
     * 初始化配置
     */
    static async init(){
        
        //初始化security filter
        InstanceFactory.addInstance({
            name:'NoomiSecurityFilter',           //实例名
            instance:new SecurityFilter(),
            class_name:'SecurityFilter'
        });

        //创建cache
        this.cache = new NCache({
            name:'NSECURITY',
            saveType:this.saveType,
            redis:this.redis
        });
        
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

        let results:Array<any>;
        //从表中加载数据
        switch(this.dbOptions.product){
            case "mysql":
                results = await handleMysql(this.dbOptions,ids);
                break;
            case "mssql":
                results = await handleMssql.call(this,this.dbOptions,ids);
                break;
            case "oracle":
                results = await handleOracle.call(this,this.dbOptions,ids);
                break;
            case "mangodb":
                results = await handleMongo.call(this,this.dbOptions,ids);
                break;
        }
        //组权限
        for(let r of results[0]){
            this.addGroupAuthority(r.gid,r.aid);
        }
        let resArr:Array<any> = [];
        //资源
        for(let r of results[1]){
            let a = [];
            for(let r1 of results[2]){
                if(r1.rid === r.rid){
                    let aid = r1.aid;
                    if(a.includes(aid)){
                        continue;
                    }
                    a.push(aid);
                }
            }
            this.addResourceAuths(r.url,a);
        }

        /**
         * 处理mysql
         * @param cfg 
         */
        async function handleMysql(cfg:any,ids:any):Promise<Array<any>>{
            const db = require('mysql');
            const port = cfg.port || 3306;
            let conn = db.createConnection({
                host: cfg.host,
                port: port,
                user: cfg.user,
                password: cfg.pwd,
                database: cfg.schema
            });
            let arr:Array<any> = [];
            try{
                conn.connect();
                //组权限
                let results:Array<any> = await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth,
                    (error,results,fields)=>{
                        resolve(results);
                    });
                });
                let a:Array<any> = [];
                for(let r of results){
                    a.push({
                        gid:r[ids.groupId],
                        aid:r[ids.authId]
                    });
                }
                arr.push(a);

                //资源
                results = await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource,
                    (error,results,fields)=>{
                        resolve(results);
                    });
                });
                let a1:Array<any> = [];
                for(let r of results){
                    a1.push({
                        rid:r[ids.resourceId],
                        url:r[ids.resourceUrl]
                    });
                }
                arr.push(a1);
                
                //资源权限
                results = await new Promise((resolve,reject)=>{
                    conn.query("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth,
                    (error,results,fields)=>{
                        resolve(results);
                    });
                });
                let a2:Array<any> = [];
                for(let r of results){
                    a2.push({
                        rid:r[ids.resourceId],
                        aid:r[ids.authId]
                    });
                }
                arr.push(a2);
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

            return arr;
        }

        /**
         * 处理mssql
         * @param cfg 
         * @param ids 
         */
        async function handleMssql(cfg:any,ids:any):Promise<Array<any>>{
            const db = require('mssql');
            const port = cfg.port || 1433;
            let conn;
            let arr:Array<any> = [];
            try{
                conn = await db.connect({
                    host: cfg.host,
                    port: port,
                    user: cfg.user,
                    password: cfg.pwd,
                    database: cfg.schema
                });
                
                //组权限
                arr.push(await conn.request().query("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth));
                //资源
                arr.push(await conn.request().query("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource));
                //资源权限
                arr.push(await conn.request().query("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth));
                
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
            return arr;
        }

        /**
         * 处理oracle
         * @param cfg 
         * @param ids 
         */
        async function handleOracle(cfg:any,ids:any):Promise<Array<any>>{
            const db = require('oracledb');
            const port = cfg.port || 1521;
            let conn;
            let arr:Array<any> = [];
            try{
                conn = await db.getConnection({
                    host: cfg.host,
                    port: port,
                    user: cfg.user,
                    password: cfg.pwd,
                    database: cfg.schema
                });
                
                //组权限
                arr.push(await conn.execute("select " + ids.groupId + "," + ids.authId + " from " + ids.tgroupauth));
                
                //资源
                arr.push(await conn.execute("select " + ids.resourceId + "," + ids.resourceUrl + " from " + ids.tresource));
                
                //资源权限
                arr.push(await conn.execute("select " + ids.resourceId + "," + ids.authId + " from " + ids.tresourceauth));
                
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
            return arr;
        }

        /**
         * 处理mongo
         * @param cfg 
         * @param ids 
         */
        async function handleMongo(cfg:any,ids:any):Promise<Array<any>>{
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
            let arr:Array<any> = [];
            db.connect(dbUrl,async (err,client)=>{
                if(err){
                    throw err;
                }
                let db1 = client.db(cfg.database);
                let coll = db1.collection(ids.tgroupauth);
                arr.push(await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        resolve(results);
                    });
                }));

                //资源
                coll = db1.collection(ids.tresource);
                arr.push(await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        resolve(results);
                    });
                }));

                //资源权限
                coll = db1.collection(ids.tresourceauth);
                arr.push(await new Promise((resolve,reject)=>{
                    coll.find({}).toArray(async (err,results)=>{
                        resolve(results);
                    });
                }));

                client.close();
            });
            return arr;
        }
    }

    /**
     * 添加用户组
     * @param userId    用户id
     * @param groupId   组id
     */
    static async addUserGroup(userId:number,groupId:number){
        let key:string = this.USERKEY + userId;
        let s = await this.cache.get(key);
        let arr:Array<number>;
        if(s !== null){
            arr = JSON.parse(s);
        }else{
            arr = [];
        }
        if(arr.includes(groupId)){
            return;
        }
        arr.push(groupId);
        await this.cache.set({
            key:key,
            value:JSON.stringify(arr)
        });
    }

    /**
     * 添加用户组(多个组)
     * @param userId    用户id
     * @param groups    组id 数组
     */
    static async addUserGroups(userId:number,groups:Array<number>,request?:HttpRequest){
        //保存userId 到session object
        if(request){
            let session:Session = await SessionFactory.getSession(request);
            if(session){
                await session.set(this.USERID,userId);
            }
        }
        //保存用户组
        await this.cache.set({
            key:this.USERKEY + userId,
            value:JSON.stringify(groups)
        });
    }
    /**
     * 添加组权限
     * @param groupId   组id
     * @param authId    权限id
     */
    static async addGroupAuthority(groupId:number,authId:number){
        let key:string = this.GROUPKEY + groupId;
        let s = await this.cache.get(key);
        let arr:Array<number>;
        if(s !== null){
            arr = JSON.parse(s);
        }else{
            arr = [];
        }
        if(arr.includes(authId)){
            return;
        }
        arr.push(authId);
        await this.cache.set({
            key:key,
            value:JSON.stringify(arr)
        });
    }

    /**
     * 添加资源权限
     * @param resourceId    资源id
     * @param authId        资源id
     */
    static async addResourceAuth(url:string,authId:number){
        let key:string = this.RESKEY + url;
        let s = await this.cache.get(key);
        let arr:Array<number>;
        if(s !== null){
            arr = JSON.parse(s);
        }else{
            arr = [];
        }
        if(arr.includes(authId)){
            return;
        }
        arr.push(authId);
        await this.cache.set({
            key:key,
            value:JSON.stringify(arr)
        });
    }

    /**
     * 添加资源权限(多个权限)
     * @param url       资源id
     * @param auths     权限id数组
     */
    static async addResourceAuths(url:string,auths:Array<number>){
        let key:string = this.RESKEY + url;
        let s = await this.cache.set({
            key:key,
            value:JSON.stringify(auths)
        });
    }

    /**
     * 删除用户     用户id
     * @param userId 
     */
    static async deleteUser(userId:number,request?:HttpRequest){
        //保存userId 到session object
        if(request){
            let session:Session = await SessionFactory.getSession(request);
            if(session){
                await SessionFactory.delSession(session.id);
            }
        }
        //从cache删除
        this.cache.del(this.USERKEY + userId);
    }

    /**
     * 删除用户组
     * @param userId    用户id 
     * @param groupId   组id
     */
    static async deleteUserGroup(userId:number,groupId:number){
        let key:string = this.USERKEY + userId;
        let astr:string = await this.cache.get(key);
        if(astr === null){
            return;
        }
        let a:Array<number> = JSON.parse(astr);
        if(!a.includes(groupId)){
            return;
        }
        a.splice(a.indexOf(groupId),1);
        await this.cache.set({
            key:key,
            value:JSON.stringify(a)
        });
    }

    /**
     * 删除组     
     * @param groupId   组id 
     */
    static async deleteGroup(groupId:number){
        await this.cache.del(this.GROUPKEY+groupId);
    }

    /**
     * 删除组权限
     * @param groupId   组id 
     * @param authId    权限id
     */
    static async deleteGroupAuthority(groupId:number,authId:number){
        let key:string = this.GROUPKEY + groupId;
        let astr:string = await this.cache.get(key);
        if(astr === null){
            return;
        }
        let a:Array<number> = JSON.parse(astr);
        if(!a.includes(authId)){
            return;
        }
        a.splice(a.indexOf(authId),1);
        await this.cache.set({
            key:key,
            value:JSON.stringify(a)
        });
    }

    /**
     * 删除资源     
     * @param resourceId   资源id 
     */
    static async deleteResource(url:string){
        await this.cache.del(this.RESKEY + url);
    }

    /**
     * 删除资源权限
     * @param resourceId     资源id 
     * @param authId    权限id
     */
    static async deleteResourceAuthority(url:string,authId:number){
        let key:string = this.RESKEY + url;
        let astr:string = await this.cache.get(key);
        if(astr === null){
            return;
        }
        let a:Array<number> = JSON.parse(astr);
        if(!a.includes(authId)){
            return;
        }
        a.splice(a.indexOf(authId),1);
        await this.cache.set({
            key:key,
            value:JSON.stringify(a)
        });
    }

    /**
     * 删除权限
     * @param authId    权限Id
     */
    static async deleteAuthority(authId:number){
        //遍历资源权限并清除
        let arr:Array<string> = await this.cache.getKeys(this.RESKEY + '*');
        if(arr !== null){
            for(let item of arr){
                let astr:string = await this.cache.get(item);
                if(astr === null){
                    return;
                }
                let a:Array<number> = JSON.parse(astr);
                if(!a.includes(authId)){
                    return;
                }
                a.splice(a.indexOf(authId),1);
                await this.cache.set({
                    key:item,
                    value:JSON.stringify(a)
                });
            }
        }

        //遍历组权限并清除
        arr = await this.cache.getKeys(this.GROUPKEY + '*');
        if(arr !== null){
            for(let item of arr){
                let astr:string = await this.cache.get(item);
                if(astr === null){
                    return;
                }
                let a:Array<number> = JSON.parse(astr);
                if(!a.includes(authId)){
                    return;
                }
                a.splice(a.indexOf(authId),1);
                await this.cache.set({
                    key:item,
                    value:JSON.stringify(a)
                });
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
        
        let astr:string = await this.cache.get(this.RESKEY + url);
        if(astr === null){
            return 0;
        }
        let resAuthArr:Array<number> = JSON.parse(astr);
        //资源不存在，则直接返回true
        if(!Array.isArray(resAuthArr) || resAuthArr.length === 0){
            return 0;
        }
        // sesion 不存在，返回1
        if(!session){
            return 1;
        }
        let userId:any = await session.get(this.USERID);        
        if(userId === null){
            return 1;
        }
        if(typeof userId === 'string'){
            userId = parseInt(userId);
        }

        let groupIds:Array<number>;
        let gids:string = await this.cache.get(this.USERKEY + userId);
        if(gids !== null){
            groupIds = JSON.parse(gids);
        }
        
        //无组权限，返回无权
        if(!Array.isArray(groupIds) || groupIds.length === 0){
            return 2;
        }

        //用户权限
        let authArr = [];
        for(let id of groupIds){
            //组对应权限
            let a:Array<number>;
            let s:string = await this.cache.get(this.GROUPKEY + id);
            if(!s){
                continue;
            }
            a = JSON.parse(s);
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
     * 获取登录前页面
     * @param session   session
     * @return          page url
     */
    static async getPreLoginPage(session:Session):Promise<string>{
        return await session.get(this.PRELOGIN);
    }

    /**
     * 设置认证前页面
     * @param session   Session
     * @param page      pageurl
     */
    static async setPreLoginPage(session:Session,page:string){
        await session.set(this.PRELOGIN,page);
    }
    
    /**
     * 文件解析
     * @param path 
     */
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