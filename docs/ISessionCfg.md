# Interface ISessionCfg
## 属性列表
+ [max_size](#PROP_max_size)
+ [name](#PROP_name)
+ [redis](#PROP_redis)
+ [save_type](#PROP_save_type)
+ [timeout](#PROP_timeout)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
session配置项  
## 属性
### <a id="PROP_max_size">max_size</a>
缓存最大尺寸，save_type=0时有效  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_name">name</a>
sessionId名  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_redis">redis</a>
redis名，save_type=1时有效  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_save_type">save_type</a>
存储类型 0:memory 1:redis  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_timeout">timeout</a>
超时时间  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
