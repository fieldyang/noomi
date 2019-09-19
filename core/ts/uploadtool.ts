import { IncomingMessage } from "http";
import { fileURLToPath } from "url";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";

/**
 * 上传工具
 */
class UploadTool{
    static tmpDir:string = 'upload/tmp';        //临时上传路径
    static singleUploadSize:number = 10000000;  //必须启用单个文件上传的文件大小
    static maxSize:number = 10000000;           //最大上传文件大小
    static buffInFileSize:number = 10000000;    //缓存到文件的上传内容大小
    static init(cfg:any){
        if(cfg['upload_tmp_dir']){
            this.tmpDir = cfg['upload_tmp_dir'];
        }

        if(cfg['single_upload_size']){
            this.singleUploadSize = cfg['single_upload_size'];
        }

        if(cfg['max_size']){
            this.maxSize = cfg['max_size'];
        }
    }

    /**
     * 上传文件
     * @param req 
     */
    static upload(req:IncomingMessage){
        if(parseInt(req.headers['content-length']) > this.maxSize){
            throw "上传文件大小超出限制";
        }
        return new Promise((resolve,reject)=>{
            let chunks:Array<Buffer> = [];
            let num:number = 0;
            //数据项分割位置
            let dispositions:Array<number> = [];
            //行结束位置
            let rowEnds:Array<number> = [];
            //缓存文件路径
            const fsMdl = require('fs');
            const pathMdl = require('path');
            const uuidMdl = require('node-uuid');
            
            //文件路径
            let filePath:string = pathMdl.resolve(process.cwd(),this.tmpDir,uuidMdl.v1());
            let fileHandler:number = fsMdl.openSync(filePath,'a');
            
            let dataKey:string;
            let value:any = {
                filePath:fileURLToPath
            };
            req.on("data",chunk=>{
                //缓存到文件
                if(fileHandler !== 0){
                    fsMdl.writeSync(fileHandler,chunk,num);
                }
                //第一组数据，含文件信息
                if(!value.fileName){
                    let paramInd = chunk.indexOf('Content-Disposition');
                    //找到行结束标志
                    for (let i = 0; i < chunk.length-1; i++) {
                        if (chunk[i]==13&&chunk[i+1]==10) {
                            rowEnds.push(i);
                        }
                        if(rowEnds.length === 4){
                            break;
                        }
                    }
                    //文件参数处理
                    for(let i=0;i<rowEnds.length;i++){
                        if(paramInd < rowEnds[i]){
                            let tmpStr:string = chunk.readUIntBE(paramInd,rowEnds[i]).toString();
                            let arr:Array<string> = tmpStr.split(';');
                            //数据项
                            dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                            dataKey = dataKey.substring(1,dataKey.length-1);
                            let a1 = arr[2].split('=');
                            let fn = a1[1].trim();
                            //文件名
                            value.fileName = fn.substring(1,fn.length-1);
                            //文件类型
                            tmpStr = chunk.readUIntBE(rowEnds[i]+2,rowEnds[i+1]-1).toString();
                            value.fileType = tmpStr.substr(tmpStr.indexOf(':')).trim();
                            //写文件
                            fsMdl.writeSync(fileHandler,chunk.readUIntBE(rowEnds[i+2]+1,chunk.length-rowEnds[i+2]-1));
                            break;
                        }
                    }
                }else{  //直接开始写文件
                    fsMdl.writeSync(fileHandler,chunk);
                }
            });
            //数据传输结束
            req.on("end",()=>{
                let obj = {};
                obj[dataKey] = value;
                resolve(obj);
            });

            req.on('error',err=>{

            });
        });
    }
    /**
     * 处理上传
     * @param req   request
     * @return      文件对象{inputname:{path:临时存储路径,fileName:文件名,fileType:文件mime}}
     */
    static formData(req:IncomingMessage):Promise<any>{
        if(parseInt(req.headers['content-length']) > this.maxSize){
            throw "上传文件大小超出限制";
        }

        return new Promise((resolve,reject)=>{
            let chunks:Array<Buffer> = [];
            let num:number = 0;
            //数据项分割位置
            let dispositions:Array<number> = [];
            //行结束位置
            let rowEnds:Array<number> = [];
            //缓存文件路径
            let buffFilePath:string;
            let fileHandler:number = 0;
            const fsMdl = require('fs');
            const pathMdl = require('path');
            const uuidMdl = require('node-uuid');
            if(parseInt(req.headers['content-length'])>10000000){
                buffFilePath = pathMdl.resolve(process.cwd(),this.tmpDir,uuidMdl.v1());
                fileHandler = fsMdl.openSync(buffFilePath,'a');
            }

            req.on("data",chunk=>{
                //缓存到文件
                if(fileHandler !== 0){
                    fsMdl.writeSync(fileHandler,chunk,num);
                }
                //缓存到数组
                chunks.push(chunk);
                num+=chunk.length;
                let ind = -1;
                //数据项分隔符
                //如果上传内容存在 Content-Disposition 字符串，需要处理，先略过
                if((ind = chunk.indexOf('Content-Disposition')) !== -1){
                    dispositions.push(ind);
                }
                //找到行结束标志
                for (let i = 0; i < chunk.length-1; i++) {
                    if (chunk[i]==13&&chunk[i+1]==10) {
                        rowEnds.push(i);
                    }
                }
            });
            //数据传输结束
            req.on("end",()=>{
                let returnObj:any = {};
                //从缓存文件
                let buffer=Buffer.concat(chunks,num);
                for(let i=0;i<dispositions.length;i++){
                    let st:number = dispositions[i];
                    let jIndex:number = 0;      //rowEnds 的开始对比序号
                    let dataKey:string;         //键
                    for(let j=jIndex;j<rowEnds.length;j++){
                        //分隔符行
                        if(rowEnds[j] > st){
                            let tmpStr:string = buffer.readUIntBE(st,rowEnds[j]).toString();
                            let arr:Array<string> = tmpStr.split(';');
                            //数据项
                            dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                            dataKey = dataKey.substring(1,dataKey.length-1);
                            let value:any;
                            if(arr.length === 3 && arr[2].includes('filename=')){  //文件判断
                                //处理filename
                                let value:any = {};
                                let a1 = arr[2].split('=');
                                let fn = a1[1].trim();
                                value.fileName = fn.substring(1,fn.length-1);
                                //文件类型
                                tmpStr = buffer.readUIntBE(rowEnds[j]+2,rowEnds[j+1]-1).toString();
                                value.fileType = tmpStr.substr(tmpStr.indexOf(':')).trim();
                                //文件内容
                                fn = pathMdl.resolve(process.cwd(),this.tmpDir,uuidMdl.v1());
                                value.filePath = fn;
                                let length:number = j<rowEnds.length-3?rowEnds[j+3]-1:buffer.length;
                                //写文件
                                fsMdl.writeSync(fn,buffer.readUIntBE(rowEnds[j+2]+1,rowEnds[j+3]-1));
                                //修改jindex
                                jIndex = j+3;
                            }else{  //普通数据项
                                value = buffer.readUIntBE(rowEnds[j+1],rowEnds[j+2]-1).toString().trim();
                                jIndex = j+2;
                            }
                            //值转换为数组
                            if(returnObj.hasOwnProperty(dataKey)){
                                //新建数组
                                if(!Array.isArray(returnObj[dataKey])){
                                    returnObj[dataKey] = [returnObj[dataKey]];
                                }
                                //新值入数组
                                returnObj[dataKey].push(value);
                            }else{
                                returnObj[dataKey] = value;
                            }
                            break;
                        }
                    }
                }
                resolve(returnObj);
            });

            req.on('error',err=>{

            });
        });
        
    }

    
}

export {UploadTool}