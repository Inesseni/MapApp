//// Masked Overlay/////
var imagecanvas = document.createElement('canvas');
var imagecontext = imagecanvas.getContext('2d');
var imgg = null;
var newImg = null;
var width = null;
var height = null;
var mask = null;



//document.addEventListener('mouseup', setNewMask);

function setNewMask() {




    //alert("im here");
    [].forEach.call(document.querySelectorAll('.mask'), function (img) {
        imgg = img;
        newImg = document.createElement('img');
        newImg.src = img.src;


        width = newImg.width;
        height = newImg.height;

        mask = document.createElement('img');
        mask.src = document.getElementById('drawingTest');

        console.log("i'm here nowwww")
        imagecanvas.width = width;
        imagecanvas.height = height;

        imagecontext.drawImage(mask, 0, 0, width, height);
        imagecontext.globalCompositeOperation = 'source-out';
        imagecontext.drawImage(img, 0, 0);

        img.src = imagecanvas.toDataURL();
        // newFogImg();
    });
}


function newFogImg() {



    masking();
}

function masking() {
    console.log("i'm here nowwww")
    imagecanvas.width = width;
    imagecanvas.height = height;

    imagecontext.drawImage(mask, 0, 0, width, height);
    imagecontext.globalCompositeOperation = 'source-out';
    imagecontext.drawImage(img, 0, 0);

    img.src = imagecanvas.toDataURL();
}

function TestFunction(canvas) {
    console.log("this worked");


    var ctx = document.getElementById('FogOfWar');
    if (ctx.getContext) {

        ctx = ctx.getContext('2d');
        var img1 = new Image();

                //drawing of the test image - img1
                img1.onload = function () {
                    //draw background image
                    ctx.drawImage(img1, 0, 0);
                    //draw a box over the top
                    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, 500, 500);
        
                };
        
               img1.src = canvas.getContext('2d');

    }


    /*
        var ctx = document.getElementById('FogOfWar');
        var imagecontext = ctx.getContext('2d');
    
        
    
        var mask = document.createElement('img');
        mask.src = document.getElementById('drawingTest');
    
        imagecontext.drawImage(mask, 0, 0, width, height);
        imagecontext.globalCompositeOperation = 'source-out';
        imagecontext.drawImage(img, 0, 0);
    
        ctx.drawImage(mask, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(myImg, 0, 0);
    */
    //myImg.src = imagecanvas.toDataURL();
}