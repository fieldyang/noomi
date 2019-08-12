/**
 * 服务池子
 */
class CellPool{
	static add(name,clsName){
		if(this.cells.has())
		this.cells.set(name,new Cell(name,clsName));
	}

	static get(name){
		const cell = this.cells.get(name);
		if(cell === undefined){
			throw Error.handle("");
		}

		//单例返回已创建的实例，否则新建一个返回
		if(cell.singleton){
			return cell.instance;
		}
		return cell.newInstance();
	}
}

// cell map
CellPool.cells = new Map();