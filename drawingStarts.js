var mask = "";
w = 10;
h = 10;

document.documentElement.addEventListener("click", function (c) {
    mask+="mask-img.png"+(c.pageX-w/10)+"px "+(c.pageY-h/10)+"px/"+w+"px "+h+"px no-repeat,";
   document.documentElement.style.setProperty("--mask", mask)
});