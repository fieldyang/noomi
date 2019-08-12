/**
 * 处理单元
 */
module.exports = class Cell{
	/**
	 * @param clsName 		class name
	 * @param singleton 	是否单例	
	 * @param params 		类构造参数
	 */
	constructor(className,singleton,params){
		let cls = eval(className);
		this.params = params;
		this.className = className;

		//配置为单例，需要创建实例
		if(singleton){
			this.instance = this.newInstance();	
		}
	}


	/**
	 * 创建新实例
	 * @return 	新实例
	 */
	newInstance(){
		let cls = eval(this.className);
		return Reflect.construct(cls,this.params||[]);
	}
}