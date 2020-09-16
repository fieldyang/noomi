# Class TypeormConnectionManager
## 属性列表
+ [connection](#PROP_connection)
+ [transactionManager](#PROP_transactionManager)
  
## 方法列表
+ [close](#METHOD_close)
+ [getConnection](#METHOD_getConnection)
+ [getManager](#METHOD_getManager)
+ [release](#METHOD_release)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
typeorm连接管理器  
### implements
<font class='datatype'>[IConnectionManager](/webroute/api/iconnectionmanager)</font>  
## 构造方法
### <a id="METHOD_constructor">constructor(cfg)</a>
#### 参数
+ cfg *&lt;any&gt;* 配置对象，配置如下：  
```  
 {  
  "type": "mysql",  
   "host": "localhost",  
   "port": 3306,  
   "username": "your user",  
   "password": "your password",  
   "database": "your db",  
   "logging": true,  
   "entities": [  
       "your entity js file directory/*.js"  
   ]  
 }  
```
  
## 属性
### <a id="PROP_connection">connection</a>
typeorm connection  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Connection</font>  
### <a id="PROP_transactionManager">transactionManager</a>
事务管理器  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
## 方法
### <a id="METHOD_close">close()</a>
#### 描述
关闭连接，应用结束时执行  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
void  
### <a id="METHOD_getConnection">getConnection()</a>
#### 描述
获取连接  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;Connection&gt;</font>  
connection（已连接）  
### <a id="METHOD_getManager">getManager()</a>
#### 描述
获取manager  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;EntityManager&gt;</font>  
EntityManager  
### <a id="METHOD_release">release([conn])</a>
#### 描述
释放连接，typeorm无需手动释放连接  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ conn *&lt;<font class='datatype'>any</font>&gt;* 
  
#### 返回值
void  
