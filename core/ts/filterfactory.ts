import { InstanceFactory } from "./instancefactory";
import { Linker } from "./linker";

interface FilterConfig{
    name:string;
    instanceName:string;
}

interface FilterMapping{
    filterName:string;      //过滤器名
    pattern:any;            //url正则式
}

class FilterFactory{
    static filters:any = new Map();
    static mappings:Array<FilterMapping>=[];

    /**
     * 添加过滤器到工厂
     * @param name          过滤器名
     * @param instanceName  实例名
     */
    static addFilter(name:string,instanceName:string){
        this.filters.set(name,{name:name,instanceName:instanceName});
    }

    /**
     * 添加过滤器映射
     * @param filterName    过滤器名
     * @param urlPattern    url正则式
     */    
    static addMapping(filterName:string,urlPattern:string){
        this.mappings.push({
            filterName:filterName,
            pattern:new RegExp(urlPattern)
        });
    }

    /**
     * 文件解析
     * @param path      filter的json文件
     */
    static parseFile(path:string){
        //切点json数据
        interface FilterJson{
            name:string;
            instance_name:string;
        }
        //数据json
        interface MappingJson{
            filter_name:string;
            url_pattern:string;
        }
        
        interface DataJson{
            filters:Array<FilterJson>;
            mappings:Array<MappingJson>;
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

        if(json.filters && json.filters.length>0){
            json.filters.forEach((item:FilterJson)=>{
                this.addFilter(item.name,item.instance_name);
            });
        }
        if(json.mappings && json.mappings.length>0){
            json.mappings.forEach((item:MappingJson)=>{
                this.addMapping(item.filter_name,item.url_pattern);
            });
        }
    }
    /**
     * 获取过滤器链
     * @param url   url
     * @returns     filter名数组
     */
    static getFilterChain(url:string):Array<string>{
        let arr:Array<any> = [];
        this.mappings.forEach((item:FilterMapping)=>{
            if(item.pattern.test(url)){
                arr.push(item.filterName);
            }
        });
        return arr;
    }

    /**
     * 执行过滤器链
     * @param url 
     * @param request 
     * @param response 
     */
    static doChain(url:string,request:any,response:any):boolean{
        let arr:Array<string> = FilterFactory.getFilterChain(url);
        if(arr.length === 0){
            return true;
        }
        let methods:Array<Function> = [];
        //根据过滤器名找到过滤器实例
        arr.forEach(item=>{
            let filter = InstanceFactory.getInstance(item);
            if(filter !== null && typeof filter.do === 'function'){
                methods.push(filter.do);
            }
        });

        for(let foo of methods){
            if(!foo(request,response)){
                return false;
            }
        }
        return true;
    }
}

export{FilterFactory}