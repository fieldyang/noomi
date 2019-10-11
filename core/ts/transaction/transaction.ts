/**
 * 事务类
 */
export class Transaction{
    id:number;      //transaction id
    state:number;   //状态 0创建 1开始 2正常结束 3异常结束
    instance:any;   //织入实例
    method:any;     //织入方法
    

}