isMouseDown    = false;
movingPiece    = null;
images         = [];
srcImage       = new Image();
srcImage.src   = 'images/alyson.png';
canvas         = document.getElementById("puzzle");
canvasContext  = canvas.getContext("2d");
imageSize      = 512;
pieceSize      = 128;
showHint       = false;

var initImages = function(){

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
}

var drawImages = function(){
    //clear canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    if(showHint){
        canvasContext.globalAlpha = 0.25;
        canvasContext.drawImage(srcImage, 0, 0, imageSize, imageSize);
        canvasContext.globalAlpha = 1;
    }

    //draw pieces
    images.forEach(function(img){
        canvasContext.drawImage(srcImage, img.ox, img.oy, pieceSize, pieceSize, img.x, img.y, pieceSize, pieceSize);
    });

    //draw moving piece on top
    if(movingPiece){
        canvasContext.drawImage(srcImage, movingPiece.ox, movingPiece.oy, pieceSize, pieceSize, movingPiece.x, movingPiece.y, pieceSize, pieceSize);
    }

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
            movingPiece = img;
            movingPiece.offsetX = img.x - x;
            movingPiece.offsetY = img.y - y;
            pieceIndex = index;
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

        movingPiece.x = e.layerX + movingPiece.offsetX;
        movingPiece.y = e.layerY + movingPiece.offsetY;;

        drawPuzzle();
    }
});


//init
srcImage.onload = function(){
    initImages();
    drawPuzzle();
}