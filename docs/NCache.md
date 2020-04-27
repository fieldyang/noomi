# Class NCache
## 属性列表
+ [memoryCache](#PROP_memoryCache)
+ [name](#PROP_name)
+ [redis](#PROP_redis)
+ [redisPreName](#PROP_redisPreName)
+ [redisSizeName](#PROP_redisSizeName)
+ [redisTimeout](#PROP_redisTimeout)
+ [saveType](#PROP_saveType)
  
## 方法列表
+ [addToRedis](#METHOD_addToRedis)
+ [del](#METHOD_del)
+ [get](#METHOD_get)
+ [getFromRedis](#METHOD_getFromRedis)
+ [getKeys](#METHOD_getKeys)
+ [getMap](#METHOD_getMap)
+ [getMapFromRedis](#METHOD_getMapFromRedis)
+ [has](#METHOD_has)
+ [set](#METHOD_set)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
Cache类  
### remarks
用于处理缓存，支持内存cache和redis cache  
## 构造方法
### <a id="METHOD_constructor">constructor(cfg)</a>
#### 参数
+ cfg *&lt;<font class='datatype'>[ICacheCfg](ICacheCfg)</font>&gt;*   cache初始化参数
  
## 属性
### <a id="PROP_memoryCache">memoryCache</a>
内存cache对象，saveType=0时存在  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>[MemoryCache](MemoryCache)</font>  
### <a id="PROP_name">name</a>
cache名字，全局唯一  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_redis">redis</a>
redis名，saveType为1时存在  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_redisPreName">redisPreName</a>
  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NCACHE_'  
### <a id="PROP_redisSizeName">redisSizeName</a>
  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NCACHE_SIZE_'  
### <a id="PROP_redisTimeout">redisTimeout</a>
  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'NCACHE_TIMEOUT_'  
### <a id="PROP_saveType">saveType</a>
存储类型 0内存 1redis  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
## 方法
### <a id="METHOD_addToRedis">addToRedis(item[,timeout])</a>
#### 描述
存到值redis  
#### 修饰符
<font class="modifier">private  async</font>  
#### 参数
+ item *&lt;<font class='datatype'>[ICacheItem](ICacheItem)</font>&gt;*      cache item
+ timeout *&lt;<font class='datatype'>number</font>&gt;*   超时时间
  
#### 返回值
void  
### <a id="METHOD_del">del(key[,subKey])</a>
#### 描述
删除键  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*       键
+ subKey *&lt;<font class='datatype'>string</font>&gt;*    子键
  
#### 返回值
void  
### <a id="METHOD_get">get(key[,subKey[,changeExpire]])</a>
#### 描述
获取值  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ subKey *&lt;<font class='datatype'>string</font>&gt;* 
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否更新过期时间
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt;</font>  
value或null  
### <a id="METHOD_getFromRedis">getFromRedis(key[,subKey[,changeExpire]])</a>
#### 描述
从redis获取值  
#### 修饰符
<font class="modifier">private  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ subKey *&lt;<font class='datatype'>string</font>&gt;*        子键
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否修改expire
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt;</font>  
键对应的值  
### <a id="METHOD_getKeys">getKeys(key)</a>
#### 描述
获取键数组  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键，可以带通配符
  
#### 返回值
<font class='datatype'>Promise&lt;Array&lt;string&gt;&gt;</font>  
键名组成的数组  
### <a id="METHOD_getMap">getMap(key[,changeExpire])</a>
#### 描述
获取map，当key对应的存储对象为map时，则获取map，否则为null  
##### return
object或null  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否更新过期时间
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt;</font>  
### <a id="METHOD_getMapFromRedis">getMapFromRedis(key[,changeExpire])</a>
#### 描述
从redis获取map  
##### apram
subKey        子键  
#### 修饰符
<font class="modifier">private  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否修改expire
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt;</font>  
object或null  
### <a id="METHOD_has">has(key)</a>
#### 描述
是否拥有key  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
<font class='datatype'>Promise&lt;boolean&gt;</font>  
如果存在则返回true，否则返回false  
### <a id="METHOD_set">set(item[,timeout])</a>
#### 描述
添加值到cache  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ item *&lt;<font class='datatype'>[ICacheItem](ICacheItem)</font>&gt;* 
+ timeout *&lt;<font class='datatype'>number</font>&gt;*   超时时间(秒)
  
#### 返回值
void  
