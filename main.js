    // varialbes
let height = 1000;
let width = 1000;
let turb; // 大気ゆらぎ mdeg
let back; // 背景の明るさ mag
let diam; // 口径 mm
let magn; // 倍率 倍
let vmagn = 0.1; //描画につかう倍率 px/mdeg
let fov = 1.5; //°
let fl = 130; //現実で使用するレンズの倍率
let radi,cv,count,sradi;
let center2 = [0,0];
let Bri = [0,0,0];
let iti = [0,0];
let nullKazu = 0;
let cuv = 0.1;
let maxBri;
let isM81 = true;
    // 
let request = new XMLHttpRequest();
request.open("GET", "./stars/m27_1.json", false);
//request.open("GET", "./stars/m81_1.json", false);
request.send();
//let center = [148.5, 69.45];
let stars = JSON.parse(request.responseText);
let center = [stars.data[0][1],stars.data[0][2]];
console.log(center[0],center[1]);

    // elements
let canv = document.getElementById("canvas");
let cimg = document.getElementById("cImg");
let debug = document.getElementById("debug");
let yuragiS = document.getElementById("yuragiS");
let yuragiP = document.getElementById("yuragiP");

    // elements setup
debug.addEventListener("click",()=>{
    request = new XMLHttpRequest();
    if(isM81){
        request.open("GET", "./stars/m81_1.json", false);
    }else{
        request.open("GET", "./stars/m27_1.json", false);
    }
    request.send();
    stars = JSON.parse(request.responseText);
    center = [stars.data[0][1],stars.data[0][2]];
    console.log(center[0],center[1]);
    resizeWindow();
    isM81 = !isM81;
});
yuragiS.addEventListener("change",()=>{
    yuragiP.innerHTML = yuragiS.value.toString();
});

    // consts
const con = canv.getContext("2d");
const dimm = 100000;
const minradiMaxcount = 8;


function reCal(){
}
function drawStar(x, y, r, b){
    let airPat = con.createRadialGradient(x*vmagn,y*vmagn,0,x*vmagn,y*vmagn,)
}
function draw(){
    con.clearRect(0,0,canv.width,canv.height);
    con.strokeStyle = "red";
    con.beginPath();
    con.arc(width/2, height/2, radi, 0, Math.PI*2, true);
    con.stroke();

    for(let i=0; i<stars.data.length; i++){
        nullKazu = 0;
        for(let j=0; j<3; j++){
            if(stars.data[i][5-j] == null){
                Bri[j] = 0;
                nullKazu++;
            }else{
                Bri[j] = 16 - stars.data[i][5-j] 
                Bri[j] += yuragiS.value*Bri[j]*Math.random();
                Bri[j] -= yuragiS.value*Bri[j]/2;
            }
        }
        count = Bri[0]+Bri[1]+Bri[2];
        maxBri = Math.max(Bri[0],Math.max(Bri[1],Bri[2]));
        Bri[0] = Math.floor(Bri[0]*255/maxBri);
        Bri[1] = Math.floor(Bri[1]*255/maxBri);
        Bri[2] = Math.floor(Bri[2]*255/maxBri);
        count = count / (3-nullKazu);
        count = count / minradiMaxcount;
        con.beginPath();
        /*
        if(stars.data[i][0] == 1070540497113726080){
            count = 20;
            Bri[0] = 200;
            Bri[1] = 20;
            Bri[2] = 20;
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
        //iti[0] = -stars.data[i][1]*cv + center2[0];
        //iti[1] = -stars.data[i][2]*cv + center2[1];
        iti[0] = width/2 - (stars.data[i][1] - center[0])*cv;
        iti[1] = height/2 - (stars.data[i][2] - center[1])*cv;
        if(1 <= count){
            sradi = count/2;
            con.fillStyle = `#${Bri[0].toString(16).padStart(2,'0')}${Bri[1].toString(16).padStart(2,'0')}${Bri[2].toString(16).padStart(2,'0')}ff`;
            con.arc(iti[0], iti[1] , sradi , 0 , Math.PI*2 , true);
            con.fill();
            if(1.4 < count){
                con.beginPath();
                sradi = count/3;
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
    }
}
function resizeWindow(){
    width = window.innerWidth;
    height = window.innerHeight;
    canv.width = width;
    canv.height = height;

    radi = (Math.min(canv.width,canv.height)/2);
    cv = radi*2/fov; //px/°
    center2 = [width/2 + center[0]*cv, height/2 + center[1]*cv];
    draw();
    //cimg.style.width = Math.min(width,height);    
    //cimg.style.height = Math.min(width,height);    
}
window.onresize = resizeWindow;


//ここから，ここから

resizeWindow();
console.log(stars.data[0][0]);
let yuragi = setInterval(draw, 50);
//setTimeout(()=>{clearInterval(yuragi)},10000);
