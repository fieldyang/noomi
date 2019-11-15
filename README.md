# 项目名
noomi
# 介绍
一个基于node的企业级框架，基于typescript开发，支持路由、过滤器、IoC、Aop、事务及嵌套、安全框架、缓存、集群。
# 用法
## 起步
所有实例在vscode下执行，其它ide工具请相应调整。
### 安装
npm install noomi -g  
npm install noomi  
npm install noomi --save
### 项目初始化
创建noomi目录,切换到根目录
#### vs启动配置
创建.vscode目录，/.vscode
新建launch.json文件，内容如下：
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program":"${file}",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "sourceMaps": true,
            "outFiles": [
                "${workspaceFolder}/**/*.js"
            ],
            "cwd": "${workspaceRoot}"
        }
    ]
}
```
#### typescript配置文件
在项目根目录新建tsconfig.json文件,内容如下：
```
{
  "compilerOptions": {
    "module":"commonjs",
    "target": "es2017",
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir":"./dist/module"
  },
  "include":[
    "**/*.ts"
  ],
}
```
### 示例1-hello world
#### Noomi项目配置文件
项目根目录下新建config目录,新建noomi.json（名字不可变）文件,内容如下：
```
{
    "instance":{
        "instances":["dist/module/**/*.js"]
    }
}
```
#### 模块编写
项目根目录下新建module目录,新建app.ts文件，内容如下：
```
import { noomi } from "noomitest";
noomi(3000);
```
新建目录route，/module/route，新建文件hello.ts，内容如下：
```
import { Router, Route} from "noomi";
@Router()
export class Hello{
    @Route('/hello')
    sayHello(){
        return 'hello world!';
    }
}
```
#### 执行和测试
切换到app.js文件，按F5执行
切换到浏览器，输入localhost:3000/hello，浏览器显示hello world!
### 示例2-IoC
为hello增加一个大写转换器。
切换到module目录，新建/service目录，/module/service,
新建文件charchange.ts，内容如下：
```
import { Instance } from "noomi";
@Instance({name:'charChange'})
export class CharChange{
    toUpper(src:string){
        return src.toUpperCase();
    }
}
```
修改hello.ts文件，完整内容如下：
```
import { Router, Route, Inject} from "noomi";
import { CharChange } from "../service/charchange";
@Router()
export class Hello{
    //注入
    @Inject('charChange')
    charChange:CharChange;
    @Route('/hello')
    sayHello(){
        return this.charChange.toUpper('hello world!');
    }
}
```
切换到浏览器，输入localhost:3000/hello，输出变大写, ，浏览器显示HELLO WORLD!
### 示例3-Aop
为业务方法增加aop拦截
在module目录下增加aop目录，/module/aop。
新建logadvice.ts文件，内容如下：
```
import { Aspect, Pointcut, Before, Around, AfterThrow, After, AfterReturn, Instance } from "noomi";
@Instance({
    name:'logAdvice'
})
@Aspect()
export class LogAdvice{
    @Pointcut(["charChange.*"])
    testPointcut(){}

    @Before("testPointcut()")
    before(){
        let o = arguments[0];
        console.log(`前置通知:"实例名:${o.instanceName};方法名:${o.methodName};参数:${o.params}`);
    }
    @After("testPointcut()")
    after(){
        console.log("注释后置通知",arguments[0].methodName);
    }

    @Around("testPointcut()")
    around(){
        console.log("注释环绕通知",arguments[0].methodName);
    }

    @AfterThrow("testPointcut()")
    afterThrow(){
        console.log("注释异常通知",arguments[0].methodName);
    }

    @AfterReturn("testPointcut()")
    afterReturn(args){
        console.log("只是返回通知",arguments[0].methodName);
    }
}
```
切换到浏览器，输入localhost:3000/hello，控制台输出如下：
```
前置通知:"实例名:charChange;方法名:toUpper;参数:hello world! 
logadvice.ts:13
注释环绕通知 toUpper 
logadvice.ts:22
只是返回通知 toUpper 
logadvice.ts:32
注释后置通知 toUpper 
logadvice.ts:17
注释环绕通知 toUpper
```
### 示例4-数据库操作
以mysql为例.
创建数据库 noomi
```
create database noomi default character set ‘utf8’;
```
切换数据库
```
use noomi;
```
创建表
```
create table t_user(
   id int(11) not null auto_increment,
	name varchar(32),
	age int(11),
	mobile char(11),
	primary key(id)
);
```
修改config/noomi.json文件，增加数据源配置，完整配置如下：
```
{
    "instance":{
        "instances":["dist/module/**/*.js"]
    },
    "database":{
        "product":"mysql",
        "use_pool":true,
        "options":{
            "host":"localhost",
            "port":3306,
            "user":"root",
            "password":"your password",
            "database":"noomi",
            "connectionLimit":10
        }
    }
}
```
在module/route 目录下增加useraction.ts文件，代码如下：
```
import { BaseAction, Router, Inject } from "noomi";
import { UserService } from "../service/userservice";
@Router({
    namespace:'/user',
    path:'/'
})
export class UserAction extends BaseAction{
    @Inject('userService')
    userService:UserService;

