# Class SecurityFactory
## 属性列表
+ [GROUPKEY](#PROP_GROUPKEY)
+ [PRELOGIN](#PROP_PRELOGIN)
+ [RESKEY](#PROP_RESKEY)
+ [USERID](#PROP_USERID)
+ [USERKEY](#PROP_USERKEY)
+ [authType](#PROP_authType)
+ [cache](#PROP_cache)
+ [dbOptions](#PROP_dbOptions)
+ [groups](#PROP_groups)
+ [maxSize](#PROP_maxSize)
+ [redis](#PROP_redis)
+ [redisGroupKey](#PROP_redisGroupKey)
+ [redisResourceKey](#PROP_redisResourceKey)
+ [redisUserKey](#PROP_redisUserKey)
+ [saveType](#PROP_saveType)
+ [securityPages](#PROP_securityPages)
+ [sessionName](#PROP_sessionName)
+ [users](#PROP_users)
  
## 方法列表
+ [addGroupAuthority](#METHOD_addGroupAuthority)
+ [addResourceAuth](#METHOD_addResourceAuth)
+ [addUserGroup](#METHOD_addUserGroup)
+ [addUserGroups](#METHOD_addUserGroups)
+ [check](#METHOD_check)
+ [deleteAuthority](#METHOD_deleteAuthority)
+ [deleteGroup](#METHOD_deleteGroup)
+ [deleteGroupAuthority](#METHOD_deleteGroupAuthority)
+ [deleteResource](#METHOD_deleteResource)
+ [deleteResourceAuthority](#METHOD_deleteResourceAuthority)
+ [deleteUser](#METHOD_deleteUser)
+ [deleteUserGroup](#METHOD_deleteUserGroup)
+ [getPreLoginInfo](#METHOD_getPreLoginInfo)
+ [getSecurityPage](#METHOD_getSecurityPage)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
+ [setPreLoginInfo](#METHOD_setPreLoginInfo)
+ [updGroupAuths](#METHOD_updGroupAuths)
+ [updResourceAuths](#METHOD_updResourceAuths)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
安全工厂  
### remarks
用于管理安全对象  
## 属性
### <a id="PROP_GROUPKEY">GROUPKEY</a>
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'GROUP'  
### <a id="PROP_PRELOGIN">PRELOGIN</a>
认证前url在session中的名字  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NSECURITY_PRELOGIN'  
### <a id="PROP_RESKEY">RESKEY</a>
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'RESOURCE'  
### <a id="PROP_USERID">USERID</a>
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NSECURITY_USERID'  
### <a id="PROP_USERKEY">USERKEY</a>
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'USER'  
### <a id="PROP_authType">authType</a>
认证类型 0 session 1 token  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>number</font>  
#### 初始值
0  
### <a id="PROP_cache">cache</a>
缓存对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>[NCache](NCache)</font>  
### <a id="PROP_dbOptions">dbOptions</a>
数据表对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_groups">groups</a>
组map  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;number,Array&lt;number&gt;&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_maxSize">maxSize</a>
最大size,saveType=0时有效  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_redis">redis</a>
redis名，必须在redis.json中已定义,saveType=1时有效  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'default'  
### <a id="PROP_redisGroupKey">redisGroupKey</a>
groups在cache的key  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
"NOOMI_SECURITY_GROUPS"  
### <a id="PROP_redisResourceKey">redisResourceKey</a>
resource在cache的key  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
"NOOMI_SECURITY_RESOURCES"  
### <a id="PROP_redisUserKey">redisUserKey</a>
users在cache的key  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
"NOOMI_SECURITY_USERS"  
### <a id="PROP_saveType">saveType</a>
数据存储类型，0内存 1redis  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>number</font>  
#### 初始值
0  
### <a id="PROP_securityPages">securityPages</a>
安全相关页面map  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,string&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_sessionName">sessionName</a>
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NOOMI_SECURITY_OBJECT'  
### <a id="PROP_users">users</a>
登录用户map  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;number,Array&lt;number&gt;&gt;</font>  
#### 初始值
new Map()  
## 方法
### <a id="METHOD_addGroupAuthority">addGroupAuthority(groupId,authId)</a>
#### 描述
添加组权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
+ authId *&lt;<font class='datatype'>number</font>&gt;*    权限id
  
#### 返回值
void  
### <a id="METHOD_addResourceAuth">addResourceAuth(url,authId)</a>
#### 描述
添加资源权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;*       资源url
+ authId *&lt;<font class='datatype'>number</font>&gt;*    权限id
  
#### 返回值
void  
### <a id="METHOD_addUserGroup">addUserGroup(userId,groupId)</a>
#### 描述
添加用户组  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ userId *&lt;<font class='datatype'>number</font>&gt;*    用户id
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
  
#### 返回值
void  
### <a id="METHOD_addUserGroups">addUserGroups(userId,groups[,request])</a>
#### 描述
添加用户组(多个组)  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ userId *&lt;<font class='datatype'>number</font>&gt;*    用户id
+ groups *&lt;<font class='datatype'>Array&lt;number&gt;</font>&gt;*    组id 数组
+ request *&lt;<font class='datatype'>[HttpRequest](HttpRequest)</font>&gt;* 
  
#### 返回值
void  
### <a id="METHOD_check">check(url,session)</a>
#### 描述
鉴权  
##### return
0 通过 1未登录 2无权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;*       资源url
+ session *&lt;<font class='datatype'>Session</font>&gt;*   session对象
  
#### 返回值
<font class='datatype'>Promise&lt;number&gt;</font>  
### <a id="METHOD_deleteAuthority">deleteAuthority(authId)</a>
#### 描述
删除权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ authId *&lt;<font class='datatype'>number</font>&gt;*    权限Id
  
#### 返回值
void  
### <a id="METHOD_deleteGroup">deleteGroup(groupId)</a>
#### 描述
删除组  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
  
#### 返回值
void  
### <a id="METHOD_deleteGroupAuthority">deleteGroupAuthority(groupId,authId)</a>
#### 描述
删除组权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
+ authId *&lt;<font class='datatype'>number</font>&gt;*    权限id
  
#### 返回值
void  
### <a id="METHOD_deleteResource">deleteResource(url)</a>
#### 描述
删除资源  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;* 
  
#### 返回值
void  
### <a id="METHOD_deleteResourceAuthority">deleteResourceAuthority(url,authId)</a>
#### 描述
删除资源权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;* 
+ authId *&lt;<font class='datatype'>number</font>&gt;*    权限id
  
#### 返回值
void  
### <a id="METHOD_deleteUser">deleteUser(userId[,request])</a>
#### 描述
删除用户  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ userId *&lt;<font class='datatype'>number</font>&gt;*    用户id
+ request *&lt;<font class='datatype'>[HttpRequest](HttpRequest)</font>&gt;*   request对象
  
#### 返回值
void  
### <a id="METHOD_deleteUserGroup">deleteUserGroup(userId,groupId)</a>
#### 描述
删除用户组  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ userId *&lt;<font class='datatype'>number</font>&gt;*    用户id
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
  
#### 返回值
void  
### <a id="METHOD_getPreLoginInfo">getPreLoginInfo(request)</a>
#### 描述
获取登录前页面  
##### return
page url  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ request *&lt;<font class='datatype'>[HttpRequest](HttpRequest)</font>&gt;* 
  
#### 返回值
<font class='datatype'>Promise&lt;string&gt;</font>  
### <a id="METHOD_getSecurityPage">getSecurityPage(name)</a>
#### 描述
获取安全配置页面  
##### return
页面url  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*      配置项名
  
#### 返回值
void  
### <a id="METHOD_init">init(config)</a>
#### 描述
初始化配置  
##### config
配置项  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ config *&lt;any&gt;* 
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ path *&lt;any&gt;* 文件路径
  
#### 返回值
void  
### <a id="METHOD_setPreLoginInfo">setPreLoginInfo(session,request)</a>
#### 描述
设置认证前页面  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ session *&lt;<font class='datatype'>Session</font>&gt;*   session对象
+ request *&lt;<font class='datatype'>[HttpRequest](HttpRequest)</font>&gt;* 
  
#### 返回值
void  
### <a id="METHOD_updGroupAuths">updGroupAuths(groupId,authIds)</a>
#### 描述
更新组权限  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ groupId *&lt;<font class='datatype'>number</font>&gt;*   组id
+ authIds *&lt;<font class='datatype'>Array&lt;number&gt;</font>&gt;*   权限id数组
  
#### 返回值
void  
### <a id="METHOD_updResourceAuths">updResourceAuths(url,auths)</a>
#### 描述
添加资源权限(多个权限)  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;*       资源id
+ auths *&lt;<font class='datatype'>Array&lt;number&gt;</font>&gt;*     权限id数组
  
#### 返回值
void  
