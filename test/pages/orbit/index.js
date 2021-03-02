var buildUrl = "res";
var config = {
    dataUrl: buildUrl + "/webgl.data",
    frameworkUrl: buildUrl + "/webgl.framework.js",
    codeUrl: buildUrl + "/webgl.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "63839",
    productName: "orbit",
    productVersion: "1.0",
};

var lstData = [];
var currentIndex = 0;
var recordCount = 1;
var readCount = 0;
var g_unityInstance;
var pageNo = 1;

window.onload = ()=>{
    let earthCvs = document.querySelector(".earth");
    earthCvs.style.width = earthCvs.parentElement.offsetWidth + 'px';
    earthCvs.style.height = earthCvs.parentElement.offsetHeight + 'px';
    earthCvs.width = earthCvs.parentElement.offsetWidth;
    earthCvs.height = earthCvs.parentElement.offsetHeight;
    
    let mapCvs = document.querySelector('.map');
    mapCvs.style.width = mapCvs.parentElement.offsetWidth + 'px';
    mapCvs.style.height = mapCvs.parentElement.offsetHeight + 'px';
    mapCvs.width = mapCvs.parentElement.offsetWidth;
    mapCvs.height = mapCvs.parentElement.offsetHeight;
    
    createUnityInstance(earthCvs, config, (progress) => {
        
    }).then((unityInstance) => {
        g_unityInstance = unityInstance;
        judgeInit();
    }).catch((message) => {
        alert(message);
    });

    readData(140);
    
    
}

function draw(){
    if(lstData.length<=1){
        return;
    }
    let data = lstData[currentIndex];
    let xyz = hlb2Xyz(data.h*1000,data.lamda,data.b);
    //发送数据给unity
    g_unityInstance.SendMessage('earth','addData',xyz.join(','));
    //绘制canvas
    let cvs = document.querySelector('.map');
    let ctx = cvs.getContext('2d');
    ctx.clearRect(0,0,cvs.width,cvs.height);
    
    //线
    ctx.lineWidth=1;
    ctx.strokeStyle='red';
    let oldPosition;
    ctx.beginPath();
    let xy;
    for(let i=0;i<currentIndex;i++){
        let d = lstData[i];
        xy = jwToXy(d.lamda,d.b,cvs.width,cvs.height);
        if(!oldPosition || oldPosition.x - xy[0]>50){
            ctx.moveTo(xy[0],xy[1]);
        }else{
            ctx.lineTo(xy[0],xy[1]);
        }
        oldPosition = {x:xy[0],y:xy[1]};
    }
    ctx.stroke();
    
    
    // 圆
    if(xy){
        ctx.beginPath();
        ctx.fillStyle='gold';
        ctx.arc(xy[0],xy[1],3,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    
    if(currentIndex++ < recordCount){
        setTimeout(draw,30);
    }
}

function show(){
    if(recordCount > 1){
        let d = this.lstData[currentIndex];
        document.querySelector("[name='time']").innerHTML = d.year + '-' + d.month + '-' + d.day + ' '
                    + d.hour + ':' + d.minute + ':' + d.second;
        document.querySelector("[name='flytime']").innerHTML = d.t + ' s';
        document.querySelector("[name='velocity']").innerHTML = d.v.toFixed(3) + ' m/s';
        document.querySelector("[name='lamda']").innerHTML = d.lamda.toFixed(3) + ' °';
        document.querySelector("[name='b']").innerHTML = d.b.toFixed(3) + ' °';
        document.querySelector("[name='av']").innerHTML = d.vE.toFixed(3) + ' m/s';
        document.querySelector("[name='i']").innerHTML = d.i.toFixed(3) + ' °';
        document.querySelector("[name='ra']").innerHTML = d.ra + ' m';
        document.querySelector("[name='rp']").innerHTML = d.rp + ' m';
    }
    
    if(currentIndex < recordCount){
        setTimeout(show,1000);
    }
}
function readData(taskId){
    let url = "http://127.0.0.1:3000/orbit/data/findorbit?cacTaskId=" + taskId;
    let ajax = new XMLHttpRequest();
    ajax.onload = (r)=>{
        let json = JSON.parse(ajax.responseText);
        recordCount = json.total;
        for(let o of json.rows){
            lstData.push(o);
        }
        readCount += json.rows.length;
        judgeInit();
    }
    
    ajax.open('GET',url);
    ajax.send();

}


function hlb2Xyz(height,lamda,b){
    let a = 6378137.0;
        
    lamda *= Math.PI/180;
    b *= Math.PI/180;

    let scale = 637813.7*2;
    height += a;
    let x = height*Math.sin(lamda)*Math.cos(b)/scale;
    let y = height*Math.sin(b)/scale;
    let z = height * Math.cos(lamda) * Math.cos(b)/scale;
    return [x,y,z];
}

function jwToXy(lamda,b,width,height){
    let px = width/360;
    let py = height/180;
    let x = lamda * px + width/2;
    let y = b * py + height/2;
    return[x,y];
}

function judgeInit(){
    if(g_unityInstance){
        setTimeout(()=>{
            draw();
            show();
            document.querySelector('.loading').style.display = 'none';
        },1000);
    }
}
