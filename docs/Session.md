# Class Session
## 属性列表
+ [id](#PROP_id)
  
## 方法列表
+ [del](#METHOD_del)
+ [get](#METHOD_get)
+ [set](#METHOD_set)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
session 类  
## 构造方法
### <a id="METHOD_constructor">constructor(id)</a>
#### 参数
+ id *&lt;<font class='datatype'>string</font>&gt;* sessionId
  
## 属性
### <a id="PROP_id">id</a>
session id  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
## 方法
### <a id="METHOD_del">del(key)</a>
#### 描述
删除session值  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
void  
### <a id="METHOD_get">get(key)</a>
#### 描述
获取session值  
##### return
值或null  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
  
#### 返回值
<font class='datatype'>Promise&lt;any&gt; </font>  
### <a id="METHOD_set">set(key,value)</a>
#### 描述
设置session值  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   键
+ value *&lt;<font class='datatype'>any</font>&gt;* 值
  
#### 返回值
void  
