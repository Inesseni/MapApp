
var can = document.getElementById('drawingTest');
can.style.position = 'fixed';
can.onselectstart = function () { return false; }
var ctx = can.getContext('2d');

var resultCanvas = document.getElementById('drawingResult');
var resultCTX = resultCanvas.getContext('2d');
resultCanvas.onselectstart = function () { return false; }

var dotOffset = 30;
var dotSize = 100;
var root = document.documentElement;

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;


// get canvas 2D context and set him correct size
resize();



// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', debugPoint);
document.addEventListener('mouseenter', setPosition);
//document.addEventListener('mouseup', clearMask);


// new position from mouse event
function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}

// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    resultCTX.canvas.width = ctx.canvas.width;
    resultCTX.canvas.height = ctx.canvas.height;

}


// Add points to the mask based on GPS Marker
function AddNewPointToMask(AllMarkerPositions, zoomLevel) {
 
    newRadius = zoomLevel*0.05
    //console.log(newRadius);
    //console.log(dotSize * newRadius);
    root.style.setProperty('--dotBlur', zoomLevel/2 + "px");
    
    //clear old mask and create new one
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //adjust the radius based on zoom level (wip)
    //radius = (dotSize / zoomLevel);
   

    for (let i = 0; i < AllMarkerPositions.length; i++) {
        const element = AllMarkerPositions[i];

        const markerX = element[0];
        const markerY = element[1];
        
        offsettedX = markerX + dotOffset;
        offsettedY = markerY + dotOffset;
        //console.log(x , y);

        ctx.lineWidth = dotSize * newRadius;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'white';

        ctx.beginPath();
        ctx.moveTo(offsettedX, offsettedY);
        ctx.lineTo(offsettedX + 0.4, offsettedY + 0.4);
        ctx.stroke();

        setNewImgMask();
    }
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
            imageData[p + r] = 255;
            imageData[p + g] = 255;
            imageData[p + b] = 255;
            imageData[p + a] = 230;
        }
    }


    

    // after the manipulation, reset the data
    image.data = imageData;
    // and put the imagedata to the new canvas (the fog of war)
    resultCTX.putImageData(image, 0, 0);
}

function clearMask() {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    resultCTX.clearRect(0, 0, resultCTX.canvas.width, resultCTX.canvas.height);

    setNewImgMask();
}


setNewImgMask();




/*
function copyToAnotherCanvas() {

    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var resultCanvas = document.getElementById('drawingResult');
    var resultCTX = resultCanvas.getContext('2d');

    resultCTX.canvas.width = ctx.canvas.width;
    resultCTX.canvas.height = ctx.canvas.width;

    resultCTX.putImageData(imgData, 0, 0);
}
*/

///Draw a path with the mouse (debug only)
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

function debugPoint(e){

}