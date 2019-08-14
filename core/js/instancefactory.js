class InstanceFactory {
    /**
     * 添加单例到工厂
     * @param cfg 实例配置
     */
    static addInstance(cfg) {
        if (this.factory.has(cfg.name)) {
            throw "该实例名已存在";
        }
        this.factory.set(cfg.className, Reflect.construct(eval(cfg.className), cfg.args));
    }
    /**
     * 获取实例
     * @param name 类名
     */
    static getInstance(name) {
        let fs = require("fs");
        if (!this.factory.has(name)) {
            throw "实例不存在";
        }
        return this.factory.get(name);
    }
    /**
     * 解析实例配置文件
     * @param path 文件路径
     */
    static parseCtx(path) {
        const fs = require("fs");
        //读取文件
        let jsonStr = fs.readFileSync(new URL("file://" + path), 'utf-8');
        let json = null;
        try {
            json = JSON.parse(jsonStr);
        }
        catch (e) {
            throw "实例文件配置错误";
        }
        if (json.files !== undefined && json.files.length > 0) {
            json.files.forEach((item) => {
                this.parseCtx(item);
            });
        }
        if (json.instances && json.instances.length > 0) {
            json.instances.forEach((item) => {
                this.addInstance(item);
            });
        }
    }
}
InstanceFactory.factory = new Map();
export { InstanceFactory };
// }
//# sourceMappingURL=instancefactory.js.map