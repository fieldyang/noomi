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
    

    /**
     * 处理buffer
     * @param buffer 
     */
    static handleBuffer(buffer:Buffer):any{
        let reg:RegExp = /\nContent-Disposition/g;
        let reg1:RegExp = /\r\n/g;
        // let buffStr = buffer.toString('binary');
        let re:RegExpExecArray;
        let dataKey:string;
        let returnObj:any = {};
        let disponsitions:Array<number> = [];
        let rowEnds:Array<number> = [];
        let dispStr = '\nContent-Disposition';
        let ind = 0;
        while((ind=buffer.indexOf(dispStr,ind)) !== -1){
            disponsitions.push(ind);
            ind += dispStr.length+1;
        }
        
        for(let ii=0;ii<disponsitions.length;ii++){
            let st = disponsitions[ii]+1;
            let len = ii<disponsitions.length-1?disponsitions[ii+1]:buffer.length - 1;
            ind = buffer.indexOf('\r\n',st+10)
            //第一行分隔符
            let firstStr:string = buffer.toString('utf8',st,ind);  
            let arr:Array<string> = firstStr.split(';');  
            //数据项
            dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
            dataKey = dataKey.substring(2,dataKey.length);
            let value:any;
            //第二行，文件Content-type开头，字段为空
            st = ind+2;
            ind = buffer.indexOf('\r\n',st);

            let secondStr:string = buffer.toString('utf8',st,ind);
            //第三行，文件为空，字段为value
            st = ind+2;
            ind = buffer.indexOf('\r\n',st);
            let thirdStr:string = buffer.toString('utf8',st,ind);
            if(arr.length === 2){  //普通字段
                value = thirdStr.trim();
            }else if(arr.length === 3){ //文件
                value = {};
                let a1 = arr[2].split('=');
                let fn = a1[1].trim();
                //文件名
                if(fn.length>2){
                    const fsMdl = require('fs');
                    const pathMdl = require('path');
                    const uuidMdl = require('uuid');
                    
                    value.fileName = fn.substring(1,fn.length);
                    //文件类型
                    value.fileType = secondStr.substr(secondStr.indexOf(':')).trim();
                    //文件路径
                    let filePath:string = pathMdl.resolve(process.cwd(),UploadTool.tmpDir,uuidMdl.v1().replace(/\-/g,''));
                    value.path = filePath;
                    st = ind+2;
                    let endFile = 0;
                    let et = ii<disponsitions.length-1?disponsitions[ii+1]-2:buffer.length-1;
                    //找文件结尾
                    for(let j=et;j>0;j--){
                        //找到 -----WebKitFormBoundary2xEhUBhl9D9VdlVv 前一行
                        if(this.judgeRowEnd(buffer,j)){
                            endFile = j;
                            break;
                        }
                    }
                    //写文件，图片文件用二进制保存
                    fsMdl.writeFileSync(filePath,buffer.slice(st,endFile),'binary');
                }
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
        }
        return returnObj;
    }

    
    static handleFile(path:string):any{

    }

    /**
     * 判断换行符
     * @param str       字符串
     * @param index     索引号
     */
    /*static judgeRowEnd(str:string,index:number):boolean{
        return str.charAt(index) === '\r' && str.charAt(index+1) === '\n'; 
    }*/
    static judgeRowEnd(buff:Buffer,index:number):boolean{
        return buff[index] === 13 && buff[index + 1] === 10; 
    }
}

export {UploadTool}