
namespace noomispace{
    class RouteHandler{
        static routeArray:object[];
        /**
         * 添加路由
         * @param path      路由路径，支持通配符*，需要method支持
         * @param clazz     对应类
         * @param method    方法，支持{n}
         */
        static addRoute(path:string,clazz:string,method:string){
            //替换*
            let path1 = path.replace(/\*/g,".*");
            this.routeArray.push({
                path:path,
                reg:new RegExp(path1),
                clazz:clazz.trim(),
                method:method.trim()
            });
        }

        /**
         * 处理路径
         * @param path 
         */
        static handleRoute(path:string){
            path = path.trim();
            let isMatch:boolean = false;
            let instance:object = null;
            for(let i=0;i<this.routeArray.length;i++){
                let item = this.routeArray[i];
                //路径测试通过
                if(item.reg.test(path)){
                    let m = item.method;
                    let index = item.path.indexOf("*");
                    //通配符处理
                    if(index !== -1){
                        //*通配符方法
                        m = path.substr(index-1);
                    }
                    //看是否存在对应的类和方法，如果存在，置找到标志
                    //从工厂找到实例
                    
                    //设置找到标志
                    isMatch = true;
                    break;
                }
            }
            //未找到，跳转到404
            if(!isMatch){
                //404
            }else{
                return new Promise((resolve,reject)=>{
                    // 调用方法
                    // let re = call();
                    // resolve(re);
                });
            }
        }
    }
}

