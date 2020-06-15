# Class StaticResource
## 属性列表
+ [staticMap](#PROP_staticMap)
+ [zipTypes](#PROP_zipTypes)
  
## 方法列表
+ [addPath](#METHOD_addPath)
+ [checkNeedZip](#METHOD_checkNeedZip)
+ [load](#METHOD_load)
+ [readFile](#METHOD_readFile)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
静态资源加载器  
## 属性
### <a id="PROP_staticMap">staticMap</a>
静态资源map，用于管理可访问静态资源路径，目录可以带通配符‘*’  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Map&lt;string,RegExp&gt;</font>  
#### 初始值
new Map()  
### <a id="PROP_zipTypes">zipTypes</a>
可压缩类型  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>Array&lt;RegExp&gt;</font>  
#### 初始值
[  
## 方法
### <a id="METHOD_addPath">addPath(paths)</a>
#### 描述
添加静态路径  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ paths *&lt;<font class='datatype'>string|string[]</font>&gt;*   待添加的目录或目录数组
  
#### 返回值
void  
### <a id="METHOD_checkNeedZip">checkNeedZip(mimeType)</a>
#### 描述
检查mime类型文件是否需要压缩  
#### 修饰符
<font class="modifier">public  static</font>  
#### 参数
+ mimeType *&lt;<font class='datatype'>string</font>&gt;* 
  
#### 返回值
<font class='datatype'>boolean</font>  
### <a id="METHOD_load">load(request,response,path)</a>
#### 描述
加载静态资源  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ request *&lt;<font class='datatype'>[HttpRequest](HttpRequest)</font>&gt;*   request
+ response *&lt;<font class='datatype'>[HttpResponse](HttpResponse)</font>&gt;*  response
+ path *&lt;<font class='datatype'>string</font>&gt;*      文件路径
  
#### 返回值
<font class='datatype'>Promise&lt;number&gt;</font>  
http异常码或0  
### <a id="METHOD_readFile">readFile(path[,zip])</a>
#### 描述
读文件  
#### 修饰符
<font class="modifier">public  static  async</font>  
#### 参数
+ path *&lt;<font class='datatype'>string</font>&gt;*      绝对路径
+ zip *&lt;<font class='datatype'>string</font>&gt;*       压缩方法
  
#### 返回值
<font class='datatype'>Promise&lt;object&gt;</font>  
{  
etag:etag,  
lastModified:lastModified,  
type:mimeType,  
data:srcBuf,     未压缩数据  
zipData:srcBuf   压缩数据  
size:content length  
saveData:是否可缓存数据  
}  
