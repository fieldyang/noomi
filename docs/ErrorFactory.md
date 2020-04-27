# Class ErrorFactory
## 属性列表
+ [errMap](#PROP_errMap)
+ [language](#PROP_language)
  
## 方法列表
+ [getError](#METHOD_getError)
+ [init](#METHOD_init)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
异常工厂  
### remarks
用于异常信息管理和异常信息处理  
## 属性
### <a id="PROP_errMap">errMap</a>
异常信息map，键为异常码，值为异常信息  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,string&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_language">language</a>
异常提示语言  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'zh'  
## 方法
### <a id="METHOD_getError">getError(errNo[,param])</a>
#### 描述
获取异常  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ errNo *&lt;<font class='datatype'>string</font>&gt;*     异常码
+ param *&lt;<font class='datatype'>Array&lt;any&gt;</font>&gt;*     参数值数组，用于处理消息带参数的情况
  
#### 返回值
<font class='datatype'>any</font>  
{code:异常码,message:异常信息}  
### <a id="METHOD_init">init(language)</a>
#### 描述
异常初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ language *&lt;any&gt;*  异常提示语言
  
#### 返回值
void  
