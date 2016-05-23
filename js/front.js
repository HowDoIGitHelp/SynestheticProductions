
/*------------------------ OBJECT DEFINITIONS & GLOBAL VARIABLE DECLARATIONS ---*/

var canvasDimension = 2;
var gridLimit = 40;
var initialGrids = [];

/*------------------------------------------------------------------------------*/


/*------------------------ EVENT LISTENERS ------------------------------------*/

$(document).ready(function () {

    //console.log(isBeyondCanvas(6,-2));
    $('#grid-size-button').click(function () {

        canvasDimension = canvasDimension + 2;
        var g = $('#canvas-area').width() / canvasDimension;

        //checks if calculated grid size is an integer (only integers can be set as css width for grid)
        while (!(typeof g === 'number' && (g % 1) === 0)) {
            if (canvasDimension >= gridLimit) {
                canvasDimension = 2;
            }
            else {
                canvasDimension = canvasDimension + 2;
            }
            g = $('#canvas-area').width() / canvasDimension;
        }
        $(this).attr('value', canvasDimension + ' x ' + canvasDimension);
        initCanvas(g);
    });

    $('#light').click(function () {
        extrusion(4);

    });
    $('#light2').click(function () {
        extrusion(-4);

    });
    
});
var hex = []; 
/*-------------------------------------------------------------------------------*/

/*------------------------ METHOD DEFINITIONS -----------------------------------*/

function initCanvas(g){
    var c = $('#canvas-area').width() * $('#canvas-area').height();
    var n = Math.pow($('#canvas-area').width() / g, 2);

    $('#canvas-area').html('');

    var class1 = 'cell animate3s white';
    var class2 = 'cell animate3s';
    
    for(var i = 0; i < n; i++){
        hex[i+1]="FFFFFFFF";
        if(i % canvasDimension == 0 && i > 0){
            var temp = class1;
            class1 = class2;
            class2 = temp;
        }    
        if(i % 2 == 0){
            $('#canvas-area').append('<div id="cell_' + (i + 1) + 
            '" class="' + class1 + '" style="height: ' + g + 'px; width: ' + g + 'px;"></div>');
        }
        else{
            $('#canvas-area').append('<div id="cell_' + (i + 1) +  
            '" class="' + class2 + '" style="height: ' + g + 'px; width: ' + g + 'px;"></div>');
        }
    }
    

    $('.cell').click(function (){
        index=$(this).attr('id').split("_")[1];
        changeCellColor("80808080",index);
    });
}

