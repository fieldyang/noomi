import{InstanceFactory} from './instancefactory';

function Inject(className:string){
    return function(target:any,propertyName:string){
        console.log(target,propertyName,className);
        let instance = InstanceFactory.getInstance(className);
        if(!instance){
            throw "找不到指定类名对应的实例";
        }
        Reflect.set(target,propertyName,instance);
    }
    // console.log(this);
    // console.log(className);
    // console.log(arguments);
    // return className;
}

export {Inject};