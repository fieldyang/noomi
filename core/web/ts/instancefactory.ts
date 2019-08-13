/**
 * 实例工厂
 */
// namespace noomispace{
    interface Argument{
        index:number;   //参数索引
        value:any;      //参数置
    }
    interface InstanceCfg{
        name:string;            //实例名
        className:string;       //类名
        args:Array<Argument>;   //参数列表
    }
    
    class InstanceFactory{
        static factory:any = new Map();
        /**
         * 添加单例到工厂
         * @param cfg 实例配置
         */
        static addInstance(cfg:InstanceCfg){
            if(this.factory.has(cfg.name)){
                throw "该实例名已存在";
            }
            this.factory.set(cfg.className,Reflect.construct(eval(cfg.className),cfg.args)); 
        }

        /**
         * 获取实例
         * @param name 类名  
         */
        static getInstance(name:string){
            
            let fs = require("fs");
            if(!this.factory.has(name)){
                throw "实例不存在";
            }

            return this.factory.get(name);
        }

        /**
         * 解析实例配置文件
         * @param path 文件路径
         */
        static parseCtx(path:string){
            interface InstanceJSON{
                files:Array<string>;        //引入文件
                instances:Array<any>;       //实例配置数组
            }

            const fs = require("fs");
        
            //读取文件
            let jsonStr:string = fs.readFileSync(new URL("file://" + path),'utf-8');
            let json:InstanceJSON = null;
            try{
                json = JSON.parse(jsonStr);
            }catch(e){
                throw "实例文件配置错误"!
            }

            if(json.files !== undefined && json.files.length>0){
                json.files.forEach((item)=>{
                    this.parseCtx(item);
                });
            }

            if(json.instances && json.instances.length>0){
                json.instances.forEach((item)=>{
                    this.addInstance(item);
                });
            }
        }
    }

    export {InstanceFactory};
// }