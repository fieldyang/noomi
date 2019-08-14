/**
 * 测试用户
 */
class UserQuery{
    
    /**
     * 获取用户信息
     */
    getInfo(){
        return {
            success:true,
            result:{
                userId:1,
                userName:'yang'
            }
        }
    }
}

export{UserQuery};