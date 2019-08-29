class LogAdvice{
    before(args){
        console.log("前置通知");
    }

    after(args){
        console.log("后置通知");
    }

    around(args){
        console.log("环绕通知");
    }

    throw(args){
        console.log("异常通知");
    }

    afterReturn(args){
        console.log("返回通知");
    }
}

export {LogAdvice};