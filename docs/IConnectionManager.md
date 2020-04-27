# Interface IConnectionManager
## 属性列表
+ [dbMdl](#PROP_dbMdl)
+ [pool](#PROP_pool)
  
## 方法列表
+ [getConnection](#METHOD_getConnection)
+ [getManager](#METHOD_getManager)
+ [release](#METHOD_release)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
数据库连接管理器  
### remarks
用于管理connection  
## 属性
### <a id="PROP_dbMdl">dbMdl</a>
数据库module，可以是 mysql module,mssql module, oracle module  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_pool">pool</a>
数据库连接池  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
## 方法
### <a id="METHOD_getConnection">getConnection()</a>
#### 描述
获取连接  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
### <a id="METHOD_getManager">getManager()</a>
#### 描述
获取EntityManager，TypeormConnectionManager有效  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
### <a id="METHOD_release">release(conn)</a>
#### 描述
释放连接  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ conn *&lt;<font class='datatype'>any</font>&gt;*  待释放的连接
  
#### 返回值
void  
