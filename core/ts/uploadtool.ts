import { IncomingMessage } from "http";
import { fileURLToPath } from "url";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";
import { HttpRequest } from "./httprequest";

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
     * @param request 
     */
    static upload(request:HttpRequest){
        if(parseInt(request.headers['content-length']) > this.maxSize){
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
            request.req.on("data",chunk=>{
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
                        if(paramInd < rowEnds[i]+10){
                            let tmpStr:string = chunk.toString('utf8',paramInd,rowEnds[i]);
                            let arr:Array<string> = tmpStr.split(';');
                            //数据项
                            dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                            dataKey = dataKey.substring(2,dataKey.length-1);
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
            request.req.on("end",()=>{
                let obj = {};
                request.setParameter(dataKey,value);
                resolve();
            });

            request.req.on('error',err=>{

            });
        });
    }
    

    
}

export {UploadTool}