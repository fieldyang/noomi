# Class HttpResponse
## 方法列表
+ [getHeader](#METHOD_getHeader)
+ [init](#METHOD_init)
+ [redirect](#METHOD_redirect)
+ [setHeader](#METHOD_setHeader)
+ [writeCookie](#METHOD_writeCookie)
+ [writeFileToClient](#METHOD_writeFileToClient)
+ [writeToClient](#METHOD_writeToClient)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
response类  
### remarks
在ServerResponse基础上增加了写客户端方法，更适合直接使用  
### Extends:
<font class='datatype'>ServerResponse</font>  
## 方法
### <a id="METHOD_getHeader">getHeader(key)</a>
#### 描述
获取header  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;* 
  
#### 返回值
<font class='datatype'>number|string|string[]</font>  
返回值  
### <a id="METHOD_init">init(req,res)</a>
#### 描述
初始化response对象  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ req *&lt;<font class='datatype'>IncomingMessage</font>&gt;*   源request对象
+ res *&lt;<font class='datatype'>ServerResponse</font>&gt;*   源response对象
  
#### 返回值
void  
### <a id="METHOD_redirect">redirect(page)</a>
#### 描述
重定向  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ page *&lt;<font class='datatype'>string</font>&gt;*  跳转路径url
  
#### 返回值
void  
### <a id="METHOD_setHeader">setHeader(key,value)</a>
#### 描述
设置回传header  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*       键
+ value *&lt;<font class='datatype'>number|string|string[]</font>&gt;*     值
  
#### 返回值
void  
### <a id="METHOD_writeCookie">writeCookie()</a>
#### 描述
写cookie到header  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
### <a id="METHOD_writeFileToClient">writeFileToClient(config)</a>
<font class="since">开始于 : v0.3.3</font>  
#### 描述
写数据流到浏览器(客户端)  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ config *&lt;<font class='datatype'>[IResponseWriteCfg](IResponseWriteCfg)</font>&gt;*    回写配置项  
data:file path
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_writeToClient">writeToClient(config)</a>
#### 描述
写到浏览器(客户)端  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ config *&lt;<font class='datatype'>[IResponseWriteCfg](IResponseWriteCfg)</font>&gt;*    回写配置项
  
#### 返回值
<font class='datatype'>void</font>  
