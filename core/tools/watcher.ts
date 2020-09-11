import { App } from "./application";
import { FSWatcher, fstat, Dirent } from "fs";
import { StaticResource } from "../web/staticresource";
import { WebCache } from "../web/webcache";
import { Util } from "./util";
import { InstanceFactory } from "../main/instancefactory";

/**
 * file watch 类
 * 用于监测 静态文件或instance(动态)文件的改变
 * 静态文件改变后会更新web cache
 * instance文件改变后，更新实例工厂，仅对“@Instance”装饰器有效
 * 监听类型包括
 * 
 */
export enum EWatcherType{
    STATIC = 1,
    DYNAMIC = 2
}
export class Watcher {
    /**
     * 监听目录map，键为路径，值为类型，类型包括static(静态)和dynamic(动态)
     */
    static directoryMap:Map<string,EWatcherType> = new Map();

    /**
     * 监听文件map，键为路径，值为类型，类型包括static(静态)和dynamic(动态)
     */
    static fileMap:Map<string,EWatcherType> = new Map();

    /**
     * watcher实例map，键为路径，值为watcher实例
     */
    static watcherMap:Map<string,FSWatcher> = new Map();

    /**
     * 添加监听目录
     * @param path      目录路径
     * @param type      类型
     */
    static addDir(path:string,type:EWatcherType){
        if(this.watcherMap.has(path)){
            return;
        }
        this.directoryMap.set(path,type);
        switch(type){
            case EWatcherType.STATIC:
                this.watchStatic(path);
                break;
            case EWatcherType.DYNAMIC:
                this.watchDynamic(path);
                break;
        }
    }

    /**
     * 添加监听文件
     * @param path      文件路径
     * @param type      类型
     */
    static addFile(path:string,type:EWatcherType){
        this.fileMap.set(path,type);
        // this.watcher();
    }

    /**
     * 删除监听目录
     * @param path      目录路径
     */
    static removeDir(path:string){
        this.directoryMap.delete(path);
        App.fs.unwatchFile(path);
    }

    /**
     * 删除监听文件
     * @param path      文件路径
     */
    static removeFile(path:string){
        this.fileMap.delete(path);
        App.fs.unwatchFile(path);
    }

    /**
     * 开启监听
     */
    static watcher(){
        //已监听的不再监听
        for(let v of this.directoryMap){
            if(this.watcherMap.has(v[0])){
                continue;
            }
            this.watcherMap.set(v[0],
                App.fs.watch(v[0],{recursive:true},async (eventType,fileName)=>{
                    //文件不存在或监听类型为rename，则返回
                    if(!fileName || eventType === 'rename'){
                        return;
                    }
                    let path:string = App.path.resolve(v[0] ,fileName);
                    switch(v[1]){
                        case EWatcherType.STATIC:   //静态文件
                            
                        case EWatcherType.DYNAMIC:  //动态文件
                            
                            break;
                    }
                })
            );
        }

        for(let v of this.fileMap){
            //已监听的不再监听
            if(this.fileMap.has(v[0])){
                continue;
            }
        }
        
    }
    /**
     * 监听静态目录
     * @param path  目录路径
     */
    private static async watchStatic(path:string){
        try{
            App.fs.watch(path,{recursive:true},async (eventType,fileName)=>{
                //文件不存在或监听类型为rename，则返回
                if(!fileName || eventType === 'rename'){
                    return;
                }
                let path1:string = App.path.resolve(path ,fileName);
                await this.handleStaticRes(path1);
            });    
        }catch(e){  //不支持递归，则需要处理所有子孙目录
            App.fs.watch(path,async (eventType,fileName)=>{
                //文件不存在或监听类型为rename，则返回
                if(!fileName || eventType === 'rename'){
                    return;
                }
                let path1:string = App.path.resolve(path ,fileName);
                await this.handleStaticRes(path1);
            });

            const dir = App.fs.readdirSync(path,{withFileTypes:true});
            for (let dirent of dir) {
                if(!dirent.isDirectory()){
                    continue;
                }
                //处理子目录
                this.addDir(App.path.resolve(path,dirent.name),EWatcherType.STATIC);
            }
        }
    }

    /**
     * 监听动态目录
     * @param path  路径
     */
    private static watchDynamic(path:string){
        App.fs.watch(path,async (eventType,fileName)=>{
            //文件不存在或不为js文件则返回
            if(!fileName || !fileName.endsWith('.js')){
                return;
            }
            let path1:string = App.path.resolve(path ,fileName);
            //删除require 该模块缓存
            delete require.cache[path1];
            //加载模块
            require(path1);
        });
    }

    /**
     * 处理单个静态目录
     * @param path 
     */
    private static async handleStaticRes(path:string){
        let url:string = Util.getRelPath(path);
        let obj = await WebCache.getCacheData(url);
        
        //如果缓存该文件，则需要加入缓存
        if(obj && (obj.data || obj.zipData)){
            let zip;
            if(obj.zipData){
                zip = 'gzip';
            }
            let data = await StaticResource.readFile(path,zip);
            WebCache.add(url,data);
        }
    }
}