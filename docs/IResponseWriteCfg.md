# Interface IResponseWriteCfg
## 属性列表
+ [charset](#PROP_charset)
+ [crossDomain](#PROP_crossDomain)
+ [data](#PROP_data)
+ [size](#PROP_size)
+ [statusCode](#PROP_statusCode)
+ [type](#PROP_type)
+ [zip](#PROP_zip)
  
---
## 描述
<font class="since">开始于 : v0.0.1</font>  
response回写配置项  
## 属性
### <a id="PROP_charset">charset</a>
字符集，默认utf8  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>BufferEncoding</font>  
### <a id="PROP_crossDomain">crossDomain</a>
跨域配置串，多个域名用','分割，默认用webconfig中配置的网址数组，如果都没配置，则使用*  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_data">data</a>
待写数据，可以是数据串或stream  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>any</font>  
### <a id="PROP_size">size</a>
数据长度  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_statusCode">statusCode</a>
http状态码，默认200  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>number</font>  
### <a id="PROP_type">type</a>
数据类型，默认text/html  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
### <a id="PROP_zip">zip</a>
压缩类型，包括br,gzip,deflate  
#### 修饰符
<font class="modifier">public</font>  
#### 数据类型
<font class='datatype'>string</font>  
