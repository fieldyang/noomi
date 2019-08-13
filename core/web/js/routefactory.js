/**
 * route 管理
 */
import { InstanceFactory } from "./instancefactory";
console.log(InstanceFactory);
class RouteFactory {
    /**
     * 添加路由
     * @param path      路由路径，支持通配符*，需要method支持
     * @param clazz     对应类
     * @param method    方法，支持{n}
     */
    static addRoute(path, clazz, method) {
        //替换*
        let path1 = path.replace(/\*/g, ".*");
        this.routes.push({
            path: path,
            reg: new RegExp(path1),
            className: clazz.trim(),
            method: method.trim()
        });
    }
    /**
     * 处理路径
     * @param path      路径
     * @param params    调用参数
     */
    static handleRoute(path, params) {
        path = path.trim();
        let isMatch = false;
        let instance = null;
        let method = "";
        for (let i = 0; i < this.routes.length; i++) {
            let item = this.routes[i];
            //路径测试通过
            if (item.reg.test(path)) {
                method = item.method;
                let index = item.path.indexOf("*");
                //通配符处理
                if (index !== -1) {
                    //*通配符方法
                    method = path.substr(index - 1);
                }
                //看是否存在对应的类和方法，如果存在，置找到标志
                //从工厂找到实例
                instance = InstanceFactory.getInstance(item.className);
                if (instance === undefined) {
                    throw "未找到实例，请检查实例配置文件";
                }
                if (instance[method] !== undefined && instance[method].constructor === 'function') {
                    //设置找到标志
                    isMatch = true;
                }
                break;
            }
        }
        //未找到，跳转到404
        if (!isMatch) {
            throw "http:404";
        }
        else {
            return new Promise((resolve, reject) => {
                try {
                    //调用方法
                    let re = instance[method].call(null, params);
                    resolve(re);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
    }
}
export { RouteFactory };
// }
//# sourceMappingURL=routefactory.js.map