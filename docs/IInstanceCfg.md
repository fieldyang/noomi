# Interface IInstanceCfg
## 属性列表
+ [class](#PROP_class)
+ [instance](#PROP_instance)
+ [name](#PROP_name)
+ [params](#PROP_params)
+ [path](#PROP_path)
+ [properties](#PROP_properties)
+ [singleton](#PROP_singleton)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
实例配置对象  
## 属性
### <a id="PROP_class">class</a>
类名或类  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_instance">instance</a>
实例与path 二选一  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_name">name</a>
实例名  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_params">params</a>
参数数组，初始化时需要传入的参数  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Array&lt;any&gt;</font>  
### <a id="PROP_path">path</a>
模块路径（相对noomi.ini配置的modulepath），与instance二选一  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_properties">properties</a>
属性列表，定义需要注入的属性  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Array&lt;[IInstanceProperty](/webroute/api/iinstanceproperty)&gt;</font>  
### <a id="PROP_singleton">singleton</a>
单例模式，如果为true，表示该类只创建一个实例，调用时，共享调用  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
