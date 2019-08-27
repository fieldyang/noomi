/**
 * AOP 工厂
 */

 /**
  * aop 切点
  */
interface AopPoint{
    id:string;
    expression:string;
}

/**
 * 连接点
 */
interface Aop{
    pointid:string;
    type:string;
    method:string;
}

/**
 * 切面
 */
interface AopAspect{
    class:string;
    //切点
    points:Array<AopPoint>;
    //连接点
    aops:Array<Aop>;
}



class AopFactory{
    static aspects:any = new Map();
    static points:any = new Map();
    /**
     * 添加切面
     */
    static addAspect(cfg:AopAspect){
        if(this.aspects.has(cfg.class)){
            throw "该class已经在切面中存在"; 
        }

        //切点
        if(cfg.points && cfg.points.length>0){
            cfg.points.forEach((p)=>{
                this.points.set(p.id,p);
            });
        }

        //连接点
        if(cfg.aops && cfg.aops.length>0){
            
        }
        
    }

    /**
     * 添加切点
     */
    static addPoint(){

    }

    /**
     * 获取切点
     * @param className     类名
     * @param method        方法名
     */
    static getPoint(className:string,method:string){

    }

    /**
     * 解析文件
     * @param path          文件路径 
     */
    static parseFile(path:string){

    }

    
}