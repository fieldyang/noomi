/**
 * 安全工厂
 */
interface ResourceObj{
    reg:RegExp;                //正则表达式
    auths:Array<number>;       //组id列表
}
class SecurityFactory{
    //资源列表
    static resources:Map<number,ResourceObj> = new Map();
    //用户
    static users:Map<number,Array<number>> = new Map();; 
    //组
    static groups:Map<number,Array<number>> = new Map();
    
    /**
     * 加载数据，需要用户自己改写
     * @return  promise
     */
    static loadData():Promise<any>{
        return Promise.resolve();
    }
    /**
     * 初始化配置
     * 
     */
    static init(){
        /**
         * @param datas {
         *        ras   resource authority 数组 [{resourceId:资源id,authId:权限id}]
         *        gas   group authority 数组 [{groupId:组id,authId:权限id}]  
         * }
         */ 
        this.loadData().then((datas)=>{
            //资源权限
            let raMap:Map<number,Array<number>> = new Map();
            //组权限
            let gaMap:Map<number,Array<number>> = new Map();
            //初始化resource auth
            for(let ra of datas.ras){
            this.addResourceAuth(ra.resourceId,ra.authId);
            }
            
            //初始化group auth
            for(let ga of datas.gas){
                this.addGroupAuth(ga.groupId,ga.authId);
            }
        });
    }

    /**
     * 登录
     */
    login(){

    }
    /**
     * 添加用户组
     * @param userId    用户id
     * @param groupId   组id
     */
    static addUserGroup(userId:number,groupId:number){
        let arr:Array<any> = this.users.get(userId);
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
    static addUserGroups(userId:number,groups:Array<number>){
        for(let gid of groups){
            this.addUserGroup(userId,gid);
        }
    }
    /**
     * 添加组权限
     * @param groupId 
     * @param authId 
     */
    static addGroupAuth(groupId:number,authId:number){
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
     * 添加资源权限
     * @param resourceId    资源id
     * @param authId        资源id
     * @param url           资源url（可以是正则式）
     */
    static addResourceAuth(resourceId:number,authId:number,url?:string){
        let ro:ResourceObj = this.resources.get(resourceId);
        if(!ro){
            ro = {reg:null,auths:[]}
            if(url){
                ro.reg = new RegExp('^' + url + '$');
            }
        }
        if(ro.auths.includes(authId)){
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
    static deleteGroupAuth(groupId:number,authId:number){
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
    static deleteResourceAuth(resourceId:number,authId:number){
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
    static deleteAuth(authId:number){
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
     * @param user      用户
     * @return          true通过/false未通过
     */
    static check(url:string,userId:number){
        //用户所在组
        let groupIds = this.users.get(userId);
        if(!groupIds){
            return false;
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
            return false;
        }
        for(let item of this.resources){
            //进行资源匹配
            if(item[1].reg.test(url)){
                //资源权限包含用户组权限
                for(let au of authArr){
                    if(item[1].auths.includes(au)){
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    }

    

}

export{SecurityFactory}