# Class RouteErrorHandler
## 方法列表
+ [handle](#METHOD_handle)
  
---
## 描述
<font class="since">开始于 : v0.3.7</font>  
路由异常处理类  
如果需要自定义输出，需要继承该类并重载handle方法  
## 方法
### <a id="METHOD_handle">handle(res,e)</a>
#### 描述
异常处理方法  
#### 修饰符
<font class="modifier">public</font>  
#### 参数
+ res *&lt;<font class='datatype'>[HttpResponse](HttpResponse)</font>&gt;*   http response
+ e *&lt;<font class='datatype'>Error</font>&gt;*     异常对象
  
#### 返回值
void  
