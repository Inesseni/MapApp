// create canvas element and append it to document body
//var canvas = document.createElement('canvas');
//document.body.appendChild(canvas);

var resultCanvas = document.getElementById('drawingResult');
var resultCTX = resultCanvas.getContext('2d');



var can = document.getElementById('drawingTest');
can.onselectstart = function () { return false; }
// some hotfixes... ( ≖_≖)
//document.body.style.margin = 0;
can.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = can.getContext('2d');
resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);


// new position from mouse event
function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}

// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

}

function draw(e) {

    // mouse left button must be pressed (0 is none, 1 is left and 2 is right)
    if (e.buttons !== 2) return;

    ctx.beginPath(); // begin


    ctx.lineWidth = 100;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!

    setNewImgMask();

}


function copyToAnotherCanvas() {

    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var resultCanvas = document.getElementById('drawingResult');
    var resultCTX = resultCanvas.getContext('2d');

    resultCTX.canvas.width = ctx.canvas.width;
    resultCTX.canvas.height = ctx.canvas.width;

    resultCTX.putImageData(imgData, 0, 0);
}

function setNewImgMask() {

    // get the image data object
    var image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // get the image data values 
    var imageData = image.data,
        length = imageData.length;

    var r = 0, g = 1, b = 2, a = 3;
    for (var p = 0; p < length; p += 4) {
        //check if first pixel is white
        if (
            imageData[p + r] == 255 &&
            imageData[p + g] == 255 &&
            imageData[p + b] == 255) // if white then change alpha to 0
        { imageData[p + a] = 0; }
        else {
            imageData[p + a] = 200;
        }
    }

    resultCTX.canvas.width = ctx.canvas.width;
    resultCTX.canvas.height = ctx.canvas.height;

    // after the manipulation, reset the data
    image.data = imageData;


    resultCanvas.onselectstart = function () { return false; }




    // and put the imagedata to the new canvas (the fog of war)
    resultCTX.putImageData(image, 0, 0);
}

function clearMask() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function AddNewPointToMask() {

}

setNewImgMask();
