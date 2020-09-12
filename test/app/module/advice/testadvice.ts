import { Aspect, Pointcut, Before, Around, AfterThrow, After, AfterReturn, Instance } from "../../../../core/tools/decorator";

@Aspect()
class TestAdvice{
    @Pointcut(["dataImpl.add$"])
    // @Pointcut([])
    testPointcut(){}

    @Before("testPointcut()")
    before(){
        console.log("注解前置通知，方法名:",arguments[0].methodName);
    }
    @After("testPointcut()")
    after(){
        console.log("注释后置通知，方法名:",arguments[0].methodName);
    }

    @Around("testPointcut()")
    around(){
        console.log("注释环绕通知，方法名:",arguments[0].methodName);
    }

    @AfterThrow("testPointcut()")
    afterThrow(){
        console.log("注释异常通知，方法名:",arguments[0].methodName);
    }

    @AfterReturn("testPointcut()")
    afterReturn(args){
        console.log("注释返回通知，方法名:",arguments[0].methodName);
    }
}

export{TestAdvice}