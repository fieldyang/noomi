# Class HttpResponse
## 属性列表
+ [cookie](#PROP_cookie)
+ [request](#PROP_request)
+ [srcRes](#PROP_srcRes)
  
## 方法列表
+ [doHead](#METHOD_doHead)
+ [doOptions](#METHOD_doOptions)
+ [getHeader](#METHOD_getHeader)
+ [init](#METHOD_init)
+ [redirect](#METHOD_redirect)
+ [setContentLength](#METHOD_setContentLength)
+ [setContentType](#METHOD_setContentType)
+ [setCorsHead](#METHOD_setCorsHead)
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
### extends
<font class='datatype'>ServerResponse</font>  
## 属性
### <a id="PROP_cookie">cookie</a>
cookie  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>[HttpCookie](/webroute/api/httpcookie)</font>  
#### 初始值
new HttpCookie()  
### <a id="PROP_request">request</a>
源request  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>IncomingMessage</font>  
### <a id="PROP_srcRes">srcRes</a>
源response  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>ServerResponse</font>  
## 方法
### <a id="METHOD_doHead">doHead(config)</a>
#### 描述
处理head方法请求  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ config *&lt;<font class='datatype'>[IResponseWriteCfg](/webroute/api/iresponsewritecfg)</font>&gt;*    response config
  
#### 返回值
<font class='datatype'>boolean</font>  
如果请方法为head，则返回true，否则返回false  
### <a id="METHOD_doOptions">doOptions()</a>
#### 描述
处理options  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
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
### <a id="METHOD_setContentLength">setContentLength(length)</a>
#### 描述
设置content length  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ length *&lt;<font class='datatype'>number</font>&gt;*    内容长度
  
#### 返回值
void  
### <a id="METHOD_setContentType">setContentType(type)</a>
#### 描述
设置回写类型  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ type *&lt;<font class='datatype'>string</font>&gt;*      类型
  
#### 返回值
void  
### <a id="METHOD_setCorsHead">setCorsHead()</a>
#### 描述
设置跨域头  
#### 修饰符
<font class="modifier">public</font>  
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
+ config *&lt;<font class='datatype'>[IResponseWriteCfg](/webroute/api/iresponsewritecfg)</font>&gt;*    回写配置项  
data:file path
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_writeToClient">writeToClient(config)</a>
#### 描述
写到浏览器(客户)端  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ config *&lt;<font class='datatype'>[IResponseWriteCfg](/webroute/api/iresponsewritecfg)</font>&gt;*    回写配置项
  
#### 返回值
<font class='datatype'>void</font>  
