import { UploadTool } from "../uploadtool";

/**
 * 文件上传过滤器
 */
class UploadFilter{
    do(request,response){
        const type = request.headers['content-type'];
        if(request.method !== 'POST' || !type || !type.includes('multipart/form-data'))
        {
            return true;
        }
        //单个上传文件
        let singleFile:boolean = false;
        if(request.headers['content-length'] > UploadTool.singleUploadSize){
            singleFile = true;
        }
        //接受数据
        request.on('data',chunk=>{

        });

        //数据接受完成
        request.on('end',()=>{

        });

        //异常
        request.on('error',err=>{

        });

    }
}

export {UploadFilter}