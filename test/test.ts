
//class
function m1(){
    return (target)=>{
        console.log('m1',target);
    }
}
//method
function m2(){
    return (target,name)=>{
        console.log('m2',target,name);
    }
}

//property
function m3(){
    return (target,name)=>{
        console.log('m3',target,name);
    }
}


@m1()
class Clazz1{
    constructor(){
        console.log('constructor');
    }

    @m3()
    private name = 10;

    @m2()
    public foo(){
        console.log(this.name);
    }
}