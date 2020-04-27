# Interface IFilterCfg
## 属性列表
+ [instance](#PROP_instance)
+ [instance_name](#PROP_instance_name)
+ [method_name](#PROP_method_name)
+ [order](#PROP_order)
+ [url_pattern](#PROP_url_pattern)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
过滤器配置类型  
## 属性
### <a id="PROP_instance">instance</a>
实例  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_instance_name">instance_name</a>
实例名(与instance二选一)  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_method_name">method_name</a>
方法名,默认do  
方法需要返回true/false，如果为false，则表示不再继续执行（过滤器链）  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_order">order</a>
优先级，越小越高，1-10为框架保留，创建时尽量避免，默认10000  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_url_pattern">url_pattern</a>
正则表达式串，或数组  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string|Array&lt;string&gt;</font>  