function isBeyondCanvas(currentCellNumber, offset){
    var rightLimit = Math.ceil(currentCellNumber/canvasDimension)*canvasDimension;
    var lefLimit = rightLimit-(canvasDimension-1);
    var nextCellNumber=currentCellNumber+offset;
    return nextCellNumber>rightLimit || nextCellNumber < lefLimit;
}
function isOutside(currentCellNumber,offset){
    var nextCellNumber=currentCellNumber+offset;
    return nextCellNumber>canvasDimension*canvasDimension || nextCellNumber < 1;
}
function changeCellColorRGB(r, g, b, a, cellNumber){
    $('#cell_' + cellNumber).css('background-color', 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
}
function changeCellColor(h,cellNumber){
    r=parseInt(h.substr(0,2),16);
    g=parseInt(h.substr(2,2),16);
    b=parseInt(h.substr(4,2),16);
    a=(parseInt(h.substr(6,2),16)/255);
    $('#cell_' + cellNumber).css('background-color', 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
    hex[cellNumber]=h;
}
function lightCell(index){
    $('#cell_' + index).attr('class', $('#cell_' + index).attr('class') + ' light');
}
function divideColor(hex,divisor){
    a=parseInt(hex.substr(6,2),16)/divisor;
    if(a<=25);
    a=25;
    return hex.substr(0,6)+("0"+a.toString(16)).slice(-2);
}
function addColors(h1,h2){
    if(h1.substr(0,6)=="FFFFFF")
        return h2;
    else if(h2.substr(0,6)=="FFFFFF")
        return h1;
    else{
        r=Math.floor((parseInt(h1.substr(0,2),16)+parseInt(h2.substr(0,2),16))/2);
        g=Math.floor((parseInt(h1.substr(2,2),16)+parseInt(h2.substr(2,2),16))/2);
        b=Math.floor((parseInt(h1.substr(4,2),16)+parseInt(h2.substr(4,2),16))/2);
        a=Math.floor((parseInt(h1.substr(6,2),16)+parseInt(h2.substr(6,2),16)));
        if(a>255)
            a=255;
        return ("0"+r.toString(16)).slice(-2)+("0"+g.toString(16)).slice(-2)+("0"+b.toString(16)).slice(-2)+("0"+a.toString(16)).slice(-2);
    }
}
function averageBar(newHex,start,length,reduction){
    var r=0;
    var g=0;
    var b=0;
    var a=0;
    for(var i=start;i<(start+length);i++){
        r+=parseInt(hex[i].substr(0,2),16);
        g+=parseInt(hex[i].substr(2,2),16);
        b+=parseInt(hex[i].substr(4,2),16);
        a+=parseInt(hex[i].substr(6,2),16);
    }
    r=Math.floor(r/length);
    g=Math.floor(g/length);
    b=Math.floor(b/length);
    console.log(a);
    a=Math.floor(a/(length-(reduction*2)));
    console.log(a);
    if(a>255)
        a=255;
    console.log(a);
    average = ("0"+r.toString(16)).slice(-2)+("0"+g.toString(16)).slice(-2)+("0"+b.toString(16)).slice(-2)+("0"+a.toString(16)).slice(-2);
    for(var i=start+reduction;i<((start+length)-reduction);i++){
        newHex[i]=average;
    }
}
function extrusion(value){
    var g = $('#canvas-area').width() / canvasDimension;
    var n = Math.pow($('#canvas-area').width() / g, 2);
    var newHex = [];
    var length=0;
    for(var i=1;i<=n;i++){
        newHex[i] = "FFFFFF00";
    }
    if(value>0){
        var divisor =(value*2) +1;
        for(var i=1;i<=n;i++){
            if(!(hex[i].substr(0,6)=="FFFFFF")){
                newHex[i]=addColors(newHex[i],divideColor(hex[i],divisor));
                for(var j=1;j<=value;j++){
                    if(!isBeyondCanvas(i,j)){
                        newHex[i+j]=addColors(newHex[i+j],divideColor(hex[i],divisor));
                    }
                    if(!isBeyondCanvas(i,-j)){
                        newHex[i-j]=addColors(newHex[i-j],divideColor(hex[i],divisor));
                    }
                }
            }
        }
    }
    else{
        value=(-1)*value;
        for(var i=1;i<=n;i++){
            if(!(hex[i].substr(0,6)=="FFFFFF")&&(hex[i-1].substr(0,6)=="FFFFFF"||isBeyondCanvas(i,-1))){
                length = 0;
                start=i;
                while(!(hex[i+1].substr(0,6)=="FFFFFF"||isBeyondCanvas(i,1))){
                    length++;
                    i++;
                }
                averageBar(newHex,start,length+1,value);
            }
        }
    }
    for(var i=1;i<=n;i++){
        hex[i]=newHex[i];
        changeCellColor(hex[i],i);
    }
}
function translation(value){
    var g = $('#canvas-area').width() / canvasDimension;
    var n = Math.pow($('#canvas-area').width() / g, 2);
    var l = canvasDimension;
    var newHex = [];
    for(var i=1;i<=n;i++){
        newHex[i] = "FFFFFF00";
    }
    for(var i=1;i<=n;i++){
        if(!(hex[i].substr(0,6)=="FFFFFF")){
            if(!isOutside(i,l*value)){
                newHex[i+(l*value)]=hex[i];
            }
        }
    }
    for(var i=1;i<=n;i++){
        hex[i]=newHex[i];
        changeCellColor(hex[i],i);
    }
}
/*-------------------------------------------------------------------------------*/