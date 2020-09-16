# Class MssqlTransaction
## 属性列表
+ [tr](#PROP_tr)
  
## 方法列表
+ [begin](#METHOD_begin)
+ [commit](#METHOD_commit)
+ [rollback](#METHOD_rollback)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
mssql 事务类  
### extends
<font class='datatype'>[NoomiTransaction](/webroute/api/noomitransaction)</font>  
## 构造方法
### <a id="METHOD_constructor">constructor(id[,connection[,type]])</a>
#### 参数
+ id *&lt;<font class='datatype'>number</font>&gt;*            事务id
+ connection *&lt;<font class='datatype'>any</font>&gt;*    所属连接
+ type *&lt;<font class='datatype'>TransactionType</font>&gt;*          事务类型
  
## 属性
### <a id="PROP_tr">tr</a>
mysql 事务对象  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
## 方法
### <a id="METHOD_begin">begin()</a>
#### 描述
开始事务  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_commit">commit()</a>
#### 描述
事务提交  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_rollback">rollback()</a>
#### 描述
事务回滚  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
