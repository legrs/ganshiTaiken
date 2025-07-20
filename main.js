    // elements
let canv = document.getElementById("canvas");
let cimg = document.getElementById("cImg");
    // consts
const con = canv.getContext("2d");
const dimm = 100000;
const minradiMaxcount = 10000000;
    // varialbes
let height = 1000;
let width = 1000;

let turb; // 大気ゆらぎ mdeg
let back; // 背景の明るさ mag
let diam; // 口径 mm
let magn; // 倍率 倍
let vmagn = 0.1; //描画につかう倍率 px/mdeg
let fov = 5.4; //°
//let fl = 130; //現実で使用するレンズの倍率

let radi,cv,count,sradi;
let center2 = [0,0];
let Bri = [0,0,0];


let request = new XMLHttpRequest();
request.open("GET", "./stars/m81_82.json", false);
request.send();
let center = [148.5, 69.45];
let stars = JSON.parse(request.responseText);


function reCal(){
}
function drawStar(x, y, r, b){
    let airPat = con.createRadialGradient(x*vmagn,y*vmagn,0,x*vmagn,y*vmagn,)
}
function draw(){
    con.clearRect(0,0,canv.width,canv.height);
    con.strokeStyle = "white";
    con.beginPath();
    con.arc(width/2, height/2, radi, 0, Math.PI*2, true);
    con.stroke();


    count = 0;
    for(let i=0; i<stars.data.length; i++){
        Bri[0] = stars.data[i][4] + 0.5*stars.data[i][4]*Math.random();
        Bri[1] = stars.data[i][2] + 0.5*stars.data[i][2]*Math.random();
        Bri[2] = stars.data[i][3] + 0.5*stars.data[i][3]*Math.random();
        for(let j=0; j<3; j++){
            count += Bri[j];
        }
        for(let j=0; j<3; j++){
            Bri[j] = Math.floor(Bri[j]*255/count);
        }

        count = count/minradiMaxcount;
        con.beginPath();
        if(1 < count){
            sradi = 0.3 + count/5;
            con.fillStyle = `#${Bri[0].toString(16)}${Bri[1].toString(16)}${Bri[2].toString(16)}ff`;
            con.arc(stars.data[i][0]*cv + center2[0] , -stars.data[i][1]*cv + center2[1] , sradi , 0 , Math.PI*2 , true);
            con.fill();

            if(1.6 < count){
                con.beginPath();
                sradi = 0.3 + count/9;
                con.fillStyle = "#ffffff";
                con.arc(stars.data[i][0]*cv + center2[0] , -stars.data[i][1]*cv + center2[1] , sradi , 0 , Math.PI*2 , true);
                con.fill();
            }
        }else{
            sradi = 0.5;
            count = Math.floor(count*255);
            con.fillStyle = `#${Bri[0].toString(16).padStart(2,'0')}${Bri[1].toString(16).padStart(2,'0')}${Bri[2].toString(16).padStart(2,'0')}${count.toString(16).padStart(2,'0')}`;
            con.arc(stars.data[i][0]*cv + center2[0] , -stars.data[i][1]*cv + center2[1] , sradi , 0 , Math.PI*2 , true);
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
    center2 = [width/2 - center[0]*cv, height/2 + center[1]*cv];
    draw();
    //cimg.style.width = Math.min(width,height);    
    //cimg.style.height = Math.min(width,height);    
}
window.onresize = resizeWindow;


//ここから，ここから

resizeWindow();
console.log(stars.data[0][1]);
let yuragi = setInterval(draw, 20);
//setTimeout(clearInterval(yuragi),10000);
