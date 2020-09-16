# Class RouteFactory
## 属性列表
+ [dynaRouteArr](#PROP_dynaRouteArr)
+ [errorHandler](#PROP_errorHandler)
+ [staticRouteMap](#PROP_staticRouteMap)
  
## 方法列表
+ [addRoute](#METHOD_addRoute)
+ [getRoute](#METHOD_getRoute)
+ [handleException](#METHOD_handleException)
+ [handleOneResult](#METHOD_handleOneResult)
+ [handleResult](#METHOD_handleResult)
+ [handleRoute](#METHOD_handleRoute)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
路由工厂类  
用于管理所有路由对象  
## 属性
### <a id="PROP_dynaRouteArr">dynaRouteArr</a>
动态路由(带通配符)路由集合  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>IRouteCfg[]</font>  
#### 初始值
new Array()  
### <a id="PROP_errorHandler">errorHandler</a>
<font class="since">开始于 : v0.3.7</font>  
异常处理器实例名  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_staticRouteMap">staticRouteMap</a>
静态路由(不带通配符)路由集合  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,IRouteCfg&gt;</font>  
#### 初始值
new Map()  
## 方法
### <a id="METHOD_addRoute">addRoute(path,clazz[,method[,results]])</a>
#### 描述
添加路由  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*      路由路径，支持通配符*，需要method支持
+ clazz *&lt;<font class='datatype'>string</font>&gt;*     对应类
+ method *&lt;<font class='datatype'>string</font>&gt;*    方法，path中包含*，则不设置
+ results *&lt;<font class='datatype'>Array&lt;[IRouteResult](/webroute/api/irouteresult)&gt;</font>&gt;*   路由处理结果集
  
#### 返回值
void  
### <a id="METHOD_getRoute">getRoute(path)</a>
#### 描述
根据路径获取路由对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*      url路径
  
#### 返回值
<font class='datatype'>[IRoute](/webroute/api/iroute)</font>  
路由对象  
### <a id="METHOD_handleException">handleException(res,e)</a>
#### 描述
处理异常信息  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ res *&lt;<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>&gt;*   response 对象
+ e *&lt;<font class='datatype'>any</font>&gt;*     异常
  
#### 返回值
void  
### <a id="METHOD_handleOneResult">handleOneResult(res,result,data[,instance])</a>
#### 描述
处理一个路由结果  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ res *&lt;<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>&gt;*           response 对象
+ result *&lt;<font class='datatype'>[IRouteResult](/webroute/api/irouteresult)</font>&gt;*        route result
+ data *&lt;<font class='datatype'>any</font>&gt;*          路由执行结果
+ instance *&lt;<font class='datatype'>any</font>&gt;*      路由实例
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_handleResult">handleResult(res,data,instance,results)</a>
#### 描述
处理路由结果  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ res *&lt;<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>&gt;*       response 对象
+ data *&lt;<font class='datatype'>any</font>&gt;*      路由对应方法返回值
+ instance *&lt;<font class='datatype'>any</font>&gt;*  路由对应实例
+ results *&lt;<font class='datatype'>Array&lt;[IRouteResult](/webroute/api/irouteresult)&gt;</font>&gt;*   route结果数组
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_handleRoute">handleRoute(pathOrRoute,params,req,res)</a>
#### 描述
路由方法执行  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ pathOrRoute *&lt;<font class='datatype'>string|IRoute</font>&gt;*   路径或路由
+ params *&lt;<font class='datatype'>object</font>&gt;*        调用参数对象
+ req *&lt;<font class='datatype'>[HttpRequest](/webroute/api/httprequest)</font>&gt;*           request 对象
+ res *&lt;<font class='datatype'>[HttpResponse](/webroute/api/httpresponse)</font>&gt;*           response 对象
  
#### 返回值
<font class='datatype'>number</font>  
错误码或0  
### <a id="METHOD_init">init(config[,ns])</a>
#### 描述
初始化路由工厂  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ config *&lt;<font class='datatype'>any</font>&gt;*    配置文件
+ ns *&lt;<font class='datatype'>string</font>&gt;*        命名空间（上级路由路径）
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path[,ns])</a>
#### 描述
解析路由文件  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*  文件路径
+ ns *&lt;<font class='datatype'>string</font>&gt;*    命名空间，默认
  
#### 返回值
void  
