/**
 * AOP 工厂
 */
class AopFactory {
    /**
     * 添加切面
     */
    static addAspect(cfg) {
        if (this.aspects.has(cfg.class)) {
            throw "该class已经在切面中存在";
        }
        //切点
        if (cfg.points && cfg.points.length > 0) {
            cfg.points.forEach((p) => {
                this.points.set(p.id, p);
            });
        }
        //连接点
        if (cfg.aops && cfg.aops.length > 0) {
        }
    }
    /**
     * 添加切点
     */
    static addPoint() {
    }
    /**
     * 获取切点
     * @param className     类名
     * @param method        方法名
     */
    static getPoint(className, method) {
    }
    /**
     * 解析文件
     * @param path          文件路径
     */
    static parseFile(path) {
    }
}
AopFactory.aspects = new Map();
AopFactory.points = new Map();
//# sourceMappingURL=aopfactory.js.map