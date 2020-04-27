# Class HttpCookie
## 属性列表
+ [params](#PROP_params)
  
## 方法列表
+ [get](#METHOD_get)
+ [getAll](#METHOD_getAll)
+ [remove](#METHOD_remove)
+ [set](#METHOD_set)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
cookie类  
### remarks
用于response操作cookie  
## 构造方法
### <a id="METHOD_constructor">constructor()</a>
#### 参数
  
## 属性
### <a id="PROP_params">params</a>
参数map  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,string&gt;</font>  
## 方法
### <a id="METHOD_get">get(key)</a>
#### 描述
获取值  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
<font class='datatype'>string</font>  
### <a id="METHOD_getAll">getAll()</a>
#### 描述
获取所有参数  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>Map&lt;string,string&gt;</font>  
参数map  
### <a id="METHOD_remove">remove(key)</a>
#### 描述
删除键  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
void  
### <a id="METHOD_set">set(key,value)</a>
#### 描述
设置值  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
+ value *&lt;<font class='datatype'>string</font>&gt;* 值
  
#### 返回值
void  
