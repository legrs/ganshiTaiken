    // varialbes
let height = 1000;
let width = 1000;
let turb; // 大気ゆらぎ mdeg
let back; // 背景の明るさ mag
let diam; // 口径 mm
let magn; // 倍率 倍
let vmagn = 0.1; //描画につかう倍率 px/deg
let fov = 1.4; //°
let fl = 130; //現実で使用するレンズの倍率
let radi,count,sradi;
let center2 = [0,0];
let Bri = [0,0,0];
let iti = [0,0];
let nullKazu = 0;
let cuv = 0.1;
let maxBri; //
let mouse = [0,0]; //mouse pos
let cosD; //cos(dec)の値
let debugBool = false;
let celi = 0; //天体のindex
    // 
let request = new XMLHttpRequest();
request.open("GET", "./stars/m27.json", false);
request.send();
let stars = JSON.parse(request.responseText);
let center = [stars.data[0][1],stars.data[0][2]];
cosD = Math.cos(center[1]*Math.PI/180);
console.log(center[0],center[1]);

    // elements
let canv = document.getElementById("canvas");
let cimg = document.getElementById("cImg");
let debug = document.getElementById("debug");
let yuragiS = document.getElementById("yuragiS");
let yuragiP = document.getElementById("yuragiP");
let cimgBriS = document.getElementById("cimgBriS");
let cimgBriP = document.getElementById("cimgBriP");
let minRadimaxMagS = document.getElementById("minRadimaxMagS");
let minRadimaxMagP = document.getElementById("minRadimaxMagP");
let backBriS = document.getElementById("backBriS");
let backBriP = document.getElementById("backBriP");
let dl = document.getElementById("DSOlist");
let lp = document.getElementById("lp"); //light pollution
let infoD = document.getElementById("infoDiv");
let infoB = document.getElementById("info");
let ss = document.getElementById("ss");
let bbu = document.getElementById("backBriUnit");

    // elements setup
debug.addEventListener("click",()=>{
    debugBool = !debugBool;
});
ss.addEventListener("click",()=>{
    if(ss.value = "STOP"){
        clearInterval(yuragi);
        ss.value = "RUN";
    }else{
        yuragi = setInterval(draw, 70);
        ss.value = "STOP";
    }
});
yuragiS.addEventListener("change",()=>{
    yuragiP.innerHTML = yuragiS.value.toString();
});
infoB.addEventListener("click",()=>{
    if(infoD.style.display == "block"){
        infoD.style.display = "none";
    }else{
        infoD.style.display = "block";
    }
});
cimgBriS.addEventListener("change",()=>{
    cimgBriP.innerHTML = cimgBriS.value.toString();
    cimg.style.opacity = cimgBriS.value/100;
    console.log(`set opacity at ${cimgBriS.value/100}`);
});
minRadimaxMagS.addEventListener("change",()=>{
    minRadimaxMagP.innerHTML = minRadimaxMagS.value.toString();
    console.log(`set opacity at ${cimgBriS.value}`);
});
backBriS.addEventListener("change",()=>{
    backBriP.innerHTML = backBriS.value.toString();
});
bbu.addEventListener("change",()=>{
    let tmpB = backBriS.value;
    if(bbu.value == "count"){ //mag to count
        // mag = K + -2.5log[10]count; -2.5log[10]count = mag-K;
        // log[10]count = (mag-K)/-2.5; 10^((mag-K)/-2.5) = count;
        backBriS.min = 20.7;
        backBriS.max = 13089.9;
        backBriS.value = Math.pow(10, (tmpB - 25.29234)/-2.5);
    }else{
        backBriS.min = 15;
        backBriS.max = 22;
        backBriS.value = 25.29234 + -2.5*Math.log10(tmpB);
    }
    backBriP.innerHTML = backBriS.value.toString();
});
dl.addEventListener("change",()=>{
    request.open("GET", `./stars/${dl.value}.json`, false);
    request.send();
    stars = JSON.parse(request.responseText);
    center = [stars.data[0][1],stars.data[0][2]];
    console.log(center[0],center[1]);
    resizeWindow();
    cimg.src = `./imgs/${dl.value}.png`;
    celi = cname.indexOf(dl.value);
});
document.getElementById("body").addEventListener("click",(event)=>{
    console.log(event.clientX, event.clientY);
    mouse[0] = event.clientX;
    mouse[1] = event.clientY;
    console.log(" ");
    console.log(center[0] + (mouse[0] - height-Math.min(width,height)/2)/(vmagn*cosD) , center[1] + (mouse[1] - height-Math.min(width,height)/2)/(vmagn) );
    resizeWindow();
    console.log(" ");
});
    // consts
