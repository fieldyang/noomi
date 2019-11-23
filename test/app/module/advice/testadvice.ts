import { Aspect, Pointcut, Before, Around, AfterThrow, After, AfterReturn, Instance } from "../../../../core/tools/decorator";
@Instance({
    name:'testAdvice'
})
@Aspect()
class TestAdvice{
    @Pointcut(["userService.getInfo","dataImpl.*"])
    testPointcut(){}

    @Before("testPointcut()")
    before(){
        console.log("注解前置通知",arguments[0].methodName);
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

export{TestAdvice}