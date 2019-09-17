class LogAdvice{
    before(){
        console.log("前置通知",arguments);
    }

    after(){
        console.log("后置通知",arguments);
    }

    around(){
        console.log("环绕通知",arguments);
    }

    throw(){
        console.log("异常通知",arguments);
    }

    afterReturn(args){
        console.log("返回通知",arguments);
    }
}

export {LogAdvice};