const con = canv.getContext("2d");
const dimm = 100000;
//const base = 16; //mag (base)mag |-> 0Bri
const cname = ["m27","m81","m104"];
const cimgD = [ //画像の位置を大きさを正しくするための値 画像の左上の位置(ra,dec)，画像の幅,高さ(°)
    [300,22.8,0.2,0.15],
    [300,22.8,0.2,0.15],
    [190.097625,-11.563,0.2,0.12]
    ];


function drawStar(x, y, r, b){
    let airPat = con.createRadialGradient(x*vmagn,y*vmagn,0,x*vmagn,y*vmagn,)
}
function draw(){
    cimg.style.opacity = 290 / minRadimaxMagS.value;
    cimgBriS.value = cimg.style.opacity * 100;
    cimgBriP.innerHTML = (cimgBriS.value).toString();
    con.clearRect(0,0,canv.width,canv.height);
            // vmagn = px / degree
            // 1/vmagn = degree / px
            // arcsesc / px = 3600/vmagn
            // arcsesc^2 / px^2 = 3600^2/vmagn^2
    if(bbu.value == "mag"){ //mag to countする必要
        con.fillStyle = `#ffffff${Math.floor(Math.pow(10, (backBriS.value - 25.29234)/-2.5)*255/minRadimaxMagS.value/Math.pow(3600/vmagn, 2)).toString(16).padStart(2,'0')}`;
        console.log("mag to count su");
    }else{
        con.fillStyle = `#ffffff${Math.floor(backBriS.value*255/minRadimaxMagS.value/Math.pow(3600/vmagn, 2)).toString(16).padStart(2,'0')}`;
    }
    console.log(Math.floor(backBriS.value*255/minRadimaxMagS.value).toString(16).padStart(2,'0'));
    con.beginPath();
    con.arc(width/2, height-Math.min(width,height)/2, radi, 0, Math.PI*2, true);
    con.fill();
    for(let i=0; i<stars.data.length; i++){
        nullKazu = 0;
        for(let j=0; j<3; j++){
            if(stars.data[i][5-j] == null){
                Bri[j] = 0;
                nullKazu++;
            }else{
                Bri[j] = stars.data[i][5-j]/1000; 
                Bri[j] += yuragiS.value*Bri[j]*(Math.random()-0.5);
            }
        }
        count = Bri[0]+Bri[1]+Bri[2];
        maxBri = Math.max(Bri[0],Math.max(Bri[1],Bri[2]));
        Bri[0] = Math.floor(Bri[0]*255/maxBri);
        Bri[1] = Math.floor(Bri[1]*255/maxBri);
        Bri[2] = Math.floor(Bri[2]*255/maxBri);
        count = count / (3-nullKazu);
        count = count / minRadimaxMagS.value;
        con.beginPath();
        /*
        if(stars.data[i][0] == 1833253124707245600){
        }
        if(stars.data[i][0] == 1071309090100262912){
            count = 20;
            Bri[0] = 20;
            Bri[1] = 200;
            Bri[2] = 20;
        }
        if(stars.data[i][0] == 1070243869491248256){
            count = 20;
            Bri[0] = 20;
            Bri[1] = 20;
            Bri[2] = 200;
        }
        if(stars.data[i][0] == 1070945014312759296){
            count = 200;
            Bri[0] = 20;
            Bri[1] = 200;
            Bri[2] = 20;
        }
        */
        iti[0] = -stars.data[i][1]*vmagn*cosD + center2[0];
        iti[1] = -stars.data[i][2]*vmagn + center2[1];
        if(1 <= count){
            sradi = Math.sqrt(count)/2;
            con.fillStyle = `#${Bri[0].toString(16).padStart(2,'0')}${Bri[1].toString(16).padStart(2,'0')}${Bri[2].toString(16).padStart(2,'0')}ff`;
            con.arc(iti[0], iti[1] , sradi , 0 , Math.PI*2 , true);
            con.fill();
            if(1.4 < count){
                con.beginPath();
                sradi /= 2;
                con.fillStyle = "#ffffff";
                con.arc(iti[0], iti[1] , sradi , 0 , Math.PI*2 , true);
                con.fill();
            }
        }else{
            sradi = 0.5;
            count = Math.floor(count*255);
            con.fillStyle = `#${Bri[0].toString(16).padStart(2,'0')}${Bri[1].toString(16).padStart(2,'0')}${Bri[2].toString(16).padStart(2,'0')}${count.toString(16).padStart(2,'0')}`;
            con.arc(iti[0], iti[1] , sradi , 0 , Math.PI*2 , true);
            con.fill();
        }
        //debug

        if(Math.abs(iti[0]-mouse[0]) < 3 && Math.abs(iti[1]-mouse[1]) < 3){
            console.log(i,stars.data[i]);
            console.log((stars.data[i][5-0]+stars.data[i][5-1]+stars.data[i][5-2])/3);
        }
        /*
        if(stars.data[i][3] < 2){
            console.log("vegaかな",stars.data[i][3]);
        }
        */
        ///debug
    }


    //debug

    /*
    const centerA = [189.997625,-11.623];
    const de = [0.1,0.06];

    iti[0] = -(centerA[0]-de[0])*vmagn*cosD + center2[0];
    iti[1] = -(centerA[1]-de[1])*vmagn + center2[1];
    con.beginPath();
    con.moveTo(iti[0], iti[1]);
    iti[0] = -(centerA[0]+de[0])*vmagn*cosD + center2[0];
    con.lineTo(iti[0], iti[1]);
    iti[1] = -(centerA[1]+de[1])*vmagn + center2[1];
    con.lineTo(iti[0], iti[1]);
    iti[0] = -(centerA[0]-de[0])*vmagn*cosD + center2[0];
    con.lineTo(iti[0], iti[1]);
    iti[1] = -(centerA[1]-de[1])*vmagn + center2[1];
    con.lineTo(iti[0], iti[1]);
    con.stroke();
    console.log(center2,centerA,center);
    */
}
function resizeWindow(){
    width = window.innerWidth;
    height = window.innerHeight;
    canv.width = width;
    canv.height = height;

    radi = (Math.min(canv.width,canv.height)/2);
    vmagn = radi*2/fov; //px/°
    cosD = Math.cos(center[1]*Math.PI/180);
    center2 = [width/2 + center[0]*vmagn*cosD, height-Math.min(width,height)/2 + center[1]*vmagn];
    draw();
    cimg.style.left   = -cimgD[celi][0]*vmagn*cosD + center2[0];
    cimg.style.top    = -cimgD[celi][1]*vmagn + center2[1];
    cimg.style.width  =  cimgD[celi][2]*vmagn*cosD;
    cimg.style.height =  cimgD[celi][3]*vmagn;
    console.log(cimg.style.top,cimg.style.left,cimg.style.width,cimg.style.height);
}
window.onresize = resizeWindow;


//ここから、ここから

resizeWindow();
console.log(stars.data[0][0]);
let yuragi = setInterval(draw, 70);
//setTimeout(()=>{clearInterval(yuragi)},10000);
