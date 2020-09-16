# Class RedisFactory
## 属性列表
+ [bufferPrefix](#PROP_bufferPrefix)
+ [clientMap](#PROP_clientMap)
  
## 方法列表
+ [addClient](#METHOD_addClient)
+ [del](#METHOD_del)
+ [get](#METHOD_get)
+ [getClient](#METHOD_getClient)
+ [getMap](#METHOD_getMap)
+ [has](#METHOD_has)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
+ [preHandle](#METHOD_preHandle)
+ [set](#METHOD_set)
+ [setTimeout](#METHOD_setTimeout)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
redis 工厂  
## 属性
### <a id="PROP_bufferPrefix">bufferPrefix</a>
buffer data 前缀，用于识别buffer  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'@@BF_DT@@'  
### <a id="PROP_clientMap">clientMap</a>
存储所有的redis对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,any&gt;</font>  
#### 初始值
new Map()  
## 方法
### <a id="METHOD_addClient">addClient(cfg)</a>
#### 描述
添加redis client到clientMap  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ cfg *&lt;<font class='datatype'>[IRedisCfg](/webroute/api/irediscfg)</font>&gt;*   redis配置项
  
#### 返回值
void  
### <a id="METHOD_del">del(clientName,key[,subKey])</a>
#### 描述
删除项  
##### clientName
client name  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ clientName *&lt;<font class='datatype'>string</font>&gt;* 
+ key *&lt;<font class='datatype'>string</font>&gt;*       键
+ subKey *&lt;<font class='datatype'>string</font>&gt;*    子键
  
#### 返回值
void  
### <a id="METHOD_get">get(clientName,item)</a>
#### 描述
从redis 中取值  
##### return
item value  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ clientName *&lt;<font class='datatype'>string</font>&gt;*    client name
+ item *&lt;<font class='datatype'>[IRedisItem](/webroute/api/iredisitem)</font>&gt;*          redis item
  
#### 返回值
<font class='datatype'>Promise&lt;string&gt;</font>  
### <a id="METHOD_getClient">getClient(name)</a>
#### 描述
获得redis client  
##### return
redis client  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*      client name，默认default
  
#### 返回值
void  
### <a id="METHOD_getMap">getMap(clientName,item)</a>
#### 描述
获取map数据  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ clientName *&lt;<font class='datatype'>string</font>&gt;*    client name
+ item *&lt;<font class='datatype'>[IRedisItem](/webroute/api/iredisitem)</font>&gt;*          IRedisItem
  
#### 返回值
void  
### <a id="METHOD_has">has(clientName,key)</a>
#### 描述
是否存在某个key  
##### return
存在则返回true，否则返回false  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ clientName *&lt;<font class='datatype'>string</font>&gt;*    redis name
+ key *&lt;<font class='datatype'>string</font>&gt;*           key
  
#### 返回值
<font class='datatype'>Promise&lt;boolean&gt;</font>  
### <a id="METHOD_init">init(config)</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ config *&lt;any&gt;*    redis配置
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
解析配置文件  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*  redis配置文件路径
  
#### 返回值
void  
### <a id="METHOD_preHandle">preHandle(value)</a>
#### 描述
预处理value  
#### 修饰符
<font class="modifier">private  static</font>  
#### 参数
+ value *&lt;<font class='datatype'>any</font>&gt;*     待处理值
  
#### 返回值
<font class='datatype'>any</font>  
已处理值  
### <a id="METHOD_set">set(clientName,item)</a>
#### 描述
把值存入redis中  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ clientName *&lt;<font class='datatype'>string</font>&gt;*    client name
+ item *&lt;<font class='datatype'>[IRedisItem](/webroute/api/iredisitem)</font>&gt;*          redis item
  
#### 返回值
void  
### <a id="METHOD_setTimeout">setTimeout(client,key,timeout)</a>
#### 描述
设置超时时间  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ client *&lt;<font class='datatype'>any</font>&gt;*    client name
+ key *&lt;<font class='datatype'>string</font>&gt;*       键
+ timeout *&lt;<font class='datatype'>number</font>&gt;*   超时时间
  
#### 返回值
void  
