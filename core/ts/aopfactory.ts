
/**
 * AOP 工厂
 */

/**
 * 连接点
 */
interface Aop{
    //切点
    pointcut_id:string;
    //类型 (before,after,return,throw,around)
    type:string;
    //切面对应的方法
    method:string;
    //切面对应的类名
    class:string; 
}

/**
 * 切面
 */
interface AopAspect{
    class:string;
    //切点
    pointcuts:Array<AopPointcut>;
    //连接点
    aops:Array<Aop>;
}

 /**
  * aop 切点
  */
class AopPointcut{
    id:string;
    //表达式数组（正则表达式）
    expressions:Array<RegExp> = [];
    aops:Array<Aop>;

    constructor(id:string,expressions:Array<string>){
        this.id = id;
        if(expressions && expressions.length > 0){
            throw "pointcut的expressions参数配置错误";
        }
        expressions.forEach((item)=>{
            if(typeof item !== 'string'){
                throw "pointcut的expressions参数配置错误";
            }
            // 转字符串为正则表达式并加入到数组
            this.expressions.push(new RegExp(item));
        });
    }
    /**
     * 匹配方法是否满足表达式
     * @param className     类名，可选
     * @param methodName    待检测方法 
     * @return              true/false
     */
    match(className:string,methodName:string):boolean{
        for(let i=0;i<this.expressions.length;i++){
            if(this.expressions[i].test(className + '.' + methodName)){
                return true;
            }
        }
        return false;
    }

    /**
     * 添加连接点
     * @param aop 
     */
    addAop(aop:Aop){
        this.aops.push(aop);
    }
}



class AopFactory{
    static aspects:any = new Map();
    static pointcuts:any = new Map();
    /**
     * 添加切面
     */
    static addAspect(cfg:AopAspect){
        if(this.aspects.has(cfg.class)){
            throw "该class已经在切面中存在"; 
        }
        //连接点
        if(cfg.aops && cfg.aops.length>0){
            cfg.aops.forEach((item)=>{
                if(!this.pointcuts.has(item.pointcut_id)){
                    throw "pointcut不存在";
                }
                //设置类名
                item.class = cfg.class;
                //添加到pointcut的aop数组(是否需要重复检测，待考虑)
                this.pointcuts.get(item.pointcut_id).addJoint(item);
            });
        }
        this.aspects.set(cfg.class,cfg);
    }

    /**
     * 添加切点
     * @param id            切点id 
     * @param expressions   方法匹配表达式数组
     */
    static addPointcut(id:string,expressions:Array<string>){
        //切点
        if(this.pointcuts.has(id)){
            throw "pointcut id重复定义";
        }
        this.pointcuts.set(id,new AopPointcut(id,expressions));

    }

    /**
     * 解析文件
     * @param path          文件路径 
     */
    static parseFile(path:string){
        //切点json数据
        interface PointcutJson{
            id:string;
            expressions:Array<string>;
        }
        //数据json
        interface DataJson{
            files:Array<string>;            //引入文件
            pointcuts:Array<PointcutJson>;   //切点
            aspects:Array<AopAspect>;       //切面
        }
        

        const fs = require("fs");
        
        //读取文件
        let jsonStr:string = fs.readFileSync(new URL("file://" + path),'utf-8');
        let json:DataJson = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw "实例文件配置错误"!
        }

        if(json.pointcuts && json.pointcuts.length>0){
            json.pointcuts.forEach((item:PointcutJson)=>{
                this.addPointcut(item.id,item.expressions);
            });
        }
    }

    /**
     * 获取切点
     * @param className     类名 
     * @param methodName    方法名
     */
    static getPointcut(className:string,methodName:string):AopPointcut{
        // 遍历iterator
        let ite = this.pointcuts.values();
        for(let p of ite){
            if(p.match(className,methodName)){
                return p; 
            }
        }
        return null;
    }

    /**
     * 执行方法
     * @param className     类名
     * @param methodName    方法名
     * @return              {
     *                          before:[{class:切面类,method:切面方法},...]
     *                          after:[{class:切面类,method:切面方法},...]
     *                          return:[{class:切面类,method:切面方法},...]
     *                          throw:[{class:切面类,method:切面方法},...]
     *                      }
     */
    static getAops(className:string,methodName:string):object{
        let pointcut = this.getPointcut(className,methodName);
        if(pointcut === null){
            return null;
        }

        let beforeArr:Array<object> = [];
        let afterArr:Array<object> = [];
        let throwArr:Array<object> = [];
        let returnArr:Array<object> = [];

        pointcut.aops.forEach(aop=>{
            switch(aop.type){
                case 'before':
                    beforeArr.push({
                        class:aop.class,
                        method:aop.method
                    });
                    return;
                case 'after':
                    afterArr.push({
                        class:aop.class,
                        method:aop.method
                    });
                    return;
                case 'around':
                    beforeArr.push({
                        class:aop.class,
                        method:aop.method
                    });
                    afterArr.push({
                        class:aop.class,
                        method:aop.method
                    });
                    return;
                case 'return':
                    returnArr.push({
                        class:aop.class,
                        method:aop.method
                    });
                    return;
                case 'throw':
                    throwArr.push({
                        class:aop.class,
                        method:aop.method
                    });
            }
        });
        return {
            before:beforeArr,
            after:afterArr,
            throw:throwArr,
            return:returnArr
        }
    }
}

export{AopFactory};