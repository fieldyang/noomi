# Interface IRouteResult
## 属性列表
+ [params](#PROP_params)
+ [type](#PROP_type)
+ [url](#PROP_url)
+ [value](#PROP_value)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
路由结果类型  
## 属性
### <a id="PROP_params">params</a>
参数名数组，当type为chain时，从当前路由对应类中获取参数数组对应的属性值并以参数对象传递到下一个路由  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Array&lt;string&gt;</font>  
### <a id="PROP_type">type</a>
结果类型  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>[ERouteResultType](ERouteResultType)</font>  
### <a id="PROP_url">url</a>
路径，type 为redirect 和 url时，必须设置  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_value">value</a>
返回值，当返回值与value一致时，将执行此结果  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
