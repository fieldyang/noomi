# Interface ICacheCfg
## 属性列表
+ [maxSize](#PROP_maxSize)
+ [name](#PROP_name)
+ [redis](#PROP_redis)
+ [saveType](#PROP_saveType)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
cache配置类型，初始化cache时使用  
## 属性
### <a id="PROP_maxSize">maxSize</a>
最大空间，默认为0(表示不限制)，如果saveType=1，设置无效  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_name">name</a>
cache 名  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_redis">redis</a>
redis名，如果saveType=1，则必须设置，默认default  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_saveType">saveType</a>
存储类型 0内存，1redis，默认0，如果应用设置为集群部署，则设置无效(强制为1)  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
