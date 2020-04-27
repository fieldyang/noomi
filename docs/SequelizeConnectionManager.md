# Class SequelizeConnectionManager
## 属性列表
+ [options](#PROP_options)
+ [sequelize](#PROP_sequelize)
  
## 方法列表
+ [close](#METHOD_close)
+ [getConnection](#METHOD_getConnection)
+ [getManager](#METHOD_getManager)
+ [release](#METHOD_release)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
sequelize连接管理器  
### Implements:
<font class='datatype'>[IConnectionManager](IConnectionManager)</font>  
## 构造方法
### <a id="METHOD_constructor">constructor(cfg)</a>
#### 参数
+ cfg *&lt;any&gt;* 配置对象 {usePool:使用连接池,useTransaction:是否启用事务机制,其它配置参考options属性说明}
  
## 属性
### <a id="PROP_options">options</a>
数据库配置项，示例如下：  
```  
 {  
   "dialect":"mysql",  
   "host":"localhost",  
   "port":3306,  
   "username":"your user",  
   "password":"your password",  
   "database":"your db",  
   "pool": {  
       "max": 5,  
       "min": 0,  
       "acquire": 30000,  
       "idle": 10000  
   },  
   "define": {  
       "timestamps": false  
   },  
   "models":["your model js file directory"],  
   "repositoryMode":true   
 }  
```  
更多细节参考npm sequelize  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>object</font>  
### <a id="PROP_sequelize">sequelize</a>
sequelize对象  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>Sequelize</font>  
## 方法
### <a id="METHOD_close">close()</a>
#### 描述
关闭连接，整个应用结束时执行  
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
void  
### <a id="METHOD_getManager">getManager()</a>
#### 描述
获取EntityManager，TypeormConnectionManager有效，其它返回null  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;EntityManager&gt;</font>  
### <a id="METHOD_release">release([conn])</a>
#### 描述
释放连接，不做任何操作  
#### 修饰符
<font class="modifier">public  async</font>  
#### 参数
+ conn *&lt;<font class='datatype'>any</font>&gt;* 
  
#### 返回值
void  
