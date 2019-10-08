import { HttpRequest } from "./httprequest";
import { InstanceFactory } from "./instancefactory";
import { SecurityFilter } from "./filter/securityfilter";
import { Session } from "./sessionfactory";

/**
 * 安全工厂
 */
interface ResourceObj{
    reg:RegExp;                //正则表达式
    auths:Array<number>;       //组id列表
}
class SecurityFactory{
    static sessionName:string = 'NOOMI_SECURITY_OBJECT';
    static dbOptions:any;
    static securityPages:Map<string,string> = new Map();
    //资源列表
    static resources:Map<number,ResourceObj> = new Map();
    //用户
    static users:Map<number,Array<number>> = new Map();; 
    //组
    static groups:Map<number,Array<number>> = new Map();
    
    /**
     * 初始化配置
     * 
     */
    static async init(){
        //初始化security filter
        InstanceFactory.addInstance({
            name:'securityFilter',           //实例名
            instance:new SecurityFilter(),
            class_name:'SecurityFilter'
        });

        let conn:any;
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
        switch(this.dbOptions.production){
            case "mysql":
                handleMysql.call(this,this.dbOptions,ids);
                break;
            case "mssql":

            break;
            case "oracle":

            break;
        }

        /**
         * 处理mysql
         * @param cfg 
         */
        async function handleMysql(cfg:any,ids:any){
            const mysql = require('mysql');
            conn = mysql.createConnection({
                host: cfg.host,
                user: cfg.user,
                password: cfg.pwd,
                database: cfg.schema
            });
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
            //关闭连接
            conn.end();
        }
    }

    /**
     * 添加用户组
     * @param userId    用户id
     * @param groupId   组id
     */
    static addUserGroup(userId:number,groupId:number){
        let arr:Array<any> = this.users.get(userId);
        if(typeof userId === 'string'){
            userId = parseInt(userId);
        }
        if(typeof groupId === 'string'){
            groupId = parseInt(groupId);
        }
        if(!arr){
            arr = [];
            this.users.set(userId,arr);
        }
        if(arr.includes(groupId)){
            return;
        }
        arr.push(groupId);
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
    static addGroupAuthority(groupId:number,authId:number){
        let arr:Array<any> = this.groups.get(groupId);
        if(!arr){
            arr = [];
            this.groups.set(groupId,arr);
        }
        if(arr.includes(authId)){
            return;
        }
        arr.push(authId);
    }

    /**
     * 
     * @param id    资源id
     * @param url   资源路径，可以是正则式
     */
    static addResource(id:number,url:string){
        let ro:ResourceObj = {
            reg:new RegExp('^' + url + '$'),
            auths:[]
        };
        this.resources.set(id,ro);
    }

    /**
     * 添加资源权限
     * @param resourceId    资源id
     * @param authId        资源id
     */
    static addResourceAuth(resourceId:number,authId:number){
        let ro:ResourceObj = this.resources.get(resourceId);
        if(!ro || ro.auths.includes(authId)){
            return;
        }
        ro.auths.push(authId);
    }

    /**
     * 删除用户     用户id
     * @param userId 
     */
    static deleteUser(userId:number){
        this.users.delete(userId);
    }

    /**
     * 删除用户组
     * @param userId    用户id 
     * @param groupId   组id
     */
    static deleteUserGroup(userId:number,groupId:number){
        if(!this.users.has(userId)){
            return;
        }
        let a = this.users.get(userId);
        if(!a.includes(groupId)){
            return;
        }
        //从数组移除
        a.splice(a.indexOf(groupId),1);
    }

    /**
     * 删除组     
     * @param groupId   组id 
     */
    static deleteGroup(groupId:number){
        this.groups.delete(groupId);
    }

    /**
     * 删除组权限
     * @param groupId   组id 
     * @param authId    权限id
     */
    static deleteGroupAuthority(groupId:number,authId:number){
        if(!this.groups.has(groupId)){
            return;
        }
        let a = this.groups.get(groupId);
        if(!a.includes(authId)){
            return;
        }
        //从数组移除
        a.splice(a.indexOf(authId),1);
    }

    /**
     * 删除资源     
     * @param resourceId   资源id 
     */
    static deleteResource(resourceId:number){
        this.resources.delete(resourceId);
    }

    /**
     * 删除资源权限
     * @param resourceId     资源id 
     * @param authId    权限id
     */
    static deleteResourceAuthority(resourceId:number,authId:number){
        if(!this.resources.has(resourceId)){
            return;
        }
        let a = this.resources.get(resourceId).auths;
        if(!a.includes(authId)){
            return;
        }
        //从数组移除
        a.splice(a.indexOf(authId),1);
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
    static check(url:string,session:Session):number{
        //获取路径
        url = require('url').parse(url).pathname;
        let resAuthArr:Array<number>;
        for(let item of this.resources){
            //进行资源匹配
            if(item[1].reg.test(url)){
                resAuthArr = item[1].auths;
                break;
            }
        }
        //资源不存在，则直接返回true
        if(resAuthArr === undefined || resAuthArr.length === 0){
            return 0;
        }
        
        let userId = this.getSession(session,'userId');        
        if(userId === undefined){
            return 1;
        }
        
        //用户所在组
        let groupIds = this.users.get(userId);
        //用户无权限
        if(!groupIds){
            return 2;
        }
        //用户权限
        let authArr = [];
        //组权限数组
        for(let id of groupIds){
            //组对应权限
            let a = this.groups.get(id);
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
    static setSession(session:Session,key:string,value:any){
        if(!session){
            return;
        }
        let secObj:any = session.get(this.sessionName);
        //不存在
        if(secObj === undefined){
            secObj = {};
        }
        secObj[key] = value;
        session.set(this.sessionName,secObj);
    }

    /**
     * 获取security session值
     * @param session   session
     * @param key       键
     */
    static getSession(session:Session,key:string):any{
        if(!session){
            return;
        }
        let secObj:any = session.get(this.sessionName);
        if(secObj){
            return secObj[key];
        }
    }

    /**
     * 获取登录前页面
     * @param session   session
     * @return          page url
     */
    static getPreLoginPage(session:Session):string{
        return this.getSession(session,'prelogin');
    }
    
    static parseFile(path){
        const pathTool = require('path');
        const fs = require("fs");
        //读取文件
        let jsonStr:string = fs.readFileSync(pathTool.join(process.cwd(),path),'utf-8');
        let json:any = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw e;
        }
        //鉴权失败页面
        if(json.hasOwnProperty('auth_fail_url')){
            this.securityPages.set('auth_fail_url',json['auth_fail_url']);
        }

        //登录页面
        if(json.hasOwnProperty('login_url')){
            this.securityPages.set('login_url',json['login_url']);
        }

        //数据库解析
        if(json.hasOwnProperty('dboption')){
            this.dbOptions = json.dboption;
        }

        this.init();
    }
}

export{SecurityFactory}