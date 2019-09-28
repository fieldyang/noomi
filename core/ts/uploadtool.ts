import { IncomingMessage } from "http";
import { WriteStream } from "tty";

/**
 * 上传工具
 */
class UploadTool{
    static tmpDir:string = 'upload/tmp';        //临时上传路径
    static maxSize:number = 0;                  //最大上传文件大小
    
    static init(cfg:any){
        if(cfg['upload_tmp_dir']){
            this.tmpDir = cfg['upload_tmp_dir'];
        }

        if(cfg['max_size']){
            this.maxSize = cfg['max_size'];
        }
    }

    /**
     * 处理输入流
     * @param stream 
     */ 
    static formHandle(req:IncomingMessage){
        //不能大于max size
        let contentLen:number = parseInt(req.headers['content-length']);
        if(this.maxSize > 0 && contentLen > UploadTool.maxSize){
            return Promise.reject( "上传内容大小超出限制");
        }

        const fsMdl = require('fs');
        const pathMdl = require('path');
        const uuidMdl = require('uuid');
        
        let dispLineNo:number = 0; //字段分割行号，共三行
        let isFile:boolean = false;         //是否文件字段
        let dataKey:string;                 //字段名
        let value:any;                      //字段值
        let dispLine:Buffer;                //分割线
        let startField:boolean = false;     //新字段开始
        let returnObj:any = {};             //返回对象
        let writeStream:WriteStream;        //输出流
        
        return new Promise((resolve,reject)=>{
            let lData:Buffer;
            let flag = false;
            req.on('data',(chunk)=>{
                if(!flag){
                    flag = true;
                }
                lData = handleBuffer(chunk,lData);
            });
            req.on('end',()=>{
                //最后一行数据
                if(lData){
                    handleLine(lData);
                }
                resolve(returnObj);
            });
        });
        
        /**
         * 处理缓冲区
         * @param buffer        缓冲区 
         * @param lastData      行开始缓冲区
         */
        function handleBuffer(buffer:Buffer,lastData?:Buffer):Buffer{
            let rowStartIndex = 0;  //行开始位置
            let i = 0;
            for(;i<buffer.length;i++){
                let rowChar = '';
                let ind = i;
                if(buffer[i] === 13){
                    if(i<buffer.length-1 && buffer[i+1] === 10){
                        i++;
                        rowChar = '\r\n';
                    }else{
                        rowChar = '\r';
                    }
                }else if(buffer[i] === 10){
                    rowChar = '\n';
                }
                //处理行
                if(rowChar !== ''){
                    let newBuf:Buffer = buffer.subarray(rowStartIndex,ind);
                    if(lastData){
                        newBuf = Buffer.concat([lastData,newBuf]);
                        lastData = undefined;
                    }
                    handleLine(newBuf,rowChar);
                    rowChar = '';
                    rowStartIndex = ++i;
                }
            }
            
            //最末没出现换行符，保存下一行
            if(rowStartIndex<buffer.length-1){
                return buffer.subarray(rowStartIndex);
            }
        }
        
        /**
         * 处理行
         * @param lineBuffer    行buffer
         * @param rowChar       换行符 
         */
        function handleLine(lineBuffer:Buffer,rowChar?:string){
            //第一行，设置分割线
            if(!dispLine){
                dispLine = lineBuffer;
                startField = true;
                dispLineNo = 1;
                return;
            }
            
            //字段结束
            if(dispLine.length === lineBuffer.length && dispLine.equals(lineBuffer) || 
                dispLine.length+2 === lineBuffer.length && dispLine.equals(lineBuffer.subarray(0,dispLine.length))){  //新字段或结束
                //关闭文件流
                if(isFile){
                    writeStream.end();
                }

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
                startField = true;
                dispLineNo = 1;
                isFile = false;
                value = '';
                return;
            }

            if(startField){
                //buffer转utf8字符串
                let line = lineBuffer.toString();
                //第一行
                switch(dispLineNo){
                    case 1:  //第一行
                        dispLineNo = 2;
                        let arr = line.split(';');  
                        //数据项
                        dataKey = arr[1].substr(arr[1].indexOf('=')).trim();
                        dataKey = dataKey.substring(2,dataKey.length-1);
                        if(arr.length === 3){  //文件
                            let a1 = arr[2].split('=');
                            let fn = a1[1].trim();
                            let fn1 = fn.substring(1,fn.length-1);
                            let fn2 = uuidMdl.v1().replace(/\-/g,'') + fn1.substr(fn1.lastIndexOf('.'));
                            let filePath = pathMdl.resolve(process.cwd(),'upload/tmp',fn2);
                            value = {
                                fileName:fn1,
                                path:filePath
                            };
                            writeStream = fsMdl.createWriteStream(filePath,'binary');
                            isFile = true;  
                        }
                        return;
                    case 2: //第二行（空或者文件类型）
                        if(isFile){  //文件字段
                            value.fileType = line.substr(line.indexOf(':')).trim();
                        }
                        dispLineNo = 3;
                        return;
                    case 3: //第三行（字段值或者空）
                        if(!isFile){
                            value = line; 
                        }
                        startField = false;
                        return;
                }
            } else{
                if(isFile){  //写文件
                    writeStream.write(lineBuffer);
                    writeStream.write(rowChar);
                }else{  //普通字段（textarea可能有换行符）
                    value += lineBuffer.toString() + rowChar;
                }
            }   
        }
    }
}



export {UploadTool}