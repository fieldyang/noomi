# Class SessionFactory
## 属性列表
+ [cache](#PROP_cache)
+ [redis](#PROP_redis)
+ [sessionName](#PROP_sessionName)
+ [sessions](#PROP_sessions)
+ [timeout](#PROP_timeout)
+ [type](#PROP_type)
  
## 方法列表
+ [delSession](#METHOD_delSession)
+ [genSessionId](#METHOD_genSessionId)
+ [getSession](#METHOD_getSession)
+ [getSessionId](#METHOD_getSessionId)
+ [init](#METHOD_init)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
session 工厂类  
### remarks
用于管理session  
## 属性
### <a id="PROP_cache">cache</a>
缓存对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>[NCache](/webroute/api/ncache)</font>  
### <a id="PROP_redis">redis</a>
redis名，type为1时需要设置，默认为default  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'default'  
### <a id="PROP_sessionName">sessionName</a>
cookie中的session name，默认NSESSIONID  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
"NSESSIONID"  
### <a id="PROP_sessions">sessions</a>
session map，用于存放所有session对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,Session&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_timeout">timeout</a>
过期时间(默认30分钟)  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>number</font>  
#### 初始值
1800  
### <a id="PROP_type">type</a>
session存储类型 0内存 1redis，默认0  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>number</font>  
#### 初始值
0  
## 方法
### <a id="METHOD_delSession">delSession(sessionId)</a>
#### 描述
删除session  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ sessionId *&lt;<font class='datatype'>string</font>&gt;*     sessionId
  
#### 返回值
void  
### <a id="METHOD_genSessionId">genSessionId()</a>
#### 描述
创建sessionId  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
<font class='datatype'>string</font>  
用uuid生成的sessionId  
### <a id="METHOD_getSession">getSession(req)</a>
#### 描述
获取session  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ req *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;*   request对象
  
#### 返回值
void  
### <a id="METHOD_getSessionId">getSessionId(req)</a>
#### 描述
获取cookie携带的sessionId  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ req *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;*   request对象
  
#### 返回值
<font class='datatype'> string </font>  
sessionId  
### <a id="METHOD_init">init(cfg)</a>
#### 描述
参数初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ cfg *&lt;<font class='datatype'>[ISessionCfg](/webroute/api/isessioncfg)</font>&gt;* session配置项
  
#### 返回值
void  