    async add(){
        try{
            let r = await this.userService.addUser(this.model.name,this.model.age,this.model.mobile);
            return {success:true,result:{id:r}}
        }catch(e){
            return {success:false,msg:e};
        }
    }
}
```
在module/service目录下增加userservice.ts文件，代码如下：
```
import { getConnection, Instance } from "noomi";
@Instance('userService')
export class UserService{
    async addUser(name:string,age:string,mobile:string):Promise<number>{
        let conn:any = await getConnection();
        let r:any = await new Promise((resolve,reject)=>{
            conn.query('insert into t_user(name,age,mobile) values(?,?,?)',
            [name,age,mobile],
            (err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
                closeConnection(conn);
            });
        });
        return r.insertId;
    }
}
```
切换到浏览器，输入http://localhost:3000/user/add?name=noomi&age=1&mobile=13808080808  
得到返回内容  
{"success":true,"result":{"id":1}}  
查看数据库t_user表，查看数据是否已经加入。
### 示例5-事务（嵌套）
在config/noomi.json的database项中增加事务配置，完整配置文件如下：
```
{
    "instance":{
        "instances":["dist/module/**/*.js"]
    },
    "database":{
        "product":"mysql",
        "use_pool":true,
        "options":{
            "host":"localhost",
            "port":3306,
            "user":"root",
            "password":"field",
            "database":"noomi",
            "connectionLimit":10
        },
        "transaction":{}
    }
}
```
在route/useraction.ts下增加addtwo方法，完整代码如下：
```
import { BaseAction, Router, Inject } from "noomi";
import { UserService } from "../service/userservice";
@Router({
    namespace:'/user',
    path:'/'
})
export class UserAction extends BaseAction{
    @Inject('userService')
    userService:UserService;
    async add(){
        try{
            let r = await this.userService.addUser(
                this.model.name,
                this.model.age,
                this.model.mobile
            );
            return {success:true,result:{id:r}}
        }catch(e){
            return {success:false,msg:e};
        }
    }
    async addtwo(){
        try{
            let r = await this.userService.addTwoUser(
                this.model.id,
                this.model.name,
                this.model.age,
                this.model.mobile
            );
            return {success:true,result:{id:r}}
        }catch(e){
            return {success:false,msg:e};
        }
    }
}
```
在module/service/userservice.ts文件中增加addUserWithId和addTwoUser方法，完整代码如下：
```
import { getConnection, Instance, Transactioner, closeConnection } from "noomi";
//Transactioner注解器把UserService类的所有方法注册为事务方法
@Transactioner()
@Instance('userService')
export class UserService{
    async addUser(
        name:string,
        age:string,
        mobile:string):Promise<number>{
        let conn:any = await getConnection();
        let r:any = await new Promise((resolve,reject)=>{
            conn.query('insert into t_user(name,age,mobile) values(?,?,?)',
            [name,age,mobile],
            (err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
        return r.insertId;
    }
    async addUserWithId(
        id:string,
        name:string,
        age:string,
        mobile:string):Promise<number>{
        let conn:any = await getConnection();
        let r:any = await new Promise((resolve,reject)=>{
            conn.query('insert into t_user(id,name,age,mobile) values(?,?,?,?)',
            [id,name,age,mobile],
            (err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
        return r.insertId;
    }
    async addTwoUser(id:string,
        name:string,
        age:string,
        mobile:string):Promise<any>{
        //如果传入的主键id在数据表中已经存在，则会回滚事务，
        // 否则添加两条name age mobile相同，id不同的数据记录
        await this.addUser(name,age,mobile);
        await this.addUserWithId(id,name,age,mobile);
    }
}
```
切换到浏览器，输入网址：http://localhost:3000/user/addtwo?id=5&name=nodom&age=3&mobile=13800000000  
***当t_user表中有id为5的数据记录时，一条记录都不会加入，否则会增加两条记录。***

## 使用说明
***备注:参数为[]时，代表可选参数***
### 缓存Ncache
使用Ncache时，首先将创建Ncache管理器。
```
const cache = new NCache([cfg])
```
+ cfg:CacheCfg
  - saveType <number>为0表示存在内存，为1表示存在redis中   
  - name <string> 缓存空间名称  
  - [redis] <string> redis名称  
  - [maxSize]<number> 最大空间，默认为0，saveType为1时设置无效  

# 版权

# 贡献者
1. 杨雷 email:fieldyang@163.com  git:https://github.com/fieldyang
2. 唐榜 email:244750596@qq.com   git:https://github.com/Tang1227

