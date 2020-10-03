整体架构
cell 挂载到指定方法
cellpool存放初始化的cell，每次调用时，从cellpool找到空闲的cell，然后给cell挂载指定方法，cell负责计算过程管理，比如局部变量、外部引用


InstanceFactory 实例工厂
Context 上下文

mime: 需要安装mime包

IoC : 采用装饰器进行注入
Aop : 定义切面、接入点
问题:Aop针对注入对象，需要进行参数代理


启动过程
1. 读config/noomi.ini文件
2. session 工厂建立
3. 找到context文件路径
4. 读instance context文件并进行实例工厂初始化
5. 读route 文件进行路由工厂初始化
6. 读aop文件进行aop工厂初始化


2019-9-2
Aop执行时，实例的方法需要通过代理来执行，否则无法进行aop嗅探，所以需要对需要aop的所有方法进行代理处理
遍历实例方法:
Object.getOwnPropertyNames(instance.__proto__),实例的方法通过类的原型链继承
今天出现一个问题，就是在inject注解代码中，针对方法做代理后，UserService的dateHandler注入属性变成了undefined
找到原因：方法调用时，沿用了之前的调用方式，需要用apply赋予this指向

2019-9-3
需要修改AopProxy，aop不应该修改InstanceFactory.exec,它应该是对原框架无扰，所以要在AopProxy中重写调用方法

2019-9-4
过滤器和静态资源管理完成了
在noomi.ini中增加了error page的配置，根据错误可以跳转到错误页面了
出现一个问题：utf8回写页面出现中文乱码问题，改成gbk正常，待解决，解决方案：response setheader时content-type里面加charset参数。

模型驱动问题
因为js数据没有类型，无法做到模型的数据转换

问题：
关于node很多操作都是异步，instance factory 怎么控制其执行顺序

2019-9-6
尝试 async-hooks 监听异步操作方法

2019-9-10
尝试注解（装饰器）方式，或者要求带有异步的方法用async定义类，用await调用方法

2019-9-11
有两种方法，一种返回普通结果，一种返回promise对象（异步），有两种调用方式，一种直接调用，一种aop织入
1、返回普通结果的直接调用：调用后直接返回结果，可供继续执行
2、返回普通结果的aop织入：前置方法执sh行-被织入方法执行-后置（异常）方法执行，分两种情况：
  1）前置、后置方法都返回普通结果，则直接执行即可
  2）前置、后置方法存在返回promise情况，需要加await执行 模拟同步
3、返回promise对象的直接调用：用await模拟同步
4、返回promise对象的aop织入：用await模拟同步


2019-9-16
上传功能

2019-9-20
form提交分为两种，一种form内容小于5M，一种form内容大于5M
小于5M的内容，存放在buffer中，大于5M的内容存放到文件中，然后解析文件功能。

2019-9-21
用stream处理，req本身是incommingstream，直接处理即可
有个问题，incommingstream默认是utf8，而文件必须为binary

2019-10-5
route results 如果只有一个，则不判断返回结果，如果没有，则默认返回 ajax json

2019-10-7
修改httprequest 和httpresponse类，在createserver时代理createserver中的request和response

2019-10-8
还剩下异常处理+国际化、redisfactory、事务
继续noomi中的redis的文件加载

2019-10-9
sessionfactory getSession 需要整理 

2019-10-10
异常处理、oracle，mssql，mongodb接入安全框架

后续工作，orm、事务
2019-10-11
事务管理器，管理所有事务，事务分为不同（分数据库、第三方框架）。
事务嵌套，如何解决内部事务的事务获取问题
假定每个用户，同一时刻只有一个事务，则事务的启用，必须加锁，为每个用户设定事务等待队列。
数据库方法基本都是采用异步，所以存在单个用户同时有多个事务处理的情况。

security增加redis支持，后期可能还需要增加token支持

2019-10-13
事务处理 mysql 、sequenlize

2019-10-16
cpu超限时的拒绝连接问题
放弃事务机制
增加aop注解方式


2019-10-25
事务嵌套，提交时execution id不正确
整理connection manager、transaction manager，增加mssql、oracle支持
增加sequlize、typeorm支持

2019-10-28
因为是静态方法，所以在aopproxy这儿引用出了问题

2019-10-30
bug:session id 生成方式有错误，集群环境下会出现重复值，需转成uuid
bug:直接绑定事务代理方法不正确，因为可能存在其它切面的情况，需要修改代理方法

2019-10-6
上传后图出问题,ok
访问action时需要登录的情况，这个时候应该跳回到登录前页面，而不是action,ok

异常信息处理

2019-10-12
response writetoclient headers 需要检查代码

2019-11-17
transactionproxy dodatabase 方法需要修改，事务用完后需要从transactionmanager删除

2019-11-25
instances配置，当模块路径不存在时报错

2019-11-27
当请求路径不在路由列表时，过滤器不执行

2019-12-2
如果static_path下不存在某个路径，则报错

2019-12-8
多个应用部署时，redis存在 cache name相同的问题

2019-12-11
安全相关数据为空时，报错

2019-12-16
路由方法名与namespace一致时报错

2019-12-18
处理重复请求过滤

2019-12-28
嵌套事务时，a 调用b，如果b抛出异常，而a进行了捕获，则不会进行回滚，noomi这块没有处理

2020-4-27
safari使用redis，压缩缓存，会导致不能解析

2020-5-31
fetch处理问题，httprequest 处理数据
修复路由路径存在包含问题的bug