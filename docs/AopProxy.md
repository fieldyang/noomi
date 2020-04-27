# Class AopProxy
## 方法列表
+ [invoke](#METHOD_invoke)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
Aop 代理类  
### remarks
用于代理切点所匹配的方法，当符合切点表达式匹配的方法时，将统一调用该代理类的invoke方法  
## 方法
### <a id="METHOD_invoke">invoke(instanceName,methodName,func,instance)</a>
#### 描述
代理方法  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ instanceName *&lt;<font class='datatype'>string</font>&gt;*  实例名
+ methodName *&lt;<font class='datatype'>string</font>&gt;*    方法名
+ func *&lt;<font class='datatype'>Function</font>&gt;*          执行函数
+ instance *&lt;<font class='datatype'>any</font>&gt;*      实例
  
#### 返回值
<font class='datatype'>any</font>  
