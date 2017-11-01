var isMouseDown    = false;
var movingPiece    = false;
var images         = [];
var srcImage       = new Image();
    srcImage.src   = 'images/alyson.png';
var canvas         = document.getElementById("puzzle");
var canvasContext  = canvas.getContext("2d");
var imageSize      = 512;
var pieceSize      = 128;
var showHint       = true;

var imageIndex = null;

var initImages = function(){
    images = [];
    //build random coordinates
    var random = [];
    for(var x=0; x<imageSize; x+=pieceSize){
        for(var y=0; y<imageSize; y+=pieceSize){
            random.push({"x":x,"y":y});
        }
    }
    for(var x=0; x<imageSize; x+=pieceSize){
        for(var y=0; y<imageSize; y+=pieceSize){

            var randomPlace = Math.floor(Math.random() * ( random.length ) );
            var placement = random[randomPlace];

            images.push(
                {
                    "x" : placement.x+imageSize,
                    "y" : placement.y,
                    "ox": x,
                    "oy": y,
                    "offsetX": 0,
                    "offsetY":0,
                    "mover": null
                }
            );

            random.splice(randomPlace,1);
        }
    }

    myRootRef.child("demo").set(images);
}

var drawImages = function(){
    //clear canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    if(showHint){
        canvasContext.globalAlpha = 0.15;
        canvasContext.drawImage(srcImage, 0, 0, imageSize, imageSize);
        canvasContext.globalAlpha = 1;
    }

    //draw pieces
    images.forEach(function(img){
        canvasContext.drawImage(srcImage, img.ox, img.oy, pieceSize, pieceSize, img.x, img.y, pieceSize, pieceSize);
    });

    //draw moving piece on top
    if(imageIndex)canvasContext.drawImage(srcImage, images[imageIndex].ox, images[imageIndex].oy, pieceSize, pieceSize, images[imageIndex].x, images[imageIndex].y, pieceSize, pieceSize);

    
}

var drawOutlines = function(){
    for(var i=0; i<=imageSize; i+=pieceSize){
        canvasContext.beginPath();
        canvasContext.moveTo(i, 0);
        canvasContext.lineTo(i, imageSize);
        canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.moveTo(0, i);
        canvasContext.lineTo( imageSize, i);
        canvasContext.stroke();
    }
}

var drawPuzzle = function(){
    drawImages();
    drawOutlines();
}

var setPiece = function(x,y){
    //find image clicked on
    var index = 0;
    images.forEach(function(img){
        if( ( x > img.x && x < img.x + pieceSize ) && ( y > img.y && y < img.y + pieceSize ) ){
            images[index].offsetX = img.x - x;
            images[index].offsetY = img.y - y;
            imageIndex = index;
            return false;
        }
        index++;
    });
}

//handle mouse up event
canvas.addEventListener('mouseup', function(e){
    isMouseDown = false;
    movingPiece = null;
    //console.log("mouseup x:"+ e.layerX + " x:" + e.layerY);
});

//handle mouse down event
canvas.addEventListener('mousedown', function(e){
    isMouseDown = true;
    setPiece(e.layerX,e.layerY);
    //console.log("mousedown x:"+ e.layerX + " x:" + e.layerY);
});

//hanle the mouse moving around
canvas.addEventListener('mousemove', function(e){
    if(isMouseDown){
        e.preventDefault();
        images[imageIndex].x = e.layerX + images[imageIndex].offsetX;
        images[imageIndex].y = e.layerY + images[imageIndex].offsetY;
        myRootRef.child("demo").set(images);
        drawPuzzle();
    }
});

var myRootRef = new Firebase('https://puzzle.firebaseIO.com/');
//init
srcImage.onload = function(){
    var tmp = myRootRef.child("demo");
}

myRootRef.on('value', function(demo){
    images = demo.val().demo;
    console.log('value');
    drawPuzzle();
});