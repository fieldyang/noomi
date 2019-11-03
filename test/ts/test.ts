function addInstances(path:string){
    const pathTool = require('path');
    const basePath = process.cwd();
    let pathArr = path.split('/');
    let pa = [basePath];
    for(let i=0;i<pathArr.length;i++){
        const p = pathArr[i];
        if(p.indexOf('*') === -1){
                pa.push(p);
        }else{
            if(p === '**'){ //所有子孙目录
                if(i<pathArr.length-2){
                        throw '路径错误';
                }
                handleDir(pa.join('/'),pathArr[pathArr.length-1],true);
            }
        }
    }
    function handleDir(dirPath:string,fileExt:string,deep?:boolean){
        const fs = require('fs');
        const dir = fs.readdirSync(dirPath,{withFileTypes:true});
        let reg:RegExp;
        let fn:string = fileExt;
        fn = fn.replace(/\./g,'\\.');
        fn = fn.replace(/\*/g,'\.*');
        reg = new RegExp('^' + fn + '$');
        
        for (const dirent of dir) {
            if(dirent.isDirectory()){
                if(deep){
                    handleDir(dirPath + '/' + dirent.name,fileExt,deep);
                }
            }else if(dirent.isFile()){
                if(reg.test(dirent.name)){
                        console.log(dirPath + '/' + dirent.name);
                        require(dirPath + '/' + dirent.name);
                }
        
            }            
            
        }
    }
}

addInstances("/build/test/**/*.js");