# Class LaunchHookManager
## 属性列表
+ [hooks](#PROP_hooks)
  
## 方法列表
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
+ [run](#METHOD_run)
  
---
## 描述
<font class="since">开始于 : v0.3.5</font>  
启动后执行钩子对象管理器  
## 属性
### <a id="PROP_hooks">hooks</a>
hook实例数组  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;[IHookObj](/webroute/api/ihookobj)&gt;</font>  
#### 初始值
new Array()  
## 方法
### <a id="METHOD_init">init(json)</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ json *&lt;<font class='datatype'>Array&lt;[IHookObj](/webroute/api/ihookobj)&gt;</font>&gt;* [{"instance":实例名,"method":方法名,params:参数数组}...]
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
解析配置文件  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*  launch hook配置文件路径
  
#### 返回值
void  
### <a id="METHOD_run">run()</a>
#### 描述
批量执行hook方法  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 返回值
void  
