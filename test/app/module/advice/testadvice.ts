import { Aspect, Pointcut, Before, Around, AfterThrow, After, AfterReturn } from "../../../../core/ts/decorator";

@Aspect
class TestAdvice{
    @Pointcut(["userService\\.getInfo"])
    testPointcut(){}

    @Before("testPointcut()")
    before(){
        console.log("注解前置通知",arguments);
    }
    @After("testPointcut()")
    after(){
        console.log("注释后置通知",arguments);
    }

    @Around("testPointcut()")
    around(){
        console.log("注释环绕通知",arguments);
    }

    @AfterThrow("testPointcut()")
    afterThrow(){
        console.log("注释异常通知",arguments);
    }

    @AfterReturn("testPointcut()")
    afterReturn(args){
        console.log("只是返回通知",arguments);
    }
}

export{TestAdvice}