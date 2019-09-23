import { UploadTool } from "../uploadtool";

/**
 * 文件上传过滤器
 */
class UploadFilter{
    async do(request,response){
        const req = request.req;
        const type = request.getHeader('content-type');
        if(request.getHeader('method') !== 'POST' || !type || !type.includes('multipart/form-data'))
        {
            return true;
        }
        // await UploadTool.upload(request);
        return true;
    }
}

export {UploadFilter}