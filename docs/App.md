# Class App
## 属性列表
+ [JSON](#PROP_JSON)
+ [appName](#PROP_appName)
+ [configPath](#PROP_configPath)
+ [crypto](#PROP_crypto)
+ [fs](#PROP_fs)
+ [http](#PROP_http)
+ [isCluster](#PROP_isCluster)
+ [mime](#PROP_mime)
+ [openWatcher](#PROP_openWatcher)
+ [path](#PROP_path)
+ [qs](#PROP_qs)
+ [redis](#PROP_redis)
+ [stream](#PROP_stream)
+ [url](#PROP_url)
+ [util](#PROP_util)
+ [uuid](#PROP_uuid)
+ [zlib](#PROP_zlib)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
全局App对象  
把常用模块放置到该全局对象中，可以减少模块初始化时间  
## 属性
### <a id="PROP_JSON">JSON</a>
json5 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('json5')  
### <a id="PROP_appName">appName</a>
应用名，如果存在多个App共享redis，则需要设置改名字，在noomi.json中配置  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
#### 初始值
'APP'  
### <a id="PROP_configPath">configPath</a>
应用配置文件路径  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_crypto">crypto</a>
node crypto 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('crypto')  
### <a id="PROP_fs">fs</a>
node fs 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('fs')  
### <a id="PROP_http">http</a>
node http 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('http')  
### <a id="PROP_isCluster">isCluster</a>
应用是否部署为集群应用标志  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
#### 初始值
false  
### <a id="PROP_mime">mime</a>
mime 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('mime')  
### <a id="PROP_openWatcher">openWatcher</a>
是否打开file watcher  
#### 修饰符
<font class="modifier">public  static</font>  
#### 数据类型
<font class='datatype'>boolean</font>  
#### 初始值
false  
### <a id="PROP_path">path</a>
node path 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('path')  
### <a id="PROP_qs">qs</a>
node querystring 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('querystring')  
### <a id="PROP_redis">redis</a>
redis 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('redis')  
### <a id="PROP_stream">stream</a>
stream 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('stream')  
### <a id="PROP_url">url</a>
node url 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('url')  
### <a id="PROP_util">util</a>
node util 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('util')  
### <a id="PROP_uuid">uuid</a>
uuid 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('uuid')  
### <a id="PROP_zlib">zlib</a>
zlib 对象  
#### 修饰符
<font class="modifier">public  static</font>  
#### 初始值
require('zlib')  
