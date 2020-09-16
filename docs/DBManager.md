# Class DBManager
## 属性列表
+ [connectionManagerName](#PROP_connectionManagerName)
+ [product](#PROP_product)
+ [transactionName](#PROP_transactionName)
  
## 方法列表
+ [getConnectionManager](#METHOD_getConnectionManager)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
数据库管理器  
### remarks
用于管理数据库相关配置  
## 属性
### <a id="PROP_connectionManagerName">connectionManagerName</a>
连接管理器实例名  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_product">product</a>
数据库产品 包括:mysql,mssql,oracle,typeorm,sequelize  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_transactionName">transactionName</a>
事务类名  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
## 方法
### <a id="METHOD_getConnectionManager">getConnectionManager()</a>
#### 描述
获取connection manager  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
<font class='datatype'>[IConnectionManager](/webroute/api/iconnectionmanager)</font>  
connection manager  
### <a id="METHOD_init">init(cfg)</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ cfg *&lt;<font class='datatype'>any</font>&gt;*   配置项,参考数据库配置
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*  文件路径
  
#### 返回值
void  
