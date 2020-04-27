# Function getConnection()
<font class="since">开始于 : v0.0.1</font>  
修饰符  
<font class="modifier">async</font>  
## 描述
获取数据库或数据源连接  
## 返回值
<font class='datatype'>Promise&lt;Sequelize|Connection|any&gt;</font>  
数据库connection，针对不同的product返回不同:  
mysql:      返回connection对象  
oracle:     返回connection对象  
mssql:      返回request对象  
sequelize:  返回sequelize对象  
typeorm:    返回connection（已连接）  
