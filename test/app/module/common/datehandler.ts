import { Instance } from "../../../../core/ts/decorator";

@Instance({
    name:'dateHandler'
})
class DateHandler{
    tickerToDTString(ticker:number){
        let d = new Date(ticker);
        let year=d.getFullYear(); 
        let month=d.getMonth()+1; 
        let date=d.getDate(); 
        let hour=d.getHours(); 
        let minute=d.getMinutes(); 
        let second=d.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    }
}

export {DateHandler};