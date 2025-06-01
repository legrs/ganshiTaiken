    // elements
let canv = document.getElementById("canvas");
let cimg = document.getElementById("cImg");
    // consts
const ctx = canv.getContext("2d");
const yOfs = 120;
const stars = [
[0,0],
[20,0]
];
    // varialbes
let height = 1000;
let width = 1000;

let turb; // 大気ゆらぎ
let back; // 背景の明るさ
let diam; // 口径
let magn; // 倍率
let fl = 130; //現実で使用するレンズの倍率





function resizeWindow(){
    width = window.innerWidth;
    height = window.innerHeight;
    canv.width = width;
    canv.height = height;
    cimg.style.width = Math.min(width,height);    
    cimg.style.height = Math.min(width,height);    
}
window.onresize = resizeWindow;
resizeWindow();
