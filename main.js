    // elements
let canv = document.getElementById("canvas");
let cimg = document.getElementById("cImg");
    // consts
const con = canv.getContext("2d");
const yOfs = 120;
    // varialbes
let height = 1000;
let width = 1000;

let turb; // 大気ゆらぎ mdeg
let back; // 背景の明るさ mag
let diam; // 口径 mm
let magn; // 倍率 倍
let vmagn = 0.1; //描画につかう倍率 px/mdeg
let fov = 2.7; //°
//let fl = 130; //現実で使用するレンズの倍率

let request = new XMLHttpRequest();
request.open("GET", "./stars/m81_82.json", false);
request.send();
let stars = JSON.parse(request.responseText);

console.log(stars.data[0][0])



function reCal(){
}

function drawStar(x, y, r, b){
    let airPat = con.createRadialGradient(x*vmagn,y*vmagn,0,x*vmagn,y*vmagn,)
}




function resizeWindow(){
    width = window.innerWidth;
    height = window.innerHeight;
    canv.width = width;
    canv.height = height;
    //cimg.style.width = Math.min(width,height);    
    //cimg.style.height = Math.min(width,height);    
}
window.onresize = resizeWindow;
resizeWindow();
