# Class PageFactory
## 属性列表
+ [errorPages](#PROP_errorPages)
  
## 方法列表
+ [addErrorPage](#METHOD_addErrorPage)
+ [getErrorPage](#METHOD_getErrorPage)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
页面工厂  
### remarks
用于管理页面及路径  
## 属性
### <a id="PROP_errorPages">errorPages</a>
错误页面集合  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;number,string&gt;</font>  
#### 初始值
new Map()  
## 方法
### <a id="METHOD_addErrorPage">addErrorPage(code,url)</a>
#### 描述
添加错误提示页  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ code *&lt;<font class='datatype'>number</font>&gt;*      错误码
+ url *&lt;<font class='datatype'>string</font>&gt;*       页面地址
  
#### 返回值
void  
### <a id="METHOD_getErrorPage">getErrorPage(code)</a>
#### 描述
获取错误提示页  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ code *&lt;<font class='datatype'>number</font>&gt;*      错误码
  
#### 返回值
<font class='datatype'>string</font>  
错误码对应的页面url  
