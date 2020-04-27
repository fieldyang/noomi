# Class MemoryItem
## 属性列表
+ [LRU](#PROP_LRU)
+ [createTime](#PROP_createTime)
+ [expire](#PROP_expire)
+ [key](#PROP_key)
+ [size](#PROP_size)
+ [timeout](#PROP_timeout)
+ [type](#PROP_type)
+ [useRcds](#PROP_useRcds)
+ [value](#PROP_value)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
  
## 构造方法
### <a id="METHOD_constructor">constructor([timeout])</a>
#### 参数
+ timeout *&lt;<font class='datatype'>number</font>&gt;* 超时时间
  
## 属性
### <a id="PROP_LRU">LRU</a>
最近最久使用值，值越大越不淘汰  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_createTime">createTime</a>
创建时间  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_expire">expire</a>
过期时间  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_key">key</a>
键  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_size">size</a>
存储空间  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_timeout">timeout</a>
超时时间(秒)  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_type">type</a>
类型0 字符串  1 map  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_useRcds">useRcds</a>
使用记录，用于LRU置换，记录最近5次访问时间  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Array&lt;any&gt;</font>  
### <a id="PROP_value">value</a>
值  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
