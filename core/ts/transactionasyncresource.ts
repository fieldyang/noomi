import { AsyncResource } from "async_hooks";

export class TransactionAsyncRecource extends AsyncResource{
    constructor(){
        super('TransactionAsyncResource');
    }

    close(){
        this.emitDestroy();
    }
}