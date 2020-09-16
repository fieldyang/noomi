# Class FilterFactory
## 属性列表
+ [filters](#PROP_filters)
  
## 方法列表
+ [addFilter](#METHOD_addFilter)
+ [doChain](#METHOD_doChain)
+ [getFilterChain](#METHOD_getFilterChain)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
过滤器工厂类  
### remarks
用于管理所有过滤器对象  
## 属性
### <a id="PROP_filters">filters</a>
过滤器实例数组  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;[IFilter](/webroute/api/ifilter)&gt;</font>  
#### 初始值
[]  
## 方法
### <a id="METHOD_addFilter">addFilter(cfg)</a>
#### 描述
添加过滤器到工厂  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ cfg *&lt;<font class='datatype'>[IFilterCfg](/webroute/api/ifiltercfg)</font>&gt;*   过滤器配置项
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_doChain">doChain(url,request,response)</a>
#### 描述
执行过滤器链  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;*       url路径
+ request *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;*   request 对象
+ response *&lt;<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>&gt;*  response 对象
  
#### 返回值
<font class='datatype'>Promise&lt;boolean&gt;</font>  
### <a id="METHOD_getFilterChain">getFilterChain(url)</a>
#### 描述
获取过滤器链  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ url *&lt;<font class='datatype'>string</font>&gt;*   资源url
  
#### 返回值
<font class='datatype'>Array&lt;[IFilter](/webroute/api/ifilter)&gt;</font>  
filter数组  
### <a id="METHOD_init">init(config)</a>
#### 描述
初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ config *&lt;any&gt;* {filters:[{IFilterCfg1},...]}
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*      filter的json文件
  
#### 返回值
<font class='datatype'>void</font>  
