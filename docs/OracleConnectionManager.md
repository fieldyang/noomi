# Class OracleConnectionManager
## 属性列表
+ [connection](#PROP_connection)
+ [dbMdl](#PROP_dbMdl)
+ [options](#PROP_options)
+ [pool](#PROP_pool)
+ [poolAlias](#PROP_poolAlias)
+ [usePool](#PROP_usePool)
  
## 方法列表
+ [getConnection](#METHOD_getConnection)
+ [getManager](#METHOD_getManager)
+ [release](#METHOD_release)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
oracle连接管理器  
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
module oracle  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_options">options</a>
数据库配置项，示例如下：  
```  
 {  
   "user":"your user",  
   "password":"your password",  
   "connectString":"localhost/your db",  
   "poolMin":5,  
   "poolMax":20  
 }  
```  
更多细节参考npm oracle  
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
### <a id="PROP_poolAlias">poolAlias</a>
pool别名  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_usePool">usePool</a>
是否使用连接池  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
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
### <a id="METHOD_release">release(conn)</a>
#### 描述
释放连接  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ conn *&lt;<font class='datatype'>any</font>&gt;* oracle connection对象
  
#### 返回值
void  
