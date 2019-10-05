import { ClientRequest, ServerResponse } from "http";
import { HttpRequest } from "./httprequest";

class BaseAction{
    model:any;
    request:HttpRequest;          //request obj
    response:ServerResponse;        //response obj
    setModel(data:any){
        this.model = data;
    }

    setRequest(req:HttpRequest){
        this.request = req;
    }

    setReponse(res:ServerResponse){
        this.response = res;
    }
}

export{BaseAction};