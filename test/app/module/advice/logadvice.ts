import { Instance } from "../../../../core/ts/decorator";

@Instance({
    name:'logAdvice'
})
class LogAdvice{
    before(){
        console.log("配置前置通知",arguments);
    }

    after(){
        console.log("配置后置通知",arguments);
    }

    around(){
        console.log("配置环绕通知",arguments);
    }

    throw(){
        console.log("配置异常通知",arguments);
    }

    afterReturn(args){
        console.log("配置返回通知",arguments);
    }
}

export {LogAdvice};