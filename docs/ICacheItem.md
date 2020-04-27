# Interface ICacheItem
## 属性列表
+ [key](#PROP_key)
+ [subKey](#PROP_subKey)
+ [timeout](#PROP_timeout)
+ [value](#PROP_value)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
cache item类型，用于cache操作参数传递  
## 属性
### <a id="PROP_key">key</a>
键  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_subKey">subKey</a>
子键，当key对应值为map时，存取操作需要设置  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_timeout">timeout</a>
超时时间(秒)，为0或不设置，则表示不超时  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_value">value</a>
键对应值  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
