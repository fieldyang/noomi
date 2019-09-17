import { rejects } from "assert";

/**
 * 链式操作器
 */
class Linker{
	/**
	 * 同步顺序执行
	 * @param funcArr 	函数数组
	 * @param index 	当前index	
	 * @param paramArr 	参数数组
	 * @return 			promise对象
	 */
	static dolist(funcArr:Array<Function>,index:number,paramArr:Array<any>){
		const me = this;
		return foo(funcArr,index,paramArr);

		function foo(fa:Array<Function>,i:number,pa:Array<any>){
			if(fa.length === 0){
				return Promise.resolve();
			}else{
				return new Promise((resolve,reject)=>{
					if(Array.isArray(pa) && pa.length>0){
						fa[i](pa[i],resolve,reject);
					}else{
						fa[i](resolve,reject);
					}
				}).catch((err)=>{
					return Promise.reject(err);
				}).then(()=>{
					if(i<fa.length-1){
						return foo(fa,i+1,pa);
					}
				});	
			}
		}
	}	
}

export {Linker};