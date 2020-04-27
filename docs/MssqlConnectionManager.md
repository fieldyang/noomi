# Class MssqlConnectionManager
## 属性列表
+ [connection](#PROP_connection)
+ [dbMdl](#PROP_dbMdl)
+ [options](#PROP_options)
+ [pool](#PROP_pool)
  
## 方法列表
+ [getConnection](#METHOD_getConnection)
+ [getManager](#METHOD_getManager)
+ [release](#METHOD_release)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
mssql连接管理器  
### remarks
mssql直接启动连接池，不需要单独配置  
### Implements:
<font class='datatype'>[IConnectionManager](IConnectionManager)</font>  
## 构造方法
### <a id="METHOD_constructor">constructor(cfg)</a>
#### 参数
+ cfg *&lt;any&gt;* 配置对象 {usePool:使用连接池,useTransaction:是否启用事务机制,其它配置参考options属性说明}
  
## 属性
### <a id="PROP_connection">connection</a>
mysql connection对象  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_dbMdl">dbMdl</a>
module mssql  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_options">options</a>
数据库配置项，示例如下：  
```  
{  
  "server":"localhost",  
   "port":1434,  
   "user":"your user",  
   "password":"your password",  
   "database":"your db"     
 }  
```  
更多细节参考npm mssql  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>object</font>  
### <a id="PROP_pool">pool</a>
连接池  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
## 方法
### <a id="METHOD_getConnection">getConnection()</a>
#### 描述
获取连接  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_getManager">getManager()</a>
#### 描述
获取EntityManager，TypeormConnectionManager有效，其它返回null  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;EntityManager&gt;</font>  
null  
### <a id="METHOD_release">release(request)</a>
#### 描述
释放连接  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ request *&lt;<font class='datatype'>any</font>&gt;* mssql request对象
  
#### 返回值
void  
