// create canvas element and append it to document body
//var canvas = document.createElement('canvas');
//document.body.appendChild(canvas);


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
    if (e.buttons !== 1) return;

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

    //console.log(resultCanvas);
}

function setNewImgMask() {

    // get the image data object
    var image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // get the image data values 
    var imageData = image.data,
        length = imageData.length;
    // set every fourth value to 50
    for (var i = 3; i < length; i += 4) {
        imageData[i] = 50;
    }
    // after the manipulation, reset the data
    image.data = imageData;


    var resultCanvas = document.getElementById('drawingResult');
    var resultCTX = resultCanvas.getContext('2d');

    resultCanvas.onselectstart = function () { return false; }


    resultCTX.canvas.width = window.innerWidth;
    resultCTX.canvas.height = window.innerHeight;

    // and put the imagedata to the new canvas (the fog of war?)
    resultCTX.putImageData(image, 0, 0);
}

function clearMask(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function AddNewPointToMask(){

}

setNewImgMask();