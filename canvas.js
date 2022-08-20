var can = document.getElementById('FogOfWar');
var ctx = can.getContext('2d');

can.addEventListener('mousemove', function(e) {
    var mouse = getMouse(e, can);
    redraw(mouse);
}, false);


function redraw(mouse) {
    console.log('a');
    can.width = can.width;
    ctx.drawImage(img, 0, 0);
    ctx.beginPath();
    ctx.rect(0,0,500,500);
    ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI*2, true)
    ctx.clip();
    ctx.fillRect(0,0,500,500);
}

var img = new Image();
img.onload = function() {
    redraw({x: -500, y: -500})
}
       img.src = 'http://placekitten.com/500/500';

// Creates an object with x and y defined,
// set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky,
// we have to worry about padding and borders
// takes an event and a reference to the canvas


function getMouse(e, canvas) {
    var element = canvas,
        offsetX = 0,
        offsetY = 0,
        mx, my;

    // Compute the total offset. It's possible to cache this if you want
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object with x and y defined
    return {
        x: mx,
        y: my
    };
}