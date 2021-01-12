var w = window.innerWidth;
var h = window.innerHeight;

var intro = document.getElementsByClassName("intro")[0];
var history = document.getElementsByClassName("history")[0];
var paragraphs = document.getElementsByClassName("paragraphs")[0];

intro.style.fontSize = w / 30 + "px";
history.style.fontSize = w / 20 + "px";
paragraphs.style.height = h + "px";

window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    intro.style.fontSize = w / 30 + "px";
    history.style.fontSize = w / 20 + "px";
    paragraphs.style.height = h + "px";
    /*Stars Background*/
    start();
    snow();
});

export function animate() {
    intro.className = 'intro text_intro animation_intro';
    history.className = 'history text_history animation_history';    
}


/*Fondo de estrellas*/

var canvas = document.getElementById('snow');
var ctx = canvas.getContext('2d');

canvas.width = w;
canvas.height = h;

var num = 100;
var size = 2;
var elements = [];

start();
snow();

function start() {
    for (var i = 0; i < num; i++) {
        elements[i] = {
            x: Math.ceil(Math.random() * w),
            y: Math.ceil(Math.random() * h),
            size: Math.random() * size
        }
    }
}

function snow() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < num; i++) {
        var e = elements[i];
        ctx.beginPath();
        ctx.fillStyle = "#ff6";
        ctx.arc(e.x, e.y, e.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}
