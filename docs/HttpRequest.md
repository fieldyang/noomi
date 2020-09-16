# Class HttpRequest
## 属性列表
+ [parameters](#PROP_parameters)
+ [response](#PROP_response)
+ [srcReq](#PROP_srcReq)
  
## 方法列表
+ [formHandle](#METHOD_formHandle)
+ [getAllParameters](#METHOD_getAllParameters)
+ [getHeader](#METHOD_getHeader)
+ [getMethod](#METHOD_getMethod)
+ [getParameter](#METHOD_getParameter)
+ [getSession](#METHOD_getSession)
+ [getSocket](#METHOD_getSocket)
+ [getUrl](#METHOD_getUrl)
+ [init](#METHOD_init)
+ [initQueryString](#METHOD_initQueryString)
+ [setParameter](#METHOD_setParameter)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
request类  
### remarks
在IncomingMessage基础上增加了参数解析等方法，更适合直接使用  
### extends
<font class='datatype'>IncomingMessage</font>  
## 构造方法
### <a id="METHOD_constructor">constructor(req,res)</a>
#### 参数
+ req *&lt;<font class='datatype'>IncomingMessage</font>&gt;* 源IncommingMessage对象(createServer时传入)
+ res *&lt;<font class='datatype'>ServerResponse</font>&gt;* 源ServerResponse对象(createServer时传入)
  
## 属性
### <a id="PROP_parameters">parameters</a>
参数对象  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>object</font>  
#### 初始值
new Object()  
### <a id="PROP_response">response</a>
http response对象  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>  
### <a id="PROP_srcReq">srcReq</a>
源IncommingMessage对象(server listen 时传入)，某些需要操纵源IncommingMessage的情况下，可以直接使用  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>IncomingMessage</font>  
## 方法
### <a id="METHOD_formHandle">formHandle()</a>
#### 描述
POST时的参数处理  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>Promise&lt;object&gt;</font>  
参数值对象  
### <a id="METHOD_getAllParameters">getAllParameters()</a>
#### 描述
获取所有paramter  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>object</font>  
参数object  
### <a id="METHOD_getHeader">getHeader(key)</a>
#### 描述
获取请求消息头信息  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ key *&lt;<font class='datatype'>string</font>&gt;*   消息头名，具体取值参考message.headers
  
#### 返回值
<font class='datatype'>string | string[] | undefined</font>  
消息值  
### <a id="METHOD_getMethod">getMethod()</a>
#### 描述
获取请求方法，入GET、POSt等  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>string</font>  
### <a id="METHOD_getParameter">getParameter(name)</a>
#### 描述
获取参数  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*      参数名
  
#### 返回值
<font class='datatype'>string</font>  
参数值  
### <a id="METHOD_getSession">getSession()</a>
#### 描述
获取session  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;[Session](/webroute/api/session)&gt;</font>  
session对象  
### <a id="METHOD_getSocket">getSocket()</a>
#### 描述
获取socket，可以通过socket获取远程地址、本地地址等  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>Socket</font>  
socket对象  
### <a id="METHOD_getUrl">getUrl()</a>
#### 描述
获取来源url路径  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
<font class='datatype'>string</font>  
### <a id="METHOD_init">init()</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  async</font>  
#### 返回值
<font class='datatype'>Promise&lt;object&gt;</font>  
请求参数  
### <a id="METHOD_initQueryString">initQueryString()</a>
#### 描述
初始化url查询串  
#### 修饰符
<font class="modifier">public</font>  
#### 返回值
void  
### <a id="METHOD_setParameter">setParameter(name,value)</a>
#### 描述
设置参数  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*      参数名
+ value *&lt;<font class='datatype'>string</font>&gt;*     参数值
  
#### 返回值
void  
