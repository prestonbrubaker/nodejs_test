var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");
var spriteSheet = new Image();
spriteSheet.src = 'testpoop.png'; // Replace with the path to your sprite sheet
var isFullscreen = false;

var pCXW = 1000;      // count of pixels across the world
var pCYW = 800;       // count of pixels across the world
var itC = 0;
const tickS = 50;
const pixS = 10;
const minW = 0;
const minH = 0;
var maxW = c.width;   
var maxH = c.height;   
const bgHue = "#777777";
var pCX = Math.floor(maxW / pixS);  // count of pixels across the screen
var pCY = Math.floor(maxH / pixS);  // count of pixels across the screen


function tick() {
    // Clear and fill background
    ctx.clearRect(minW, minH, maxW, maxH);
    ctx.fillStyle = bgHue;
    ctx.fillRect(minW, minH, maxW, maxH);

    itC++;
}




// Initialize



setInterval(tick, tickS);
