# Class WebConfig
## 属性列表
+ [config](#PROP_config)
+ [cors](#PROP_cors)
+ [httpsCfg](#PROP_httpsCfg)
+ [useHttps](#PROP_useHttps)
+ [useServerCache](#PROP_useServerCache)
+ [welcomePage](#PROP_welcomePage)
  
## 方法列表
+ [get](#METHOD_get)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
+ [setErrorPages](#METHOD_setErrorPages)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
web 配置类  
### remarks
用于管理web配置参数  
## 属性
### <a id="PROP_config">config</a>
配置项  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_cors">cors</a>
跨域设置  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>object</font>  
### <a id="PROP_httpsCfg">httpsCfg</a>
https配置，useHttps为true时有效，包括：  
only_https:是否只采用https，如果为true，则不会启动http server，只启动https server  
key_file:私钥文件路径，相对于根目录  
cert_file:证书文件路径，相对与根目录  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>object</font>  
### <a id="PROP_useHttps">useHttps</a>
是否使用https  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
### <a id="PROP_useServerCache">useServerCache</a>
是否使用cache  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
#### 初始值
false  
### <a id="PROP_welcomePage">welcomePage</a>
欢迎页面，访问根目录时跳转到该页面  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
## 方法
### <a id="METHOD_get">get(name)</a>
#### 描述
获取参数  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;* webconfig参数名
  
#### 返回值
void  
### <a id="METHOD_init">init(config)</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ config *&lt;<font class='datatype'>any</font>&gt;* 参阅web.json配置
  
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
### <a id="METHOD_setErrorPages">setErrorPages(pages)</a>
#### 描述
设置异常页面  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ pages *&lt;<font class='datatype'>Array&lt;object&gt;</font>&gt;* page配置数组[{code:http异常码,location:异常码对应页面地址(相对于项目根目录)}]
  
#### 返回值
void  
