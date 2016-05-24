
/*------------------------ OBJECT DEFINITIONS & GLOBAL VARIABLE DECLARATIONS ---*/

var canvasDimension = 2;
var gridLimit = 40;
var initialGrids = [];
var hex = []; 
var music = [];
var currentNote=0;
/*------------------------------------------------------------------------------*/


/*------------------------ EVENT LISTENERS ------------------------------------*/

$(document).ready(function () {
    $('#resize-button').click(function () {

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

    $('#next-button').click(function () {
        if(currentNote==0){
            transition("0",music[currentNote]);    
            $('#current-state').html(currentNote+1);
        }
        else if(currentNote<music.length){
            transition(music[currentNote-1],music[currentNote]);
            $('#current-state').html(currentNote+1);
        }
        currentNote++;
    });
    $(document).on('click','.cell',function (){
        index=$(this).attr('id').split("_")[1];
        changeCellColor("80808080",index);
    });
});

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
    
    music[0]="7F1";
    music[1]="9A1";
    music[2]="9D2";
    //rest
    music[3]="7E1";
    music[4]="9A1";
    music[5]="9C2";
    //rest
    music[6]="7D1";
    music[7]="9F1";
    music[8]="9B1";
    //rest
    music[9]="7C1";
    music[10]="9F1";
    music[11]="9A1";
    //rest
    music[12]="7B0";
    music[13]="9D1";
    music[14]="9G1";
    //rest
    music[15]="7A0";
    music[16]="9D1";
    music[17]="9F1";
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
    if((reduction*2)>=length){
        reduction=Math.ceil(length/2)-1;
    }
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
    a=Math.floor(a/(length-(reduction*2)));
    if(a>255)
        a=255;
    average = ("0"+r.toString(16)).slice(-2)+("0"+g.toString(16)).slice(-2)+("0"+b.toString(16)).slice(-2)+("0"+a.toString(16)).slice(-2);
    for(var i=start+reduction;i<((start+length)-reduction);i++){
        newHex[i]=average;
    }
}
function canvassPattern(){
    var n=Math.pow(canvasDimension, 2);
    for(var i=1;i<=n;i++){
        if((hex[i].substr(0,6)=="FFFFFF")&&((i%2))==(((Math.ceil(i/canvasDimension))-1)%2)){
            changeCellColorRGB(240, 240, 240, 1,i);
        }
    }
}
function extrusion(value){
    var g = $('#canvas-area').width() / canvasDimension;
    var n = Math.pow($('#canvas-area').width() / g, 2);
    var newHex = [];
    var length=0;
    for(var i=1;i<=n;i++){
        newHex[i] = "FFFFFFFF";
    }
    if(value==0){
        return;
    }
    else if(value>0){
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
    canvassPattern();
}
function translation(value){
    var g = $('#canvas-area').width() / canvasDimension;
    var n = Math.pow($('#canvas-area').width() / g, 2);
    var l = canvasDimension;
    var newHex = [];
    for(var i=1;i<=n;i++){
        newHex[i] = "FFFFFFFF";
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
    canvassPattern();
}
function hue(value){
    n=Math.pow(canvasDimension, 2);
    var newHex = [];
    for(var i=1;i<=n;i++){
        newHex[i]=hex[i];
    }    
    var pitchColor;
    if(value=='E')
        pitchColor="AA780010";
    else if(value=='A')
        pitchColor="B5410010";
    else if(value=='D')
        pitchColor="B5004110";
    else if(value=='G')
        pitchColor="AA007810";
    else if(value=='C')
        pitchColor="7800AA10";
    else if(value=='F')
        pitchColor="4100B510";
    else if(value=='A#')
        pitchColor="0041B510";
    else if(value=='D#')
        pitchColor="0078AA10";
    else if(value=='G#')
        pitchColor="00AA7810";
    else if(value=="C#")
        pitchColor="00B54110";
    else if(value=="F#")
        pitchColor="41B50010";
    else if(value=="B")
        pitchColor="78AA0010";
    else
        pitchColor=="80808080"
    for(var i=1;i<=n;i++){
        if(!(hex[i].substr(0,6)=="FFFFFF"))
            newHex[i]=addColors(hex[i],pitchColor);    
    }
    for(var i=1;i<=n;i++){
        hex[i]=newHex[i];
        changeCellColor(hex[i],i);
    }
    canvassPattern();
}
function getDuration(duration){
    if(duration==14)
        return "1";
    else if(duration==13)
        return "1 + 1/2";
    else if(duration==12)
        return "1/2 + 1/4 + 1/8";
    else if(duration==11)
        return "1/2 + 1/4";
    else if(duration==10)
        return "1/2";
    else if(duration==9)
        return "1/4 + 1/8 + 1/16";
    else if(duration==8)
        return "1/4 + 1/8";
    else if(duration==7)
        return "1/4";
    else if(duration==6)
        return "1/8 + 1/16 + 1/32";
    else if(duration==5)
        return "1/8 + 1/16";
    else if(duration==4)
        return "1/8";
    else if(duration==3)
        return "1/16 + 1/32 + 1/64";
    else if(duration==2)
        return "1/16 + 1/32";
    else if(duration==1)
        return "1/16";
    else
        return "invalid";
}
function toOrdinal(number){
    if(number==1)
        return number.toString(10)+"th";
    else if(number==2)
        return number+"nd";
    else if(number==3)
        return number.toString(10)+"rd";
    else
        return number.toString(10)+"th";
}
function transition(pString,mString){
    var i;
    var newStart=0;
    var duration,pDuration;
    var pitch,pPitch;
    var octave,pOctave;
    var number = new RegExp("^[0-9]*$");
    var integer = new RegExp("^-?[0-9]*$");
    var note = new RegExp("^[a-hA-H]#?$");

   
    console.log(pString+" "+mString);
    if(pString=="0"){
        pDuration=0;
        pPitch="H";
        pOctave=0
    }
    else{
        var newStart=0;
        for(i=1;number.test(pString.substr(0,i))&&i<=pString.length;i++){};
        pDuration=pString.substr(0,i-1);
        newStart+=i-1;
        for(i=1;note.test(pString.substr(newStart,i))&&i<=pString.length;i++){};
        pPitch=pString.substr(newStart,i-1);
        newStart+=i-1;
        for(i=1;integer.test(pString.substr(newStart,i))&&(newStart+i)<=pString.length;i++){};
        pOctave=pString.substr(newStart,i-1);
    }

    newStart=0;
    for(i=1;number.test(mString.substr(0,i))&&i<=mString.length;i++){};
    duration=mString.substr(0,i-1)
    newStart+=i-1;
    for(i=1;note.test(mString.substr(newStart,i))&&i<=mString.length;i++){};
    pitch=mString.substr(newStart,i-1);
    newStart+=i-1;
    for(i=1;integer.test(mString.substr(newStart,i))&&(newStart+i)<=mString.length;i++){};
    octave=mString.substr(newStart,i-1);

    $('#duration').html(getDuration(duration));
    $('#pitch').html(pitch);
    $('#octave').html(toOrdinal(parseInt(octave)+3));
    extrusion(duration-pDuration);
    hue(pitch);
    translation(octave-pOctave);
}
/*-------------------------------------------------------------------------------*/