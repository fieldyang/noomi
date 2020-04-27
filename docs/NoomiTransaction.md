# Class NoomiTransaction
## 属性列表
+ [connection](#PROP_connection)
+ [id](#PROP_id)
+ [isBegin](#PROP_isBegin)
+ [manager](#PROP_manager)
+ [trIds](#PROP_trIds)
+ [type](#PROP_type)
  
## 方法列表
+ [begin](#METHOD_begin)
+ [commit](#METHOD_commit)
+ [rollback](#METHOD_rollback)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
事务类  
## 构造方法
### <a id="METHOD_constructor">constructor(id[,connection[,type]])</a>
#### 参数
+ id *&lt;<font class='datatype'>number</font>&gt;*            事务id
+ connection *&lt;<font class='datatype'>any</font>&gt;*    所属连接
+ type *&lt;<font class='datatype'>TransactionType</font>&gt;*          事务类型
  
## 属性
### <a id="PROP_connection">connection</a>
事务所属连接  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_id">id</a>
事务id  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_isBegin">isBegin</a>
事务是否开始  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
### <a id="PROP_manager">manager</a>
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_trIds">trIds</a>
事务id数组，当事务嵌套时需要通过该数组判断是否执行commit和rollback  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Array&lt;number&gt;</font>  
#### 初始值
[]  
### <a id="PROP_type">type</a>
事务类型  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>TransactionType</font>  
## 方法
### <a id="METHOD_begin">begin()</a>
#### 描述
开始事务,继承类需要重载  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_commit">commit()</a>
#### 描述
事务提交,继承类需要重载  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_rollback">rollback()</a>
#### 描述
事务回滚,继承类需要重载  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
