# Class RequestQueue
## 方法列表
+ [add](#METHOD_add)
+ [handle](#METHOD_handle)
+ [handleOne](#METHOD_handleOne)
+ [setCanHandle](#METHOD_setCanHandle)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
  
## 方法
### <a id="METHOD_add">add(req)</a>
#### 描述
加入队列  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ req *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;* 
  
#### 返回值
void  
### <a id="METHOD_handle">handle()</a>
#### 描述
处理队列  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
void  
### <a id="METHOD_handleOne">handleOne(request)</a>
#### 描述
资源访问  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ request *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;*   request
  
#### 返回值
void  
### <a id="METHOD_setCanHandle">setCanHandle(v)</a>
#### 描述
设置允许处理标志  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ v *&lt;<font class='datatype'>boolean</font>&gt;* 
  
#### 返回值
void  
