# Class InstanceFactory
## 属性列表
+ [afterInitOperations](#PROP_afterInitOperations)
+ [factory](#PROP_factory)
+ [injectList](#PROP_injectList)
+ [injectMap](#PROP_injectMap)
+ [mdlBasePath](#PROP_mdlBasePath)
  
## 方法列表
+ [addAfterInitOperation](#METHOD_addAfterInitOperation)
+ [addInject](#METHOD_addInject)
+ [addInstance](#METHOD_addInstance)
+ [addInstances](#METHOD_addInstances)
+ [doAfterInitOperations](#METHOD_doAfterInitOperations)
+ [exec](#METHOD_exec)
+ [finishInject](#METHOD_finishInject)
+ [getFactory](#METHOD_getFactory)
+ [getInstance](#METHOD_getInstance)
+ [getInstanceByClass](#METHOD_getInstanceByClass)
+ [getInstanceObj](#METHOD_getInstanceObj)
+ [handleJson](#METHOD_handleJson)
+ [init](#METHOD_init)
+ [parseFile](#METHOD_parseFile)
+ [updInject](#METHOD_updInject)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
实例工厂  
### remarks
用于管理所有的实例对象  
## 属性
### <a id="PROP_afterInitOperations">afterInitOperations</a>
<font class="since">开始于 : v0.4.0</font>  
初始化后操作数组(实例工厂初始化结束后执行) {func:Function,thisObj:func this指向}  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;object&gt;</font>  
#### 初始值
[]  
### <a id="PROP_factory">factory</a>
实例工厂map，存放所有实例对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,IInstance&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_injectList">injectList</a>
待注入对象数组  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;[IInject](/webroute/api/iinject)&gt;</font>  
#### 初始值
[]  
### <a id="PROP_injectMap">injectMap</a>
<font class="since">开始于 : v0.4.4</font>  
注入依赖map  键为注入类实例名，值为数组，数组元素为{className:类名,propName:属性名}  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,object[]&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_mdlBasePath">mdlBasePath</a>
模块基础路径数组，加载实例时从该路径加载  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;string&gt;</font>  
#### 初始值
[]  
## 方法
### <a id="METHOD_addAfterInitOperation">addAfterInitOperation(foo,thisObj)</a>
<font class="since">开始于 : v0.4.0</font>  
#### 描述
添加初始化结束后操作  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ foo *&lt;<font class='datatype'>Function</font>&gt;*   待执行操作
+ thisObj *&lt;<font class='datatype'>any</font>&gt;* 
  
#### 返回值
void  
### <a id="METHOD_addInject">addInject(instance,propName,injectName)</a>
#### 描述
为实例添加注入  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ instance *&lt;<font class='datatype'>any</font>&gt;*      实例类
+ propName *&lt;<font class='datatype'>string</font>&gt;*      属性名
+ injectName *&lt;<font class='datatype'>string</font>&gt;*    注入的实例名
  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_addInstance">addInstance(cfg)</a>
#### 描述
添加单例到工厂  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ cfg *&lt;<font class='datatype'>[IInstanceCfg](/webroute/api/iinstancecfg)</font>&gt;*       实例配置对象
  
#### 返回值
<font class='datatype'>any</font>  
undefined或添加的实例  
### <a id="METHOD_addInstances">addInstances(path)</a>
#### 描述
从文件添加实例  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*  文件路径
  
#### 返回值
void  
### <a id="METHOD_doAfterInitOperations">doAfterInitOperations()</a>
<font class="since">开始于 : v0.4.0</font>  
#### 描述
执行初始化操作  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
void  
### <a id="METHOD_exec">exec(instance,methodName,params[,func])</a>
#### 描述
执行实例的一个方法  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ instance *&lt;<font class='datatype'>any</font>&gt;* 
+ methodName *&lt;<font class='datatype'>string</font>&gt;*    方法名
+ params *&lt;<font class='datatype'>Array&lt;any&gt;</font>&gt;*        参数数组
+ func *&lt;<font class='datatype'>Function</font>&gt;*          方法(与methodName二选一)
  
#### 返回值
<font class='datatype'>any</font>  
方法对应的结果  
### <a id="METHOD_finishInject">finishInject()</a>
#### 描述
完成注入操作  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
<font class='datatype'>void</font>  
### <a id="METHOD_getFactory">getFactory()</a>
#### 描述
获取instance工厂  
#### 修饰符
<font class="modifier">public  static</font>  
#### 返回值
<font class='datatype'>Map&lt;string,IInstance&gt;</font>  
实例工厂  
### <a id="METHOD_getInstance">getInstance(name[,param])</a>
#### 描述
获取实例  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*  实例名
+ param *&lt;<font class='datatype'>Array&lt;any&gt;</font>&gt;* 参数数组
  
#### 返回值
<font class='datatype'>any</font>  
实例化的对象或null  
### <a id="METHOD_getInstanceByClass">getInstanceByClass(clazz[,param])</a>
#### 描述
通过类获取实例  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ clazz *&lt;<font class='datatype'>any</font>&gt;*     类
+ param *&lt;<font class='datatype'>Array&lt;any&gt;</font>&gt;*     参数数组
  
#### 返回值
<font class='datatype'>any</font>  
实例  
### <a id="METHOD_getInstanceObj">getInstanceObj(name)</a>
#### 描述
获取实例对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ name *&lt;<font class='datatype'>string</font>&gt;*  实例名
  
#### 返回值
<font class='datatype'>[IInstance](/webroute/api/iinstance)</font>  
实例对象  
### <a id="METHOD_handleJson">handleJson(json)</a>
#### 描述
  
#### 修饰符
<font class="modifier">private  static</font>  
#### 参数
+ json *&lt;<font class='datatype'>[IInstanceFileCfg](/webroute/api/iinstancefilecfg)</font>&gt;*      实例对象
  
#### 返回值
void  
### <a id="METHOD_init">init(config)</a>
#### 描述
工厂初始化  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ config *&lt;<font class='datatype'>any</font>&gt;*    配置项
  
#### 返回值
void  
### <a id="METHOD_parseFile">parseFile(path)</a>
#### 描述
  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*      文件路径
  
#### 返回值
void  
### <a id="METHOD_updInject">updInject(clazz)</a>
<font class="since">开始于 : v0.4.4</font>  
#### 描述
更新与clazz相关的注入  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ clazz *&lt;<font class='datatype'>any</font>&gt;* 类
  
#### 返回值
void  
