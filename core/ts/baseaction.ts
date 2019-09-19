import { ClientRequest, ServerResponse } from "http";

class BaseAction{
    model:any;
    request:ClientRequest;          //request obj
    response:ServerResponse;        //response obj
    setModel(data:any){
        this.model = data;
    }

    setRequest(req:ClientRequest){
        this.request = req;
    }

    setReponse(res:ServerResponse){
        this.response = res;
    }
}

export{BaseAction};