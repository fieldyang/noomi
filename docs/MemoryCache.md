# Class MemoryCache
## 属性列表
+ [extraSize](#PROP_extraSize)
+ [maxSize](#PROP_maxSize)
+ [size](#PROP_size)
+ [storeMap](#PROP_storeMap)
  
## 方法列表
+ [cacLRU](#METHOD_cacLRU)
+ [changeLastUse](#METHOD_changeLastUse)
+ [checkAndClean](#METHOD_checkAndClean)
+ [cleanup](#METHOD_cleanup)
+ [clearByLRU](#METHOD_clearByLRU)
+ [del](#METHOD_del)
+ [get](#METHOD_get)
+ [getKeys](#METHOD_getKeys)
+ [getMap](#METHOD_getMap)
+ [getRealSize](#METHOD_getRealSize)
+ [has](#METHOD_has)
+ [set](#METHOD_set)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
  
## 构造方法
### <a id="METHOD_constructor">constructor(cfg)</a>
#### 参数
+ cfg *&lt;<font class='datatype'>[ICacheCfg](/webroute/api/icachecfg)</font>&gt;* 
  
## 属性
### <a id="PROP_extraSize">extraSize</a>
附加size（对象）  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_maxSize">maxSize</a>
缓存最大size  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_size">size</a>
当前使用大小  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_storeMap">storeMap</a>
存储总map  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,any&gt;</font>  
## 方法
### <a id="METHOD_cacLRU">cacLRU(item)</a>
#### 描述
计算LRU  
timeout 的权重为5（先保证timeout由时间去清理）  
right = sum(1-(当前时间-使用记录)/当前时间) + timeout?5:0  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ item *&lt;<font class='datatype'>[MemoryItem](/webroute/api/memoryitem)</font>&gt;* 待计算的内存 item
  
#### 返回值
void  
### <a id="METHOD_changeLastUse">changeLastUse(item[,changeExpire])</a>
#### 描述
修改最后使用状态  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ item *&lt;<font class='datatype'>[MemoryItem](/webroute/api/memoryitem)</font>&gt;*              memory item
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*      释放修改expire
  
#### 返回值
void  
### <a id="METHOD_checkAndClean">checkAndClean(item)</a>
#### 描述
检查和清理空间  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ item *&lt;<font class='datatype'>[ICacheItem](/webroute/api/icacheitem)</font>&gt;*  cacheitem
  
#### 返回值
void  
### <a id="METHOD_cleanup">cleanup(size)</a>
#### 描述
清理缓存  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ size *&lt;<font class='datatype'>number</font>&gt;*  清理大小，为0仅清除超时元素
  
#### 返回值
void  
### <a id="METHOD_clearByLRU">clearByLRU()</a>
#### 描述
通过lru进行清理  
##### return
清理的尺寸  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
### <a id="METHOD_del">del(key[,subKey])</a>
#### 描述
删除键  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*       键
+ subKey *&lt;<font class='datatype'>string</font>&gt;*    子键
  
#### 返回值
void  
### <a id="METHOD_get">get(key[,subKey[,changeExpire]])</a>
#### 描述
从cache取值  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ subKey *&lt;<font class='datatype'>string</font>&gt;*        子键
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否更新超时时间
  
#### 返回值
void  
### <a id="METHOD_getKeys">getKeys(key)</a>
#### 描述
获取键数组  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键，可以带通配符
  
#### 返回值
<font class='datatype'>Array&lt;string&gt;</font>  
键名数组  
### <a id="METHOD_getMap">getMap(key[,changeExpire])</a>
#### 描述
获取map  
##### return
object或null  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*           键
+ changeExpire *&lt;<font class='datatype'>boolean</font>&gt;*  是否更新过期时间
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt;</font>  
### <a id="METHOD_getRealSize">getRealSize(value)</a>
#### 描述
获取值实际所占size  
##### return
值所占空间大小  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ value *&lt;<font class='datatype'>any</font>&gt;*     待检测值
  
#### 返回值
<font class='datatype'>number</font>  
### <a id="METHOD_has">has(key)</a>
#### 描述
是否存在键  
##### return
存在则返回true，否则返回false  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
<font class='datatype'>boolean</font>  
### <a id="METHOD_set">set(item[,timeout])</a>
#### 描述
往缓存中存值  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ item *&lt;<font class='datatype'>[ICacheItem](/webroute/api/icacheitem)</font>&gt;*      cache item
+ timeout *&lt;<font class='datatype'>number</font>&gt;*   超时时间
  
#### 返回值
void  
